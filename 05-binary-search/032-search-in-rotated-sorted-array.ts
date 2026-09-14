/**
 * 32. Search in Rotated Sorted Array   ·   Medium   ·   Binary Search
 *
 * An ascending array of distinct integers was rotated at some pivot. Given the
 * rotated array and a target, return the index of target or -1. The runtime
 * must be O(log n).
 *
 * Example 1:
 *   Input:  nums = [4, 5, 6, 7, 0, 1, 2], target = 0
 *   Output: 4
 *
 * Example 2:
 *   Input:  nums = [4, 5, 6, 7, 0, 1, 2], target = 3
 *   Output: -1
 *
 * Example 3:
 *   Input:  nums = [1], target = 0
 *   Output: -1
 *
 * Constraints:
 *   - 1 <= nums.length <= 5000
 *   - -10^4 <= nums[i], target <= 10^4
 *   - All values are unique; nums is an ascending array rotated at some pivot
 *
 * Follow-up: At every mid, exactly one side is guaranteed sorted. Which one,
 * and is target in it?
 *
 * Pattern:   Binary search, deciding which half is sorted each step
 * Target:    O(log n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/search-in-rotated-sorted-array/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=25881s  (07:11:21)
 */
export function search(nums: number[], target: number): number {
  throw new Error('Not implemented');
}
