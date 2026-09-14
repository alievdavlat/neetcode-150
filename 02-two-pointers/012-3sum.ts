/**
 * 12. 3Sum   ·   Medium   ·   Two Pointers
 *
 * Given an integer array nums, return every unique triplet [nums[i], nums[j],
 * nums[k]] with distinct indices i, j, k that sums to zero. The result must
 * not contain duplicate triplets; the order of the triplets and of the values
 * inside them does not matter.
 *
 * Example 1:
 *   Input:  nums = [-1, 0, 1, 2, -1, -4]
 *   Output: [[-1, -1, 2], [-1, 0, 1]]
 *
 * Example 2:
 *   Input:  nums = [0, 1, 1]
 *   Output: []
 *
 * Example 3:
 *   Input:  nums = [0, 0, 0]
 *   Output: [[0, 0, 0]]
 *
 * Constraints:
 *   - 3 <= nums.length <= 3000
 *   - -10^5 <= nums[i] <= 10^5
 *
 * Follow-up: Skipping duplicates is the whole problem — do it without a Set of
 * strings.
 *
 * Pattern:   Sort, then fix one number and run two pointers
 * Target:    O(n^2) time, O(1) extra space (sort excluded)
 * LeetCode:  https://leetcode.com/problems/3sum/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=7693s  (02:08:13)
 */
export function threeSum(nums: number[]): number[][] {
  throw new Error('Not implemented');
}
