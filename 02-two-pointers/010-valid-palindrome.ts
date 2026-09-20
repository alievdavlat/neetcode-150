/**
 * 10. Valid Palindrome   ·   Easy   ·   Two Pointers
 *
 * A phrase is a palindrome when, after dropping every non-alphanumeric
 * character and lowercasing the rest, it reads the same forwards and
 * backwards. Given a string s, return true when it is a palindrome.
 *
 * Example 1:
 *   Input:  s = "A man, a plan, a canal: Panama"
 *   Output: true       // normalises to "amanaplanacanalpanama"
 *
 * Example 2:
 *   Input:  s = "race a car"
 *   Output: false      // normalises to "raceacar"
 *
 * Example 3:
 *   Input:  s = " "
 *   Output: true       // an empty string is a palindrome
 *
 * Constraints:
 *   - 1 <= s.length <= 2 * 10^5
 *   - s consists of printable ASCII characters
 *
 * Follow-up: Solve it without building a cleaned copy of the string.
 *
 * Pattern:   Pointers from both ends, skipping non-alphanumerics
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/valid-palindrome/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=5731s  (01:35:31)
 */
export function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}
