/**
 * 150. Reverse Integer   ·   Medium   ·   Bit Manipulation
 *
 * Reverse the digits of a signed 32-bit integer, keeping the sign. Return 0
 * when the reversed value falls outside the signed 32-bit range. Assume the
 * environment cannot store 64-bit integers.
 *
 * Example 1:
 *   Input:  x = 123
 *   Output: 321
 *
 * Example 2:
 *   Input:  x = -123
 *   Output: -321
 *
 * Example 3:
 *   Input:  x = 120
 *   Output: 21
 *
 * Constraints:
 *   - -2^31 <= x <= 2^31 - 1
 *
 * Follow-up: The overflow check has to happen before the multiplication, not
 * after — otherwise you are testing a value you already lost.
 *
 * Pattern:   Pop the last digit, push it, check the 32-bit bound before pushing
 * Target:    O(log n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/reverse-integer/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=138903s  (38:35:03)
 */
export function reverse(x: number): number {
  throw new Error('Not implemented');
}
