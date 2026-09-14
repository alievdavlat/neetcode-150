/**
 * 131. Merge Intervals   ·   Medium   ·   Intervals
 *
 * Given a list of intervals, merge every group that overlaps and return the
 * non-overlapping intervals that cover exactly the same ranges.
 *
 * Example 1:
 *   Input:  intervals = [[1,3], [2,6], [8,10], [15,18]]
 *   Output: [[1, 6], [8, 10], [15, 18]]
 *
 * Example 2:
 *   Input:  intervals = [[1, 4], [4, 5]]
 *   Output: [[1, 5]]       // touching counts as overlapping
 *
 * Constraints:
 *   - 1 <= intervals.length <= 10^4
 *   - 0 <= start <= end <= 10^4
 *
 * Pattern:   Sort by start, extend the last interval while it overlaps
 * Target:    O(n log n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/merge-intervals/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=124034s  (34:27:14)
 */
export function merge(intervals: number[][]): number[][] {
  throw new Error('Not implemented');
}
