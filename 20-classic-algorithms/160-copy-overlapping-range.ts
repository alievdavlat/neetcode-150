/**
 * 160. Copy Overlapping Range   ·   Medium   ·   Classic Algorithms
 *
 * Copy count elements of data, starting at index from, to index to. The ranges
 * may overlap, and the result must be what a copy through a scratch buffer
 * would give - so a naive loop forward can read a value it has already
 * written. Change data in place and return it. This is memmove, and getting it
 * wrong is the classic C bug.
 *
 * Example 1:
 *   Input:  data = [1, 2, 3, 4, 5, 6], to = 2, from = 0, count = 3
 *   Output: [1, 2, 1, 2, 3, 6]     // copying forward would give [1, 2, 1, 2, 1, 6]
 *
 * Example 2:
 *   Input:  data = [1, 2, 3, 4, 5, 6], to = 0, from = 2, count = 3
 *   Output: [3, 4, 5, 4, 5, 6]
 *
 * Example 3:
 *   Input:  data = [1, 2, 3], to = 0, from = 0, count = 0
 *   Output: [1, 2, 3]
 *
 * Constraints:
 *   - 0 <= data.length <= 10^5
 *   - 0 <= to, from <= data.length
 *   - 0 <= count <= data.length - max(to, from)
 *
 * Follow-up: Which way round do you walk when the destination sits after the
 * source, and why the other way when it sits before?
 *
 * Pattern:   Choose the copy direction from the overlap
 * Target:    O(count) time, O(1) space
 * Source:    Classic algorithm
 */
export function copyRange(data: number[], to: number, from: number, count: number): number[] {
  throw new Error('Not implemented');
}
