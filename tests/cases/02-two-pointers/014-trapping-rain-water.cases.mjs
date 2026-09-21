import { intBetween, makeRng, series } from '../_support/random.mjs';

/**
 * Pools built between walls of a known height.
 *
 * A flat floor of height `f` lying between two walls of height `w`, with
 * `f < w`, holds `(w - f)` of water on each of its columns and nothing spills
 * past the walls. So an input assembled out of such stretches has an answer
 * that is a sum of rectangles known while the input is being written, which is
 * why nothing here needs the running maxima the problem is about.
 */
const rng = makeRng(1014);

const generated = [
  ...series(20, 'generated single pool', () => {
    const left = intBetween(rng, 2, 40);
    const right = intBetween(rng, 2, 40);
    const width = intBetween(rng, 1, 12);
    const floor = intBetween(rng, 0, Math.min(left, right) - 1);

    return {
      args: [[left, ...Array.from({ length: width }, () => floor), right]],
      expect: (Math.min(left, right) - floor) * width,
    };
  }),
  ...series(16, 'generated pools in a row', () => {
    const wall = intBetween(rng, 3, 40);
    const pools = Array.from({ length: intBetween(rng, 2, 4) }, () => ({
      width: intBetween(rng, 1, 8),
      floor: intBetween(rng, 0, wall - 1),
    }));

    const height = [wall];
    for (const pool of pools) {
      height.push(...Array.from({ length: pool.width }, () => pool.floor), wall);
    }

    return {
      args: [height],
      expect: pools.reduce((total, pool) => total + (wall - pool.floor) * pool.width, 0),
    };
  }),
  ...series(8, 'generated slope holds nothing', () => {
    const length = intBetween(rng, 2, 30);
    const step = intBetween(rng, 1, 3);
    const rising = Array.from({ length }, (_, index) => index * step);

    return { args: [rng() < 0.5 ? rising : [...rising].reverse()], expect: 0 };
  }),
];

export default {
  cases: [
    ...generated,
    { label: 'a single bar', args: [[5]], expect: 0 },
    { label: 'two bars have nothing between them', args: [[5, 5]], expect: 0 },
    { label: 'the smallest pool there is', args: [[2, 0, 2]], expect: 2 },
    { label: 'the shorter wall decides', args: [[5, 0, 3]], expect: 3 },
    { label: 'water outside the walls does not count', args: [[0, 3, 0, 3, 0]], expect: 3 },
    { label: 'a deep basin behind a low step', args: [[3, 0, 0, 2, 0, 4]], expect: 10 },
    { label: 'one dip at the end', args: [[5, 4, 1, 2]], expect: 1 },
    { label: 'flat ground', args: [[2, 2, 2, 2]], expect: 0 },
    { label: 'a valley between two peaks of the same height', args: [[4, 1, 1, 1, 4]], expect: 9 },
  ],
  /** One pool as wide as the input: every column between the walls holds water. */
  gen: (n) => [Array.from({ length: n }, (_, index) => (index === 0 || index === n - 1 ? n : 0))],
  probe: { base: 2000, budgetMs: 200 },
};
