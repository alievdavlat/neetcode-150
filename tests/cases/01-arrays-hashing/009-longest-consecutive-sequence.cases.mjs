import { intBetween, makeRng, series, shuffle } from '../_support/random.mjs';

/**
 * One run of a chosen length is planted, and every other value is parked far
 * enough away that it can only ever be a run of one. The expected answer is the
 * length we planted, so nothing here has to work the problem out.
 */
const rng = makeRng(1009);

const generated = series(30, 'generated planted run', () => {
  const length = intBetween(rng, 1, 12);
  const base = intBetween(rng, -500, 500);
  const run = Array.from({ length }, (_, index) => base + index);

  const isolated = Array.from({ length: intBetween(rng, 0, 10) }, (_, index) => base + 1000 + index * 3);
  const duplicates = run.slice(0, intBetween(rng, 0, Math.min(3, length)));

  return { args: [shuffle(rng, [...run, ...isolated, ...duplicates])], expect: length };
});

export default {
  cases: [
    ...generated,
    { label: 'empty array', args: [[]], expect: 0 },
    { label: 'single value', args: [[42]], expect: 1 },
    { label: 'all duplicates of one value', args: [[7, 7, 7, 7]], expect: 1 },
    { label: 'two runs, the longer one wins', args: [[1, 2, 3, 10, 11]], expect: 3 },
    { label: 'run crosses zero', args: [[-2, -1, 0, 1, 5]], expect: 4 },
    { label: 'descending input still counts', args: [[9, 8, 7, 6]], expect: 4 },
  ],
  gen: (n) => [Array.from({ length: n }, (_, index) => (index % 2 === 0 ? index : n * 4 + index))],
  probe: { base: 2000, budgetMs: 200 },
};
