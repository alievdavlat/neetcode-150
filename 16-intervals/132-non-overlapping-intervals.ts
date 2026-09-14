/**
 * 132. Non-overlapping Intervals   ·   Medium   ·   Intervals
 *
 * Return the minimum number of intervals you must remove so that the rest do
 * not overlap. Intervals that only touch at an endpoint do not overlap.
 *
 * Example 1:
 *   Input:  intervals = [[1,2], [2,3], [3,4], [1,3]]
 *   Output: 1          // remove [1, 3]
 *
 * Example 2:
 *   Input:  intervals = [[1, 2], [1, 2], [1, 2]]
 *   Output: 2
 *
 * Example 3:
 *   Input:  intervals = [[1, 2], [2, 3]]
 *   Output: 0
 *
 * Constraints:
 *   - 1 <= intervals.length <= 10^5
 *   - -5 * 10^4 <= start < end <= 5 * 10^4
 *
 * Follow-up: Sorting by start also works but needs a different keep/drop rule.
 * Try both.
 *
 * Pattern:   Activity selection — sort by end, keep the earliest finisher
 * Target:    O(n log n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/non-overlapping-intervals/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=124034s  (34:27:14)
 */
export function eraseOverlapIntervals(intervals: number[][]): number {
  throw new Error('Not implemented');
}
