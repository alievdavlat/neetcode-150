/**
 * 129. Valid Parenthesis String   ·   Medium   ·   Greedy
 *
 * A string contains '(', ')' and '*', where '*' may act as '(', as ')' or as
 * an empty string. Return whether some interpretation makes the string a valid
 * parenthesis sequence.
 *
 * Example 1:
 *   Input:  s = "()"
 *   Output: true
 *
 * Example 2:
 *   Input:  s = "(*)"
 *   Output: true
 *
 * Example 3:
 *   Input:  s = "(*))"
 *   Output: true
 *
 * Constraints:
 *   - 1 <= s.length <= 100
 *   - s consists of '(', ')' and '*' only
 *
 * Follow-up: Instead of one open counter, carry the smallest and largest
 * number of open brackets still possible.
 *
 * Pattern:   Track the reachable range [minOpen, maxOpen]
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/valid-parenthesis-string/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=122128s  (33:55:28)
 */
export function checkValidString(s: string): boolean {
  throw new Error('Not implemented');
}
