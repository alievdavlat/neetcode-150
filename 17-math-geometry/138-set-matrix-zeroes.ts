/**
 * 138. Set Matrix Zeroes   ·   Medium   ·   Math & Geometry
 *
 * If an element of an m x n matrix is 0, set its entire row and column to 0.
 * Do it in place.
 *
 * Example 1:
 *   Input:  matrix = [[1,1,1], [1,0,1], [1,1,1]]
 *   Output: [[1,0,1], [0,0,0], [1,0,1]]
 *
 * Example 2:
 *   Input:  matrix = [[0,1,2,0], [3,4,5,2], [1,3,1,5]]
 *   Output: [[0,0,0,0], [0,4,5,0], [0,3,1,0]]
 *
 * Constraints:
 *   - m === matrix.length, n === matrix[0].length
 *   - 1 <= m, n <= 200
 *   - -2^31 <= matrix[i][j] <= 2^31 - 1
 *
 * Follow-up: O(m + n) space is the obvious improvement. O(1) needs one extra
 * flag — which cell is ambiguous?
 *
 * Pattern:   Use the first row and column as the marker storage
 * Target:    O(m * n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/set-matrix-zeroes/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=129631s  (36:00:31)
 */
export function setZeroes(matrix: number[][]): void {
  throw new Error('Not implemented');
}
