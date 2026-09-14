/**
 * 119. Edit Distance   ·   Medium   ·   2-D Dynamic Programming
 *
 * Given two words, return the minimum number of single-character insertions,
 * deletions or replacements needed to turn the first into the second.
 *
 * Example 1:
 *   Input:  word1 = "horse", word2 = "ros"
 *   Output: 3          // horse -> rorse -> rose -> ros
 *
 * Example 2:
 *   Input:  word1 = "intention", word2 = "execution"
 *   Output: 5
 *
 * Constraints:
 *   - 0 <= word1.length, word2.length <= 500
 *   - Both consist of lowercase English letters
 *
 * Follow-up: The base row and column are not zeros. What are they, and why?
 *
 * Pattern:   Levenshtein grid: insert, delete, replace
 * Target:    O(n * m) time, O(m) space
 * LeetCode:  https://leetcode.com/problems/edit-distance/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=112309s  (31:11:49)
 */
export function minDistance(word1: string, word2: string): number {
  throw new Error('Not implemented');
}
