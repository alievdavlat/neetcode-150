/**
 * 90. Number of Connected Components in an Undirected Graph   ·   Medium   ·   Graphs
 *
 * Given n nodes labelled 0 to n - 1 and a list of undirected edges, return the
 * number of connected components in the graph.
 *
 * Example 1:
 *   Input:  n = 5, edges = [[0, 1], [1, 2], [3, 4]]
 *   Output: 2
 *
 * Example 2:
 *   Input:  n = 5, edges = [[0, 1], [1, 2], [2, 3], [3, 4]]
 *   Output: 1
 *
 * Constraints:
 *   - 1 <= n <= 2000
 *   - 1 <= edges.length <= 5000
 *   - No repeated edges and no self-loops
 *
 * Follow-up: Start at n components and subtract one per successful union.
 *
 * Pattern:   Union-find with a component counter (or DFS per node)
 * Target:    O(V + E) time, O(V) space
 * LeetCode:  https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=73456s  (20:24:16)
 */
export function countComponents(n: number, edges: number[][]): number {
  throw new Error('Not implemented');
}
