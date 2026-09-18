/**
 * 154. Sort Colors   ·   Medium   ·   Two Pointers
 *
 * nums holds only the values 0, 1 and 2. Rearrange it in place so every 0
 * comes first, then every 1, then every 2. Do it in a single pass without
 * calling a library sort. The function returns nothing - change the array
 * itself.
 *
 * Example 1:
 *   Input:  nums = [2, 0, 2, 1, 1, 0]
 *   Output: [0, 0, 1, 1, 2, 2]
 *
 * Example 2:
 *   Input:  nums = [2, 0, 1]
 *   Output: [0, 1, 2]
 *
 * Example 3:
 *   Input:  nums = [0]
 *   Output: [0]
 *
 * Constraints:
 *   - 1 <= nums.length <= 300
 *   - nums[i] is 0, 1 or 2
 *
 * Follow-up: Counting each value and rewriting takes two passes. One pass
 * needs three pointers.
 *
 * Pattern:   Dutch national flag: a low, a high and a cursor between them
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/sort-colors/
 */
export function sortColors(nums: number[]): void {
  throw new Error('Not implemented');
}
