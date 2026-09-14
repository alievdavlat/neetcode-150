/**
 * 133. Meeting Rooms   ·   Easy   ·   Intervals
 *
 * Given meeting time intervals, return whether a single person could attend
 * all of them — that is, whether no two meetings overlap. A meeting ending
 * exactly when another begins is fine.
 *
 * Example 1:
 *   Input:  intervals = [[0, 30], [5, 10], [15, 20]]
 *   Output: false
 *
 * Example 2:
 *   Input:  intervals = [[7, 10], [2, 4]]
 *   Output: true
 *
 * Constraints:
 *   - 0 <= intervals.length <= 10^4
 *   - 0 <= start < end <= 10^6
 *
 * Pattern:   Sort by start, compare each start against the previous end
 * Target:    O(n log n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/meeting-rooms/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=126049s  (35:00:49)
 */
export function canAttendMeetings(intervals: number[][]): boolean {
  throw new Error('Not implemented');
}
