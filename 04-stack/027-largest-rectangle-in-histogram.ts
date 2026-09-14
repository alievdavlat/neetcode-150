/**
 * 27. Largest Rectangle in Histogram   ·   Hard   ·   Stack
 *
 * Given an array heights representing a histogram where every bar is 1 wide,
 * return the area of the largest rectangle that fits inside the histogram.
 *
 * Example 1:
 *   Input:  heights = [2, 1, 5, 6, 2, 3]
 *   Output: 10         // bars 5 and 6 give height 5 across width 2
 *
 * Example 2:
 *   Input:  heights = [2, 4]
 *   Output: 4
 *
 * Constraints:
 *   - 1 <= heights.length <= 10^5
 *   - 0 <= heights[i] <= 10^4
 *
 * Follow-up: When a bar is popped, how far left could its rectangle have
 * started? That index is the answer to the whole problem.
 *
 * Pattern:   Monotonic increasing stack of (index, height)
 * Target:    O(n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/largest-rectangle-in-histogram/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=22762s  (06:19:22)
 */
export function largestRectangleArea(heights: number[]): number {
  throw new Error('Not implemented');
}
