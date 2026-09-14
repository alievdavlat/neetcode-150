/**
 * 111. Unique Paths   ·   Medium   ·   2-D Dynamic Programming
 *
 * A robot starts in the top-left cell of an m x n grid and may only move right
 * or down. Return how many distinct paths it can take to the bottom-right
 * cell.
 *
 * Example 1:
 *   Input:  m = 3, n = 7
 *   Output: 28
 *
 * Example 2:
 *   Input:  m = 3, n = 2
 *   Output: 3
 *
 * Constraints:
 *   - 1 <= m, n <= 100
 *
 * Follow-up: There is a closed-form binomial answer. Derive it, then trust the
 * DP.
 *
 * Pattern:   dp[r][c] = dp[r-1][c] + dp[r][c-1]
 * Target:    O(m * n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/unique-paths/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=103552s  (28:45:52)
 */
export function uniquePaths(m: number, n: number): number {
  throw new Error('Not implemented');
}
