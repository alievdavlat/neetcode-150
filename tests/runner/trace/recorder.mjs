const MAX_ITEMS = 200;
const MAX_ENTRIES = 50;
const MAX_TEXT = 120;

const cut = (text) => (text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT - 1)}…` : text);

const MAX_DEPTH = 1;

/** One line of text for a value sitting inside an array cell or a map row. */
export function show(value, depth = 0) {
  if (typeof value === 'string') return cut(`'${value}'`);
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'number' && !Number.isFinite(value)) return String(value);
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (value instanceof Map) {
    if (depth > MAX_DEPTH) return `Map(${value.size})`;
    const rows = [...value].map(([key, item]) => `${show(key, depth + 1)} → ${show(item, depth + 1)}`);
    return cut(`Map(${value.size}) {${rows.join(', ')}}`);
  }

  if (value instanceof Set) {
    if (depth > MAX_DEPTH) return `Set(${value.size})`;
    return cut(`Set(${value.size}) {${[...value].map((item) => show(item, depth + 1)).join(', ')}}`);
  }

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

/** Two entries that differ only in spacing say the same thing twice. */
const same = (a, b) => a === b || a.replace(/\s+/g, '') === b.replace(/\s+/g, '');

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
  const frames = new Map();
  let lastId = null;

  /**
   * What one evaluation of one expression has reported so far. A recursive
   * solution is part way through several evaluations of the same expression at
   * once, so these stack: the leftmost leaf opens a frame and emitting closes
   * the innermost one. Without that, the inner call erases the outer call's
   * values and the substitution comes out half filled.
   */
  const buffer = (id, opens = false) => {
    let stack = frames.get(id);
    if (!stack) frames.set(id, (stack = []));
    if (stack.length === 0 || (opens && stack.at(-1).leaves.length > 0)) {
      stack.push({ leaves: [], touched: [] });
    }
    return stack.at(-1);
  };

  const take = (id) => {
    const stack = frames.get(id);
    const held = stack?.pop() ?? { leaves: [], touched: [] };
    if (stack?.length === 0) frames.delete(id);
    return held;
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
    const held = take(id);
    lastId = id;
    return push({
      line: entry.line,
      fn: entry.fn ?? null,
      kind: entry.kind,
      chain,
      vars: {},
      changed: entry.changed ?? null,
      touched: held.touched,
    });
  };

  const api = {
    l: (id, index, value) => {
      buffer(id, index === 0).leaves[index] = show(value);
      return value;
    },

    /** `from` is the index as it was written - what lets the stage label a cell `i`. */
    x: (id, name, key, write, from) => {
      buffer(id).touched.push({ name, key, write, from });
      return key;
    },

    /**
     * `name` is the binding this expression initialises. It is passed rather
     * than read from `scope`, because a name is still in its dead zone while
     * its own initialiser runs.
     */
    v: (id, value, scope, name) => {
      const entry = meta[id];
      const chain = [entry.text];
      const filled = substitute(entry, buffer(id).leaves);
      if (!same(filled, chain.at(-1))) chain.push(filled);
      const result = show(value);
      if (!same(result, chain.at(-1))) chain.push(result);
      attach(emit(id, chain), name && scope ? { ...scope, [name]: value } : scope);
      return value;
    },

    /**
     * An update whose target is one named counter can say what the arithmetic
     * was. Anything else - `i++, j--`, `i += 2`, `freq[k]++` - only says what it
     * was; the new values are in the table, which is the honest half.
     */
    u: (id, before, after, scope) => {
      const entry = meta[id];
      const from = entry.pre && typeof after === 'number' ? after - (entry.op === '+' ? 1 : -1) : before;
      const arithmetic = entry.op && !(entry.pre && typeof after !== 'number');
      const chain = arithmetic ? [entry.text, `${show(from)} ${entry.op} 1`, show(after)] : [entry.text];

      attach(emit(id, chain), scope);
      return before;
    },

    /** `for (const word of strs)` reports the value bound on each turn. */
    i: function* (id, iterable, scope, name) {
      const entry = meta[id];
      for (const item of iterable) {
        const outer = scope();
        attach(emit(id, [entry.text, show(item)]), name ? { ...outer, [name]: item } : outer);
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
