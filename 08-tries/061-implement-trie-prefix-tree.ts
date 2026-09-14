/**
 * 61. Implement Trie (Prefix Tree)   ·   Medium   ·   Tries
 *
 * Implement a trie with three operations: insert(word) stores a word,
 * search(word) returns true when that exact word was inserted, and
 * startsWith(prefix) returns true when any stored word begins with the prefix.
 *
 * Example 1:
 *   Input:  insert("apple"), search("apple"), search("app"),
 *           startsWith("app"), insert("app"), search("app")
 *   Output: true, false, true, true
 *
 * Constraints:
 *   - 1 <= word.length, prefix.length <= 2000
 *   - Inputs consist of lowercase English letters only
 *   - At most 3 * 10^4 calls in total
 *
 * Follow-up: What single field separates "a word ends here" from "a word
 * passes through here"?
 *
 * Pattern:   Character-indexed tree with an end-of-word flag
 * Target:    O(len) per operation, O(total characters) space
 * LeetCode:  https://leetcode.com/problems/implement-trie-prefix-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=48024s  (13:20:24)
 */
export class Trie {
  insert(word: string): void {
    throw new Error('Not implemented');
  }

  search(word: string): boolean {
    throw new Error('Not implemented');
  }

  startsWith(prefix: string): boolean {
    throw new Error('Not implemented');
  }
}
