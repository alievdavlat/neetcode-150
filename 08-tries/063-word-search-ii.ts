/**
 * 63. Word Search II   ·   Hard   ·   Tries
 *
 * Given an m x n board of characters and a list of words, return every word
 * from the list that can be spelled by walking the board. A word is built from
 * letters in horizontally or vertically adjacent cells, and no cell may be
 * reused inside one word. Each answer appears once, in any order.
 *
 * Example 1:
 *   Input:  board = [["o","a","a","n"], ["e","t","a","e"],
 *                    ["i","h","k","r"], ["i","f","l","v"]],
 *           words = ["oath", "pea", "eat", "rain"]
 *   Output: ["oath", "eat"]
 *
 * Example 2:
 *   Input:  board = [["a","b"], ["c","d"]], words = ["abcb"]
 *   Output: []
 *
 * Constraints:
 *   - m === board.length, n === board[i].length, 1 <= m, n <= 12
 *   - board[i][j] is a lowercase English letter
 *   - 1 <= words.length <= 3 * 10^4 and 1 <= words[i].length <= 10
 *   - All words are unique
 *
 * Follow-up: Running Word Search once per word is far too slow. Prune the trie
 * as words are found.
 *
 * Pattern:   Build a trie of the dictionary, then backtrack the grid once
 * Target:    O(rows * cols * 4^maxWordLength) worst case
 * LeetCode:  https://leetcode.com/problems/word-search-ii/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=50488s  (14:01:28)
 */
export function findWords(board: string[][], words: string[]): string[] {
  throw new Error('Not implemented');
}
