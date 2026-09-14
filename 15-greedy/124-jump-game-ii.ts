/**
 * 124. Jump Game II   ·   Medium   ·   Greedy
 *
 * Same jump rules, but now the last index is always reachable. Return the
 * minimum number of jumps needed to get there.
 *
 * Example 1:
 *   Input:  nums = [2, 3, 1, 1, 4]
 *   Output: 2          // jump 1 step to index 1, then 3 steps to the end
 *
 * Example 2:
 *   Input:  nums = [2, 3, 0, 1, 4]
 *   Output: 2
 *
 * Constraints:
 *   - 1 <= nums.length <= 10^4
 *   - 0 <= nums[i] <= 1000
 *   - The last index is always reachable
 *
 * Follow-up: Think of each jump count as a BFS level covering a contiguous
 * window of indices.
 *
 * Pattern:   BFS-style level expansion over index ranges
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/jump-game-ii/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=117106s  (32:31:46)
 */
export function jump(nums: number[]): number {
  throw new Error('Not implemented');
}
