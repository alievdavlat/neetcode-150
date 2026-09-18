/**
 * 152. Longest Common Prefix   ·   Easy   ·   Arrays & Hashing
 *
 * Return the longest string that every word in strs begins with. When the
 * words share no opening character, return the empty string.
 *
 * Example 1:
 *   Input:  strs = ["flower", "flow", "flight"]
 *   Output: "fl"
 *
 * Example 2:
 *   Input:  strs = ["dog", "racecar", "car"]
 *   Output: ""        // nothing in common
 *
 * Example 3:
 *   Input:  strs = ["alone"]
 *   Output: "alone"
 *
 * Constraints:
 *   - 1 <= strs.length <= 200
 *   - 0 <= strs[i].length <= 200
 *   - strs[i] consists of lowercase English letters
 *
 * Follow-up: The shortest word caps the answer, which is worth knowing before
 * you start scanning.
 *
 * Pattern:   Walk the columns together and stop at the first disagreement
 * Target:    O(total characters) time, O(1) extra space
 * LeetCode:  https://leetcode.com/problems/longest-common-prefix/
 */
export function longestCommonPrefix(strs: string[]): string {
  throw new Error('Not implemented');
}
