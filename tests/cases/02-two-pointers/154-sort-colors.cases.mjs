import { intBetween, makeRng, series, shuffle } from '../_support/random.mjs';

/**
 * The sorted array is written first and then shuffled into the input, so the
 * expected value is the array we started from - no sort is called anywhere,
 * which is the one thing the problem forbids.
 *
 * The function returns nothing, so the runner judges the array it was handed
 * after the call.
 */
const rng = makeRng(1154);

const generated = series(30, 'generated shuffled colours', () => {
  const counts = [intBetween(rng, 0, 8), intBetween(rng, 0, 8), intBetween(rng, 0, 8)];
  if (counts.every((count) => count === 0)) counts[1] = 1;

  const sorted = counts.flatMap((count, colour) => Array.from({ length: count }, () => colour));

  return { args: [shuffle(rng, sorted)], expect: sorted };
});

export default {
  cases: [
    ...generated,
    { label: 'already sorted', args: [[0, 0, 1, 1, 2, 2]], expect: [0, 0, 1, 1, 2, 2] },
    { label: 'exactly reversed', args: [[2, 2, 1, 1, 0, 0]], expect: [0, 0, 1, 1, 2, 2] },
    { label: 'one of each', args: [[2, 1, 0]], expect: [0, 1, 2] },
    { label: 'no ones at all', args: [[2, 0, 2, 0]], expect: [0, 0, 2, 2] },
    { label: 'no zeros at all', args: [[2, 1, 2, 1]], expect: [1, 1, 2, 2] },
    { label: 'no twos at all', args: [[1, 0, 1, 0]], expect: [0, 0, 1, 1] },
    { label: 'all the same colour', args: [[1, 1, 1]], expect: [1, 1, 1] },
    { label: 'a single two', args: [[2]], expect: [2] },
    { label: 'the last element belongs first', args: [[1, 1, 2, 2, 0]], expect: [0, 1, 1, 2, 2] },
  ],
  gen: (n) => [Array.from({ length: n }, (_, index) => (index * 7) % 3)],
  probe: { base: 2000, budgetMs: 200 },
};
