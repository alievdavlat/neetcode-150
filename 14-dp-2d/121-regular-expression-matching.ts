/**
 * 121. Regular Expression Matching   ·   Hard   ·   2-D Dynamic Programming
 *
 * Implement matching for '.' which matches any single character and '*' which
 * matches zero or more of the preceding element. The match must cover the
 * entire input string, not just part of it. Every '*' in p has a valid
 * preceding character.
 *
 * Example 1:
 *   Input:  s = "aa", p = "a"
 *   Output: false
 *
 * Example 2:
 *   Input:  s = "aa", p = "a*"
 *   Output: true
 *
 * Example 3:
 *   Input:  s = "ab", p = ".*"
 *   Output: true       // "." repeated twice
 *
 * Constraints:
 *   - 1 <= s.length <= 20 and 1 <= p.length <= 30
 *   - s contains lowercase letters only
 *   - p contains lowercase letters plus '.' and '*'
 *
 * Follow-up: The x* case branches two ways: use zero copies, or consume one
 * character and stay.
 *
 * Pattern:   Grid DP with a special case for x*
 * Target:    O(n * m) time and space
 * LeetCode:  https://leetcode.com/problems/regular-expression-matching/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=114877s  (31:54:37)
 */
export function isMatch(s: string, p: string): boolean {
  throw new Error('Not implemented');
}
