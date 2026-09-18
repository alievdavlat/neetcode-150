import { parentPort, workerData } from 'node:worker_threads';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { prepare } from '../../tests/runner/discover.mjs';
import { caseArgs, judgeCase } from '../../tests/runner/execute.mjs';
import { instrument } from '../../tests/runner/trace/instrument.mjs';
import { createRecorder, show, TraceBudgetExceeded } from '../../tests/runner/trace/recorder.mjs';
import { traceSupport } from '../../tests/runner/trace/supported.mjs';

/**
 * Record one case of one variant. The run path is untouched: this instruments a
 * copy of the file, imports the copy, and calls the function once.
 */
const { number, variant, caseIndex, file, args: asked } = workerData;

/** An input typed in the UI has no expected answer, so the run is shown, never judged. */
const custom = (() => {
  if (!asked) return null;

  try {
    const parsed = JSON.parse(asked);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
})();
const ROOT = new URL('../../', import.meta.url);

const shell = (status, message, extra = {}) => ({
  number,
  variant,
  caseIndex,
  status,
  message,
  args: [],
  input: '[]',
  custom: custom !== null,
  expect: null,
  result: null,
  passed: null,
  detail: null,
  steps: [],
  truncated: false,
  source: '',
  ...extra,
});

const answer = (payload) => {
  parentPort.postMessage(payload);
};

/**
 * A solution file logs at the bottom - `console.log(twoSum([3, 2, 4], 9))` -
 * and that call runs the instrumented copy too. Importing under a recorder that
 * throws everything away keeps the student's scratch calls out of the trace, so
 * what is replayed is the one case that was asked for.
 */
const idle = {
  l: (id, index, value) => value,
  x: (id, name, key) => key,
  v: (id, value) => value,
  u: () => {},
  s: () => {},
  i: function* (id, iterable) {
    yield* iterable;
  },
};

/** The same scratch calls print to stdout, where the JSON answer lives. */
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

const problem = (await loadProblems()).find((entry) => entry.number === number);

if (!problem) {
  answer(shell('unsupported', `no problem numbered ${number}`));
} else {
  const support = traceSupport(problem.signature);

  if (!support.ok) {
    answer(shell('unsupported', support.reason));
  } else {
    const target = file ? { ...problem, file } : problem;
    const prepared = await prepare(target);
    const testCase = prepared.cases?.[caseIndex];
    const source = await readFile(new URL(target.file, ROOT), 'utf8').catch(() => null);

    if (source === null) {
      answer(shell('uninstrumentable', 'the file the tracer was pointed at does not exist'));
    } else if (prepared.status === 'load-error') {
      answer(shell('uninstrumentable', prepared.error?.message ?? 'the file could not be loaded', { source }));
    } else if (!testCase) {
      answer(shell('unsupported', 'this problem has no runnable case to trace', { source }));
    } else {
      /**
       * Every exported function is instrumented, not only the one being called.
       * A problem whose exports only work as a pair - encode and decode - fails
       * inside the other half, and a replay that stops at the entry point shows
       * a correct-looking run and no reason.
       */
      const exported = Object.keys(prepared.module ?? {}).filter(
        (name) => typeof prepared.module[name] === 'function' && name !== variant,
      );

      let instrumented = null;
      try {
        instrumented = instrument(source, { functionNames: [variant, ...exported] });
      } catch (error) {
        answer(shell('uninstrumentable', error.message, { source }));
      }

      if (instrumented) {
        const dir = new URL('studio/.studio/trace/', ROOT);
        await mkdir(dir, { recursive: true });
        const copy = new URL(`${number}-${variant}-${Date.now()}.ts`, dir);
        await writeFile(copy, instrumented.code, 'utf8');

        const { api, steps } = createRecorder(instrumented.meta);

        const raw = custom ?? testCase.args;
        const args = caseArgs({ ...testCase, args: raw }, prepared);

        let status = 'ok';
        let message = null;
        let result = null;
        let expect = null;
        let passed = null;
        let detail = null;
        let truncated = false;

        globalThis.__t = idle;
        let restore = quiet();
        let module = null;

        try {
          module = await import(copy.href);
        } catch (error) {
          status = 'uninstrumentable';
          message = error.message;
        } finally {
          restore();
        }

        let produced;
        let called = false;

        if (module) {
          globalThis.__t = api;
          restore = quiet();

          try {
            produced = module[variant](...args);
            called = true;
          } catch (error) {
            if (error instanceof TraceBudgetExceeded) truncated = true;
            else {
              status = 'threw';
              message = error.message;
              passed = false;
            }
          } finally {
            restore();
          }
        }

        /**
         * Judged against the instrumented module, so a case that checks one
         * export against another records the second one's steps too, and the
         * verdict is this replay's rather than the last run's.
         */
        if (called && custom !== null) {
          result = show(produced);
        }

        if (called && custom === null) {
          restore = quiet();

          try {
            const judged = judgeCase({ produced, args, testCase, prepared, module });
            result = show(judged.result);
            expect = judged.expect === undefined ? null : show(judged.expect);
            passed = judged.verdict.passed;
            detail = judged.verdict.detail ?? null;
          } catch (error) {
            result = show(produced);
            if (error instanceof TraceBudgetExceeded) truncated = true;
            else {
              passed = false;
              detail = `the case check threw: ${error.message}`;
            }
          } finally {
            restore();
          }
        }

        delete globalThis.__t;
        await rm(copy, { force: true });

        answer({
          number,
          variant,
          caseIndex,
          status,
          message,
          args: args.map(show),
          input: JSON.stringify(raw),
          custom: custom !== null,
          expect,
          result,
          passed,
          detail,
          steps,
          truncated,
          source,
        });
      }
    }
  }
}
