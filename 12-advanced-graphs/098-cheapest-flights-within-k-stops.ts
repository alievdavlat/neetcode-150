/**
 * 98. Cheapest Flights Within K Stops   ·   Medium   ·   Advanced Graphs
 *
 * flights[i] = [from, to, price] describes a directed flight. Return the
 * cheapest price from src to dst using at most k stops, or -1 when no such
 * route exists.
 *
 * Example 1:
 *   Input:  n = 4, flights = [[0,1,100], [1,2,100], [2,0,100], [1,3,600], [2,3,200]],
 *           src = 0, dst = 3, k = 1
 *   Output: 700
 *
 * Example 2:
 *   Input:  n = 3, flights = [[0,1,100], [1,2,100], [0,2,500]], src = 0, dst = 2, k = 1
 *   Output: 200
 *
 * Example 3:
 *   Input:  n = 3, flights = [[0,1,100], [1,2,100], [0,2,500]], src = 0, dst = 2, k = 0
 *   Output: 500
 *
 * Constraints:
 *   - 1 <= n <= 100 and 0 <= flights.length <= n * (n - 1) / 2
 *   - 0 <= src, dst, k < n and src !== dst
 *   - 1 <= price <= 10^4, with no duplicate flights
 *
 * Follow-up: Relaxing in place lets one round use edges added in the same
 * round. Snapshot the distances.
 *
 * Pattern:   Bellman-Ford limited to k + 1 relaxation rounds
 * Target:    O(k * E) time, O(V) space
 * LeetCode:  https://leetcode.com/problems/cheapest-flights-within-k-stops/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=83680s  (23:14:40)
 */
export function findCheapestPrice(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number,
): number {
  throw new Error('Not implemented');
}
