/**
 * 14. Trapping Rain Water   ·   Hard   ·   Two Pointers
 *
 * Given n non-negative integers where height[i] is the elevation at index i
 * and every bar is 1 wide, compute how much rain water the elevation map traps
 * after it rains. Water above a bar is bounded by the tallest bar to its left
 * and the tallest bar to its right.
 *
 * Example 1:
 *   Input:  height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
 *   Output: 6
 *
 * Example 2:
 *   Input:  height = [4, 2, 0, 3, 2, 5]
 *   Output: 9
 *
 * Constraints:
 *   - n === height.length
 *   - 1 <= n <= 2 * 10^4
 *   - 0 <= height[i] <= 10^5
 *
 * Follow-up: The prefix/suffix-max arrays are the easy version. Can you drop
 * both arrays and keep O(1) space?
 *
 * Pattern:   Two pointers carrying running left/right maxima
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/trapping-rain-water/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=9658s  (02:40:58)
 */
export function trap(height: number[]): number {
  throw new Error('Not implemented');
}
