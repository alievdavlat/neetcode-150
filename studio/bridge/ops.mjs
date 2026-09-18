import { Worker } from 'node:worker_threads';

/**
 * Count the statements one solution runs at doubling input sizes, and print the
 * shape they fit. A worker keeps a runaway loop out of the dev server.
 */
const WORKER = new URL('./ops-worker.mjs', import.meta.url);
const TIMEOUT_MS = 60000;

const [number, variant, ...flags] = process.argv.slice(2);
const fileFlag = flags.indexOf('--file');
const file = fileFlag === -1 ? null : flags[fileFlag + 1];

const workerArgv = () =>
  process.execArgv.filter((flag) => !flag.startsWith('--expose') && !flag.startsWith('--max-old'));

const outcome = await new Promise((resolve) => {
  const worker = new Worker(WORKER, { workerData: { number, variant, file }, execArgv: workerArgv() });

  const timer = setTimeout(() => {
    worker.terminate();
    resolve({ status: 'stalled', message: `no answer after ${TIMEOUT_MS}ms` });
  }, TIMEOUT_MS);

  worker.on('message', (answer) => {
    clearTimeout(timer);
    resolve(answer);
  });

  worker.on('error', (error) => {
    clearTimeout(timer);
    resolve({ status: 'crashed', message: error.message });
  });

  worker.on('exit', (code) => {
    clearTimeout(timer);
    resolve({ status: 'crashed', message: `the counter exited with code ${code}` });
  });
});

process.stdout.write(
  JSON.stringify({
    number,
    variant,
    status: 'ok',
    message: null,
    points: [],
    verdict: null,
    deviation: null,
    target: null,
    comparison: null,
    ...outcome,
  }),
);
