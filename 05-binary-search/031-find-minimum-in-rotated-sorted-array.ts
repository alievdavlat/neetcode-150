/**
 * 31. Find Minimum in Rotated Sorted Array   ·   Medium   ·   Binary Search
 *
 * An ascending array of unique integers has been rotated between 1 and n
 * times. Return its minimum element in O(log n) time.
 *
 * Example 1:
 *   Input:  nums = [3, 4, 5, 1, 2]
 *   Output: 1          // the original [1,2,3,4,5] rotated 3 times
 *
 * Example 2:
 *   Input:  nums = [4, 5, 6, 7, 0, 1, 2]
 *   Output: 0
 *
 * Example 3:
 *   Input:  nums = [11, 13, 15, 17]
 *   Output: 11         // rotated a full turn
 *
 * Constraints:
 *   - n === nums.length
 *   - 1 <= n <= 5000
 *   - -5000 <= nums[i] <= 5000
 *   - All integers are unique
 *
 * Follow-up: Comparing mid to left is a trap. Compare it to right and see why.
 *
 * Pattern:   Binary search comparing mid against the right end
 * Target:    O(log n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=25881s  (07:11:21)
 */
export function findMin(nums: number[]): number {
  throw new Error('Not implemented');
}
