/**
 * 134. Meeting Rooms II   ·   Medium   ·   Intervals
 *
 * Given meeting time intervals, return the minimum number of rooms needed to
 * hold all of them at once.
 *
 * Example 1:
 *   Input:  intervals = [[0, 30], [5, 10], [15, 20]]
 *   Output: 2
 *
 * Example 2:
 *   Input:  intervals = [[7, 10], [2, 4]]
 *   Output: 1
 *
 * Constraints:
 *   - 0 <= intervals.length <= 10^4
 *   - 0 <= start < end <= 10^6
 *
 * Follow-up: Sorting starts and ends into two separate arrays turns this into
 * a running counter. The answer is its peak.
 *
 * Pattern:   Sweep line over separated start/end times (or a min-heap of end times)
 * Target:    O(n log n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/meeting-rooms-ii/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=126049s  (35:00:49)
 */
export function minMeetingRooms(intervals: number[][]): number {
  throw new Error('Not implemented');
}
