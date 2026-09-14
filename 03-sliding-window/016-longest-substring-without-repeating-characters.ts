/**
 * 16. Longest Substring Without Repeating Characters   ·   Medium   ·   Sliding Window
 *
 * Given a string s, return the length of the longest substring that contains
 * no repeated character. A substring is contiguous — a subsequence is not.
 *
 * Example 1:
 *   Input:  s = "abcabcbb"
 *   Output: 3          // "abc"
 *
 * Example 2:
 *   Input:  s = "bbbbb"
 *   Output: 1          // "b"
 *
 * Example 3:
 *   Input:  s = "pwwkew"
 *   Output: 3          // "wke"; "pwke" is a subsequence, not a substring
 *
 * Constraints:
 *   - 0 <= s.length <= 5 * 10^4
 *   - s consists of English letters, digits, symbols and spaces
 *
 * Follow-up: A last-seen index map lets left jump instead of crawling. Worth
 * it?
 *
 * Pattern:   Sliding window + set (or last-seen index map)
 * Target:    O(n) time, O(min(n, alphabet)) space
 * LeetCode:  https://leetcode.com/problems/longest-substring-without-repeating-characters/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=12149s  (03:22:29)
 */
export function lengthOfLongestSubstring(s: string): number {
  throw new Error('Not implemented');
}
