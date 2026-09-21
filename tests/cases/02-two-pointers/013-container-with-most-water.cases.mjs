import { intBetween, makeRng, series } from '../_support/random.mjs';

/**
 * Towers standing in a field of walls one unit high.
 *
 * Any pair that includes a one-unit wall holds at most `n - 1`, because the
 * shorter wall governs and the field is never wider than that. So if every
 * tower pair is built to hold more than `n - 1`, the answer has to be the best
 * tower pair - and with two or three towers that is a comparison of two or
 * three numbers we already have, not a search.
 */
const rng = makeRng(1013);

/** The shortest tower that beats every pair involving a one-unit wall. */
const tallEnough = (length, span) => Math.ceil((length - 1) / span) + 1;

const field = (length, towers) => {
  const height = Array.from({ length }, () => 1);
  for (const [at, value] of towers) height[at] = value;

  return height;
};

const generated = [
  ...series(24, 'generated two towers', () => {
    const length = intBetween(rng, 4, 24);
    const left = intBetween(rng, 0, length - 2);
    const right = intBetween(rng, left + 1, length - 1);

    const floor = tallEnough(length, right - left);
    const first = intBetween(rng, floor, floor + 25);
    const second = intBetween(rng, floor, floor + 25);

    return {
      args: [field(length, [[left, first], [right, second]])],
      expect: Math.min(first, second) * (right - left),
    };
  }),
  ...series(12, 'generated three towers', () => {
    const length = intBetween(rng, 6, 26);
    const left = intBetween(rng, 0, length - 3);
    const middle = intBetween(rng, left + 1, length - 2);
    const right = intBetween(rng, middle + 1, length - 1);

    const floor = tallEnough(length, Math.min(middle - left, right - middle));
    const [a, b, c] = [0, 1, 2].map(() => intBetween(rng, floor, floor + 25));

    return {
      args: [field(length, [[left, a], [middle, b], [right, c]])],
      expect: Math.max(
        Math.min(a, b) * (middle - left),
        Math.min(b, c) * (right - middle),
        Math.min(a, c) * (right - left),
      ),
    };
  }),
  ...series(8, 'generated flat field', () => {
    const length = intBetween(rng, 2, 30);
    const level = intBetween(rng, 0, 40);

    return { args: [Array.from({ length }, () => level)], expect: level * (length - 1) };
  }),
];

export default {
  cases: [
    ...generated,
    { label: 'the two shortest walls, far apart', args: [[1, 2, 1]], expect: 2 },
    { label: 'equal ends beat a taller neighbour', args: [[4, 3, 2, 1, 4]], expect: 16 },
    { label: 'the widest pair is not the best', args: [[1, 2, 4, 3]], expect: 4 },
    { label: 'two tall neighbours beat everything wider', args: [[2, 3, 4, 5, 18, 17, 6]], expect: 17 },
    { label: 'a zero wall holds nothing', args: [[0, 2, 0, 2, 0]], expect: 4 },
    { label: 'every wall the same', args: [[3, 3, 3, 3]], expect: 9 },
    { label: 'ascending', args: [[1, 2, 3, 4, 5]], expect: 6 },
  ],
  gen: (n) => [Array.from({ length: n }, (_, index) => (index % 2 === 0 ? 1 : index))],
  probe: { base: 2000, budgetMs: 200 },
};
