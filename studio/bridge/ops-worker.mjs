import { parentPort, workerData } from 'node:worker_threads';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { prepare } from '../../tests/runner/discover.mjs';
import { caseArgs } from '../../tests/runner/execute.mjs';
import { compareToTarget, fitOperations, targetTimeComplexity } from '../../tests/runner/complexity.mjs';
import { declaredFunctions, instrument } from '../../tests/runner/trace/instrument.mjs';
import { createCounter, createIdle } from '../../tests/runner/trace/recorder.mjs';

/**
 * Run one variant at doubling sizes under a recorder that only counts. The file
 * is instrumented exactly as the simulator instruments it, so the number is the
 * statements the student's own code ran - not a guess, and not a clock.
 */
const { number, variant, file } = workerData;
const ROOT = new URL('../../', import.meta.url);

const BASE = 200;
const STEPS = 6;
const MAX_OPS = 4_000_000;

const answer = (payload) => parentPort.postMessage(payload);

const quiet = () => {
  const realLog = console.log;
  const realWrite = process.stdout.write.bind(process.stdout);
  console.log = () => {};
  process.stdout.write = () => true;
  return () => {
    console.log = realLog;
    process.stdout.write = realWrite;
  };
};

/** Scratch calls at the bottom of a solution file must not land in the count. */
const { api: idle } = createIdle();

const problem = (await loadProblems()).find((entry) => entry.number === number);

if (!problem) {
  answer({ status: 'unsupported', message: `no problem numbered ${number}` });
} else {
  const target = file ? { ...problem, file } : problem;
  const prepared = await prepare(target);

  if (prepared.status === 'load-error') {
    answer({ status: 'unsupported', message: prepared.error?.message ?? 'the file could not be loaded' });
  } else if (!prepared.gen) {
    answer({ status: 'unsupported', message: 'this problem has no size generator, so there is nothing to grow' });
  } else {
    const source = await readFile(new URL(target.file, ROOT), 'utf8').catch(() => null);

    /**
     * Every function in the file is instrumented, not only the one being called:
     * a solution that hands its loop to a helper would otherwise be counted as
     * doing almost nothing, and the curve would be a lie.
     */
    const others = source === null ? [] : declaredFunctions(source).filter((name) => name !== variant);

    let instrumented = null;
    try {
      instrumented = source === null ? null : instrument(source, { functionNames: [variant, ...others] });
    } catch (error) {
      answer({ status: 'unsupported', message: error.message });
    }

    if (instrumented) {
      const dir = new URL('studio/.studio/trace/', ROOT);
      await mkdir(dir, { recursive: true });
      const copy = new URL(`${number}-${variant}-ops-${Date.now()}.ts`, dir);
      await writeFile(copy, instrumented.code, 'utf8');

      globalThis.__t = idle;
      let restore = quiet();
      let module = null;
      let failure = null;

      try {
        module = await import(copy.href);
      } catch (error) {
        failure = error.message;
      } finally {
        restore();
      }

      const points = [];

      if (module && typeof module[variant] === 'function') {
        for (let step = 0; step < STEPS; step += 1) {
          const size = BASE * 2 ** step;
          const { api, count } = createCounter();
          const args = caseArgs({ args: prepared.gen(size) }, prepared);

          globalThis.__t = api;
          restore = quiet();

          try {
            module[variant](...args);
          } catch (error) {
            failure = error.message;
          } finally {
            restore();
            delete globalThis.__t;
          }

          if (failure) break;

          points.push({ n: size, ops: count() });
          if (count() > MAX_OPS) break;
        }
      }

      await rm(copy, { force: true });

      if (failure) answer({ status: 'threw', message: failure, points });
      else {
        const fit = fitOperations(points);
        const wanted = targetTimeComplexity(problem.complexity ?? '');

        /**
         * Only the student's own statements are counted. A solution that hands
         * the work to `new Set(...)` or `sort()` runs the same handful of
         * statements at every size, and calling that O(1) would be a lie: say
         * where the work went instead.
         */
        const flat = points.length > 1 && points.every((point) => point.ops === points[0].ops);

        answer({
          status: 'ok',
          message: flat
            ? 'your own statements do not grow with the input — the work is inside built-ins, which this counter cannot see'
            : (fit.reason ?? null),
          points,
          verdict: flat ? null : fit.verdict,
          deviation: flat ? null : (fit.deviation ?? null),
          target: wanted,
          comparison:
            !flat && fit.verdict
              ? compareToTarget({ verdict: fit.verdict, members: [fit.verdict], confident: fit.confident }, wanted)
              : null,
        });
      }
    }
  }
}
