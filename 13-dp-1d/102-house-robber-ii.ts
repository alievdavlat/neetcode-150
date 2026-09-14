/**
 * 102. House Robber II   ·   Medium   ·   1-D Dynamic Programming
 *
 * Same rules as House Robber, except the houses form a circle: the first and
 * the last are neighbours. Return the maximum you can take.
 *
 * Example 1:
 *   Input:  nums = [2, 3, 2]
 *   Output: 3          // 2 and 2 are adjacent through the circle
 *
 * Example 2:
 *   Input:  nums = [1, 2, 3, 1]
 *   Output: 4
 *
 * Example 3:
 *   Input:  nums = [1, 2, 3]
 *   Output: 3
 *
 * Constraints:
 *   - 1 <= nums.length <= 100
 *   - 0 <= nums[i] <= 1000
 *
 * Follow-up: Watch the single-house case — both ranges are empty there.
 *
 * Pattern:   Run House Robber twice on two open ranges
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/house-robber-ii/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=89425s  (24:50:25)
 */
export function rob(nums: number[]): number {
  throw new Error('Not implemented');
}
