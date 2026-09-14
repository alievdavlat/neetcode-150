/**
 * 21. Valid Parentheses   ·   Easy   ·   Stack
 *
 * Given a string containing only the characters ( ) [ ] { }, decide whether it
 * is valid: every bracket must be closed by the matching kind, in the correct
 * order, and no closer may appear before its opener.
 *
 * Example 1:
 *   Input:  s = "()[]{}"
 *   Output: true
 *
 * Example 2:
 *   Input:  s = "(]"
 *   Output: false
 *
 * Example 3:
 *   Input:  s = "([)]"
 *   Output: false      // right kinds, wrong order
 *
 * Example 4:
 *   Input:  s = "{[]}"
 *   Output: true
 *
 * Constraints:
 *   - 1 <= s.length <= 10^4
 *   - s consists of the characters ()[]{} only
 *
 * Pattern:   Stack of expected closers
 * Target:    O(n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/valid-parentheses/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=17984s  (04:59:44)
 */
export function isValid(s: string): boolean {
  throw new Error('Not implemented');
}
