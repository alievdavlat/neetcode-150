/**
 * 97. Alien Dictionary   ·   Hard   ·   Advanced Graphs
 *
 * A list of words is sorted according to an unknown alphabet that uses the
 * usual lowercase letters. Derive an ordering of those letters consistent with
 * the sorting and return it as a string. Return "" when the input is
 * contradictory; when several orders are valid, any one is accepted.
 *
 * Example 1:
 *   Input:  words = ["wrt", "wrf", "er", "ett", "rftt"]
 *   Output: "wertf"
 *
 * Example 2:
 *   Input:  words = ["z", "x"]
 *   Output: "zx"
 *
 * Example 3:
 *   Input:  words = ["z", "x", "z"]
 *   Output: ""         // contradictory
 *
 * Constraints:
 *   - 1 <= words.length <= 100 and 1 <= words[i].length <= 100
 *   - words[i] consists of lowercase English letters
 *
 * Follow-up: The prefix case is the trap: ["abc", "ab"] is invalid input, not
 * a missing edge.
 *
 * Pattern:   Derive edges from adjacent word pairs, then topological sort
 * Target:    O(total characters) time, O(1) space (26 letters)
 * LeetCode:  https://leetcode.com/problems/alien-dictionary/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=83680s  (23:14:40)
 */
export function alienOrder(words: string[]): string {
  throw new Error('Not implemented');
}
