/**
 * 76. Word Search   ·   Medium   ·   Backtracking
 *
 * Given an m x n grid of characters and a word, return true when the word can
 * be spelled by walking through horizontally or vertically adjacent cells. The
 * same cell may not be used more than once within a single attempt.
 *
 * Example 1:
 *   Input:  board = [["A","B","C","E"], ["S","F","C","S"], ["A","D","E","E"]],
 *           word = "ABCCED"
 *   Output: true
 *
 * Example 2:
 *   Input:  same board, word = "SEE"
 *   Output: true
 *
 * Example 3:
 *   Input:  same board, word = "ABCB"
 *   Output: false      // the B would have to be reused
 *
 * Constraints:
 *   - m === board.length, n === board[i].length
 *   - 1 <= m, n <= 6 and 1 <= word.length <= 15
 *   - board and word consist of English letters
 *
 * Follow-up: Can you prune early using a character count of the whole board?
 *
 * Pattern:   Grid DFS with in-place visited marking
 * Target:    O(rows * cols * 4^len) time, O(len) space
 * LeetCode:  https://leetcode.com/problems/word-search/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=60594s  (16:49:54)
 */
export function exist(board: string[][], word: string): boolean {
  throw new Error('Not implemented');
}
