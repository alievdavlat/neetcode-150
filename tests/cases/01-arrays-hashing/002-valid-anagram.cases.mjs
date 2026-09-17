/** Cases stay inside the stated constraint: lowercase English letters only. */
const rotated = (length, offset) =>
  Array.from({ length }, (_, index) => String.fromCharCode(97 + ((index + offset) % 26))).join('');

import { intBetween, LOWERCASE, makeRng, pick, series, shuffle, word } from '../_support/random.mjs';

const rng = makeRng(1002);

/**
 * A shuffle of the same letters is always an anagram; replacing one letter with
 * a different one always breaks the counts. Neither needs the answer computed.
 */
const generated = [
  ...series(20, 'generated shuffle', () => {
    const left = word(rng, intBetween(rng, 1, 30));
    return { args: [left, shuffle(rng, [...left]).join('')], expect: true };
  }),
  ...series(20, 'generated one letter replaced', () => {
    const left = word(rng, intBetween(rng, 1, 30));
    const at = intBetween(rng, 0, left.length - 1);
    let swap = pick(rng, LOWERCASE.split(''));
    while (swap === left[at]) swap = pick(rng, LOWERCASE.split(''));
    return { args: [left, `${left.slice(0, at)}${swap}${left.slice(at + 1)}`], expect: false };
  }),
  ...series(10, 'generated different lengths', () => {
    const left = word(rng, intBetween(rng, 1, 20));
    return { args: [left, left + word(rng, intBetween(rng, 1, 5))], expect: false };
  }),
];

export default {
  compare: 'exact',
  cases: [
    ...generated,
    { label: 'identical single letters', args: ['a', 'a'], expect: true },
    { label: 'two letters swapped', args: ['ab', 'ba'], expect: true },
    { label: 'same letters, different counts', args: ['aacc', 'ccac'], expect: false },
    { label: 'length differs', args: ['a', 'ab'], expect: false },
    { label: 'repeated letter only', args: ['aaa', 'aaa'], expect: true },
    { label: 'one letter apart', args: ['abcd', 'abce'], expect: false },
  ],
  gen: (n) => {
    const forward = rotated(n, 0);
    return [forward, [...forward].reverse().join('')];
  },
  probe: { base: 4000, budgetMs: 200 },
};
