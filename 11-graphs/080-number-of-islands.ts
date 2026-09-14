/**
 * 80. Number of Islands   ·   Medium   ·   Graphs
 *
 * Given an m x n grid of '1' (land) and '0' (water), count the islands. An
 * island is land connected horizontally or vertically, and the grid is
 * surrounded by water on all four edges.
 *
 * Example 1:
 *   Input:  grid = [["1","1","1","1","0"], ["1","1","0","1","0"],
 *                    ["1","1","0","0","0"], ["0","0","0","0","0"]]
 *   Output: 1
 *
 * Example 2:
 *   Input:  grid = [["1","1","0","0","0"], ["1","1","0","0","0"],
 *                    ["0","0","1","0","0"], ["0","0","0","1","1"]]
 *   Output: 3
 *
 * Constraints:
 *   - m === grid.length, n === grid[i].length
 *   - 1 <= m, n <= 300
 *   - grid[i][j] is '0' or '1'
 *
 * Follow-up: Can you avoid a visited array by mutating the grid — and should
 * you?
 *
 * Pattern:   Flood fill from every unvisited land cell
 * Target:    O(rows * cols) time and space
 * LeetCode:  https://leetcode.com/problems/number-of-islands/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=63848s  (17:44:08)
 */
export function numIslands(grid: string[][]): number {
  throw new Error('Not implemented');
}
