/**
 * 67. Kth Largest Element in an Array   ·   Medium   ·   Heap / Priority Queue
 *
 * Return the kth largest element of an unsorted array, counting in sorted
 * order rather than by distinct value. Solve it without sorting the whole
 * array.
 *
 * Example 1:
 *   Input:  nums = [3, 2, 1, 5, 6, 4], k = 2
 *   Output: 5
 *
 * Example 2:
 *   Input:  nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4
 *   Output: 4
 *
 * Constraints:
 *   - 1 <= k <= nums.length <= 10^5
 *   - -10^4 <= nums[i] <= 10^4
 *
 * Follow-up: What input makes a naive quickselect pivot degrade to O(n^2)?
 *
 * Pattern:   Quickselect (or a size-k min-heap)
 * Target:    O(n) average with quickselect, O(1) extra space
 * LeetCode:  https://leetcode.com/problems/kth-largest-element-in-an-array/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=53444s  (14:50:44)
 */
export function findKthLargest(nums: number[], k: number): number {
  throw new Error('Not implemented');
}
