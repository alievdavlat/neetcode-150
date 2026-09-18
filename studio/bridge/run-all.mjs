import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { runAll } from '../../tests/runner/schedule.mjs';

/**
 * Run the given problem numbers and print one compact verdict each. This is what
 * makes the sidebar honest: a status is a real test result, not a guess from the
 * file's shape. The queue and the stall recovery come from the CLI runner.
 */
const TIMEOUT_MS = 10000;

const wanted = new Set(process.argv.slice(2).filter((arg) => /^\d{3,4}$/.test(arg)));
const problems = (await loadProblems()).filter((problem) => wanted.size === 0 || wanted.has(problem.number));

const compact = (report) => {
  const variants = report.variants ?? [];

  return {
    number: report.number,
    status: report.status,
    passed: variants.reduce((sum, variant) => sum + variant.passed, 0),
    total: variants.reduce((sum, variant) => sum + variant.total, 0),
    failingVariants: variants.filter((variant) => variant.passed < variant.total).length,
  };
};

const results = [];

await runAll({
  problems,
  options: { showBigO: false, showMemory: false },
  timeoutMs: TIMEOUT_MS,
  onReport: (report) => results.push(compact(report)),
  onStall: (problem, _timeoutMs, error) =>
    results.push({
      number: problem.number,
      status: error ? 'crashed' : 'stalled',
      passed: 0,
      total: 0,
      failingVariants: 0,
    }),
});

process.stdout.write(JSON.stringify(results));
