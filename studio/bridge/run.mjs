import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { runAll } from '../../tests/runner/schedule.mjs';

/**
 * Run one problem and print its report as JSON. The worker and stall handling
 * come from the CLI runner untouched; only the rendering differs.
 */
const TIMEOUT_MS = 10000;
const TIMEOUT_WITH_PROBE_MS = 90000;
const LIMIT = 160;

const [number, ...flags] = process.argv.slice(2);
const showBigO = flags.includes('--big-o');
const showMemory = flags.includes('--memory');

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

const serializeVariant = (variant) => ({
  name: variant.name,
  passed: variant.passed,
  total: variant.total,
  ms: variant.ms,
  heap: variant.heap ?? null,
  target: variant.target ?? null,
  complexity: variant.complexity
    ? {
        verdict: variant.complexity.verdict ?? null,
        deviation: variant.complexity.deviation ?? null,
        points: variant.complexity.points ?? [],
      }
    : null,
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

let payload = null;

await runAll({
  problems: [problem],
  options: { showBigO, showMemory },
  timeoutMs: showBigO ? TIMEOUT_WITH_PROBE_MS : TIMEOUT_MS,
  onReport: (report) => {
    payload = serialize(report);
  },
  onStall: (_stalled, timeoutMs, error) => {
    payload = {
      ...shell,
      status: error ? 'crashed' : 'stalled',
      timeoutMs,
      message: error?.message ?? null,
      variants: [],
    };
  },
});

process.stdout.write(JSON.stringify(payload ?? { ...shell, status: 'error', message: 'no report produced' }));
