/**
 * 64. Kth Largest Element in a Stream   ·   Easy   ·   Heap / Priority Queue
 *
 * Design a class that reports the kth largest value seen so far in a stream —
 * the kth largest in sorted order, not the kth distinct value. The constructor
 * takes k and an initial array; add(val) appends a value and returns the
 * current kth largest. It is guaranteed that there are always at least k
 * elements when add returns.
 *
 * Example 1:
 *   Input:  k = 3, nums = [4, 5, 8, 2]; add(3), add(5), add(10), add(9), add(4)
 *   Output: 4, 5, 5, 8, 8
 *
 * Constraints:
 *   - 1 <= k <= 10^4 and 0 <= nums.length <= 10^4
 *   - -10^4 <= nums[i], val <= 10^4
 *   - At most 10^4 calls to add
 *
 * Follow-up: Why a min-heap of size k rather than a max-heap of everything?
 *
 * Pattern:   Min-heap capped at size k
 * Target:    O(log k) per add, O(k) space
 * LeetCode:  https://leetcode.com/problems/kth-largest-element-in-a-stream/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=50488s  (14:01:28)
 */
export class KthLargest {
  constructor(k: number, nums: number[]) {
    throw new Error('Not implemented');
  }

  add(val: number): number {
    throw new Error('Not implemented');
  }
}
