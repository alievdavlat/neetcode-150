/**
 * 89. Redundant Connection   ·   Medium   ·   Graphs
 *
 * A tree on n nodes had one extra edge added, producing a graph with exactly
 * one cycle. Given the edge list, return the edge that can be removed to make
 * it a tree again. If several answers exist, return the one that appears last
 * in the input.
 *
 * Example 1:
 *   Input:  edges = [[1, 2], [1, 3], [2, 3]]
 *   Output: [2, 3]
 *
 * Example 2:
 *   Input:  edges = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]
 *   Output: [1, 4]
 *
 * Constraints:
 *   - n === edges.length and 3 <= n <= 1000
 *   - 1 <= ai < bi <= n with no repeated edges and no self-loops
 *   - The graph is connected
 *
 * Follow-up: Processing edges in order means the answer is simply the first
 * union that fails.
 *
 * Pattern:   Union-find — the first edge that joins two already-connected nodes
 * Target:    O(n * alpha(n)) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/redundant-connection/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=73456s  (20:24:16)
 */
export function findRedundantConnection(edges: number[][]): number[] {
  throw new Error('Not implemented');
}
