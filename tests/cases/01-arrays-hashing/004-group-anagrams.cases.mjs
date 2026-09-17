/**
 * Groups may come back in any order and so may the words inside them, so both
 * levels are sorted before comparing. The generator builds real anagram groups
 * from a fixed-width alphabet window so word length stays constant as n grows.
 */
import { intBetween, makeRng, series, shuffle } from '../_support/random.mjs';

const rng = makeRng(1004);

/**
 * Group g is built from the letter at index g, repeated a number of times that
 * is also unique to g, so two groups can never be anagrams of each other. The
 * members are shuffles of that string, which makes the grouping known up front.
 */
const generated = series(25, 'generated planted groups', () => {
  const groups = intBetween(rng, 1, 6);
  const expect = [];

  for (let group = 0; group < groups; group += 1) {
    const letters = String.fromCharCode(97 + group).repeat(group + 2) + 'z';
    const members = Array.from({ length: intBetween(rng, 1, 4) }, () => shuffle(rng, [...letters]).join(''));
    expect.push(members);
  }

  return { args: [shuffle(rng, expect.flat())], expect };
});

export default {
  cases: [
    ...generated,
    { label: 'no anagrams at all', args: [['abc', 'def', 'ghi']], expect: [['abc'], ['def'], ['ghi']] },
    { label: 'every word in one group', args: [['abc', 'bca', 'cab']], expect: [['abc', 'bca', 'cab']] },
    { label: 'repeated letters', args: [['aab', 'aba', 'baa', 'abb']], expect: [['aab', 'aba', 'baa'], ['abb']] },
    { label: 'single empty string', args: [['']], expect: [['']] },
  ],
  gen: (n) => {
    const words = [];
    for (let index = 0; index < n; index += 1) {
      const letters = Array.from({ length: 8 }, (_, offset) =>
        String.fromCharCode(97 + ((index + offset) % 26)),
      );
      if (index % 3 === 0) letters.reverse();
      words.push(letters.join(''));
    }
    return [words];
  },
  probe: { base: 2000, budgetMs: 200 },
};
