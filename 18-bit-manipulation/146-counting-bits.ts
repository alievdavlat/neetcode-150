/**
 * 146. Counting Bits   ·   Easy   ·   Bit Manipulation
 *
 * Given an integer n, return an array of length n + 1 where the ith entry is
 * the number of set bits in i.
 *
 * Example 1:
 *   Input:  n = 2
 *   Output: [0, 1, 1]
 *
 * Example 2:
 *   Input:  n = 5
 *   Output: [0, 1, 1, 2, 1, 2]
 *
 * Constraints:
 *   - 0 <= n <= 10^5
 *
 * Follow-up: Can you do it in one pass without calling a popcount routine per
 * number?
 *
 * Pattern:   dp[i] = dp[i >> 1] + (i & 1)
 * Target:    O(n) time, O(1) extra space
 * LeetCode:  https://leetcode.com/problems/counting-bits/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=135662s  (37:41:02)
 */
export function countBits(n: number): number[] {
  throw new Error('Not implemented');
}
