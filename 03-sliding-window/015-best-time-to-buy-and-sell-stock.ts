/**
 * 15. Best Time to Buy and Sell Stock   ·   Easy   ·   Sliding Window
 *
 * prices[i] is the price of a stock on day i. Buy on one day and sell on a
 * later day to maximise profit, and return that profit. If no transaction
 * makes a profit, return 0.
 *
 * Example 1:
 *   Input:  prices = [7, 1, 5, 3, 6, 4]
 *   Output: 5          // buy on day 1 at 1, sell on day 4 at 6
 *
 * Example 2:
 *   Input:  prices = [7, 6, 4, 3, 1]
 *   Output: 0          // prices only fall, so do nothing
 *
 * Constraints:
 *   - 1 <= prices.length <= 10^5
 *   - 0 <= prices[i] <= 10^4
 *
 * Pattern:   Track the minimum seen so far
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=12149s  (03:22:29)
 */
export function maxProfit(prices: number[]): number {
  throw new Error('Not implemented');
}
