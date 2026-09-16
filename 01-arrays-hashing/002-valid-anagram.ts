/**
 * 2. Valid Anagram   ·   Easy   ·   Arrays & Hashing
 *
 * Given two strings s and t, return true when t is an anagram of s — the same
 * characters in the same quantities, only reordered.
 *
 * Example 1:
 *   Input:  s = "anagram", t = "nagaram"
 *   Output: true
 *
 * Example 2:
 *   Input:  s = "rat", t = "car"
 *   Output: false
 *
 * Constraints:
 *   - 1 <= s.length, t.length <= 5 * 10^4
 *   - s and t consist of lowercase English letters
 *
 * Follow-up: What changes if the inputs may contain Unicode characters?
 *
 * Pattern:   Character frequency count
 * Target:    O(n) time, O(1) space (26 letters)
 * LeetCode:  https://leetcode.com/problems/valid-anagram/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=129s  (00:02:09)
 */
export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const sString = s.split('').sort().join('');
  const tString = t.split('').sort().join('');
  return sString === tString;
}

export function isAnagram2(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const freq: Int32Array<ArrayBuffer> = new Int32Array(26);
  for (let i = 0; i < s.length; i++) {
    freq[s.charCodeAt(i) - 97]++;
    freq[t.charCodeAt(i) - 97]--;
  }

  return freq.every((count) => count === 0);
}

console.log(isAnagram('anagram', 'nagaram')); // true
console.log(isAnagram('rat', 'car')); // false