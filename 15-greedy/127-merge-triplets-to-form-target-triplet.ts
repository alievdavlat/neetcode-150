/**
 * 127. Merge Triplets to Form Target Triplet   ·   Medium   ·   Greedy
 *
 * A merge replaces two triplets with their element-wise maximum. Given a list
 * of triplets and a target triplet, return whether repeated merges can produce
 * the target. Merging is optional and may be applied any number of times to
 * any triplets.
 *
 * Example 1:
 *   Input:  triplets = [[2,5,3], [1,8,4], [1,7,5]], target = [2, 7, 5]
 *   Output: true       // merge [2,5,3] with [1,7,5]
 *
 * Example 2:
 *   Input:  triplets = [[3,4,5], [4,5,6]], target = [3, 2, 5]
 *   Output: false
 *
 * Constraints:
 *   - 1 <= triplets.length <= 10^5
 *   - 1 <= values, target values <= 1000
 *
 * Follow-up: A triplet with any value above the target can never be used. What
 * is left to check?
 *
 * Pattern:   Ignore any triplet that overshoots, then check coverage
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/merge-triplets-to-form-target-triplet/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=120855s  (33:34:15)
 */
export function mergeTriplets(triplets: number[][], target: number[]): boolean {
  throw new Error('Not implemented');
}
