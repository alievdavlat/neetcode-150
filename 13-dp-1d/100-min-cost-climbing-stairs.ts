/**
 * 100. Min Cost Climbing Stairs   ·   Easy   ·   1-D Dynamic Programming
 *
 * cost[i] is the price of stepping off the ith stair. After paying, you climb
 * one or two stairs. You may start at index 0 or index 1. Return the minimum
 * cost to reach the top, which is one past the last index.
 *
 * Example 1:
 *   Input:  cost = [10, 15, 20]
 *   Output: 15         // start at index 1, pay 15, jump two
 *
 * Example 2:
 *   Input:  cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
 *   Output: 6
 *
 * Constraints:
 *   - 2 <= cost.length <= 1000
 *   - 0 <= cost[i] <= 999
 *
 * Pattern:   dp[i] = cost[i] + min(dp[i+1], dp[i+2])
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/min-cost-climbing-stairs/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=85610s  (23:46:50)
 */
export function minCostClimbingStairs(cost: number[]): number {
  throw new Error('Not implemented');
}
