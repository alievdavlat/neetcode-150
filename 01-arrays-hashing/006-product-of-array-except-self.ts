/**
 * 6. Product of Array Except Self   ·   Medium   ·   Arrays & Hashing
 *
 * Given an integer array nums, return an array answer where answer[i] is the
 * product of every element of nums except nums[i]. Every product is guaranteed
 * to fit in a 32-bit integer. You must solve it without division and in O(n)
 * time.
 *
 * Example 1:
 *   Input:  nums = [1, 2, 3, 4]
 *   Output: [24, 12, 8, 6]
 *
 * Example 2:
 *   Input:  nums = [-1, 1, 0, -3, 3]
 *   Output: [0, 0, 9, 0, 0]
 *
 * Constraints:
 *   - 2 <= nums.length <= 10^5
 *   - -30 <= nums[i] <= 30
 *   - Every prefix/suffix product fits in a 32-bit integer
 *   - The division operator is not allowed
 *
 * Follow-up: Can you use O(1) extra space, treating the output array as free?
 *
 * Pattern:   Prefix product pass + suffix product pass
 * Target:    O(n) time, O(1) extra space (output excluded)
 * LeetCode:  https://leetcode.com/problems/product-of-array-except-self/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=2465s  (00:41:05)
 */
export function productExceptSelf(nums: number[]): number[] {
  const res = new Array(nums.length).fill(1);

  let left = 1;
  for (let i = 0; i < nums.length; i++) {
    res[i] = left;
    left *= nums[i];
  }

  let right = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    res[i] *= right;
    right *= nums[i];
  }

  return res

}


console.log(productExceptSelf([1, 2, 3, 4]))