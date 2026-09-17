import { Worker } from 'node:worker_threads';

/**
 * Trace one case of one variant and print the result as JSON. A worker keeps an
 * endless loop out of the dev server, exactly as the run bridge does.
 */
const WORKER = new URL('./trace-worker.mjs', import.meta.url);
const TIMEOUT_MS = 15000;

const [number, variant, index, ...flags] = process.argv.slice(2);
const fileFlag = flags.indexOf('--file');
const file = fileFlag === -1 ? null : flags[fileFlag + 1];

/** V8 and process-wide flags are rejected in a worker's execArgv. */
const workerArgv = () =>
  process.execArgv.filter((flag) => !flag.startsWith('--expose') && !flag.startsWith('--max-old'));

const outcome = await new Promise((resolve) => {
  const worker = new Worker(WORKER, {
    workerData: { number, variant, caseIndex: Number(index), file },
    execArgv: workerArgv(),
  });

  const timer = setTimeout(() => {
    worker.terminate();
    resolve({ status: 'stalled', message: `no answer after ${TIMEOUT_MS}ms` });
  }, TIMEOUT_MS);

  worker.on('message', (trace) => {
    clearTimeout(timer);
    resolve(trace);
  });

  worker.on('error', (error) => {
    clearTimeout(timer);
    resolve({ status: 'crashed', message: error.message });
  });
});

process.stdout.write(
  JSON.stringify({
    number,
    variant,
    caseIndex: Number(index),
    message: null,
    args: [],
    expect: null,
    result: null,
    steps: [],
    truncated: false,
    source: '',
    ...outcome,
  }),
);
