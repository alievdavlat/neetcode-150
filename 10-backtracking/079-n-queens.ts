/**
 * 79. N-Queens   ·   Hard   ·   Backtracking
 *
 * Place n queens on an n x n board so that no two attack each other, and
 * return every distinct solution. Each solution is a list of n strings where
 * 'Q' marks a queen and '.' an empty square.
 *
 * Example 1:
 *   Input:  n = 4
 *   Output: [[".Q..", "...Q", "Q...", "..Q."],
 *            ["..Q.", "Q...", "...Q", ".Q.."]]
 *
 * Example 2:
 *   Input:  n = 1
 *   Output: [["Q"]]
 *
 * Constraints:
 *   - 1 <= n <= 9
 *
 * Follow-up: Two queens share a diagonal when row - col matches, or an
 * anti-diagonal when row + col matches. Both are O(1) lookups.
 *
 * Pattern:   Row-by-row placement with column and diagonal sets
 * Target:    O(n!) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/n-queens/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=63848s  (17:44:08)
 */
export function solveNQueens(n: number): string[][] {
  throw new Error('Not implemented');
}
