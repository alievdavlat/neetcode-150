/**
 * 135. Minimum Interval to Include Each Query   ·   Hard   ·   Intervals
 *
 * Given intervals and a list of queries, answer each query with the size of
 * the smallest interval that contains it, where size is end - start + 1.
 * Answer -1 when no interval contains the query. Answers must be returned in
 * the original query order.
 *
 * Example 1:
 *   Input:  intervals = [[1,4], [2,4], [3,6], [4,4]], queries = [2, 3, 4, 5]
 *   Output: [3, 3, 1, 4]
 *
 * Example 2:
 *   Input:  intervals = [[2,3], [2,5], [1,8], [20,25]], queries = [2, 19, 5, 22]
 *   Output: [2, -1, 4, 6]
 *
 * Constraints:
 *   - 1 <= intervals.length, queries.length <= 10^5
 *   - 1 <= start <= end <= 10^7 and 1 <= query <= 10^7
 *
 * Follow-up: Processing queries in sorted order is what makes the heap valid —
 * remember to restore the original order at the end.
 *
 * Pattern:   Sort queries, sweep intervals in, min-heap by interval size
 * Target:    O((n + q) log(n + q)) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/minimum-interval-to-include-each-query/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=127578s  (35:26:18)
 */
export function minInterval(intervals: number[][], queries: number[]): number[] {
  throw new Error('Not implemented');
}
