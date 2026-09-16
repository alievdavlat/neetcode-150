import { loadProblems } from './derive-cases.mjs';
import { runAll } from './schedule.mjs';
import {
  paint,
  heading,
  problemLine,
  variantLine,
  failureBlock,
  curveBlock,
  outputBlock,
  stallBlock,
  summary,
} from './report.mjs';

const FLAGS = new Set(['--big-o', '--memory', '--all', '--curve', '--output', '--quiet', '--help']);
const TIMEOUT_MS = 10000;
const TIMEOUT_WITH_PROBE_MS = 90000;

function parseArgs(argv) {
  const flags = new Set(argv.filter((arg) => arg.startsWith('--')));
  const filters = argv.filter((arg) => !arg.startsWith('--'));
  const unknown = [...flags].filter((flag) => !FLAGS.has(flag));
  return { flags, filters, unknown };
}

/** A filter matches the category folder, the file path, the slug or the number. */
const matches = (problem, filters) => {
  if (filters.length === 0) return true;
  const haystack = `${problem.dir} ${problem.file} ${problem.slug} ${problem.number} ${problem.title}`.toLowerCase();
  return filters.some((filter) => haystack.includes(filter.toLowerCase()));
};

function usage() {
  return `
  ${paint.bold('npm test')} [filter] [flags]

  ${paint.grey('filter')}   category folder, slug, number or path fragment
             ${paint.grey('npm test -- 01          npm test -- two-sum          npm test -- 003')}

  ${paint.grey('--big-o')}  time the solution at doubling input sizes and fit a curve
  ${paint.grey('--curve')}  print the measured points behind each fit
  ${paint.grey('--memory')} report heap growth per call
  ${paint.grey('--output')} print what each passing case returned (on by default with a filter)
  ${paint.grey('--quiet')}  verdicts only
  ${paint.grey('--all')}    list the problems that have not been started yet
`;
}

async function main() {
  const { flags, filters, unknown } = parseArgs(process.argv.slice(2));

  if (flags.has('--help')) {
    console.log(usage());
    return 0;
  }

  if (unknown.length > 0) {
    console.log(paint.red(`  unknown flag: ${unknown.join(', ')}`));
    console.log(usage());
    return 1;
  }

  const showBigO = flags.has('--big-o') || flags.has('--curve');
  const showMemory = flags.has('--memory');
  const showCurve = flags.has('--curve');
  const showOutput = !flags.has('--quiet') && (flags.has('--output') || filters.length > 0);

  const problems = (await loadProblems()).filter((problem) => matches(problem, filters));
  const totals = { problems: 0, variants: 0, passed: 0, failed: 0, notStarted: 0, noCases: 0, stalled: 0 };
  const pending = [];
  let currentCategory = null;

  const openCategory = (report) => {
    if (report.category === currentCategory) return;
    currentCategory = report.category;
    console.log(heading(`${report.dir}  ${report.category}`));
  };

  const render = (report) => {
    if (report.status === 'no-cases') {
      totals.noCases += 1;
      pending.push(report);
      return;
    }

    if (report.status !== 'attempted') {
      totals.notStarted += 1;
      pending.push(report);
      return;
    }

    openCategory(report);
    totals.problems += 1;
    console.log(problemLine(report));

    for (const variant of report.variants) {
      totals.variants += 1;
      if (variant.failures.length === 0) totals.passed += 1;
      else totals.failed += 1;

      console.log(variantLine(variant, { showMemory, showBigO }));
      if (showOutput && variant.observed?.length) console.log(outputBlock(variant.observed));
      if (variant.failures.length > 0) console.log(failureBlock(variant.failures));
      if (showCurve && variant.complexity) console.log(curveBlock(variant.complexity));
    }

    if (showBigO && !report.hasGenerator && report.isFunctionProblem) {
      const path = `tests/cases/${report.dir}/${report.number}-${report.slug}.cases.mjs`;
      console.log(paint.grey(`       no size generator - add gen(n) to ${path}`));
    }

    if (report.unparsedExamples?.length > 0) {
      const list = report.unparsedExamples.map((item) => `#${item.index}`).join(', ');
      console.log(paint.grey(`       doc-block example ${list} could not be read - add it by hand if it matters`));
    }
  };

  await runAll({
    problems,
    options: { showBigO, showMemory },
    timeoutMs: showBigO ? TIMEOUT_WITH_PROBE_MS : TIMEOUT_MS,
    onReport: render,
    onStall: (problem, timeoutMs, error) => {
      totals.stalled += 1;
      totals.failed += 1;
      openCategory(problem);
      console.log(problemLine(problem));
      console.log(stallBlock(timeoutMs, error));
    },
  });

  console.log(summary(totals));

  if (flags.has('--all') && pending.length > 0) {
    console.log(paint.grey('  not started:'));
    for (const problem of pending) {
      const note = problem.status === 'no-cases' ? paint.yellow(' (no runnable cases yet)') : '';
      console.log(paint.grey(`    ${problem.number}  ${problem.title}${note}`));
    }
    console.log('');
  }

  return totals.failed > 0 ? 1 : 0;
}

process.exitCode = await main();
