/**
 * 70. Find Median from Data Stream   ·   Hard   ·   Heap / Priority Queue
 *
 * Design a structure that supports addNum(num) to feed values from a stream
 * and findMedian() to return the median of everything added so far. With an
 * even count the median is the mean of the two middle values. Answers within
 * 1e-5 of the true median are accepted.
 *
 * Example 1:
 *   Input:  addNum(1), addNum(2), findMedian(), addNum(3), findMedian()
 *   Output: 1.5, then 2.0
 *
 * Constraints:
 *   - -10^5 <= num <= 10^5
 *   - findMedian is only called after at least one addNum
 *   - At most 5 * 10^4 calls in total
 *
 * Follow-up: If all numbers were in [0, 100], could you answer in O(1)? What
 * if 99% of them were?
 *
 * Pattern:   Two heaps: max-heap of the low half, min-heap of the high half
 * Target:    O(log n) per insert, O(1) per median
 * LeetCode:  https://leetcode.com/problems/find-median-from-data-stream/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=55196s  (15:19:56)
 */
export class MedianFinder {
  addNum(num: number): void {
    throw new Error('Not implemented');
  }

  findMedian(): number {
    throw new Error('Not implemented');
  }
}
