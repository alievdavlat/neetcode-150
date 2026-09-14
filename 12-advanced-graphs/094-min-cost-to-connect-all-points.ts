/**
 * 94. Min Cost to Connect All Points   ·   Medium   ·   Advanced Graphs
 *
 * Given n points on a plane, connect all of them so that exactly one path
 * exists between any two. The cost of an edge is the Manhattan distance
 * between its endpoints. Return the minimum total cost.
 *
 * Example 1:
 *   Input:  points = [[0,0], [2,2], [3,10], [5,2], [7,0]]
 *   Output: 20
 *
 * Example 2:
 *   Input:  points = [[3, 12], [-2, 5], [-4, 1]]
 *   Output: 18
 *
 * Constraints:
 *   - 1 <= points.length <= 1000
 *   - -10^6 <= xi, yi <= 10^6
 *   - All points are distinct
 *
 * Follow-up: The graph is complete, so Prim beats Kruskal here. Why?
 *
 * Pattern:   Prim's minimum spanning tree on a complete graph
 * Target:    O(n^2 log n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/min-cost-to-connect-all-points/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=78170s  (21:42:50)
 */
export function minCostConnectPoints(points: number[][]): number {
  throw new Error('Not implemented');
}
