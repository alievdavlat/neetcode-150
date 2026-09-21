import { distinctInts, intBetween, makeRng, pick, series, shuffle } from '../_support/random.mjs';

/**
 * Each generated array is a set of planted triplets and nothing else, and the
 * planting is what makes the full answer knowable without solving anything.
 *
 * A triplet is `[-(p + q), p, q]` where every `p` and `q` across the whole
 * array is a different power of two. Two distinct powers add up to a value no
 * other pair of distinct powers reaches - that is just binary - so the only
 * way three of these values can cancel is the way they were planted. Repeated
 * values are thrown in on purpose: they cannot make a new triplet, but they do
 * catch a solution that reports the same triplet twice.
 */
const rng = makeRng(1012);

const generated = series(30, 'generated planted triplets', () => {
  const count = intBetween(rng, 1, 4);
  const powers = distinctInts(rng, count * 2, 0, 15).map((power) => 2 ** power);

  const planted = [];
  const values = [];

  for (let index = 0; index < count; index += 1) {
    const [first, second] = [powers[index * 2], powers[index * 2 + 1]];

    planted.push([-(first + second), first, second]);
    values.push(-(first + second), first, second);
  }

  const repeats = Array.from({ length: intBetween(rng, 0, 3) }, () => pick(rng, values));

  return { args: [shuffle(rng, [...values, ...repeats])], expect: planted };
});

export default {
  cases: [
    ...generated,
    { label: 'too short to hold a triplet', args: [[1, -1]], expect: [] },
    { label: 'all positive', args: [[1, 2, 3, 4]], expect: [] },
    { label: 'all negative', args: [[-1, -1, -1]], expect: [] },
    { label: 'three zeros and nothing else', args: [[0, 0, 0, 0]], expect: [[0, 0, 0]] },
    { label: 'two triplets share a value', args: [[-2, 0, 1, 1, 2]], expect: [[-2, 0, 2], [-2, 1, 1]] },
    { label: 'three overlapping triplets', args: [[3, 0, -2, -1, 1, 2]], expect: [[-2, -1, 3], [-2, 0, 2], [-1, 0, 1]] },
    { label: 'a pair that only works with the zero', args: [[-4, 0, 4, 4]], expect: [[-4, 0, 4]] },
    { label: 'repeats of every value', args: [[-1, -1, 0, 0, 1, 1]], expect: [[-1, 0, 1]] },
    { label: 'one value repeated many times, no triplet', args: [[2, 2, 2, 2, 2]], expect: [] },
  ],
  /** Every value positive, so the scan runs to the end without finding anything. */
  gen: (n) => [Array.from({ length: n }, (_, index) => index + 1)],
  probe: { base: 120, budgetMs: 400 },
};
