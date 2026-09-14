/**
 * 65. Last Stone Weight   ·   Easy   ·   Heap / Priority Queue
 *
 * Each turn, the two heaviest stones are smashed together. If they weigh the
 * same, both are destroyed; otherwise the lighter one is destroyed and the
 * heavier one is left with the difference. Return the weight of the last
 * remaining stone, or 0 when none remain.
 *
 * Example 1:
 *   Input:  stones = [2, 7, 4, 1, 8, 1]
 *   Output: 1
 *
 * Example 2:
 *   Input:  stones = [1]
 *   Output: 1
 *
 * Constraints:
 *   - 1 <= stones.length <= 30
 *   - 1 <= stones[i] <= 1000
 *
 * Pattern:   Max-heap, smash the two heaviest repeatedly
 * Target:    O(n log n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/last-stone-weight/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=52237s  (14:30:37)
 */
export function lastStoneWeight(stones: number[]): number {
  throw new Error('Not implemented');
}
