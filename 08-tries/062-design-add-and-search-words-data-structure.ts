/**
 * 62. Design Add and Search Words Data Structure   ·   Medium   ·   Tries
 *
 * Design a dictionary that supports addWord(word) and search(word), where the
 * searched word may contain '.' as a wildcard matching any single letter.
 * search returns true when at least one stored word matches.
 *
 * Example 1:
 *   Input:  addWord("bad"), addWord("dad"), addWord("mad"),
 *           search("pad"), search("bad"), search(".ad"), search("b..")
 *   Output: false, true, true, true
 *
 * Constraints:
 *   - 1 <= word.length <= 25
 *   - addWord receives lowercase English letters only
 *   - search receives lowercase letters and '.' , with at most 2 dots
 *   - At most 10^4 calls in total
 *
 * Follow-up: A wildcard turns a walk into a search. Where exactly does the
 * recursion fan out?
 *
 * Pattern:   Trie + DFS branching on the . wildcard
 * Target:    O(len) for plain words, O(26^dots * len) worst case
 * LeetCode:  https://leetcode.com/problems/design-add-and-search-words-data-structure/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=48024s  (13:20:24)
 */
export class WordDictionary {
  addWord(word: string): void {
    throw new Error('Not implemented');
  }

  search(word: string): boolean {
    throw new Error('Not implemented');
  }
}
