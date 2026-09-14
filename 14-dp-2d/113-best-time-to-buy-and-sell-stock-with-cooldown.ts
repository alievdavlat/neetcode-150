/**
 * 113. Best Time to Buy and Sell Stock with Cooldown   ·   Medium   ·   2-D Dynamic Programming
 *
 * You may complete as many transactions as you like but never hold more than
 * one share at a time, and after selling you must wait one full day before
 * buying again. Given daily prices, return the maximum profit.
 *
 * Example 1:
 *   Input:  prices = [1, 2, 3, 0, 2]
 *   Output: 3          // buy, sell, cooldown, buy, sell
 *
 * Example 2:
 *   Input:  prices = [1]
 *   Output: 0
 *
 * Constraints:
 *   - 1 <= prices.length <= 5000
 *   - 0 <= prices[i] <= 1000
 *
 * Follow-up: Name the states before you write transitions. Three is enough.
 *
 * Pattern:   State machine: holding / free-to-buy / cooling down
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=105286s  (29:14:46)
 */
export function maxProfit(prices: number[]): number {
  throw new Error('Not implemented');
}
