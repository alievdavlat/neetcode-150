import { parentPort, workerData } from 'node:worker_threads';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { prepare } from '../../tests/runner/discover.mjs';
import { instrument } from '../../tests/runner/trace/instrument.mjs';
import { createRecorder, show, TraceBudgetExceeded } from '../../tests/runner/trace/recorder.mjs';
import { traceSupport } from '../../tests/runner/trace/supported.mjs';

/**
 * Record one case of one variant. The run path is untouched: this instruments a
 * copy of the file, imports the copy, and calls the function once.
 */
const { number, variant, caseIndex, file } = workerData;
const ROOT = new URL('../../', import.meta.url);

const shell = (status, message, extra = {}) => ({
  number,
  variant,
  caseIndex,
  status,
  message,
  args: [],
  expect: null,
  result: null,
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
      let instrumented = null;
      try {
        instrumented = instrument(source, { functionName: variant });
      } catch (error) {
        answer(shell('uninstrumentable', error.message, { source }));
      }

      if (instrumented) {
        const dir = new URL('studio/.studio/trace/', ROOT);
        await mkdir(dir, { recursive: true });
        const copy = new URL(`${number}-${variant}-${Date.now()}.ts`, dir);
        await writeFile(copy, instrumented.code, 'utf8');

        const { api, steps } = createRecorder(instrumented.meta);

        const args = testCase.args.map((arg) =>
          typeof arg === 'object' && arg !== null ? structuredClone(arg) : arg,
        );

        let status = 'ok';
        let message = null;
        let result = null;
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

        if (module) {
          globalThis.__t = api;
          restore = quiet();

          try {
            result = show(module[variant](...args));
          } catch (error) {
            if (error instanceof TraceBudgetExceeded) truncated = true;
            else {
              status = 'threw';
              message = error.message;
            }
          } finally {
            restore();
          }
        }

        delete globalThis.__t;

        answer({
          number,
          variant,
          caseIndex,
          status,
          message,
          args: args.map(show),
          expect: testCase.expect === undefined ? null : show(testCase.expect),
          result,
          steps,
          truncated,
          source,
        });
      }
    }
  }
}
