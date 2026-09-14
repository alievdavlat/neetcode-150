export default {
  category: '2-D Dynamic Programming',
  dir: '14-dp-2d',
  intro: `
Now the state has two coordinates — usually a position in each of two sequences, or a
position plus a budget. Draw the grid on paper, fill the first row and column by hand, and
the recurrence tends to write itself. The last two are interval DP, a different animal.
`,
  problems: [
    {
      n: 111,
      title: 'Unique Paths',
      slug: 'unique-paths',
      difficulty: 'Medium',
      leetcode: 'unique-paths',
      pattern: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]',
      complexity: 'O(m * n) time, O(n) space',
      statement: `
A robot starts in the top-left cell of an m x n grid and may only move right or down.
Return how many distinct paths it can take to the bottom-right cell.
`,
      examples: [
        `Input:  m = 3, n = 7
Output: 28`,
        `Input:  m = 3, n = 2
Output: 3`,
      ],
      constraints: ['1 <= m, n <= 100'],
      followUp: 'There is a closed-form binomial answer. Derive it, then trust the DP.',
      stub: `
export function uniquePaths(m: number, n: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 112,
      title: 'Longest Common Subsequence',
      slug: 'longest-common-subsequence',
      difficulty: 'Medium',
      leetcode: 'longest-common-subsequence',
      pattern: 'Classic two-sequence grid DP',
      complexity: 'O(n * m) time, O(min(n, m)) space',
      statement: `
Given two strings, return the length of their longest common subsequence — the longest
sequence of characters that appears in both, in order, without needing to be contiguous.
Return 0 when there is none.
`,
      examples: [
        `Input:  text1 = "abcde", text2 = "ace"
Output: 3          // "ace"`,
        `Input:  text1 = "abc", text2 = "abc"
Output: 3`,
        `Input:  text1 = "abc", text2 = "def"
Output: 0`,
      ],
      constraints: [
        '1 <= text1.length, text2.length <= 1000',
        'Both strings consist of lowercase English letters',
      ],
      followUp: 'Only the previous row is ever read. Shrink the table to two rows.',
      stub: `
export function longestCommonSubsequence(text1: string, text2: string): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 113,
      title: 'Best Time to Buy and Sell Stock with Cooldown',
      slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
      difficulty: 'Medium',
      leetcode: 'best-time-to-buy-and-sell-stock-with-cooldown',
      pattern: 'State machine: holding / free-to-buy / cooling down',
      complexity: 'O(n) time, O(1) space',
      statement: `
You may complete as many transactions as you like but never hold more than one share at a
time, and after selling you must wait one full day before buying again. Given daily prices,
return the maximum profit.
`,
      examples: [
        `Input:  prices = [1, 2, 3, 0, 2]
Output: 3          // buy, sell, cooldown, buy, sell`,
        `Input:  prices = [1]
Output: 0`,
      ],
      constraints: ['1 <= prices.length <= 5000', '0 <= prices[i] <= 1000'],
      followUp: 'Name the states before you write transitions. Three is enough.',
      stub: `
export function maxProfit(prices: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 114,
      title: 'Coin Change II',
      slug: 'coin-change-ii',
      difficulty: 'Medium',
      leetcode: 'coin-change-ii',
      pattern: 'Unbounded knapsack counting combinations',
      complexity: 'O(amount * coins) time, O(amount) space',
      statement: `
Given coin denominations and an amount, return how many distinct combinations of coins make
up that amount. Order does not matter, so 1 + 2 and 2 + 1 count once. You have an unlimited
number of each coin, and the answer fits in a signed 32-bit integer.
`,
      examples: [
        `Input:  amount = 5, coins = [1, 2, 5]
Output: 4          // 5; 2+2+1; 2+1+1+1; 1x5`,
        `Input:  amount = 3, coins = [2]
Output: 0`,
        `Input:  amount = 10, coins = [10]
Output: 1`,
      ],
      constraints: [
        '1 <= coins.length <= 300 with distinct values',
        '1 <= coins[i] <= 5000',
        '0 <= amount <= 5000',
      ],
      followUp:
        'Looping coins outside and amounts inside counts combinations; the other order counts permutations. Know which loop nesting you wrote.',
      stub: `
export function change(amount: number, coins: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 115,
      title: 'Target Sum',
      slug: 'target-sum',
      difficulty: 'Medium',
      leetcode: 'target-sum',
      pattern: 'Memoise on (index, running sum), or reduce to subset-sum',
      complexity: 'O(n * sum) time and space',
      statement: `
Put a '+' or a '-' in front of every number in nums and concatenate them into an expression.
Return how many different sign assignments produce the value target.
`,
      examples: [
        `Input:  nums = [1, 1, 1, 1, 1], target = 3
Output: 5`,
        `Input:  nums = [1], target = 1
Output: 1`,
      ],
      constraints: [
        '1 <= nums.length <= 20',
        '0 <= nums[i] <= 1000 and 0 <= sum(nums) <= 1000',
        '-1000 <= target <= 1000',
      ],
      followUp:
        'Choosing signs is the same as choosing a subset P to be positive. What must sum(P) equal?',
      stub: `
export function findTargetSumWays(nums: number[], target: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 116,
      title: 'Interleaving String',
      slug: 'interleaving-string',
      difficulty: 'Medium',
      leetcode: 'interleaving-string',
      pattern: 'Grid DP over consumed prefixes of s1 and s2',
      complexity: 'O(n * m) time, O(m) space',
      statement: `
Return true when s3 can be formed by interleaving s1 and s2 — taking characters from the two
strings in any alternation while preserving the internal order of each.
`,
      examples: [
        `Input:  s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true`,
        `Input:  s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
Output: false`,
        `Input:  s1 = "", s2 = "", s3 = ""
Output: true`,
      ],
      constraints: [
        '0 <= s1.length, s2.length <= 100 and 0 <= s3.length <= 200',
        'All strings consist of lowercase English letters',
      ],
      followUp: 'Check the lengths first — one line rejects most invalid inputs.',
      stub: `
export function isInterleave(s1: string, s2: string, s3: string): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 117,
      title: 'Longest Increasing Path in a Matrix',
      slug: 'longest-increasing-path-in-a-matrix',
      difficulty: 'Hard',
      leetcode: 'longest-increasing-path-in-a-matrix',
      pattern: 'DFS + memoisation on each cell (the grid is a DAG)',
      complexity: 'O(rows * cols) time and space',
      statement: `
Given an m x n integer matrix, return the length of the longest strictly increasing path.
You may move up, down, left or right, but never diagonally and never off the grid.
`,
      examples: [
        `Input:  matrix = [[9, 9, 4], [6, 6, 8], [2, 1, 1]]
Output: 4          // 1 -> 2 -> 6 -> 9`,
        `Input:  matrix = [[3, 4, 5], [3, 2, 6], [2, 2, 1]]
Output: 4          // 3 -> 4 -> 5 -> 6`,
        `Input:  matrix = [[1]]
Output: 1`,
      ],
      constraints: [
        'm === matrix.length, n === matrix[i].length',
        '1 <= m, n <= 200',
        '0 <= matrix[i][j] <= 2^31 - 1',
      ],
      followUp: 'Why does strict increase mean you never need a visited set?',
      stub: `
export function longestIncreasingPath(matrix: number[][]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 118,
      title: 'Distinct Subsequences',
      slug: 'distinct-subsequences',
      difficulty: 'Hard',
      leetcode: 'distinct-subsequences',
      pattern: 'Grid DP counting matches, skip-or-take on equal characters',
      complexity: 'O(n * m) time, O(m) space',
      statement: `
Given strings s and t, return how many distinct subsequences of s equal t. The answer fits
in a signed 32-bit integer.
`,
      examples: [
        `Input:  s = "rabbbit", t = "rabbit"
Output: 3`,
        `Input:  s = "babgbag", t = "bag"
Output: 5`,
      ],
      constraints: [
        '1 <= s.length, t.length <= 1000',
        'Both consist of English letters',
      ],
      followUp: 'When the characters match you have two choices, not one. Add both counts.',
      stub: `
export function numDistinct(s: string, t: string): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 119,
      title: 'Edit Distance',
      slug: 'edit-distance',
      difficulty: 'Medium',
      leetcode: 'edit-distance',
      pattern: 'Levenshtein grid: insert, delete, replace',
      complexity: 'O(n * m) time, O(m) space',
      statement: `
Given two words, return the minimum number of single-character insertions, deletions or
replacements needed to turn the first into the second.
`,
      examples: [
        `Input:  word1 = "horse", word2 = "ros"
Output: 3          // horse -> rorse -> rose -> ros`,
        `Input:  word1 = "intention", word2 = "execution"
Output: 5`,
      ],
      constraints: [
        '0 <= word1.length, word2.length <= 500',
        'Both consist of lowercase English letters',
      ],
      followUp: 'The base row and column are not zeros. What are they, and why?',
      stub: `
export function minDistance(word1: string, word2: string): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 120,
      title: 'Burst Balloons',
      slug: 'burst-balloons',
      difficulty: 'Hard',
      leetcode: 'burst-balloons',
      pattern: 'Interval DP on the LAST balloon burst in each range',
      complexity: 'O(n^3) time, O(n^2) space',
      statement: `
Each balloon carries a number. Bursting balloon i earns nums[left] * nums[i] * nums[right],
where left and right are its current neighbours; a missing neighbour counts as 1. After a
burst its neighbours become adjacent. Return the maximum coins from bursting all balloons.
`,
      examples: [
        `Input:  nums = [3, 1, 5, 8]
Output: 167`,
        `Input:  nums = [1, 5]
Output: 10`,
      ],
      constraints: [
        'n === nums.length and 1 <= n <= 300',
        '0 <= nums[i] <= 100',
      ],
      followUp:
        'Thinking about the first burst fails because the neighbours keep changing. Ask which balloon is burst last in a range instead.',
      stub: `
export function maxCoins(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 121,
      title: 'Regular Expression Matching',
      slug: 'regular-expression-matching',
      difficulty: 'Hard',
      leetcode: 'regular-expression-matching',
      pattern: 'Grid DP with a special case for x*',
      complexity: 'O(n * m) time and space',
      statement: `
Implement matching for '.' which matches any single character and '*' which matches zero or
more of the preceding element. The match must cover the entire input string, not just part
of it. Every '*' in p has a valid preceding character.
`,
      examples: [
        `Input:  s = "aa", p = "a"
Output: false`,
        `Input:  s = "aa", p = "a*"
Output: true`,
        `Input:  s = "ab", p = ".*"
Output: true       // "." repeated twice`,
      ],
      constraints: [
        '1 <= s.length <= 20 and 1 <= p.length <= 30',
        's contains lowercase letters only',
        "p contains lowercase letters plus '.' and '*'",
      ],
      followUp: "The x* case branches two ways: use zero copies, or consume one character and stay.",
      stub: `
export function isMatch(s: string, p: string): boolean {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
