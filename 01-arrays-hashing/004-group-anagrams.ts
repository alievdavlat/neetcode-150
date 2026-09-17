/**
 * 4. Group Anagrams   ·   Medium   ·   Arrays & Hashing
 *
 * Given an array of strings, group the anagrams together. Return the groups in
 * any order, and the strings inside each group in any order.
 *
 * Example 1:
 *   Input:  strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
 *   Output: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
 *
 * Example 2:
 *   Input:  strs = [""]
 *   Output: [[""]]
 *
 * Example 3:
 *   Input:  strs = ["a"]
 *   Output: [["a"]]
 *
 * Constraints:
 *   - 1 <= strs.length <= 10^4
 *   - 0 <= strs[i].length <= 100
 *   - strs[i] consists of lowercase English letters
 *
 * Follow-up: Sorting each word is O(k log k) per word. What key avoids the
 * sort?
 *
 * Pattern:   Hash map keyed by a canonical form of the word
 * Target:    O(n * k) time with a count key, O(n * k) space
 * LeetCode:  https://leetcode.com/problems/group-anagrams/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=1110s  (00:18:30)
 */
export function groupAnagrams(strs: string[]): string[][] {
  const map = new Map();
  for (const word of strs) {
    const key = word.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }

  return [...map.values()];
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
