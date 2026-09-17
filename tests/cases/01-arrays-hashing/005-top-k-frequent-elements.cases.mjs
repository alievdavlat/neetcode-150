import { distinctInts, intBetween, makeRng, series, shuffle } from '../_support/random.mjs';

/**
 * Frequencies are assigned, not counted: each value gets a different count, so
 * the k most frequent are the k we handed the highest counts to. The answer is
 * known before the array is built, and the gap between the kth and the k+1th
 * count keeps that answer the only correct one.
 */
const rng = makeRng(1005);

const generated = series(30, 'generated planted frequencies', () => {
  const k = intBetween(rng, 1, 4);
  const extra = intBetween(rng, 1, 5);
  const values = distinctInts(rng, k + extra, -60, 60);
  const counts = values.map((_, index) => (values.length - index) * 2);
  const nums = shuffle(rng, values.flatMap((value, index) => Array.from({ length: counts[index] }, () => value)));

  return { args: [nums, k], expect: values.slice(0, k) };
});

export default {
  cases: [
    ...generated,
    { label: 'every value appears once, k is all of them', args: [[4, 1, 7], 3], expect: [4, 1, 7] },
    { label: 'single element', args: [[9], 1], expect: [9] },
    { label: 'negatives count too', args: [[-1, -1, -1, 2, 2, 5], 2], expect: [-1, 2] },
    { label: 'k equals the number of distinct values', args: [[3, 3, 2, 2, 1], 3], expect: [3, 2, 1] },
  ],
  gen: (n) => [Array.from({ length: n }, (_, index) => index % Math.max(2, Math.floor(n / 10))), 3],
  probe: { base: 2000, budgetMs: 200 },
};
