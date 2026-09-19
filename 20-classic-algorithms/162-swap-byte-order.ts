/**
 * 162. Swap Byte Order   ·   Easy   ·   Classic Algorithms
 *
 * Read value as a 32-bit unsigned integer and return it with its four bytes in
 * the opposite order. This is what a machine does when it reads a number
 * written by a machine of the other endianness.
 *
 * Example 1:
 *   Input:  value = 1
 *   Output: 16777216       // 0x00000001 becomes 0x01000000
 *
 * Example 2:
 *   Input:  value = 305419896
 *   Output: 2018915346     // 0x12345678 becomes 0x78563412
 *
 * Example 3:
 *   Input:  value = 0
 *   Output: 0
 *
 * Constraints:
 *   - 0 <= value <= 2^32 - 1
 *
 * Follow-up: JavaScript bit operators work on signed 32-bit integers, so the
 * last step needs the unsigned shift. Which one, and why?
 *
 * Pattern:   Mask one byte at a time and shift it home
 * Target:    O(1) time, O(1) space
 * Source:    Classic algorithm
 */
export function swapBytes(value: number): number {
  throw new Error('Not implemented');
}
