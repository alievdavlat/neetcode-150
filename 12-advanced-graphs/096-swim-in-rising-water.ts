/**
 * 96. Swim in Rising Water   ·   Hard   ·   Advanced Graphs
 *
 * grid[i][j] is the elevation of a square. At time t, water depth is t
 * everywhere, and you may swim from a square to a 4-directionally adjacent one
 * only when both elevations are at most t. Swimming is instantaneous. Return
 * the least time to reach the bottom-right corner from the top-left one.
 *
 * Example 1:
 *   Input:  grid = [[0, 2], [1, 3]]
 *   Output: 3
 *
 * Example 2:
 *   Input:  grid = [[0,1,2,3,4], [24,23,22,21,5], [12,13,14,15,16],
 *                    [11,17,18,19,20], [10,9,8,7,6]]
 *   Output: 16
 *
 * Constraints:
 *   - n === grid.length === grid[i].length and 1 <= n <= 50
 *   - grid[i][j] is a permutation of 0 .. n^2 - 1
 *
 * Follow-up: The path cost is the maximum cell on the path, not the sum.
 * Adjust the relaxation.
 *
 * Pattern:   Dijkstra on max-edge cost (or binary search + flood fill)
 * Target:    O(n^2 log n) time, O(n^2) space
 * LeetCode:  https://leetcode.com/problems/swim-in-rising-water/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=81277s  (22:34:37)
 */
export function swimInWater(grid: number[][]): number {
  throw new Error('Not implemented');
}
