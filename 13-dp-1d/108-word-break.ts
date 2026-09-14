/**
 * 108. Word Break   ·   Medium   ·   1-D Dynamic Programming
 *
 * Given a string s and a dictionary wordDict, return true when s can be split
 * into a sequence of dictionary words. Words may be reused any number of
 * times.
 *
 * Example 1:
 *   Input:  s = "leetcode", wordDict = ["leet", "code"]
 *   Output: true
 *
 * Example 2:
 *   Input:  s = "applepenapple", wordDict = ["apple", "pen"]
 *   Output: true       // "apple" is used twice
 *
 * Example 3:
 *   Input:  s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
 *   Output: false
 *
 * Constraints:
 *   - 1 <= s.length <= 300 and 1 <= wordDict.length <= 1000
 *   - 1 <= wordDict[i].length <= 20
 *   - All dictionary words are unique lowercase strings
 *
 * Follow-up: Plain recursion blows up on "aaaa...ab". Memoise on the start
 * index.
 *
 * Pattern:   dp[i] = some word ends at i and dp[start] was reachable
 * Target:    O(n^2 * maxWordLength) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/word-break/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=94223s  (26:10:23)
 */
export function wordBreak(s: string, wordDict: string[]): boolean {
  throw new Error('Not implemented');
}
