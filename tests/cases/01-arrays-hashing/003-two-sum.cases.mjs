/**
 * The problem says the order of the two returned indices does not matter, so
 * results are compared as an unordered pair. The generator hides the answer at
 * the end of the array, which is the worst case for a scanning solution.
 */
import { distinctInts, intBetween, makeRng, series, shuffle } from '../_support/random.mjs';

const rng = makeRng(1003);

/**
 * Distinct powers of two: any two of them sum to a value no other pair can
 * reach, so "exactly one valid answer" holds and the answer is the pair we
 * planted. The indices are read off the shuffled array, not computed.
 */
const generated = series(40, 'generated unique pair', () => {
  const values = shuffle(rng, distinctInts(rng, intBetween(rng, 2, 12), 0, 29).map((power) => 2 ** power));
  const first = intBetween(rng, 0, values.length - 1);
  let second = intBetween(rng, 0, values.length - 1);
  while (second === first) second = intBetween(rng, 0, values.length - 1);

  return { args: [values, values[first] + values[second]], expect: [first, second] };
});

export default {
  cases: [
    ...generated,
    { label: 'duplicate values form the pair', args: [[3, 3], 6], expect: [0, 1] },
    { label: 'answer skips the first element', args: [[3, 2, 4], 6], expect: [1, 2] },
    { label: 'negatives', args: [[-3, 4, 3, 90], 0], expect: [0, 2] },
    { label: 'answer at both ends', args: [[1, 5, 9, 2], 3], expect: [0, 3] },
  ],
  gen: (n) => [Array.from({ length: n }, (_, index) => index * 2), 4 * n - 6],
  probe: { base: 1000, budgetMs: 200 },
};
