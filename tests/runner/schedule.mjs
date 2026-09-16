import { Worker } from 'node:worker_threads';

const WORKER = new URL('./worker.mjs', import.meta.url);

/** V8 and process-wide flags are rejected in a worker's execArgv. */
const workerArgv = () => process.execArgv.filter((flag) => !flag.startsWith('--expose') && !flag.startsWith('--max-old'));

/**
 * Run one worker from `startIndex` until it finishes, stalls, or dies.
 * A stall is a solution that never returns — an infinite loop — so the worker
 * is killed and the index it was working on is reported back.
 */
function runSegment({ numbers, startIndex, options, timeoutMs, onReport }) {
  return new Promise((resolve) => {
    const worker = new Worker(WORKER, {
      workerData: { numbers, startIndex, options },
      execArgv: workerArgv(),
    });

    let current = startIndex;
    let timer = null;

    const stopTimer = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };

    const arm = () => {
      stopTimer();
      timer = setTimeout(() => {
        worker.terminate();
        resolve({ outcome: 'stalled', index: current });
      }, timeoutMs);
    };

    worker.on('message', (message) => {
      if (message.type === 'start') {
        current = message.index;
        arm();
        return;
      }
      if (message.type === 'report') {
        stopTimer();
        onReport(message.report);
        return;
      }
      stopTimer();
      resolve({ outcome: 'done' });
    });

    worker.on('error', (error) => {
      stopTimer();
      resolve({ outcome: 'error', index: current, error });
    });

    arm();
  });
}

/**
 * Work through every problem, surviving a solution that never terminates.
 * Each stall costs one worker restart, so a normal run spawns exactly one.
 */
export async function runAll({ problems, options, timeoutMs, onReport, onStall }) {
  const numbers = problems.map((problem) => problem.number);
  let index = 0;

  while (index < numbers.length) {
    const segment = await runSegment({
      numbers,
      startIndex: index,
      options,
      timeoutMs,
      onReport: (report) => {
        index += 1;
        onReport(report);
      },
    });

    if (segment.outcome === 'done') return;

    const stalled = problems[segment.index];
    if (segment.outcome === 'stalled') onStall(stalled, timeoutMs);
    else onStall(stalled, timeoutMs, segment.error);

    index = segment.index + 1;
  }
}
