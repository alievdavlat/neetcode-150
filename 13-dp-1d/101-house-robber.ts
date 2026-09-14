/**
 * 101. House Robber   ·   Medium   ·   1-D Dynamic Programming
 *
 * Each house on a street holds some money, but robbing two adjacent houses on
 * the same night triggers the alarm. Return the maximum you can take without
 * ever robbing two neighbours.
 *
 * Example 1:
 *   Input:  nums = [1, 2, 3, 1]
 *   Output: 4          // houses 0 and 2
 *
 * Example 2:
 *   Input:  nums = [2, 7, 9, 3, 1]
 *   Output: 12         // houses 0, 2 and 4
 *
 * Constraints:
 *   - 1 <= nums.length <= 100
 *   - 0 <= nums[i] <= 400
 *
 * Follow-up: Two variables are enough. Name them for what they mean, not rob1
 * and rob2.
 *
 * Pattern:   rob[i] = max(skip this house, take it + best two back)
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/house-robber/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=89425s  (24:50:25)
 */
export function rob(nums: number[]): number {
  throw new Error('Not implemented');
}
