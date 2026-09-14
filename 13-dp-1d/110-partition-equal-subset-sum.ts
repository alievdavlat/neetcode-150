/**
 * 110. Partition Equal Subset Sum   ·   Medium   ·   1-D Dynamic Programming
 *
 * Given an array of positive integers, decide whether it can be split into two
 * subsets whose sums are equal.
 *
 * Example 1:
 *   Input:  nums = [1, 5, 11, 5]
 *   Output: true       // [1, 5, 5] and [11]
 *
 * Example 2:
 *   Input:  nums = [1, 2, 3, 5]
 *   Output: false
 *
 * Constraints:
 *   - 1 <= nums.length <= 200
 *   - 1 <= nums[i] <= 100
 *
 * Follow-up: Reduce it to one question about half the total — and check that
 * half is an integer.
 *
 * Pattern:   Subset-sum knapsack over a set of reachable sums
 * Target:    O(n * sum) time, O(sum) space
 * LeetCode:  https://leetcode.com/problems/partition-equal-subset-sum/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=97620s  (27:07:00)
 */
export function canPartition(nums: number[]): boolean {
  throw new Error('Not implemented');
}
