/**
 * 75. Combination Sum II   ·   Medium   ·   Backtracking
 *
 * Given a collection of candidate numbers that may contain duplicates and a
 * target, find all unique combinations summing to target. Each number in
 * candidates may be used at most once per combination, and the result must not
 * contain duplicate combinations.
 *
 * Example 1:
 *   Input:  candidates = [10, 1, 2, 7, 6, 1, 5], target = 8
 *   Output: [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]
 *
 * Example 2:
 *   Input:  candidates = [2, 5, 2, 1, 2], target = 5
 *   Output: [[1, 2, 2], [5]]
 *
 * Constraints:
 *   - 1 <= candidates.length <= 100
 *   - 1 <= candidates[i] <= 50
 *   - 1 <= target <= 30
 *
 * Follow-up: Two nearly identical off-by-one traps: index + 1 versus index, i
 * > start versus i > 0.
 *
 * Pattern:   Sort + skip duplicates + each candidate used at most once
 * Target:    O(2^n) time
 * LeetCode:  https://leetcode.com/problems/combination-sum-ii/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=60594s  (16:49:54)
 */
export function combinationSum2(candidates: number[], target: number): number[][] {
  throw new Error('Not implemented');
}
