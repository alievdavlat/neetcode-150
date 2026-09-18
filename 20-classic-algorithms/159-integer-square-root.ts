/**
 * 159. Integer Square Root   ·   Easy   ·   Classic Algorithms
 *
 * Given a non-negative integer n, return the largest integer r for which r * r
 * is at most n. In other words, the square root rounded down. Do it without
 * Math.sqrt.
 *
 * Example 1:
 *   Input:  n = 4
 *   Output: 2
 *
 * Example 2:
 *   Input:  n = 8
 *   Output: 2         // 3 * 3 is already past 8
 *
 * Example 3:
 *   Input:  n = 0
 *   Output: 0
 *
 * Constraints:
 *   - 0 <= n <= 2^31 - 1
 *
 * Follow-up: The answer is never above n / 2 + 1, which is a tighter upper
 * bound to search from.
 *
 * Pattern:   Binary search the answer, not the input
 * Target:    O(log n) time, O(1) space
 * Source:    Classic algorithm
 */
export function integerSqrt(n: number): number {
  throw new Error('Not implemented');
}
