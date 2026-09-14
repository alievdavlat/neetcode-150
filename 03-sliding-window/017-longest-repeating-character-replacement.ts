/**
 * 17. Longest Repeating Character Replacement   ·   Medium   ·   Sliding Window
 *
 * Given a string s of uppercase English letters and an integer k, you may
 * change at most k characters to any other uppercase letter. Return the length
 * of the longest substring that can be made to contain a single repeated
 * letter.
 *
 * Example 1:
 *   Input:  s = "ABAB", k = 2
 *   Output: 4          // turn both A's into B's (or the reverse)
 *
 * Example 2:
 *   Input:  s = "AABABBA", k = 1
 *   Output: 4          // "AABA" -> "AAAA"
 *
 * Constraints:
 *   - 1 <= s.length <= 10^5
 *   - s consists of uppercase English letters only
 *   - 0 <= k <= s.length
 *
 * Follow-up: Do you have to recompute the most frequent count every time the
 * window moves?
 *
 * Pattern:   Window valid while (size - count of most frequent char) <= k
 * Target:    O(n) time, O(1) space (26 letters)
 * LeetCode:  https://leetcode.com/problems/longest-repeating-character-replacement/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=13384s  (03:43:04)
 */
export function characterReplacement(s: string, k: number): number {
  throw new Error('Not implemented');
}
