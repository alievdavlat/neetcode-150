/**
 * 118. Distinct Subsequences   ·   Hard   ·   2-D Dynamic Programming
 *
 * Given strings s and t, return how many distinct subsequences of s equal t.
 * The answer fits in a signed 32-bit integer.
 *
 * Example 1:
 *   Input:  s = "rabbbit", t = "rabbit"
 *   Output: 3
 *
 * Example 2:
 *   Input:  s = "babgbag", t = "bag"
 *   Output: 5
 *
 * Constraints:
 *   - 1 <= s.length, t.length <= 1000
 *   - Both consist of English letters
 *
 * Follow-up: When the characters match you have two choices, not one. Add both
 * counts.
 *
 * Pattern:   Grid DP counting matches, skip-or-take on equal characters
 * Target:    O(n * m) time, O(m) space
 * LeetCode:  https://leetcode.com/problems/distinct-subsequences/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=110006s  (30:33:26)
 */
export function numDistinct(s: string, t: string): number {
  throw new Error('Not implemented');
}
