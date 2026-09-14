/**
 * 136. Rotate Image   ·   Medium   ·   Math & Geometry
 *
 * Rotate an n x n matrix 90 degrees clockwise, in place. You may not allocate
 * another matrix.
 *
 * Example 1:
 *   Input:  matrix = [[1,2,3], [4,5,6], [7,8,9]]
 *   Output: [[7,4,1], [8,5,2], [9,6,3]]
 *
 * Example 2:
 *   Input:  matrix = [[5,1,9,11], [2,4,8,10], [13,3,6,7], [15,14,12,16]]
 *   Output: [[15,13,2,5], [14,3,4,1], [12,6,8,9], [16,7,10,11]]
 *
 * Constraints:
 *   - n === matrix.length === matrix[i].length
 *   - 1 <= n <= 20
 *   - -1000 <= matrix[i][j] <= 1000
 *
 * Follow-up: Which two one-line transformations compose into a rotation? Does
 * their order matter?
 *
 * Pattern:   Transpose, then reverse each row (or rotate ring by ring)
 * Target:    O(n^2) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/rotate-image/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=127578s  (35:26:18)
 */
export function rotate(matrix: number[][]): void {
  throw new Error('Not implemented');
}
