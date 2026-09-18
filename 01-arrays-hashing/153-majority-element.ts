/**
 * 153. Majority Element   ·   Easy   ·   Arrays & Hashing
 *
 * One value in nums appears more than half the time. Return it. You may assume
 * such a value always exists, so you never have to report failure.
 *
 * Example 1:
 *   Input:  nums = [3, 2, 3]
 *   Output: 3
 *
 * Example 2:
 *   Input:  nums = [2, 2, 1, 1, 1, 2, 2]
 *   Output: 2
 *
 * Example 3:
 *   Input:  nums = [7]
 *   Output: 7
 *
 * Constraints:
 *   - 1 <= nums.length <= 5 * 10^4
 *   - -10^9 <= nums[i] <= 10^9
 *   - A majority element always exists
 *
 * Follow-up: A hash map is the obvious answer. Getting to O(1) space is the
 * interesting one.
 *
 * Pattern:   Boyer-Moore vote: hold one candidate and a running count
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/majority-element/
 */
export function majorityElement(nums: number[]): number {
  throw new Error('Not implemented');
}
