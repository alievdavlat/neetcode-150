export default {
  category: 'Sliding Window',
  dir: '03-sliding-window',
  intro: `
A window [left, right] that only ever grows on the right and shrinks on the left, so every
index is visited at most twice. The design questions are always the same two: what does the
window have to satisfy, and what is the cheapest state that tells you when it stops.
`,
  problems: [
    {
      n: 15,
      title: 'Best Time to Buy and Sell Stock',
      slug: 'best-time-to-buy-and-sell-stock',
      difficulty: 'Easy',
      leetcode: 'best-time-to-buy-and-sell-stock',
      pattern: 'Track the minimum seen so far',
      complexity: 'O(n) time, O(1) space',
      statement: `
prices[i] is the price of a stock on day i. Buy on one day and sell on a later day to
maximise profit, and return that profit. If no transaction makes a profit, return 0.
`,
      examples: [
        `Input:  prices = [7, 1, 5, 3, 6, 4]
Output: 5          // buy on day 1 at 1, sell on day 4 at 6`,
        `Input:  prices = [7, 6, 4, 3, 1]
Output: 0          // prices only fall, so do nothing`,
      ],
      constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
      stub: `
export function maxProfit(prices: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 16,
      title: 'Longest Substring Without Repeating Characters',
      slug: 'longest-substring-without-repeating-characters',
      difficulty: 'Medium',
      leetcode: 'longest-substring-without-repeating-characters',
      pattern: 'Sliding window + set (or last-seen index map)',
      complexity: 'O(n) time, O(min(n, alphabet)) space',
      statement: `
Given a string s, return the length of the longest substring that contains no repeated
character. A substring is contiguous — a subsequence is not.
`,
      examples: [
        `Input:  s = "abcabcbb"
Output: 3          // "abc"`,
        `Input:  s = "bbbbb"
Output: 1          // "b"`,
        `Input:  s = "pwwkew"
Output: 3          // "wke"; "pwke" is a subsequence, not a substring`,
      ],
      constraints: [
        '0 <= s.length <= 5 * 10^4',
        's consists of English letters, digits, symbols and spaces',
      ],
      followUp: 'A last-seen index map lets left jump instead of crawling. Worth it?',
      stub: `
export function lengthOfLongestSubstring(s: string): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 17,
      title: 'Longest Repeating Character Replacement',
      slug: 'longest-repeating-character-replacement',
      difficulty: 'Medium',
      leetcode: 'longest-repeating-character-replacement',
      pattern: 'Window valid while (size - count of most frequent char) <= k',
      complexity: 'O(n) time, O(1) space (26 letters)',
      statement: `
Given a string s of uppercase English letters and an integer k, you may change at most k
characters to any other uppercase letter. Return the length of the longest substring that
can be made to contain a single repeated letter.
`,
      examples: [
        `Input:  s = "ABAB", k = 2
Output: 4          // turn both A's into B's (or the reverse)`,
        `Input:  s = "AABABBA", k = 1
Output: 4          // "AABA" -> "AAAA"`,
      ],
      constraints: [
        '1 <= s.length <= 10^5',
        's consists of uppercase English letters only',
        '0 <= k <= s.length',
      ],
      followUp: 'Do you have to recompute the most frequent count every time the window moves?',
      stub: `
export function characterReplacement(s: string, k: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 18,
      title: 'Permutation in String',
      slug: 'permutation-in-string',
      difficulty: 'Medium',
      leetcode: 'permutation-in-string',
      pattern: 'Fixed-size window + frequency match',
      complexity: 'O(n) time, O(1) space (26 letters)',
      statement: `
Given two strings s1 and s2, return true when s2 contains a permutation of s1 — that is,
when some substring of s2 is a rearrangement of s1.
`,
      examples: [
        `Input:  s1 = "ab", s2 = "eidbaooo"
Output: true       // s2 contains "ba"`,
        `Input:  s1 = "ab", s2 = "eidboaoo"
Output: false`,
      ],
      constraints: [
        '1 <= s1.length, s2.length <= 10^4',
        's1 and s2 consist of lowercase English letters',
      ],
      followUp:
        'Comparing two 26-slot arrays per step is O(26n). Can you maintain a single "matches" counter instead?',
      stub: `
export function checkInclusion(s1: string, s2: string): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 19,
      title: 'Minimum Window Substring',
      slug: 'minimum-window-substring',
      difficulty: 'Hard',
      leetcode: 'minimum-window-substring',
      pattern: 'Expand to satisfy, then shrink while still satisfied',
      complexity: 'O(n + m) time, O(alphabet) space',
      statement: `
Given strings s and t, return the shortest substring of s that contains every character of
t including duplicates. If no such substring exists, return the empty string. The answer
is guaranteed to be unique when it exists.
`,
      examples: [
        `Input:  s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"`,
        `Input:  s = "a", t = "a"
Output: "a"`,
        `Input:  s = "a", t = "aa"
Output: ""         // s has only one 'a'`,
      ],
      constraints: [
        'm === s.length, n === t.length',
        '1 <= m, n <= 10^5',
        's and t consist of uppercase and lowercase English letters',
      ],
      followUp: 'Can you do it in O(m + n)?',
      stub: `
export function minWindow(s: string, t: string): string {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 20,
      title: 'Sliding Window Maximum',
      slug: 'sliding-window-maximum',
      difficulty: 'Hard',
      leetcode: 'sliding-window-maximum',
      pattern: 'Monotonic decreasing deque of indices',
      complexity: 'O(n) time, O(k) space',
      statement: `
Given an array nums and a window size k, the window slides one position at a time from the
left end to the right end. Return an array holding the maximum value inside the window at
every position.
`,
      examples: [
        `Input:  nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
Output: [3, 3, 5, 5, 6, 7]`,
        `Input:  nums = [1], k = 1
Output: [1]`,
      ],
      constraints: [
        '1 <= nums.length <= 10^5',
        '-10^4 <= nums[i] <= 10^4',
        '1 <= k <= nums.length',
      ],
      followUp:
        'A heap gives O(n log k). The deque gives O(n) — what makes an index safe to drop forever?',
      stub: `
export function maxSlidingWindow(nums: number[], k: number): number[] {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
