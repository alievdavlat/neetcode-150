export default {
  category: '1-D Dynamic Programming',
  dir: '13-dp-1d',
  intro: `
Write the recurrence before the loop, every time. Ask three questions in order: what does
dp[i] mean in one sentence, what does dp[i] depend on, and what are the base cases. Only
then decide whether you need the whole array or just the last two values.
`,
  problems: [
    {
      n: 99,
      title: 'Climbing Stairs',
      slug: 'climbing-stairs',
      difficulty: 'Easy',
      leetcode: 'climbing-stairs',
      pattern: 'Fibonacci recurrence, two rolling variables',
      complexity: 'O(n) time, O(1) space',
      statement: `
It takes n steps to reach the top of a staircase, and you climb either 1 or 2 steps at a
time. In how many distinct ways can you reach the top?
`,
      examples: [
        `Input:  n = 2
Output: 2          // 1+1, 2`,
        `Input:  n = 3
Output: 3          // 1+1+1, 1+2, 2+1`,
      ],
      constraints: ['1 <= n <= 45'],
      followUp: 'Start from the recursion, memoise it, then flatten it into a loop.',
      stub: `
export function climbStairs(n: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 100,
      title: 'Min Cost Climbing Stairs',
      slug: 'min-cost-climbing-stairs',
      difficulty: 'Easy',
      leetcode: 'min-cost-climbing-stairs',
      pattern: 'dp[i] = cost[i] + min(dp[i+1], dp[i+2])',
      complexity: 'O(n) time, O(1) space',
      statement: `
cost[i] is the price of stepping off the ith stair. After paying, you climb one or two
stairs. You may start at index 0 or index 1. Return the minimum cost to reach the top,
which is one past the last index.
`,
      examples: [
        `Input:  cost = [10, 15, 20]
Output: 15         // start at index 1, pay 15, jump two`,
        `Input:  cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
Output: 6`,
      ],
      constraints: ['2 <= cost.length <= 1000', '0 <= cost[i] <= 999'],
      stub: `
export function minCostClimbingStairs(cost: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 101,
      title: 'House Robber',
      slug: 'house-robber',
      difficulty: 'Medium',
      leetcode: 'house-robber',
      pattern: 'rob[i] = max(skip this house, take it + best two back)',
      complexity: 'O(n) time, O(1) space',
      statement: `
Each house on a street holds some money, but robbing two adjacent houses on the same night
triggers the alarm. Return the maximum you can take without ever robbing two neighbours.
`,
      examples: [
        `Input:  nums = [1, 2, 3, 1]
Output: 4          // houses 0 and 2`,
        `Input:  nums = [2, 7, 9, 3, 1]
Output: 12         // houses 0, 2 and 4`,
      ],
      constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
      followUp: 'Two variables are enough. Name them for what they mean, not rob1 and rob2.',
      stub: `
export function rob(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 102,
      title: 'House Robber II',
      slug: 'house-robber-ii',
      difficulty: 'Medium',
      leetcode: 'house-robber-ii',
      pattern: 'Run House Robber twice on two open ranges',
      complexity: 'O(n) time, O(1) space',
      statement: `
Same rules as House Robber, except the houses form a circle: the first and the last are
neighbours. Return the maximum you can take.
`,
      examples: [
        `Input:  nums = [2, 3, 2]
Output: 3          // 2 and 2 are adjacent through the circle`,
        `Input:  nums = [1, 2, 3, 1]
Output: 4`,
        `Input:  nums = [1, 2, 3]
Output: 3`,
      ],
      constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 1000'],
      followUp: 'Watch the single-house case — both ranges are empty there.',
      stub: `
export function rob(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 103,
      title: 'Longest Palindromic Substring',
      slug: 'longest-palindromic-substring',
      difficulty: 'Medium',
      leetcode: 'longest-palindromic-substring',
      pattern: 'Expand around every centre (2n - 1 centres)',
      complexity: 'O(n^2) time, O(1) space',
      statement: `
Given a string s, return its longest palindromic substring. When several have the same
length, any one of them is accepted.
`,
      examples: [
        `Input:  s = "babad"
Output: "bab"      // "aba" is also correct`,
        `Input:  s = "cbbd"
Output: "bb"`,
      ],
      constraints: [
        '1 <= s.length <= 1000',
        's consists of digits and English letters',
      ],
      followUp: "Manacher's algorithm does it in O(n) — worth reading once, not memorising.",
      stub: `
export function longestPalindrome(s: string): string {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 104,
      title: 'Palindromic Substrings',
      slug: 'palindromic-substrings',
      difficulty: 'Medium',
      leetcode: 'palindromic-substrings',
      pattern: 'Same expand-around-centre, counting instead of measuring',
      complexity: 'O(n^2) time, O(1) space',
      statement: `
Count the palindromic substrings of s. Substrings at different positions count separately
even when they consist of the same characters.
`,
      examples: [
        `Input:  s = "abc"
Output: 3          // "a", "b", "c"`,
        `Input:  s = "aaa"
Output: 6          // "a" x3, "aa" x2, "aaa"`,
      ],
      constraints: [
        '1 <= s.length <= 1000',
        's consists of lowercase English letters',
      ],
      stub: `
export function countSubstrings(s: string): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 105,
      title: 'Decode Ways',
      slug: 'decode-ways',
      difficulty: 'Medium',
      leetcode: 'decode-ways',
      pattern: 'dp[i] from a one-digit and a two-digit read',
      complexity: 'O(n) time, O(1) space',
      statement: `
A message was encoded with A = 1 through Z = 26 and then stripped of separators. Given the
digit string, return how many ways it can be decoded. A leading zero never forms a valid
letter, so "06" is not "F".
`,
      examples: [
        `Input:  s = "12"
Output: 2          // "AB" or "L"`,
        `Input:  s = "226"
Output: 3          // "BZ", "VF", "BBF"`,
        `Input:  s = "06"
Output: 0`,
      ],
      constraints: ['1 <= s.length <= 100', 's contains only digits'],
      followUp: 'Every zero in the string is a constraint, not just a digit.',
      stub: `
export function numDecodings(s: string): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 106,
      title: 'Coin Change',
      slug: 'coin-change',
      difficulty: 'Medium',
      leetcode: 'coin-change',
      pattern: 'Unbounded knapsack over amounts, minimising count',
      complexity: 'O(amount * coins) time, O(amount) space',
      statement: `
Given coin denominations and a target amount, return the fewest coins that make up that
amount, or -1 when it cannot be made. You have an unlimited number of each coin.
`,
      examples: [
        `Input:  coins = [1, 2, 5], amount = 11
Output: 3          // 5 + 5 + 1`,
        `Input:  coins = [2], amount = 3
Output: -1`,
        `Input:  coins = [1], amount = 0
Output: 0`,
      ],
      constraints: [
        '1 <= coins.length <= 12',
        '1 <= coins[i] <= 2^31 - 1',
        '0 <= amount <= 10^4',
      ],
      followUp: 'Greedy fails here — find the coin set that breaks it.',
      stub: `
export function coinChange(coins: number[], amount: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 107,
      title: 'Maximum Product Subarray',
      slug: 'maximum-product-subarray',
      difficulty: 'Medium',
      leetcode: 'maximum-product-subarray',
      pattern: 'Carry both the running max and the running min',
      complexity: 'O(n) time, O(1) space',
      statement: `
Given an integer array nums, return the largest product of any contiguous non-empty
subarray. Every prefix and suffix product fits in a 32-bit integer.
`,
      examples: [
        `Input:  nums = [2, 3, -2, 4]
Output: 6          // [2, 3]`,
        `Input:  nums = [-2, 0, -1]
Output: 0`,
      ],
      constraints: [
        '1 <= nums.length <= 2 * 10^4',
        '-10 <= nums[i] <= 10',
      ],
      followUp: 'A negative number swaps the roles of your two running values.',
      stub: `
export function maxProduct(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 108,
      title: 'Word Break',
      slug: 'word-break',
      difficulty: 'Medium',
      leetcode: 'word-break',
      pattern: 'dp[i] = some word ends at i and dp[start] was reachable',
      complexity: 'O(n^2 * maxWordLength) time, O(n) space',
      statement: `
Given a string s and a dictionary wordDict, return true when s can be split into a sequence
of dictionary words. Words may be reused any number of times.
`,
      examples: [
        `Input:  s = "leetcode", wordDict = ["leet", "code"]
Output: true`,
        `Input:  s = "applepenapple", wordDict = ["apple", "pen"]
Output: true       // "apple" is used twice`,
        `Input:  s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
Output: false`,
      ],
      constraints: [
        '1 <= s.length <= 300 and 1 <= wordDict.length <= 1000',
        '1 <= wordDict[i].length <= 20',
        'All dictionary words are unique lowercase strings',
      ],
      followUp: 'Plain recursion blows up on "aaaa...ab". Memoise on the start index.',
      stub: `
export function wordBreak(s: string, wordDict: string[]): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 109,
      title: 'Longest Increasing Subsequence',
      slug: 'longest-increasing-subsequence',
      difficulty: 'Medium',
      leetcode: 'longest-increasing-subsequence',
      pattern: 'O(n^2) dp, or patience sorting with binary search',
      complexity: 'O(n log n) time, O(n) space',
      statement: `
Given an integer array nums, return the length of its longest strictly increasing
subsequence. A subsequence keeps the original order but need not be contiguous.
`,
      examples: [
        `Input:  nums = [10, 9, 2, 5, 3, 7, 101, 18]
Output: 4          // [2, 3, 7, 101]`,
        `Input:  nums = [0, 1, 0, 3, 2, 3]
Output: 4`,
        `Input:  nums = [7, 7, 7, 7, 7]
Output: 1`,
      ],
      constraints: [
        '1 <= nums.length <= 2500',
        '-10^4 <= nums[i] <= 10^4',
      ],
      followUp:
        'The O(n log n) tails array is not a subsequence of the input — do not try to read the answer out of it.',
      stub: `
export function lengthOfLIS(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 110,
      title: 'Partition Equal Subset Sum',
      slug: 'partition-equal-subset-sum',
      difficulty: 'Medium',
      leetcode: 'partition-equal-subset-sum',
      pattern: 'Subset-sum knapsack over a set of reachable sums',
      complexity: 'O(n * sum) time, O(sum) space',
      statement: `
Given an array of positive integers, decide whether it can be split into two subsets whose
sums are equal.
`,
      examples: [
        `Input:  nums = [1, 5, 11, 5]
Output: true       // [1, 5, 5] and [11]`,
        `Input:  nums = [1, 2, 3, 5]
Output: false`,
      ],
      constraints: [
        '1 <= nums.length <= 200',
        '1 <= nums[i] <= 100',
      ],
      followUp: 'Reduce it to one question about half the total — and check that half is an integer.',
      stub: `
export function canPartition(nums: number[]): boolean {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
