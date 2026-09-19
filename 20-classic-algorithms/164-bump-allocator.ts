/**
 * 164. Bump Allocator   ·   Medium   ·   Classic Algorithms
 *
 * Hand out capacity bytes to the requests in sizes, in order. Each block
 * starts at the next offset that is aligned to alignment, and the cursor moves
 * to the end of the block it just gave out. A request that would run past
 * capacity gets -1 and leaves the cursor where it was, so a later smaller
 * request can still be served. Return the offset given to each request.
 *
 * Example 1:
 *   Input:  capacity = 64, sizes = [10, 10, 10], alignment = 8
 *   Output: [0, 16, 32]        // 10 rounds up to 16, then 26 rounds up to 32
 *
 * Example 2:
 *   Input:  capacity = 20, sizes = [10, 10], alignment = 8
 *   Output: [0, -1]            // the second would end at 26, past 20
 *
 * Example 3:
 *   Input:  capacity = 8, sizes = [], alignment = 4
 *   Output: []
 *
 * Constraints:
 *   - 0 <= capacity <= 2^31 - 1
 *   - 0 <= sizes.length <= 10^4
 *   - 0 <= sizes[i] <= capacity
 *   - alignment is a power of two, 1 <= alignment <= 4096
 *
 * Follow-up: This allocator can never free one block. What would you have to
 * record to be able to?
 *
 * Pattern:   One cursor, aligned before every handout
 * Target:    O(n) time, O(1) space
 * Source:    Classic algorithm
 */
export function allocate(capacity: number, sizes: number[], alignment: number): number[] {
  throw new Error('Not implemented');
}
