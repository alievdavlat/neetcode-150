/**
 * 128. Partition Labels   ·   Medium   ·   Greedy
 *
 * Partition a string into as many parts as possible so that each letter
 * appears in at most one part. Concatenating the parts in order must rebuild
 * the original string. Return the sizes of the parts.
 *
 * Example 1:
 *   Input:  s = "ababcbacadefegdehijhklij"
 *   Output: [9, 7, 8]
 *
 * Example 2:
 *   Input:  s = "eccbbbbdec"
 *   Output: [10]
 *
 * Constraints:
 *   - 1 <= s.length <= 500
 *   - s consists of lowercase English letters
 *
 * Pattern:   Last-index map + extend the current partition end
 * Target:    O(n) time, O(1) space (26 letters)
 * LeetCode:  https://leetcode.com/problems/partition-labels/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=120855s  (33:34:15)
 */
export function partitionLabels(s: string): number[] {
  throw new Error('Not implemented');
}
