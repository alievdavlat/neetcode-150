import { parentPort, workerData } from 'node:worker_threads';
import vm from 'node:vm';
import v8 from 'node:v8';
import { loadProblems } from './derive-cases.mjs';
import { runProblem } from './run-problem.mjs';

/**
 * V8 flags cannot be passed to a worker through execArgv, so the collector is
 * exposed from inside instead. Without it the heap column would be noise.
 */
if (workerData.options.showMemory && typeof globalThis.gc !== 'function') {
  v8.setFlagsFromString('--expose-gc');
  globalThis.gc = vm.runInNewContext('gc');
}

const { numbers, startIndex, options } = workerData;
const all = await loadProblems();
const queue = numbers.map((number) => all.find((problem) => problem.number === number)).filter(Boolean);

for (let index = startIndex; index < queue.length; index += 1) {
  parentPort.postMessage({ type: 'start', index });
  const report = await runProblem(queue[index], options);
  parentPort.postMessage({ type: 'report', index, report });
}

parentPort.postMessage({ type: 'done' });
