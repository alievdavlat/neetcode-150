import { GraphNode } from '../shared/types.ts';

/**
 * 81. Clone Graph   ·   Medium   ·   Graphs
 *
 * Given a reference to a node in a connected undirected graph, return a deep
 * copy of the whole graph. Each node holds a value and a list of neighbours;
 * the copy must share no node with the original. A null input returns null.
 *
 * Example 1:
 *   Input:  adjList = [[2, 4], [1, 3], [2, 4], [1, 3]]
 *   Output: an independent graph with the same shape
 *
 * Example 2:
 *   Input:  adjList = [[]]
 *   Output: a single node with no neighbours
 *
 * Example 3:
 *   Input:  adjList = []
 *   Output: null
 *
 * Constraints:
 *   - The graph has 0 to 100 nodes
 *   - 1 <= Node.val <= 100 and values are unique
 *   - The graph is connected, undirected and has no self-loops or repeated
 *     edges
 *
 * Follow-up: The map must be written before you recurse, not after. Why?
 *
 * Pattern:   DFS/BFS with an original -> clone map
 * Target:    O(V + E) time and space
 * LeetCode:  https://leetcode.com/problems/clone-graph/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=65564s  (18:12:44)
 */
export function cloneGraph(node: GraphNode | null): GraphNode | null {
  throw new Error('Not implemented');
}
