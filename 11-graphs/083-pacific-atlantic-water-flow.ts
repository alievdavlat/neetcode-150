/**
 * 83. Pacific Atlantic Water Flow   ·   Medium   ·   Graphs
 *
 * heights is an m x n grid of cell elevations. The Pacific touches the top and
 * left edges, the Atlantic the bottom and right edges. Water flows from a cell
 * to a neighbour of equal or lower height. Return the coordinates of every
 * cell from which water can reach both oceans.
 *
 * Example 1:
 *   Input:  heights = [[1,2,2,3,5], [3,2,3,4,4], [2,4,5,3,1],
 *                       [6,7,1,4,5], [5,1,1,2,4]]
 *   Output: [[0,4], [1,3], [1,4], [2,2], [3,0], [3,1], [4,0]]
 *
 * Example 2:
 *   Input:  heights = [[1]]
 *   Output: [[0, 0]]
 *
 * Constraints:
 *   - m === heights.length, n === heights[i].length
 *   - 1 <= m, n <= 200
 *   - 0 <= heights[i][j] <= 10^5
 *
 * Follow-up: Running a search per cell is O((mn)^2). Start at the oceans and
 * walk uphill instead.
 *
 * Pattern:   Reverse traversal inward from both shorelines
 * Target:    O(rows * cols) time and space
 * LeetCode:  https://leetcode.com/problems/pacific-atlantic-water-flow/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=68045s  (18:54:05)
 */
export function pacificAtlantic(heights: number[][]): number[][] {
  throw new Error('Not implemented');
}
