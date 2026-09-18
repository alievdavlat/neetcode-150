import { timeCall } from './measure.mjs';

const CURVES = [
  { name: 'O(1)', of: () => 1 },
  { name: 'O(log n)', of: (n) => Math.log2(n) },
  { name: 'O(n)', of: (n) => n },
  { name: 'O(n log n)', of: (n) => n * Math.log2(n) },
  { name: 'O(n²)', of: (n) => n ** 2 },
  { name: 'O(n³)', of: (n) => n ** 3 },
  { name: 'O(2ⁿ)', of: (n) => 2 ** n },
];

const MIN_POINTS = 4;

/** Spread of the per-point constants; a true match keeps t(n)/f(n) flat. */
const deviation = (points, curve, key = 'ms') => {
  const ratios = points.map((point) => point[key] / curve.of(point.n));
  if (!ratios.every(Number.isFinite)) return Infinity;

  const mean = ratios.reduce((sum, value) => sum + value, 0) / ratios.length;
  if (mean <= 0) return Infinity;

  const variance = ratios.reduce((sum, value) => sum + (value - mean) ** 2, 0) / ratios.length;
  return Math.sqrt(variance) / mean;
};

/**
 * Time the function at doubling input sizes until it gets slow, then rank the
 * standard curves by how constant t(n)/f(n) stays. Measurement, not proof —
 * O(n) and O(n log n) sit close enough that noise can swap them.
 */
export function probeComplexity(fn, gen, { base = 1000, steps = 6, budgetMs = 250, totalMs = 4000 } = {}) {
  const points = [];
  const started = performance.now();

  for (let step = 0; step < steps; step += 1) {
    const n = base * 2 ** step;
    const args = gen(n);
    const ms = timeCall(fn, args, { rounds: 3 });
    points.push({ n, ms });
    if (ms > budgetMs) break;
    if (performance.now() - started > totalMs) break;
  }

  if (points.length < MIN_POINTS) {
    return { points, verdict: null, reason: 'too few usable sizes' };
  }

  const fitted = points.slice(1);
  const ranked = CURVES.map((curve) => ({ name: curve.name, deviation: deviation(fitted, curve) })).sort(
    (a, b) => a.deviation - b.deviation,
  );

  const [best, runnerUp] = ranked;
  if (!Number.isFinite(best.deviation)) {
    return { points, verdict: null, reason: 'no curve fits' };
  }

  const band = bandFor(best, runnerUp);
  if (band) {
    return {
      points,
      verdict: band.join(' / '),
      members: band,
      band: true,
      deviation: best.deviation,
      runnerUp: null,
      confident: true,
    };
  }

  return {
    points,
    verdict: best.name,
    members: [best.name],
    band: false,
    deviation: best.deviation,
    runnerUp: runnerUp ? { name: runnerUp.name, deviation: runnerUp.deviation } : null,
    confident: best.deviation < 0.15 && (!runnerUp || runnerUp.deviation > best.deviation * 1.8),
  };
}

/**
 * Pairs that timing cannot separate. Between n and n log n the log factor only
 * moves by ~1.4x across the sizes we can afford, which is inside measurement
 * noise, so reporting one of them as the answer would be a guess dressed as a
 * result. Report the pair instead.
 */
const INSEPARABLE = [
  ['O(1)', 'O(log n)'],
  ['O(n)', 'O(n log n)'],
];

function bandFor(best, runnerUp) {
  if (!runnerUp || !Number.isFinite(runnerUp.deviation)) return null;
  const pair = INSEPARABLE.find(
    (members) => members.includes(best.name) && members.includes(runnerUp.name),
  );
  if (!pair) return null;
  const alsoFits = runnerUp.deviation < 0.15 || runnerUp.deviation <= best.deviation * 2.5;
  return alsoFits ? pair : null;
}

/**
 * How a measured shape relates to the complexity the problem file asks for.
 * Targets written over more than one variable (`O(n * k)`) are not comparable
 * to a single-variable measurement, so they report as `unknown` rather than
 * raising a false alarm.
 */
export function compareToTarget(complexity, target) {
  if (!target || !complexity?.verdict) return 'unknown';
  if (/[a-z]/.test(target.replace(/log|n/g, ''))) return 'unknown';
  if (!complexity.confident) return 'unknown';
  return complexity.members.includes(target) ? 'match' : 'differs';
}

/** Pull the time term out of an authored `O(n) time, O(1) space` string. */
export function targetTimeComplexity(text) {
  if (!text) return null;
  const match = text.match(/O\([^)]*\)(?=\s*time)/);
  return match ? normalizeBigO(match[0]) : null;
}

const SUPERSCRIPTS = { '^2': '²', '^3': '³', '2^n': '2ⁿ' };

export function normalizeBigO(text) {
  let value = text.replace(/\s+/g, ' ').trim();
  for (const [plain, pretty] of Object.entries(SUPERSCRIPTS)) {
    value = value.replaceAll(plain, pretty);
  }
  return value.replace(/O\( /, 'O(').replace(/ \)/, ')');
}

/** Horizontal bars of measured time against input size. */
export function renderCurve(points, { width = 34 } = {}) {
  const peak = Math.max(...points.map((point) => point.ms));
  return points.map(({ n, ms }) => {
    const filled = peak > 0 ? Math.max(1, Math.round((ms / peak) * width)) : 1;
    return {
      n,
      ms,
      bar: '█'.repeat(filled),
    };
  });
}

/**
 * Rank the curves against counted operations. No band here: a count has no
 * noise, so n and n log n are told apart by the numbers themselves.
 */
export function fitOperations(points) {
  if (points.length < MIN_POINTS) return { points, verdict: null, reason: 'too few usable sizes' };

  const fitted = points.slice(1);
  const ranked = CURVES.map((curve) => ({ name: curve.name, deviation: deviation(fitted, curve, 'ops') })).sort(
    (left, right) => left.deviation - right.deviation,
  );

  const [best, runnerUp] = ranked;
  if (!Number.isFinite(best.deviation)) return { points, verdict: null, reason: 'no curve fits' };

  return {
    points,
    verdict: best.name,
    deviation: best.deviation,
    runnerUp: runnerUp ? { name: runnerUp.name, deviation: runnerUp.deviation } : null,
    confident: best.deviation < 0.05,
  };
}
