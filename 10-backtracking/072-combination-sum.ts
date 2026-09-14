/**
 * 72. Combination Sum   ·   Medium   ·   Backtracking
 *
 * Given an array of distinct integers candidates and a target, return every
 * unique combination that sums to target. The same number may be chosen any
 * number of times, and two combinations are different when the multiset of
 * chosen numbers differs. Fewer than 150 combinations exist for every test
 * case.
 *
 * Example 1:
 *   Input:  candidates = [2, 3, 6, 7], target = 7
 *   Output: [[2, 2, 3], [7]]
 *
 * Example 2:
 *   Input:  candidates = [2, 3, 5], target = 8
 *   Output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
 *
 * Example 3:
 *   Input:  candidates = [2], target = 1
 *   Output: []
 *
 * Constraints:
 *   - 1 <= candidates.length <= 30
 *   - 2 <= candidates[i] <= 40 and all values are distinct
 *   - 1 <= target <= 40
 *
 * Follow-up: What stops [2,3,3] and [3,2,3] from both appearing?
 *
 * Pattern:   Backtracking with reuse — recurse on the same index
 * Target:    O(n^(target / min)) time
 * LeetCode:  https://leetcode.com/problems/combination-sum/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=58543s  (16:15:43)
 */
export function combinationSum(candidates: number[], target: number): number[][] {
  throw new Error('Not implemented');
}
