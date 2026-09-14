/**
 * 144. Single Number   ·   Easy   ·   Bit Manipulation
 *
 * Every element of nums appears twice except one, which appears once. Return
 * that element in linear time using only constant extra space.
 *
 * Example 1:
 *   Input:  nums = [2, 2, 1]
 *   Output: 1
 *
 * Example 2:
 *   Input:  nums = [4, 1, 2, 1, 2]
 *   Output: 4
 *
 * Example 3:
 *   Input:  nums = [1]
 *   Output: 1
 *
 * Constraints:
 *   - 1 <= nums.length <= 3 * 10^4
 *   - -3 * 10^4 <= nums[i] <= 3 * 10^4
 *   - Every element appears twice except one
 *
 * Follow-up: Two properties of XOR do all the work here. Name them.
 *
 * Pattern:   XOR cancels every pair
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/single-number/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=133913s  (37:11:53)
 */
export function singleNumber(nums: number[]): number {
  throw new Error('Not implemented');
}
