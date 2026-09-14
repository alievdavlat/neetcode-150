/**
 * 19. Minimum Window Substring   ·   Hard   ·   Sliding Window
 *
 * Given strings s and t, return the shortest substring of s that contains
 * every character of t including duplicates. If no such substring exists,
 * return the empty string. The answer is guaranteed to be unique when it
 * exists.
 *
 * Example 1:
 *   Input:  s = "ADOBECODEBANC", t = "ABC"
 *   Output: "BANC"
 *
 * Example 2:
 *   Input:  s = "a", t = "a"
 *   Output: "a"
 *
 * Example 3:
 *   Input:  s = "a", t = "aa"
 *   Output: ""         // s has only one 'a'
 *
 * Constraints:
 *   - m === s.length, n === t.length
 *   - 1 <= m, n <= 10^5
 *   - s and t consist of uppercase and lowercase English letters
 *
 * Follow-up: Can you do it in O(m + n)?
 *
 * Pattern:   Expand to satisfy, then shrink while still satisfied
 * Target:    O(n + m) time, O(alphabet) space
 * LeetCode:  https://leetcode.com/problems/minimum-window-substring/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=15431s  (04:17:11)
 */
export function minWindow(s: string, t: string): string {
  throw new Error('Not implemented');
}
