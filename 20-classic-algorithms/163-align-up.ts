/**
 * 163. Align Up   ·   Easy   ·   Classic Algorithms
 *
 * Return the smallest multiple of alignment that is not less than offset.
 * alignment is always a power of two. Every allocator starts here: a value has
 * to sit on an address its type can be read from.
 *
 * Example 1:
 *   Input:  offset = 13, alignment = 8
 *   Output: 16
 *
 * Example 2:
 *   Input:  offset = 16, alignment = 8
 *   Output: 16         // already aligned, so it does not move
 *
 * Example 3:
 *   Input:  offset = 0, alignment = 4
 *   Output: 0
 *
 * Constraints:
 *   - 0 <= offset <= 2^31 - 1
 *   - alignment is a power of two, 1 <= alignment <= 2^16
 *
 * Follow-up: There is a version with no division and no branch, using only
 * alignment - 1. Find it.
 *
 * Pattern:   A power of two masks the bits below it
 * Target:    O(1) time, O(1) space
 * Source:    Classic algorithm
 */
export function alignUp(offset: number, alignment: number): number {
  throw new Error('Not implemented');
}
