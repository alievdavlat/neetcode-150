/**
 * 115. Target Sum   ·   Medium   ·   2-D Dynamic Programming
 *
 * Put a '+' or a '-' in front of every number in nums and concatenate them
 * into an expression. Return how many different sign assignments produce the
 * value target.
 *
 * Example 1:
 *   Input:  nums = [1, 1, 1, 1, 1], target = 3
 *   Output: 5
 *
 * Example 2:
 *   Input:  nums = [1], target = 1
 *   Output: 1
 *
 * Constraints:
 *   - 1 <= nums.length <= 20
 *   - 0 <= nums[i] <= 1000 and 0 <= sum(nums) <= 1000
 *   - -1000 <= target <= 1000
 *
 * Follow-up: Choosing signs is the same as choosing a subset P to be positive.
 * What must sum(P) equal?
 *
 * Pattern:   Memoise on (index, running sum), or reduce to subset-sum
 * Target:    O(n * sum) time and space
 * LeetCode:  https://leetcode.com/problems/target-sum/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=107406s  (29:50:06)
 */
export function findTargetSumWays(nums: number[], target: number): number {
  throw new Error('Not implemented');
}
