/**
 * 77. Palindrome Partitioning   ·   Medium   ·   Backtracking
 *
 * Given a string s, partition it so that every part is a palindrome, and
 * return all possible partitionings.
 *
 * Example 1:
 *   Input:  s = "aab"
 *   Output: [["a", "a", "b"], ["aa", "b"]]
 *
 * Example 2:
 *   Input:  s = "a"
 *   Output: [["a"]]
 *
 * Constraints:
 *   - 1 <= s.length <= 16
 *   - s contains only lowercase English letters
 *
 * Follow-up: Precomputing an isPalindrome table turns the check from O(n) into
 * O(1).
 *
 * Pattern:   Backtrack over cut positions, test each prefix
 * Target:    O(n * 2^n) time
 * LeetCode:  https://leetcode.com/problems/palindrome-partitioning/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=62163s  (17:16:03)
 */
export function partition(s: string): string[][] {
  throw new Error('Not implemented');
}
