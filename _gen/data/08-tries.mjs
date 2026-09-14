export default {
  category: 'Tries',
  dir: '08-tries',
  intro: `
Three problems, one data structure, escalating stakes: build it, make it answer wildcards,
then run a whole dictionary against a grid with it. Decide early whether a node stores its
children in a Map or a fixed 26-slot array — the third problem cares.
`,
  problems: [
    {
      n: 61,
      title: 'Implement Trie (Prefix Tree)',
      slug: 'implement-trie-prefix-tree',
      difficulty: 'Medium',
      leetcode: 'implement-trie-prefix-tree',
      pattern: 'Character-indexed tree with an end-of-word flag',
      complexity: 'O(len) per operation, O(total characters) space',
      statement: `
Implement a trie with three operations: insert(word) stores a word, search(word) returns
true when that exact word was inserted, and startsWith(prefix) returns true when any stored
word begins with the prefix.
`,
      examples: [
        `Input:  insert("apple"), search("apple"), search("app"),
        startsWith("app"), insert("app"), search("app")
Output: true, false, true, true`,
      ],
      constraints: [
        '1 <= word.length, prefix.length <= 2000',
        'Inputs consist of lowercase English letters only',
        'At most 3 * 10^4 calls in total',
      ],
      followUp: 'What single field separates "a word ends here" from "a word passes through here"?',
      stub: `
export class Trie {
  insert(word: string): void {
    throw new Error('Not implemented');
  }

  search(word: string): boolean {
    throw new Error('Not implemented');
  }

  startsWith(prefix: string): boolean {
    throw new Error('Not implemented');
  }
}
`,
    },
    {
      n: 62,
      title: 'Design Add and Search Words Data Structure',
      slug: 'design-add-and-search-words-data-structure',
      difficulty: 'Medium',
      leetcode: 'design-add-and-search-words-data-structure',
      pattern: 'Trie + DFS branching on the . wildcard',
      complexity: 'O(len) for plain words, O(26^dots * len) worst case',
      statement: `
Design a dictionary that supports addWord(word) and search(word), where the searched word
may contain '.' as a wildcard matching any single letter. search returns true when at least
one stored word matches.
`,
      examples: [
        `Input:  addWord("bad"), addWord("dad"), addWord("mad"),
        search("pad"), search("bad"), search(".ad"), search("b..")
Output: false, true, true, true`,
      ],
      constraints: [
        '1 <= word.length <= 25',
        'addWord receives lowercase English letters only',
        "search receives lowercase letters and '.' , with at most 2 dots",
        'At most 10^4 calls in total',
      ],
      followUp: 'A wildcard turns a walk into a search. Where exactly does the recursion fan out?',
      stub: `
export class WordDictionary {
  addWord(word: string): void {
    throw new Error('Not implemented');
  }

  search(word: string): boolean {
    throw new Error('Not implemented');
  }
}
`,
    },
    {
      n: 63,
      title: 'Word Search II',
      slug: 'word-search-ii',
      difficulty: 'Hard',
      leetcode: 'word-search-ii',
      pattern: 'Build a trie of the dictionary, then backtrack the grid once',
      complexity: 'O(rows * cols * 4^maxWordLength) worst case',
      statement: `
Given an m x n board of characters and a list of words, return every word from the list
that can be spelled by walking the board. A word is built from letters in horizontally or
vertically adjacent cells, and no cell may be reused inside one word. Each answer appears
once, in any order.
`,
      examples: [
        `Input:  board = [["o","a","a","n"], ["e","t","a","e"],
                 ["i","h","k","r"], ["i","f","l","v"]],
        words = ["oath", "pea", "eat", "rain"]
Output: ["oath", "eat"]`,
        `Input:  board = [["a","b"], ["c","d"]], words = ["abcb"]
Output: []`,
      ],
      constraints: [
        'm === board.length, n === board[i].length, 1 <= m, n <= 12',
        'board[i][j] is a lowercase English letter',
        '1 <= words.length <= 3 * 10^4 and 1 <= words[i].length <= 10',
        'All words are unique',
      ],
      followUp:
        'Running Word Search once per word is far too slow. Prune the trie as words are found.',
      stub: `
export function findWords(board: string[][], words: string[]): string[] {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
