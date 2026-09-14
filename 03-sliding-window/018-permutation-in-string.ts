/**
 * 18. Permutation in String   ·   Medium   ·   Sliding Window
 *
 * Given two strings s1 and s2, return true when s2 contains a permutation of
 * s1 — that is, when some substring of s2 is a rearrangement of s1.
 *
 * Example 1:
 *   Input:  s1 = "ab", s2 = "eidbaooo"
 *   Output: true       // s2 contains "ba"
 *
 * Example 2:
 *   Input:  s1 = "ab", s2 = "eidboaoo"
 *   Output: false
 *
 * Constraints:
 *   - 1 <= s1.length, s2.length <= 10^4
 *   - s1 and s2 consist of lowercase English letters
 *
 * Follow-up: Comparing two 26-slot arrays per step is O(26n). Can you maintain
 * a single "matches" counter instead?
 *
 * Pattern:   Fixed-size window + frequency match
 * Target:    O(n) time, O(1) space (26 letters)
 * LeetCode:  https://leetcode.com/problems/permutation-in-string/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=13384s  (03:43:04)
 */
export function checkInclusion(s1: string, s2: string): boolean {
  throw new Error('Not implemented');
}
