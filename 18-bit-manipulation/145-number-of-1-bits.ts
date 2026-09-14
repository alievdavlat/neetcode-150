/**
 * 145. Number of 1 Bits   ·   Easy   ·   Bit Manipulation
 *
 * Return the number of set bits in the binary representation of a 32-bit
 * unsigned integer — its Hamming weight.
 *
 * Example 1:
 *   Input:  n = 11        // 0000...1011
 *   Output: 3
 *
 * Example 2:
 *   Input:  n = 128       // 0000...10000000
 *   Output: 1
 *
 * Example 3:
 *   Input:  n = 2147483645
 *   Output: 30
 *
 * Constraints:
 *   - 1 <= n <= 2^31 - 1
 *
 * Follow-up: Looping 32 times always works. Looping once per set bit is better
 * — how?
 *
 * Pattern:   n & (n - 1) clears the lowest set bit
 * Target:    O(set bits) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/number-of-1-bits/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=135662s  (37:41:02)
 */
export function hammingWeight(n: number): number {
  throw new Error('Not implemented');
}
