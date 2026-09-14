/**
 * 1. Contains Duplicate   ·   Easy   ·   Arrays & Hashing
 *
 * Given an integer array nums, return true when any value shows up at least
 * twice, and false when every element is distinct.
 *
 * Example 1:
 *   Input:  nums = [1, 2, 3, 1]
 *   Output: true       // 1 appears twice
 *
 * Example 2:
 *   Input:  nums = [1, 2, 3, 4]
 *   Output: false      // every value is unique
 *
 * Example 3:
 *   Input:  nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]
 *   Output: true
 *
 * Constraints:
 *   - 1 <= nums.length <= 10^5
 *   - -10^9 <= nums[i] <= 10^9
 *
 * Pattern:   Hash set
 * Target:    O(n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/contains-duplicate/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=129s  (00:02:09)
 */
export function containsDuplicate(nums: number[]): boolean {
  const isUnique = new Set<number>(nums);
  if (isUnique.size === nums.length) return false;
  return true;
}

export function containsDuplicate2(nums: number[]): boolean {
  let obj: Record<number, number> = {};
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] in obj) {
      return true;
    } else {
      obj[nums[i]] = i;
    }
  }

  return false;
}


containsDuplicate([1, 2, 3, 1]); // true
containsDuplicate2([1, 2, 3, 4]); // false