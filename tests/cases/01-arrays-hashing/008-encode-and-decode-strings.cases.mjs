/**
 * Two exports that only mean anything together, so each case encodes and then
 * asks the module for decode. The third argument to `check` is the loaded
 * solution module.
 */
const roundTrip = (strs, label) => ({
  label,
  args: [strs],
  check: (encoded, [input], module) => {
    if (typeof encoded !== 'string') return `encode returned ${typeof encoded}, expected a string`;
    const back = module.decode(encoded);
    if (JSON.stringify(back) === JSON.stringify(input)) return true;
    return `decode gave ${JSON.stringify(back)}`;
  },
});

import { intBetween, makeRng, pick, series } from '../_support/random.mjs';

const rng = makeRng(1008);

/** Characters a separator-based encoding tends to trip over. */
const AWKWARD = ['#', ':', '/', '|', ',', '0', '1', '9', 'a', ' ', '"', 'é', '中'];

const noisy = (length) => Array.from({ length }, () => pick(rng, AWKWARD)).join('');

const generated = series(30, 'generated round trip', () =>
  roundTrip(
    Array.from({ length: intBetween(rng, 0, 6) }, () => noisy(intBetween(rng, 0, 8))),
    '',
  ),
).map((entry, index) => ({ ...entry, label: `generated round trip ${index + 1}` }));

export default {
  only: ['encode'],
  cases: [
    ...generated,
    roundTrip(['neet', 'code', 'love', 'you'], 'plain words'),
    roundTrip(['we', 'say', ':', 'yes'], 'a separator character in the data'),
    roundTrip([''], 'one empty string'),
    roundTrip([], 'no strings at all'),
    roundTrip(['', ''], 'two empty strings must not collapse into one'),
    roundTrip(['4#abc', 'x'], 'data that looks like a length prefix'),
    roundTrip(['a'.repeat(120), 'b'], 'length needing more than one digit'),
  ],
};
