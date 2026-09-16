const MIN_SAMPLE_MS = 30;
const MAX_BUILD_MS = 40;
const MAX_REPS = 20000;

/** Structured clone so a mutating solution never sees an already-chewed input. */
const freshArgs = (args) => args.map((arg) => (typeof arg === 'object' && arg !== null ? structuredClone(arg) : arg));

const timeOnce = (run) => {
  const start = performance.now();
  run();
  return performance.now() - start;
};

/**
 * Median cost of one call. Repeats enough times to outrun timer noise, but the
 * batch of fresh inputs is built up front, so the repeat count is also capped
 * by how long that build takes - a fast function over a large input would
 * otherwise spend all its time cloning rather than running.
 */
export function timeCall(fn, args, { rounds = 5 } = {}) {
  const buildCost = Math.max(timeOnce(() => freshArgs(args)), 1e-6);
  fn(...freshArgs(args));
  const callCost = Math.max(timeOnce(() => fn(...freshArgs(args))) - buildCost, 1e-6);

  const reps = Math.max(
    1,
    Math.min(Math.ceil(MIN_SAMPLE_MS / callCost), Math.floor(MAX_BUILD_MS / buildCost), MAX_REPS),
  );

  const samples = [];
  for (let round = 0; round < rounds; round += 1) {
    const batch = Array.from({ length: reps }, () => freshArgs(args));
    const start = performance.now();
    for (let index = 0; index < reps; index += 1) fn(...batch[index]);
    samples.push((performance.now() - start) / reps);
  }

  samples.sort((a, b) => a - b);
  return samples[Math.floor(samples.length / 2)];
}

export const gcAvailable = () => typeof globalThis.gc === 'function';

/**
 * Heap growth across a single call, in bytes. Requires --expose-gc; without it
 * the number would be dominated by whatever the collector happened to be doing.
 */
export function measureHeap(fn, args) {
  if (!gcAvailable()) return null;

  const call = freshArgs(args);
  globalThis.gc();
  const before = process.memoryUsage().heapUsed;
  const held = [fn(...call)];
  const after = process.memoryUsage().heapUsed;
  return held.length === 1 ? Math.max(0, after - before) : 0;
}

export function formatBytes(bytes) {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatMs(ms) {
  if (ms === null) return '—';
  if (ms < 0.001) return `${(ms * 1000).toFixed(1)} µs`;
  if (ms < 1) return `${ms.toFixed(3)} ms`;
  return `${ms.toFixed(2)} ms`;
}
