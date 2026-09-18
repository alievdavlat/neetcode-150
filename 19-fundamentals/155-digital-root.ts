/**
 * 155. Digital Root   ·   Easy   ·   Fundamentals
 *
 * Add the digits of a non-negative integer. If the result has more than one
 * digit, add its digits too, and keep going until a single digit is left.
 * Return that digit.
 *
 * Example 1:
 *   Input:  n = 16
 *   Output: 7         // 1 + 6
 *
 * Example 2:
 *   Input:  n = 942
 *   Output: 6         // 9 + 4 + 2 = 15, then 1 + 5
 *
 * Example 3:
 *   Input:  n = 0
 *   Output: 0
 *
 * Constraints:
 *   - 0 <= n <= 10^9
 *
 * Follow-up: There is a closed form that needs no loop. Work out what it does
 * at multiples of nine.
 *
 * Pattern:   Sum the digits until one is left, or use the mod 9 identity
 * Target:    O(1) time, O(1) space
 * Source:    Codewars-style fundamentals
 */
export function digitalRoot(n: number): number {
  throw new Error('Not implemented');
}
