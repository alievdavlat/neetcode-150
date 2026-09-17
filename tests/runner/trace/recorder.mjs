const MAX_ITEMS = 200;
const MAX_ENTRIES = 50;
const MAX_TEXT = 120;

const cut = (text) => (text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT - 1)}…` : text);

/** One line of text for a value sitting inside an array cell or a map row. */
export function show(value) {
  if (typeof value === 'string') return cut(`'${value}'`);
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'number' && !Number.isFinite(value)) return String(value);
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'object') {
    try {
      return cut(JSON.stringify(value) ?? String(value));
    } catch {
      return cut(String(value));
    }
  }
  return cut(String(value));
}

const isIndexed = (value) => Array.isArray(value) || ArrayBuffer.isView(value);

/**
 * The shape the stage draws. Taken eagerly, because the point of a trace is the
 * value at that moment rather than the value at the end.
 */
export function snapshot(value) {
  if (isIndexed(value)) {
    const items = Array.from(value).slice(0, MAX_ITEMS).map(show);
    return { t: 'array', items, truncated: value.length > MAX_ITEMS };
  }

  if (value instanceof Map) {
    const all = [...value.entries()];
    return {
      t: 'map',
      entries: all.slice(0, MAX_ENTRIES).map(([key, item]) => [String(key), show(item)]),
      truncated: all.length > MAX_ENTRIES,
    };
  }

  if (value instanceof Set) {
    const all = [...value];
    return { t: 'array', items: all.slice(0, MAX_ITEMS).map(show), truncated: all.length > MAX_ITEMS };
  }

  if (value !== null && typeof value === 'object') {
    const all = Object.entries(value);
    return {
      t: 'map',
      entries: all.slice(0, MAX_ENTRIES).map(([key, item]) => [key, show(item)]),
      truncated: all.length > MAX_ENTRIES,
    };
  }

  return { t: 'scalar', text: show(value) };
}

export const MAX_STEPS = 20000;

export class TraceBudgetExceeded extends Error {
  constructor() {
    super('trace budget exceeded');
    this.name = 'TraceBudgetExceeded';
  }
}

/** Splice the recorded leaf values back over their own ranges, right to left. */
function substitute(entry, leaves) {
  let text = entry.text;
  for (let index = entry.leaves.length - 1; index >= 0; index -= 1) {
    const value = leaves[index];
    if (value === undefined) continue;
    const { start, end } = entry.leaves[index];
    text = text.slice(0, start) + value + text.slice(end);
  }
  return text;
}

/**
 * Collects what the instrumented copy reports. The five calls on `api` are the
 * whole contract with the instrumenter; everything else here is bookkeeping.
 */
export function createRecorder(meta, { maxSteps = MAX_STEPS } = {}) {
  const steps = [];
  const pending = new Map();
  let lastId = null;

  const buffer = (id) => {
    if (!pending.has(id)) pending.set(id, { leaves: [], touched: [] });
    return pending.get(id);
  };

  const push = (step) => {
    if (steps.length >= maxSteps) throw new TraceBudgetExceeded();
    steps.push(step);
    return step;
  };

  const attach = (step, scope) => {
    if (!scope) return step;
    step.vars = Object.fromEntries(Object.entries(scope).map(([name, value]) => [name, snapshot(value)]));
    return step;
  };

  const emit = (id, chain) => {
    const entry = meta[id];
    const held = buffer(id);
    pending.delete(id);
    lastId = id;
    return push({
      line: entry.line,
      kind: entry.kind,
      chain,
      vars: {},
      changed: entry.changed ?? null,
      touched: held.touched,
    });
  };

  const api = {
    l: (id, index, value) => {
      buffer(id).leaves[index] = show(value);
      return value;
    },

    x: (id, name, key, write) => {
      buffer(id).touched.push({ name, key, write });
      return key;
    },

    v: (id, value, scope) => {
      const entry = meta[id];
      const chain = [entry.text];
      const filled = substitute(entry, buffer(id).leaves);
      if (filled !== chain.at(-1)) chain.push(filled);
      const result = show(value);
      if (result !== chain.at(-1)) chain.push(result);
      attach(emit(id, chain), scope);
      return value;
    },

    u: (id, before, after, scope) => {
      const entry = meta[id];
      attach(emit(id, [entry.text, `${show(before)} ${entry.op} 1`, show(after)]), scope);
    },

    /** `for (const word of strs)` reports the value bound on each turn. */
    i: function* (id, iterable, scope) {
      const entry = meta[id];
      for (const item of iterable) {
        attach(emit(id, [entry.text, show(item)]), scope());
        yield item;
      }
    },

    s: (id, scope) => {
      const entry = meta[id];
      attach(lastId === id ? steps.at(-1) : emit(id, [entry.text]), scope);
    },
  };

  return { api, steps };
}
