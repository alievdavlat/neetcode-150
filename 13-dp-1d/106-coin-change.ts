/**
 * 106. Coin Change   ·   Medium   ·   1-D Dynamic Programming
 *
 * Given coin denominations and a target amount, return the fewest coins that
 * make up that amount, or -1 when it cannot be made. You have an unlimited
 * number of each coin.
 *
 * Example 1:
 *   Input:  coins = [1, 2, 5], amount = 11
 *   Output: 3          // 5 + 5 + 1
 *
 * Example 2:
 *   Input:  coins = [2], amount = 3
 *   Output: -1
 *
 * Example 3:
 *   Input:  coins = [1], amount = 0
 *   Output: 0
 *
 * Constraints:
 *   - 1 <= coins.length <= 12
 *   - 1 <= coins[i] <= 2^31 - 1
 *   - 0 <= amount <= 10^4
 *
 * Follow-up: Greedy fails here — find the coin set that breaks it.
 *
 * Pattern:   Unbounded knapsack over amounts, minimising count
 * Target:    O(amount * coins) time, O(amount) space
 * LeetCode:  https://leetcode.com/problems/coin-change/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=92396s  (25:39:56)
 */
export function coinChange(coins: number[], amount: number): number {
  throw new Error('Not implemented');
}
