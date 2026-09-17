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

const target = file ? { ...problem, file } : problem;

/**
 * Import the file once here, keeping console output line by line, so the scratch
 * logging at the bottom of a solution survives into the report. The runner's own
 * import comes later and finds the module cached, so nothing runs twice.
 */
const captured = [];
const realLog = console.log;
const realWrite = process.stdout.write.bind(process.stdout);

console.log = (...args) => captured.push(args.map((value) => String(value)).join(' '));
process.stdout.write = (chunk) => {
  captured.push(String(chunk).replace(/\n$/, ''));
  return true;
};

await import(new URL(`../../${target.file}`, import.meta.url).href).catch(() => null);

console.log = realLog;
process.stdout.write = realWrite;

const report = await runProblem(target, options);

parentPort.postMessage({ ...report, scratch: captured.join('\n').trim() || null });
