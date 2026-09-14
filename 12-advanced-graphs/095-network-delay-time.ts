/**
 * 95. Network Delay Time   ·   Medium   ·   Advanced Graphs
 *
 * times[i] = [u, v, w] is a directed edge from node u to node v taking w time.
 * A signal is sent from node k; return the time it takes for every one of the
 * n nodes to receive it, or -1 when some node never does.
 *
 * Example 1:
 *   Input:  times = [[2,1,1], [2,3,1], [3,4,1]], n = 4, k = 2
 *   Output: 2
 *
 * Example 2:
 *   Input:  times = [[1, 2, 1]], n = 2, k = 1
 *   Output: 1
 *
 * Example 3:
 *   Input:  times = [[1, 2, 1]], n = 2, k = 2
 *   Output: -1
 *
 * Constraints:
 *   - 1 <= k <= n <= 100 and 1 <= times.length <= 6000
 *   - 1 <= ui, vi <= n and ui !== vi
 *   - 0 <= wi <= 100, with all (ui, vi) pairs unique
 *
 * Follow-up: The answer is the maximum of the shortest distances, not their
 * sum.
 *
 * Pattern:   Dijkstra's shortest path from a single source
 * Target:    O(E log V) time, O(V + E) space
 * LeetCode:  https://leetcode.com/problems/network-delay-time/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=81277s  (22:34:37)
 */
export function networkDelayTime(times: number[][], n: number, k: number): number {
  throw new Error('Not implemented');
}
