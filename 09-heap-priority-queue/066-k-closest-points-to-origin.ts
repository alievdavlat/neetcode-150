/**
 * 66. K Closest Points to Origin   ·   Medium   ·   Heap / Priority Queue
 *
 * Given an array of points on the plane and an integer k, return the k points
 * closest to the origin by Euclidean distance. The answer may be returned in
 * any order, and it is unique apart from that ordering.
 *
 * Example 1:
 *   Input:  points = [[1, 3], [-2, 2]], k = 1
 *   Output: [[-2, 2]]
 *
 * Example 2:
 *   Input:  points = [[3, 3], [5, -1], [-2, 4]], k = 2
 *   Output: [[3, 3], [-2, 4]]
 *
 * Constraints:
 *   - 1 <= k <= points.length <= 10^4
 *   - -10^4 <= xi, yi <= 10^4
 *
 * Follow-up: You never need the square root. Quickselect gets the average case
 * to O(n).
 *
 * Pattern:   Max-heap of size k on squared distance (or quickselect)
 * Target:    O(n log k) time, O(k) space
 * LeetCode:  https://leetcode.com/problems/k-closest-points-to-origin/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=52237s  (14:30:37)
 */
export function kClosest(points: number[][], k: number): number[][] {
  throw new Error('Not implemented');
}
