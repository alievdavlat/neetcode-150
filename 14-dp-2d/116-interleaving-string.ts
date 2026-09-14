/**
 * 116. Interleaving String   ·   Medium   ·   2-D Dynamic Programming
 *
 * Return true when s3 can be formed by interleaving s1 and s2 — taking
 * characters from the two strings in any alternation while preserving the
 * internal order of each.
 *
 * Example 1:
 *   Input:  s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
 *   Output: true
 *
 * Example 2:
 *   Input:  s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
 *   Output: false
 *
 * Example 3:
 *   Input:  s1 = "", s2 = "", s3 = ""
 *   Output: true
 *
 * Constraints:
 *   - 0 <= s1.length, s2.length <= 100 and 0 <= s3.length <= 200
 *   - All strings consist of lowercase English letters
 *
 * Follow-up: Check the lengths first — one line rejects most invalid inputs.
 *
 * Pattern:   Grid DP over consumed prefixes of s1 and s2
 * Target:    O(n * m) time, O(m) space
 * LeetCode:  https://leetcode.com/problems/interleaving-string/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=107406s  (29:50:06)
 */
export function isInterleave(s1: string, s2: string, s3: string): boolean {
  throw new Error('Not implemented');
}
