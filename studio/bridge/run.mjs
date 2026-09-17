import { Worker } from 'node:worker_threads';
import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { compareToTarget } from '../../tests/runner/complexity.mjs';

/**
 * Run one problem and print its report as JSON. The report is the runner's own
 * object; only the rendering differs. `--file <path>` reads the code from
 * somewhere else than the problem's own file, which is how a practice attempt
 * is tested against the real cases.
 */
const WORKER = new URL('./worker.mjs', import.meta.url);
const TIMEOUT_MS = 10000;
const TIMEOUT_WITH_PROBE_MS = 45000;
const LIMIT = 160;

const [number, ...flags] = process.argv.slice(2);
const showBigO = flags.includes('--big-o');
const showMemory = flags.includes('--memory');
const fileFlag = flags.indexOf('--file');
const file = fileFlag === -1 ? null : flags[fileFlag + 1];

/** V8 and process-wide flags are rejected in a worker's execArgv. */
const workerArgv = () =>
  process.execArgv.filter((flag) => !flag.startsWith('--expose') && !flag.startsWith('--max-old'));

/** One problem, one thread: a solution that never returns is terminated instead of hanging. */
const runInWorker = (timeoutMs) =>
  new Promise((resolve) => {
    const worker = new Worker(WORKER, {
      workerData: { number, file, options: { showBigO, showMemory } },
      execArgv: workerArgv(),
    });

    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ outcome: 'stalled' });
    }, timeoutMs);

    worker.on('message', (report) => {
      clearTimeout(timer);
      resolve({ outcome: 'done', report });
    });

    worker.on('error', (error) => {
      clearTimeout(timer);
      resolve({ outcome: 'crashed', error });
    });
  });

const replacer = (_key, value) => {
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'number' && !Number.isFinite(value)) return String(value);
  return value;
};

const display = (value, limit = LIMIT) => {
  if (value === undefined) return 'undefined';
  let text;
  try {
    text = JSON.stringify(value, replacer) ?? String(value);
  } catch {
    text = String(value);
  }
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
};

const displayArgs = (args) => (args ?? []).map((arg) => display(arg, 80)).join(', ');

const serializeCase = (item) => ({
  label: item.label,
  passed: item.passed,
  trace: item.trace ?? null,
  input: item.trace ? null : displayArgs(item.args),
  output: item.trace ? null : display(item.thrown ?? item.result),
});

const serializeFailure = (failure) => ({
  label: failure.label,
  input: displayArgs(failure.args),
  expected: failure.thrown ? null : display(failure.expect),
  got: failure.thrown ? null : display(failure.result),
  thrown: failure.thrown ?? null,
  detail: failure.detail ?? null,
});

const serializeComplexity = (complexity, target) => ({
  verdict: complexity.verdict ?? null,
  members: complexity.members ?? [],
  band: Boolean(complexity.band),
  confident: Boolean(complexity.confident),
  deviation: complexity.deviation ?? null,
  runnerUp: complexity.runnerUp ?? null,
  reason: complexity.reason ?? null,
  points: complexity.points ?? [],
  target: target ?? null,
  relation: compareToTarget(complexity, target),
});

const serializeVariant = (variant) => ({
  name: variant.name,
  passed: variant.passed,
  total: variant.total,
  ms: variant.ms,
  heap: variant.heap ?? null,
  target: variant.target ?? null,
  complexity: variant.complexity ? serializeComplexity(variant.complexity, variant.target) : null,
  cases: (variant.observed ?? []).map(serializeCase),
  failures: (variant.failures ?? []).map(serializeFailure),
});

const serialize = (report) => ({
  ...report,
  variants: (report.variants ?? []).map(serializeVariant),
});

const fail = (message) => {
  process.stdout.write(JSON.stringify({ status: 'error', message }));
  process.exit(1);
};

const all = await loadProblems();
const problem = all.find((entry) => entry.number === number);
if (!problem) fail(`no problem numbered ${number}`);

const shell = {
  number: problem.number,
  title: problem.title,
  difficulty: problem.difficulty,
  category: problem.category,
  dir: problem.dir,
  slug: problem.slug,
};

const timeoutMs = showBigO ? TIMEOUT_WITH_PROBE_MS : TIMEOUT_MS;
const outcome = await runInWorker(timeoutMs);

const payload =
  outcome.outcome === 'done'
    ? serialize(outcome.report)
    : {
        ...shell,
        status: outcome.outcome,
        timeoutMs,
        message: outcome.error?.message ?? null,
        variants: [],
      };

process.stdout.write(JSON.stringify(payload));
