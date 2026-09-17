import { parentPort, workerData } from 'node:worker_threads';
import vm from 'node:vm';
import v8 from 'node:v8';
import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { runProblem } from '../../tests/runner/run-problem.mjs';

/**
 * Run one problem in its own thread so a solution that never returns can be
 * terminated. `file` overrides where the code is read from, which is how a
 * practice attempt under `.studio/scratch` is tested with the real cases.
 */
const { number, file, options } = workerData;

/** V8 flags cannot reach a worker through execArgv, so the collector is exposed here. */
if (options.showMemory && typeof globalThis.gc !== 'function') {
  v8.setFlagsFromString('--expose-gc');
  globalThis.gc = vm.runInNewContext('gc');
}

const problem = (await loadProblems()).find((entry) => entry.number === number);
if (!problem) throw new Error(`no problem numbered ${number}`);

parentPort.postMessage(await runProblem(file ? { ...problem, file } : problem, options));
