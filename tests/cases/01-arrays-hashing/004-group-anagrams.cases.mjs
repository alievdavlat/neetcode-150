/**
 * Groups may come back in any order and so may the words inside them, so both
 * levels are sorted before comparing. The generator builds real anagram groups
 * from a fixed-width alphabet window so word length stays constant as n grows.
 */
export default {
  cases: [
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
