/**
 * 151. Roman to Integer   ·   Easy   ·   Arrays & Hashing
 *
 * Roman numerals are written with the letters I, V, X, L, C, D and M, worth 1,
 * 5, 10, 50, 100, 500 and 1000. They are normally written largest to smallest
 * and added up, but a smaller letter placed directly before a larger one is
 * subtracted instead. Given a valid roman numeral, return the number it stands
 * for.
 *
 * Example 1:
 *   Input:  s = "III"
 *   Output: 3
 *
 * Example 2:
 *   Input:  s = "LVIII"
 *   Output: 58        // L = 50, V = 5, III = 3
 *
 * Example 3:
 *   Input:  s = "MCMXCIV"
 *   Output: 1994      // M + CM + XC + IV
 *
 * Constraints:
 *   - 1 <= s.length <= 15
 *   - s contains only the letters I, V, X, L, C, D, M
 *   - s is a valid roman numeral in the range [1, 3999]
 *
 * Follow-up: Only six pairs are ever subtracted. You do not need to
 * special-case any of them.
 *
 * Pattern:   Scan once and subtract a letter that is smaller than the one after it
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/roman-to-integer/
 */
export function romanToInt(s: string): number {
  throw new Error('Not implemented');
}
