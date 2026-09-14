/**
 * 130. Insert Interval   ·   Medium   ·   Intervals
 *
 * intervals is sorted by start and contains no overlaps. Insert newInterval,
 * merging where it overlaps, and return the result still sorted and still
 * non-overlapping.
 *
 * Example 1:
 *   Input:  intervals = [[1, 3], [6, 9]], newInterval = [2, 5]
 *   Output: [[1, 5], [6, 9]]
 *
 * Example 2:
 *   Input:  intervals = [[1,2], [3,5], [6,7], [8,10], [12,16]], newInterval = [4, 8]
 *   Output: [[1, 2], [3, 10], [12, 16]]
 *
 * Example 3:
 *   Input:  intervals = [], newInterval = [5, 7]
 *   Output: [[5, 7]]
 *
 * Constraints:
 *   - 0 <= intervals.length <= 10^4
 *   - 0 <= start <= end <= 10^5
 *   - intervals is sorted by start and non-overlapping
 *
 * Follow-up: No sorting needed — the input is already ordered. One pass is
 * enough.
 *
 * Pattern:   Three phases: before, overlapping (merge), after
 * Target:    O(n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/insert-interval/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=122128s  (33:55:28)
 */
export function insert(intervals: number[][], newInterval: number[]): number[][] {
  throw new Error('Not implemented');
}
