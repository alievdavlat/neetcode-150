/**
 * Extra cases beyond the doc-block examples, plus the size generator that lets
 * `--big-o` time this problem. Nothing here reveals a solution.
 */
import { distinctInts, intBetween, makeRng, series, shuffle } from '../_support/random.mjs';

const rng = makeRng(1001);

/** Distinct values by construction, so the answer is known without solving anything. */
const generated = [
  ...series(25, 'generated all distinct', () => ({
    args: [shuffle(rng, distinctInts(rng, intBetween(rng, 2, 40), -1000, 1000))],
    expect: false,
  })),
  ...series(25, 'generated with a planted repeat', () => {
    const values = distinctInts(rng, intBetween(rng, 2, 40), -1000, 1000);
    const repeated = values[intBetween(rng, 0, values.length - 1)];
    return { args: [shuffle(rng, [...values, repeated])], expect: true };
  }),
];

export default {
  compare: 'exact',
  cases: [
    ...generated,
    { label: 'one value shares digits with another', args: [[12, 2]], expect: false },
    { label: 'multi-digit value contains a later one', args: [[1, 23, 3]], expect: false },
    { label: 'trailing zero is not a repeat', args: [[10, 0]], expect: false },
    { label: 'sign must not be ignored', args: [[-1, 1]], expect: false },
    { label: 'single element', args: [[7]], expect: false },
    { label: 'duplicate at the far end', args: [[5, 1, 2, 3, 4, 5]], expect: true },
    { label: 'negatives repeat', args: [[-3, 4, -3]], expect: true },
  ],
  gen: (n) => [Array.from({ length: n }, (_, index) => index * 2)],
  probe: { base: 2000, budgetMs: 200 },
};
