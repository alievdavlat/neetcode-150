/**
 * 103. Longest Palindromic Substring   ·   Medium   ·   1-D Dynamic Programming
 *
 * Given a string s, return its longest palindromic substring. When several
 * have the same length, any one of them is accepted.
 *
 * Example 1:
 *   Input:  s = "babad"
 *   Output: "bab"      // "aba" is also correct
 *
 * Example 2:
 *   Input:  s = "cbbd"
 *   Output: "bb"
 *
 * Constraints:
 *   - 1 <= s.length <= 1000
 *   - s consists of digits and English letters
 *
 * Follow-up: Manacher's algorithm does it in O(n) — worth reading once, not
 * memorising.
 *
 * Pattern:   Expand around every centre (2n - 1 centres)
 * Target:    O(n^2) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/longest-palindromic-substring/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=90664s  (25:11:04)
 */
export function longestPalindrome(s: string): string {
  throw new Error('Not implemented');
}
