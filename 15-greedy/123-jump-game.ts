/**
 * 123. Jump Game   ·   Medium   ·   Greedy
 *
 * nums[i] is the maximum jump length from index i. Starting at index 0, return
 * whether you can reach the last index.
 *
 * Example 1:
 *   Input:  nums = [2, 3, 1, 1, 4]
 *   Output: true
 *
 * Example 2:
 *   Input:  nums = [3, 2, 1, 0, 4]
 *   Output: false      // every route lands on the 0
 *
 * Constraints:
 *   - 1 <= nums.length <= 10^4
 *   - 0 <= nums[i] <= 10^5
 *
 * Follow-up: Moving the goal post leftwards is the version you will remember
 * under pressure.
 *
 * Pattern:   Track the furthest reachable index (or walk the goal backwards)
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/jump-game/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=117106s  (32:31:46)
 */
export function canJump(nums: number[]): boolean {
  throw new Error('Not implemented');
}
