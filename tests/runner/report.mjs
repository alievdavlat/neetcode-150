import { formatBytes, formatMs } from './measure.mjs';
import { renderCurve, compareToTarget } from './complexity.mjs';

const ESC = String.fromCharCode(27);
const enabled = process.stdout.isTTY && !process.env.NO_COLOR;

const code = (open) => (text) => (enabled ? `${ESC}[${open}m${text}${ESC}[0m` : String(text));

export const paint = {
  dim: code('2'),
  bold: code('1'),
  red: code('31'),
  green: code('32'),
  yellow: code('33'),
  blue: code('36'),
  magenta: code('35'),
  grey: code('90'),
};

const DIFFICULTY = {
  Easy: (text) => paint.green(text),
  Medium: (text) => paint.yellow(text),
  Hard: (text) => paint.red(text),
};

const RULE = '─';

const CHAIN_LIMIT = 8;

/**
 * Linked-list problems can hand back a node that points at itself, which
 * JSON.stringify refuses to touch. Walk the chain instead and say where it
 * closes, so a failing Linked List Cycle case prints a report rather than
 * crashing the run.
 */
const describeChain = (value) => {
  if (value === null || typeof value !== 'object') return String(value);

  const seen = new Set();
  const parts = [];
  let cursor = value;

  while (cursor && typeof cursor === 'object' && 'val' in cursor) {
    if (seen.has(cursor)) return `${parts.join(' -> ')} -> (cycles back)`;
    if (parts.length >= CHAIN_LIMIT) return `${parts.join(' -> ')} -> ...`;
    seen.add(cursor);
    parts.push(String(cursor.val));
    cursor = cursor.next;
  }

  return parts.length > 0 ? parts.join(' -> ') : '[circular value]';
};

const preview = (value, limit = 58) => {
  let text;
  try {
    text = JSON.stringify(value);
  } catch {
    text = describeChain(value);
  }
  if (text === undefined) return String(value);
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
};

export function heading(text) {
  const line = RULE.repeat(Math.max(4, 74 - text.length));
  return `\n${paint.bold(paint.blue(text))} ${paint.grey(line)}`;
}

export function problemLine(problem) {
  const difficulty = (DIFFICULTY[problem.difficulty] ?? paint.grey)(problem.difficulty);
  return `\n  ${paint.bold(problem.number)}  ${paint.bold(problem.title)}  ${paint.grey('·')} ${difficulty}`;
}

/** One row per solved variant: verdict, timing, memory, measured complexity. */
export function variantLine(result, { showMemory, showBigO }) {
  const name = result.name.padEnd(24);
  const score = `${result.passed}/${result.total}`;
  const label = result.failures.length === 0 ? `PASS ${score}` : `FAIL ${score}`;
  const tint = result.failures.length === 0 ? paint.green : paint.red;
  const columns = [`     ${name} ${tint(label.padEnd(12))}`];

  columns.push(paint.grey(formatMs(result.ms).padStart(11)));
  if (showMemory) columns.push(paint.grey(formatBytes(result.heap).padStart(11)));

  if (showBigO && result.complexity?.verdict) {
    const relation = compareToTarget(result.complexity, result.target);
    const marks = { match: paint.green('ok'), differs: paint.red('!!'), unknown: paint.grey('~~') };
    const shape = result.complexity.confident ? result.complexity.verdict : `${result.complexity.verdict} ?`;
    columns.push(`   ${marks[relation]} ${paint.magenta(shape.padEnd(22))}`);
    if (relation === 'differs') columns.push(paint.grey(`target ${result.target}`));
  }

  return columns.join('');
}

export function failureBlock(failures) {
  const lines = [];
  for (const failure of failures.slice(0, 3)) {
    lines.push(`       ${paint.red('x')} ${paint.grey(failure.label)}`);
    lines.push(`         input     ${paint.dim(failure.args.map((arg) => preview(arg)).join(', '))}`);
    if (failure.thrown) {
      lines.push(`         threw     ${paint.red(failure.thrown)}`);
    } else {
      lines.push(`         expected  ${paint.green(preview(failure.expect))}`);
      lines.push(`         got       ${paint.red(preview(failure.result))}`);
    }
    if (failure.detail) lines.push(`         note      ${paint.grey(failure.detail)}`);
  }
  if (failures.length > 3) lines.push(paint.grey(`       ... ${failures.length - 3} more failing cases`));
  return lines.join('\n');
}

/** Bars of measured time per input size, under the variant it belongs to. */
export function curveBlock(complexity) {
  if (!complexity?.points?.length) return '';
  const rows = renderCurve(complexity.points);
  const lines = rows.map(
    ({ n, ms, bar }) =>
      `       ${paint.grey(String(n).padStart(7))}  ${formatMs(ms).padStart(11)}  ${paint.magenta(bar)}`,
  );

  if (complexity.verdict) {
    const spread = `${(complexity.deviation * 100).toFixed(1)}%`;
    const next = complexity.runnerUp
      ? paint.grey(`   next ${complexity.runnerUp.name} (${(complexity.runnerUp.deviation * 100).toFixed(0)}%)`)
      : '';
    lines.push(
      `       ${paint.grey('fit')} ${paint.magenta(complexity.verdict)} ${paint.grey(`spread ${spread}`)}${next}`,
    );
  }

  return lines.join('\n');
}

/** A solution that never returned, or a worker that died taking the run with it. */
export function stallBlock(timeoutMs, error) {
  if (error) {
    return `     ${paint.red('CRASHED'.padEnd(12))} ${paint.grey(error.message ?? String(error))}`;
  }
  const seconds = (timeoutMs / 1000).toFixed(0);
  return [
    `     ${paint.red('TIMED OUT'.padEnd(12))} ${paint.grey(`no answer after ${seconds}s`)}`,
    `       ${paint.grey('a loop is not ending - check the condition that should stop it')}`,
  ].join('\n');
}

export function summary(totals) {
  const parts = [
    paint.green(`${totals.passed} passed`),
    totals.failed > 0 ? paint.red(`${totals.failed} failed`) : paint.grey('0 failed'),
    paint.grey(`${totals.notStarted} not started`),
  ];
  if (totals.stalled > 0) parts.push(paint.red(`${totals.stalled} timed out`));
  if (totals.noCases > 0) parts.push(paint.yellow(`${totals.noCases} need hand-written cases`));
  const rule = paint.grey(RULE.repeat(74));
  const headline = `${totals.variants} variants across ${totals.problems} attempted problems`;
  return `\n${rule}\n  ${paint.bold(headline)}\n  ${parts.join(paint.grey('  ·  '))}\n`;
}

/** What each passing case actually produced, the way an online judge shows it. */
export function outputBlock(observed) {
  const lines = [];
  for (const item of observed) {
    if (!item.passed) continue;
    if (item.trace) {
      lines.push(`       ${paint.green('ok')} ${paint.grey(item.label)}`);
      for (const call of item.trace) lines.push(`          ${paint.dim(call)}`);
      continue;
    }
    const input = item.args.map((arg) => preview(arg, 34)).join(', ');
    lines.push(`       ${paint.green('ok')} ${paint.grey(item.label.padEnd(30))} ${paint.dim(input)} ${paint.grey('->')} ${preview(item.result, 44)}`);
  }
  return lines.join('\n');
}
