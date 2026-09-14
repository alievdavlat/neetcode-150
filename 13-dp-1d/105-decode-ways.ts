/**
 * 105. Decode Ways   ·   Medium   ·   1-D Dynamic Programming
 *
 * A message was encoded with A = 1 through Z = 26 and then stripped of
 * separators. Given the digit string, return how many ways it can be decoded.
 * A leading zero never forms a valid letter, so "06" is not "F".
 *
 * Example 1:
 *   Input:  s = "12"
 *   Output: 2          // "AB" or "L"
 *
 * Example 2:
 *   Input:  s = "226"
 *   Output: 3          // "BZ", "VF", "BBF"
 *
 * Example 3:
 *   Input:  s = "06"
 *   Output: 0
 *
 * Constraints:
 *   - 1 <= s.length <= 100
 *   - s contains only digits
 *
 * Follow-up: Every zero in the string is a constraint, not just a digit.
 *
 * Pattern:   dp[i] from a one-digit and a two-digit read
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/decode-ways/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=92396s  (25:39:56)
 */
export function numDecodings(s: string): number {
  throw new Error('Not implemented');
}
