/**
 * 158. Merge Sort   ·   Medium   ·   Classic Algorithms
 *
 * Sort an array of integers ascending by splitting it in half, sorting each
 * half the same way, and merging the two sorted halves. Return a new array and
 * leave the input alone. Do not call the built-in sort.
 *
 * Example 1:
 *   Input:  nums = [5, 2, 3, 1]
 *   Output: [1, 2, 3, 5]
 *
 * Example 2:
 *   Input:  nums = [5, 1, 1, 2, 0, 0]
 *   Output: [0, 0, 1, 1, 2, 5]
 *
 * Example 3:
 *   Input:  nums = []
 *   Output: []
 *
 * Constraints:
 *   - 0 <= nums.length <= 5 * 10^4
 *   - -10^5 <= nums[i] <= 10^5
 *
 * Follow-up: Keep it stable: when two values are equal, the one that was first
 * must stay first.
 *
 * Pattern:   Split in half, sort each half, merge with two pointers
 * Target:    O(n log n) time, O(n) space
 * Source:    Classic algorithm
 */
export function mergeSort(nums: number[]): number[] {
  throw new Error('Not implemented');
}
