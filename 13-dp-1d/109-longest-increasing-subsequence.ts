/**
 * 109. Longest Increasing Subsequence   ·   Medium   ·   1-D Dynamic Programming
 *
 * Given an integer array nums, return the length of its longest strictly
 * increasing subsequence. A subsequence keeps the original order but need not
 * be contiguous.
 *
 * Example 1:
 *   Input:  nums = [10, 9, 2, 5, 3, 7, 101, 18]
 *   Output: 4          // [2, 3, 7, 101]
 *
 * Example 2:
 *   Input:  nums = [0, 1, 0, 3, 2, 3]
 *   Output: 4
 *
 * Example 3:
 *   Input:  nums = [7, 7, 7, 7, 7]
 *   Output: 1
 *
 * Constraints:
 *   - 1 <= nums.length <= 2500
 *   - -10^4 <= nums[i] <= 10^4
 *
 * Follow-up: The O(n log n) tails array is not a subsequence of the input — do
 * not try to read the answer out of it.
 *
 * Pattern:   O(n^2) dp, or patience sorting with binary search
 * Target:    O(n log n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/longest-increasing-subsequence/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=97620s  (27:07:00)
 */
export function lengthOfLIS(nums: number[]): number {
  throw new Error('Not implemented');
}
