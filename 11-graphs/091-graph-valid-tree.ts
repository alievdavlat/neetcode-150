/**
 * 91. Graph Valid Tree   ·   Medium   ·   Graphs
 *
 * Given n nodes labelled 0 to n - 1 and a list of undirected edges, return
 * true when the graph is a valid tree — connected and acyclic.
 *
 * Example 1:
 *   Input:  n = 5, edges = [[0, 1], [0, 2], [0, 3], [1, 4]]
 *   Output: true
 *
 * Example 2:
 *   Input:  n = 5, edges = [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]
 *   Output: false      // 1 - 2 - 3 - 1 is a cycle
 *
 * Constraints:
 *   - 1 <= n <= 2000
 *   - 0 <= edges.length <= 5000
 *   - No self-loops and no duplicate edges
 *
 * Follow-up: Two cheap checks settle it before you traverse anything. What are
 * they?
 *
 * Pattern:   Exactly n - 1 edges and fully connected, no cycle
 * Target:    O(V + E) time, O(V) space
 * LeetCode:  https://leetcode.com/problems/graph-valid-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=76283s  (21:11:23)
 */
export function validTree(n: number, edges: number[][]): boolean {
  throw new Error('Not implemented');
}
