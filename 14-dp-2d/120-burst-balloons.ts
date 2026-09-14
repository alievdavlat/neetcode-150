/**
 * 120. Burst Balloons   ·   Hard   ·   2-D Dynamic Programming
 *
 * Each balloon carries a number. Bursting balloon i earns nums[left] * nums[i]
 * * nums[right], where left and right are its current neighbours; a missing
 * neighbour counts as 1. After a burst its neighbours become adjacent. Return
 * the maximum coins from bursting all balloons.
 *
 * Example 1:
 *   Input:  nums = [3, 1, 5, 8]
 *   Output: 167
 *
 * Example 2:
 *   Input:  nums = [1, 5]
 *   Output: 10
 *
 * Constraints:
 *   - n === nums.length and 1 <= n <= 300
 *   - 0 <= nums[i] <= 100
 *
 * Follow-up: Thinking about the first burst fails because the neighbours keep
 * changing. Ask which balloon is burst last in a range instead.
 *
 * Pattern:   Interval DP on the LAST balloon burst in each range
 * Target:    O(n^3) time, O(n^2) space
 * LeetCode:  https://leetcode.com/problems/burst-balloons/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=112309s  (31:11:49)
 */
export function maxCoins(nums: number[]): number {
  throw new Error('Not implemented');
}
