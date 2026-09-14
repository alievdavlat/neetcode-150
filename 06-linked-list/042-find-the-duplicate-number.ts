/**
 * 42. Find the Duplicate Number   ·   Medium   ·   Linked List
 *
 * An array nums of n + 1 integers holds values in the range [1, n], so at
 * least one value repeats. Return the repeated number. You must not modify the
 * array and you must use only constant extra space.
 *
 * Example 1:
 *   Input:  nums = [1, 3, 4, 2, 2]
 *   Output: 2
 *
 * Example 2:
 *   Input:  nums = [3, 1, 3, 4, 2]
 *   Output: 3
 *
 * Example 3:
 *   Input:  nums = [3, 3, 3, 3, 3]
 *   Output: 3
 *
 * Constraints:
 *   - 1 <= n <= 10^5 and nums.length === n + 1
 *   - 1 <= nums[i] <= n
 *   - Exactly one value is repeated, possibly many times
 *   - The array is read-only and only O(1) extra space is allowed
 *
 * Follow-up: Read i -> nums[i] as a next pointer. Where must the cycle
 * entrance be?
 *
 * Pattern:   Floyd's cycle detection on the array-as-linked-list
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/find-the-duplicate-number/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=34420s  (09:33:40)
 */
export function findDuplicate(nums: number[]): number {
  throw new Error('Not implemented');
}
