/**
 * 29. Search a 2D Matrix   ·   Medium   ·   Binary Search
 *
 * You are given an m x n matrix where each row is sorted ascending and the
 * first value of every row is greater than the last value of the previous row.
 * Return true when target is present. The runtime must be O(log(m * n)).
 *
 * Example 1:
 *   Input:  matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 3
 *   Output: true
 *
 * Example 2:
 *   Input:  matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 13
 *   Output: false
 *
 * Constraints:
 *   - m === matrix.length, n === matrix[i].length
 *   - 1 <= m, n <= 100
 *   - -10^4 <= matrix[i][j], target <= 10^4
 *
 * Follow-up: One binary search, not two — how do you map a flat index back to
 * (row, col)?
 *
 * Pattern:   Treat the matrix as one flat sorted array
 * Target:    O(log(m * n)) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/search-a-2d-matrix/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=24383s  (06:46:23)
 */
export function searchMatrix(matrix: number[][], target: number): boolean {
  throw new Error('Not implemented');
}
