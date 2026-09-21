import { distinctInts, intBetween, makeRng, series } from '../_support/random.mjs';

/**
 * Distinct powers of two, sorted: any two of them add up to a value no other
 * pair can reach, so the problem's promise of exactly one solution holds and
 * the answer is the pair that was planted. Indices are read off the array, one
 * based, the smaller one first - nothing here searches for anything.
 */
const rng = makeRng(1011);

const generated = series(40, 'generated unique pair', () => {
  const numbers = distinctInts(rng, intBetween(rng, 2, 11), 0, 26)
    .map((power) => 2 ** power)
    .sort((left, right) => left - right);

  const first = intBetween(rng, 0, numbers.length - 2);
  const second = intBetween(rng, first + 1, numbers.length - 1);

  return { args: [numbers, numbers[first] + numbers[second]], expect: [first + 1, second + 1] };
});

export default {
  cases: [
    ...generated,
    { label: 'the only two elements', args: [[1, 2], 3], expect: [1, 2] },
    { label: 'equal values form the pair', args: [[3, 3], 6], expect: [1, 2] },
    { label: 'the pair is a repeated value in the middle', args: [[1, 2, 3, 4, 4, 9, 56, 90], 8], expect: [4, 5] },
    { label: 'both ends', args: [[-1000, -999, 0, 1000], 0], expect: [1, 4] },
    { label: 'all negative', args: [[-10, -3, 0, 5], -13], expect: [1, 2] },
    { label: 'answer sits at the far end', args: [[1, 2, 3, 4, 5, 6, 100], 106], expect: [6, 7] },
    { label: 'zero target across a sign change', args: [[-8, -2, 2, 9], 0], expect: [2, 3] },
  ],
  /** The answer is the last two, so a converging scan has to walk the array. */
  gen: (n) => [Array.from({ length: n }, (_, index) => index + 1), 2 * n - 1],
  probe: { base: 2000, budgetMs: 200 },
};
