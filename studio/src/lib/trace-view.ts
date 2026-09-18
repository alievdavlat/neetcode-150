import type { TraceKind, TraceStep, TraceValue } from './types';

/**
 * Everything the simulation panel shows beyond one raw step: what changed since
 * the step before, which pass of which loop this is, and what the step means in
 * plain words. All of it is derived from the trace the worker already sends, so
 * nothing new crosses the wire.
 */

export interface VarChange {
  changed: boolean;
  before: TraceValue | null;
  cells: number[];
  keys: string[];
}

export type StepChanges = Record<string, VarChange>;

export const UNCHANGED: VarChange = { changed: false, before: null, cells: [], keys: [] };

/** One comparable string per value, so two snapshots can be told apart cheaply. */
function canon(value: TraceValue): string {
  if (value.t === 'scalar') return `scalar:${value.text}`;
  if (value.t === 'array') return `array:${JSON.stringify(value.items)}`;
  if (value.t === 'map') return `map:${JSON.stringify(value.entries)}`;
  if (value.t === 'list') return `list:${JSON.stringify(value.items)}:${value.cyclic}`;

  return `tree:${JSON.stringify(value.rows)}`;
}

function changedCells(before: TraceValue | null, after: TraceValue): number[] {
  if (before?.t !== 'array' || after.t !== 'array') return [];

  const out: number[] = [];
  const total = Math.max(before.items.length, after.items.length);
  for (let index = 0; index < total; index += 1) {
    if (before.items[index] !== after.items[index]) out.push(index);
  }
  return out;
}

function changedKeys(before: TraceValue | null, after: TraceValue): string[] {
  if (before?.t !== 'map' || after.t !== 'map') return [];

  const was = new Map(before.entries);
  return after.entries.filter(([key, item]) => was.get(key) !== item).map(([key]) => key);
}

/**
 * What this step did to the names in scope. A name that was not in scope a step
 * ago counts as changed with nothing before it: `const calc = …` really is the
 * moment `calc` takes its value, and the panel should say so.
 */
export function changesOf(step: TraceStep, previous: TraceStep | null): StepChanges {
  const out: StepChanges = {};
  if (!previous) return out;

  for (const [name, after] of Object.entries(step.vars)) {
    const before = previous.vars[name] ?? null;

    if (before && canon(before) === canon(after)) {
      out[name] = UNCHANGED;
      continue;
    }

    out[name] = {
      changed: true,
      before,
      cells: changedCells(before, after),
      keys: changedKeys(before, after),
    };
  }

  return out;
}

export interface LoopPass {
  line: number;
  pass: number;
  total: number;
  ending: boolean;
}

/** The step kind that begins one pass of the loop written on a given line. */
function markersOf(steps: TraceStep[]): Map<number, TraceKind> {
  const out = new Map<number, TraceKind>();

  for (const step of steps) {
    if (step.kind === 'loop-cond') out.set(step.line, 'loop-cond');
    else if (step.kind === 'loop-update' && !out.has(step.line)) out.set(step.line, 'loop-update');
  }

  return out;
}

/**
 * Which pass of which loop each step belongs to. Loops nest, and a loop entered
 * from inside another one starts counting again, so open loops are kept on a
 * stack: meeting a loop's own marker while an inner loop is still open means
 * the inner one has finished.
 */
export function passesOf(steps: TraceStep[]): (LoopPass | null)[] {
  const marker = markersOf(steps);
  const open: { line: number; pass: number; episode: number }[] = [];
  const longest = new Map<number, number>();
  const seen: ({ line: number; pass: number; episode: number; ending: boolean } | null)[] = [];
  let episodes = 0;

  for (const step of steps) {
    if (marker.get(step.line) !== step.kind) {
      const inside = open[open.length - 1];
      seen.push(inside ? { ...inside, ending: false } : null);
      continue;
    }

    const at = open.findIndex((frame) => frame.line === step.line);
    if (at === -1) open.push({ line: step.line, pass: 0, episode: (episodes += 1) });
    else open.length = at + 1;

    const frame = open[open.length - 1];
    const ending = step.kind === 'loop-cond' && step.chain.at(-1) === 'false';

    if (!ending) {
      frame.pass += 1;
      longest.set(frame.episode, frame.pass);
    }

    seen.push({ ...frame, ending });
    if (ending) open.pop();
  }

  return seen.map((entry) =>
    entry
      ? {
          line: entry.line,
          pass: entry.pass,
          total: longest.get(entry.episode) ?? entry.pass,
          ending: entry.ending,
        }
      : null,
  );
}

/** What the step means for what happens next, in the words a student would use. */
export function consequenceOf(step: TraceStep): string | null {
  const value = step.chain.at(-1);

  if (step.kind === 'cond') {
    if (value === 'true') return 'so this branch runs';
    if (value === 'false') return 'so this branch is skipped';
    return null;
  }

  if (step.kind === 'loop-cond') {
    if (value === 'true') return 'so the body runs again';
    if (value === 'false') return 'so the loop ends here';
    return null;
  }

  if (step.kind === 'loop-init') return 'the loop starts here';
  if (step.kind === 'loop-update') return 'the loop moves on';
  if (step.kind === 'return') return 'the function ends here';
  return null;
}

/**
 * The steps where one name took a new value - what "watch this variable"
 * follows. A name declared inside a loop body is born again on every pass, and
 * that birth is exactly what someone watching it wants to stop at.
 */
export function stepsChanging(steps: TraceStep[], name: string): boolean[] {
  let last: string | null = null;

  return steps.map((step, index) => {
    const value = step.vars[name];
    if (!value) {
      last = null;
      return false;
    }

    const now = canon(value);
    const moved = index > 0 && last !== now;
    last = now;
    return moved;
  });
}

/** An index worth drawing under a cell: a name the student wrote, not an expression. */
export const shortIndex = (from: string) => (/^[A-Za-z_$][\w$]*$/.test(from) ? from : null);
