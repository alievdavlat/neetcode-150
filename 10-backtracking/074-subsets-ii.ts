/**
 * 74. Subsets II   ·   Medium   ·   Backtracking
 *
 * Given an integer array that may contain duplicates, return all possible
 * subsets. The result must contain no duplicate subset, in any order.
 *
 * Example 1:
 *   Input:  nums = [1, 2, 2]
 *   Output: [[], [1], [1,2], [1,2,2], [2], [2,2]]
 *
 * Example 2:
 *   Input:  nums = [0]
 *   Output: [[], [0]]
 *
 * Constraints:
 *   - 1 <= nums.length <= 10
 *   - -10 <= nums[i] <= 10
 *
 * Follow-up: The duplicate rule is one line — and it is wrong if you sort
 * after recursing.
 *
 * Pattern:   Sort, then skip a duplicate at the same recursion level
 * Target:    O(n * 2^n) time
 * LeetCode:  https://leetcode.com/problems/subsets-ii/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=58543s  (16:15:43)
 */
export function subsetsWithDup(nums: number[]): number[][] {
  throw new Error('Not implemented');
}
