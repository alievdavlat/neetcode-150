import { intBetween, makeRng, series, shuffle } from '../_support/random.mjs';

/**
 * Expected values come from dividing the total product, which is the one
 * approach the problem's follow-up rules out — so this file can state the answer
 * without hinting at the prefix and suffix passes it is asking you to find.
 * Sizes stay small so every product is far inside the 32-bit range.
 */
const rng = makeRng(1006);

const nonZero = (length) => Array.from({ length }, () => {
  const value = intBetween(rng, 1, 7);
  return rng() < 0.4 ? -value : value;
});

const generated = [
  ...series(20, 'generated no zeros', () => {
    const nums = nonZero(intBetween(rng, 2, 8));
    const total = nums.reduce((product, value) => product * value, 1);
    return { args: [nums], expect: nums.map((value) => total / value) };
  }),
  ...series(10, 'generated one zero', () => {
    const nums = nonZero(intBetween(rng, 2, 7));
    const at = intBetween(rng, 0, nums.length - 1);
    const withoutIt = nums.filter((_, index) => index !== at).reduce((product, value) => product * value, 1);
    nums[at] = 0;
    return { args: [nums], expect: nums.map((_, index) => (index === at ? withoutIt : 0)) };
  }),
  ...series(6, 'generated two zeros', () => {
    const nums = nonZero(intBetween(rng, 3, 8));
    const [first, second] = shuffle(rng, nums.map((_, index) => index)).slice(0, 2);
    nums[first] = 0;
    nums[second] = 0;
    return { args: [nums], expect: nums.map(() => 0) };
  }),
];

export default {
  compare: 'exact',
  cases: [
    ...generated,
    { label: 'two elements', args: [[3, 7]], expect: [7, 3] },
    { label: 'all ones', args: [[1, 1, 1, 1]], expect: [1, 1, 1, 1] },
    { label: 'negatives flip the sign', args: [[-1, 2, -3]], expect: [-6, 3, -2] },
    { label: 'single zero at the front', args: [[0, 4, 5]], expect: [20, 0, 0] },
  ],
  gen: (n) => [Array.from({ length: n }, (_, index) => (index % 5) + 1)],
  probe: { base: 2000, budgetMs: 200 },
};
