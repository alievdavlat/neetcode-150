/**
 * 5. Top K Frequent Elements   ·   Medium   ·   Arrays & Hashing
 *
 * Given an integer array nums and an integer k, return the k most frequent
 * elements. The answer may be returned in any order, and it is guaranteed to
 * be unique.
 *
 * Example 1:
 *   Input:  nums = [1, 1, 1, 2, 2, 3], k = 2
 *   Output: [1, 2]
 *
 * Example 2:
 *   Input:  nums = [1], k = 1
 *   Output: [1]
 *
 * Constraints:
 *   - 1 <= nums.length <= 10^5
 *   - -10^4 <= nums[i] <= 10^4
 *   - k is in the range [1, number of distinct elements]
 *   - The answer is guaranteed to be unique
 *
 * Follow-up: The expected complexity is better than O(n log n) — no full sort.
 *
 * Pattern:   Frequency map + bucket sort (or a size-k heap)
 * Target:    O(n) time with bucket sort, O(n) space
 * LeetCode:  https://leetcode.com/problems/top-k-frequent-elements/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=2465s  (00:41:05)
 */
export function topKFrequent(nums: number[], k: number): number[] {
  throw new Error('Not implemented');
}
