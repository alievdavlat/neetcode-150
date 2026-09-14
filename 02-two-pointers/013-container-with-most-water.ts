/**
 * 13. Container With Most Water   ·   Medium   ·   Two Pointers
 *
 * Each element of height is the height of a vertical line drawn at that index.
 * Pick two lines so that the container they form with the x-axis holds the
 * most water, and return that maximum area. The container may not be tilted,
 * so the area is the distance between the two lines times the shorter of the
 * two heights.
 *
 * Example 1:
 *   Input:  height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
 *   Output: 49         // lines at index 1 and 8: min(8, 7) * (8 - 1)
 *
 * Example 2:
 *   Input:  height = [1, 1]
 *   Output: 1
 *
 * Constraints:
 *   - n === height.length
 *   - 2 <= n <= 10^5
 *   - 0 <= height[i] <= 10^4
 *
 * Follow-up: Why is it always safe to discard the shorter of the two current
 * walls?
 *
 * Pattern:   Greedy two pointers — always move the shorter wall
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/container-with-most-water/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=9658s  (02:40:58)
 */
export function maxArea(height: number[]): number {
  throw new Error('Not implemented');
}
