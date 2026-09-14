/**
 * 85. Rotting Oranges   ·   Medium   ·   Graphs
 *
 * In a grid, 0 is empty, 1 is a fresh orange and 2 is a rotten one. Every
 * minute, a fresh orange adjacent (4-directionally) to a rotten one becomes
 * rotten. Return the minutes until no fresh orange remains, or -1 when that
 * never happens.
 *
 * Example 1:
 *   Input:  grid = [[2,1,1], [1,1,0], [0,1,1]]
 *   Output: 4
 *
 * Example 2:
 *   Input:  grid = [[2,1,1], [0,1,1], [1,0,1]]
 *   Output: -1         // the bottom-left orange is unreachable
 *
 * Example 3:
 *   Input:  grid = [[0, 2]]
 *   Output: 0          // nothing fresh to rot
 *
 * Constraints:
 *   - m === grid.length, n === grid[i].length
 *   - 1 <= m, n <= 10
 *   - grid[i][j] is 0, 1 or 2
 *
 * Follow-up: All rotten cells start in the queue together — that is what makes
 * the count a time.
 *
 * Pattern:   Multi-source BFS counting rounds
 * Target:    O(rows * cols) time and space
 * LeetCode:  https://leetcode.com/problems/rotting-oranges/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=69688s  (19:21:28)
 */
export function orangesRotting(grid: number[][]): number {
  throw new Error('Not implemented');
}
