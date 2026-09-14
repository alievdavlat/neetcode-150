/**
 * 112. Longest Common Subsequence   ·   Medium   ·   2-D Dynamic Programming
 *
 * Given two strings, return the length of their longest common subsequence —
 * the longest sequence of characters that appears in both, in order, without
 * needing to be contiguous. Return 0 when there is none.
 *
 * Example 1:
 *   Input:  text1 = "abcde", text2 = "ace"
 *   Output: 3          // "ace"
 *
 * Example 2:
 *   Input:  text1 = "abc", text2 = "abc"
 *   Output: 3
 *
 * Example 3:
 *   Input:  text1 = "abc", text2 = "def"
 *   Output: 0
 *
 * Constraints:
 *   - 1 <= text1.length, text2.length <= 1000
 *   - Both strings consist of lowercase English letters
 *
 * Follow-up: Only the previous row is ever read. Shrink the table to two rows.
 *
 * Pattern:   Classic two-sequence grid DP
 * Target:    O(n * m) time, O(min(n, m)) space
 * LeetCode:  https://leetcode.com/problems/longest-common-subsequence/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=103552s  (28:45:52)
 */
export function longestCommonSubsequence(text1: string, text2: string): number {
  throw new Error('Not implemented');
}
