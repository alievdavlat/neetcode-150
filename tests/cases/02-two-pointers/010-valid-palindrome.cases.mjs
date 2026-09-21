import { intBetween, LOWERCASE, makeRng, pick, series } from '../_support/random.mjs';

/**
 * Every generated string is built by mirroring a random core, so its answer is
 * known from the way it was made rather than worked out here. The negatives are
 * the same cores with one character replaced: the mirror then breaks at exactly
 * one place, which is what catches a comparison that gives up too early.
 */
const rng = makeRng(1010);

const ALNUM = `${LOWERCASE}0123456789`.split('');
const NOISE = [' ', ',', '.', ':', ';', '!', '?', '-', "'", '"', '(', ')'];

const mirrored = () => {
  const half = Array.from({ length: intBetween(rng, 1, 9) }, () => pick(rng, ALNUM));
  const middle = rng() < 0.5 ? [pick(rng, ALNUM)] : [];

  return [...half, ...middle, ...[...half].reverse()];
};

/** Scatter the characters the problem says to ignore, and vary the case. */
const decorate = (letters) =>
  [
    ...letters.flatMap((letter) => [
      ...(rng() < 0.35 ? [pick(rng, NOISE)] : []),
      rng() < 0.5 ? letter.toUpperCase() : letter,
    ]),
    ...(rng() < 0.5 ? [pick(rng, NOISE)] : []),
  ].join('');

const generated = [
  ...series(24, 'generated palindrome', () => ({ args: [decorate(mirrored())], expect: true })),
  ...series(18, 'generated one character out of place', () => {
    const letters = mirrored();
    const at = intBetween(rng, 0, Math.floor(letters.length / 2) - 1);

    let replacement = pick(rng, ALNUM);
    while (replacement === letters[at]) replacement = pick(rng, ALNUM);
    letters[at] = replacement;

    return { args: [decorate(letters)], expect: false };
  }),
];

export default {
  cases: [
    ...generated,
    { label: 'one letter', args: ['a'], expect: true },
    { label: 'two different letters', args: ['ab'], expect: false },
    { label: 'nothing left after cleaning', args: [',.;'], expect: true },
    { label: 'a digit and a letter are not the same character', args: ['0P'], expect: false },
    { label: 'digits mirror too', args: ['0P0'], expect: true },
    { label: 'the same letters in the wrong order', args: ['1a2'], expect: false },
    { label: 'apostrophes are skipped', args: ["Madam, I'm Adam"], expect: true },
    { label: 'spaces are skipped', args: ['No lemon, no melon'], expect: true },
    { label: 'even length', args: ['abccba'], expect: true },
    { label: 'odd length', args: ['tacocat'], expect: true },
    { label: 'mismatch only at the very last character', args: ['abcdba'], expect: false },
    { label: 'punctuation before the first letter', args: ['.,a'], expect: true },
  ],
  /** One long palindrome: no early exit, so the whole string is walked. */
  gen: (n) => ['x'.repeat(n)],
  probe: { base: 2000, budgetMs: 200 },
};
