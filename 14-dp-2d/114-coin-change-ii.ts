/**
 * 114. Coin Change II   ·   Medium   ·   2-D Dynamic Programming
 *
 * Given coin denominations and an amount, return how many distinct
 * combinations of coins make up that amount. Order does not matter, so 1 + 2
 * and 2 + 1 count once. You have an unlimited number of each coin, and the
 * answer fits in a signed 32-bit integer.
 *
 * Example 1:
 *   Input:  amount = 5, coins = [1, 2, 5]
 *   Output: 4          // 5; 2+2+1; 2+1+1+1; 1x5
 *
 * Example 2:
 *   Input:  amount = 3, coins = [2]
 *   Output: 0
 *
 * Example 3:
 *   Input:  amount = 10, coins = [10]
 *   Output: 1
 *
 * Constraints:
 *   - 1 <= coins.length <= 300 with distinct values
 *   - 1 <= coins[i] <= 5000
 *   - 0 <= amount <= 5000
 *
 * Follow-up: Looping coins outside and amounts inside counts combinations; the
 * other order counts permutations. Know which loop nesting you wrote.
 *
 * Pattern:   Unbounded knapsack counting combinations
 * Target:    O(amount * coins) time, O(amount) space
 * LeetCode:  https://leetcode.com/problems/coin-change-ii/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=105286s  (29:14:46)
 */
export function change(amount: number, coins: number[]): number {
  throw new Error('Not implemented');
}
