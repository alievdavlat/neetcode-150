/**
 * 34. Median of Two Sorted Arrays   ·   Hard   ·   Binary Search
 *
 * Given two sorted arrays nums1 and nums2 of sizes m and n, return the median
 * of the combined sorted array. The runtime must be O(log(m + n)); merging is
 * too slow.
 *
 * Example 1:
 *   Input:  nums1 = [1, 3], nums2 = [2]
 *   Output: 2.0        // merged = [1,2,3]
 *
 * Example 2:
 *   Input:  nums1 = [1, 2], nums2 = [3, 4]
 *   Output: 2.5        // merged = [1,2,3,4]
 *
 * Constraints:
 *   - nums1.length === m, nums2.length === n
 *   - 0 <= m, n <= 1000 and 1 <= m + n <= 2000
 *   - -10^6 <= nums1[i], nums2[i] <= 10^6
 *
 * Follow-up: Search for a cut such that everything left of it is <= everything
 * right of it, across both arrays.
 *
 * Pattern:   Binary search for the partition point on the shorter array
 * Target:    O(log(min(m, n))) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/median-of-two-sorted-arrays/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=27465s  (07:37:45)
 */
export function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  throw new Error('Not implemented');
}
