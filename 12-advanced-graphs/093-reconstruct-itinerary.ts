/**
 * 93. Reconstruct Itinerary   ·   Hard   ·   Advanced Graphs
 *
 * Given a list of airline tickets [from, to], reconstruct the itinerary that
 * uses every ticket exactly once, starting at "JFK". At least one valid
 * itinerary exists; when several do, return the one that is smallest in
 * lexical order when read as a single list.
 *
 * Example 1:
 *   Input:  tickets = [["MUC","LHR"], ["JFK","MUC"], ["SFO","SJC"], ["LHR","SFO"]]
 *   Output: ["JFK", "MUC", "LHR", "SFO", "SJC"]
 *
 * Example 2:
 *   Input:  tickets = [["JFK","SFO"], ["JFK","ATL"], ["SFO","ATL"],
 *                      ["ATL","JFK"], ["ATL","SFO"]]
 *   Output: ["JFK", "ATL", "JFK", "SFO", "ATL", "SFO"]
 *
 * Constraints:
 *   - 1 <= tickets.length <= 300
 *   - Airport codes are three uppercase letters
 *   - from !== to for every ticket
 *
 * Follow-up: Plain greedy DFS can strand you at a dead end. Appending on the
 * way back out fixes it — why?
 *
 * Pattern:   Hierholzer's Eulerian path, neighbours in lexical order
 * Target:    O(E log E) time, O(E) space
 * LeetCode:  https://leetcode.com/problems/reconstruct-itinerary/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=78170s  (21:42:50)
 */
export function findItinerary(tickets: string[][]): string[] {
  throw new Error('Not implemented');
}
