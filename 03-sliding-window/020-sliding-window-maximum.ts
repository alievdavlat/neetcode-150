/**
 * 20. Sliding Window Maximum   ·   Hard   ·   Sliding Window
 *
 * Given an array nums and a window size k, the window slides one position at a
 * time from the left end to the right end. Return an array holding the maximum
 * value inside the window at every position.
 *
 * Example 1:
 *   Input:  nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
 *   Output: [3, 3, 5, 5, 6, 7]
 *
 * Example 2:
 *   Input:  nums = [1], k = 1
 *   Output: [1]
 *
 * Constraints:
 *   - 1 <= nums.length <= 10^5
 *   - -10^4 <= nums[i] <= 10^4
 *   - 1 <= k <= nums.length
 *
 * Follow-up: A heap gives O(n log k). The deque gives O(n) — what makes an
 * index safe to drop forever?
 *
 * Pattern:   Monotonic decreasing deque of indices
 * Target:    O(n) time, O(k) space
 * LeetCode:  https://leetcode.com/problems/sliding-window-maximum/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=15431s  (04:17:11)
 */
export function maxSlidingWindow(nums: number[], k: number): number[] {
  throw new Error('Not implemented');
}
