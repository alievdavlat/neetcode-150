/**
 * 117. Longest Increasing Path in a Matrix   ·   Hard   ·   2-D Dynamic Programming
 *
 * Given an m x n integer matrix, return the length of the longest strictly
 * increasing path. You may move up, down, left or right, but never diagonally
 * and never off the grid.
 *
 * Example 1:
 *   Input:  matrix = [[9, 9, 4], [6, 6, 8], [2, 1, 1]]
 *   Output: 4          // 1 -> 2 -> 6 -> 9
 *
 * Example 2:
 *   Input:  matrix = [[3, 4, 5], [3, 2, 6], [2, 2, 1]]
 *   Output: 4          // 3 -> 4 -> 5 -> 6
 *
 * Example 3:
 *   Input:  matrix = [[1]]
 *   Output: 1
 *
 * Constraints:
 *   - m === matrix.length, n === matrix[i].length
 *   - 1 <= m, n <= 200
 *   - 0 <= matrix[i][j] <= 2^31 - 1
 *
 * Follow-up: Why does strict increase mean you never need a visited set?
 *
 * Pattern:   DFS + memoisation on each cell (the grid is a DAG)
 * Target:    O(rows * cols) time and space
 * LeetCode:  https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=110006s  (30:33:26)
 */
export function longestIncreasingPath(matrix: number[][]): number {
  throw new Error('Not implemented');
}
