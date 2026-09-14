/**
 * 78. Letter Combinations of a Phone Number   ·   Medium   ·   Backtracking
 *
 * Given a string of digits from 2 to 9, return every letter combination the
 * number could spell on a classic phone keypad (2 = abc, 3 = def, ..., 7 =
 * pqrs, 8 = tuv, 9 = wxyz). An empty input returns an empty list; the answers
 * may be in any order.
 *
 * Example 1:
 *   Input:  digits = "23"
 *   Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
 *
 * Example 2:
 *   Input:  digits = ""
 *   Output: []
 *
 * Example 3:
 *   Input:  digits = "2"
 *   Output: ["a", "b", "c"]
 *
 * Constraints:
 *   - 0 <= digits.length <= 4
 *   - digits[i] is a character in the range '2'-'9'
 *
 * Pattern:   Backtracking over a digit -> letters map
 * Target:    O(4^n) time
 * LeetCode:  https://leetcode.com/problems/letter-combinations-of-a-phone-number/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=62163s  (17:16:03)
 */
export function letterCombinations(digits: string): string[] {
  throw new Error('Not implemented');
}
