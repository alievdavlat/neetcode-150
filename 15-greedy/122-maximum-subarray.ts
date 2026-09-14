/**
 * 122. Maximum Subarray   ·   Medium   ·   Greedy
 *
 * Given an integer array nums, return the largest sum of any contiguous
 * non-empty subarray.
 *
 * Example 1:
 *   Input:  nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 *   Output: 6          // [4, -1, 2, 1]
 *
 * Example 2:
 *   Input:  nums = [1]
 *   Output: 1
 *
 * Example 3:
 *   Input:  nums = [5, 4, -1, 7, 8]
 *   Output: 23
 *
 * Constraints:
 *   - 1 <= nums.length <= 10^5
 *   - -10^4 <= nums[i] <= 10^4
 *
 * Follow-up: There is a divide-and-conquer O(n log n) solution too — try it
 * once.
 *
 * Pattern:   Kadane: drop the prefix as soon as it turns negative
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/maximum-subarray/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=114877s  (31:54:37)
 */
export function maxSubArray(nums: number[]): number {
  throw new Error('Not implemented');
}
