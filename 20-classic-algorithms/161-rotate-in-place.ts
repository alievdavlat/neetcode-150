/**
 * 161. Rotate In Place   ·   Medium   ·   Classic Algorithms
 *
 * Rotate nums to the right by k steps, using no extra array. k may be larger
 * than the length. Change nums in place and return it.
 *
 * Example 1:
 *   Input:  nums = [1, 2, 3, 4, 5, 6, 7], k = 3
 *   Output: [5, 6, 7, 1, 2, 3, 4]
 *
 * Example 2:
 *   Input:  nums = [1, 2], k = 3
 *   Output: [2, 1]         // three steps over two elements is one step
 *
 * Example 3:
 *   Input:  nums = [1], k = 0
 *   Output: [1]
 *
 * Constraints:
 *   - 1 <= nums.length <= 10^5
 *   - 0 <= k <= 10^9
 *
 * Follow-up: Reversing three times touches every element twice. The
 * cycle-following version touches each once - can you write it?
 *
 * Pattern:   Reverse the whole, then reverse each part
 * Target:    O(n) time, O(1) space
 * Source:    Classic algorithm
 */
export function rotate(nums: number[], k: number): number[] {
  throw new Error('Not implemented');
}
