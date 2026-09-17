import { parentPort, workerData } from 'node:worker_threads';
import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { runProblem } from '../../tests/runner/run-problem.mjs';

/**
 * Run one problem in its own thread so a solution that never returns can be
 * terminated. `file` overrides where the code is read from, which is how a
 * practice attempt under `.studio/scratch` is tested with the real cases.
 */
const { number, file, options } = workerData;

const problem = (await loadProblems()).find((entry) => entry.number === number);
if (!problem) throw new Error(`no problem numbered ${number}`);

parentPort.postMessage(await runProblem(file ? { ...problem, file } : problem, options));
