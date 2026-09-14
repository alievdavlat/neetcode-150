export default {
  category: 'Backtracking',
  dir: '10-backtracking',
  intro: `
One template, nine costumes: choose, recurse, un-choose. What changes between problems is
only the candidate set at each level and the rule that kills duplicate branches. Sorting the
input first is what makes the duplicate rule expressible.
`,
  problems: [
    {
      n: 71,
      title: 'Subsets',
      slug: 'subsets',
      difficulty: 'Medium',
      leetcode: 'subsets',
      pattern: 'Include / exclude each element',
      complexity: 'O(n * 2^n) time, O(n) recursion depth',
      statement: `
Given an array of unique integers, return the power set — every possible subset. No subset
may repeat, and the order of subsets does not matter.
`,
      examples: [
        `Input:  nums = [1, 2, 3]
Output: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]`,
        `Input:  nums = [0]
Output: [[], [0]]`,
      ],
      constraints: [
        '1 <= nums.length <= 10',
        '-10 <= nums[i] <= 10',
        'All values are unique',
      ],
      followUp: 'There is a bitmask version with no recursion at all.',
      stub: `
export function subsets(nums: number[]): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 72,
      title: 'Combination Sum',
      slug: 'combination-sum',
      difficulty: 'Medium',
      leetcode: 'combination-sum',
      pattern: 'Backtracking with reuse — recurse on the same index',
      complexity: 'O(n^(target / min)) time',
      statement: `
Given an array of distinct integers candidates and a target, return every unique
combination that sums to target. The same number may be chosen any number of times, and two
combinations are different when the multiset of chosen numbers differs. Fewer than 150
combinations exist for every test case.
`,
      examples: [
        `Input:  candidates = [2, 3, 6, 7], target = 7
Output: [[2, 2, 3], [7]]`,
        `Input:  candidates = [2, 3, 5], target = 8
Output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]`,
        `Input:  candidates = [2], target = 1
Output: []`,
      ],
      constraints: [
        '1 <= candidates.length <= 30',
        '2 <= candidates[i] <= 40 and all values are distinct',
        '1 <= target <= 40',
      ],
      followUp: 'What stops [2,3,3] and [3,2,3] from both appearing?',
      stub: `
export function combinationSum(candidates: number[], target: number): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 73,
      title: 'Permutations',
      slug: 'permutations',
      difficulty: 'Medium',
      leetcode: 'permutations',
      pattern: 'Swap-in-place or a used[] mask',
      complexity: 'O(n * n!) time',
      statement: `
Given an array of distinct integers, return every possible ordering of them. The
permutations may be returned in any order.
`,
      examples: [
        `Input:  nums = [1, 2, 3]
Output: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]`,
        `Input:  nums = [0, 1]
Output: [[0,1], [1,0]]`,
        `Input:  nums = [1]
Output: [[1]]`,
      ],
      constraints: [
        '1 <= nums.length <= 6',
        '-10 <= nums[i] <= 10 and all values are unique',
      ],
      stub: `
export function permute(nums: number[]): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 74,
      title: 'Subsets II',
      slug: 'subsets-ii',
      difficulty: 'Medium',
      leetcode: 'subsets-ii',
      pattern: 'Sort, then skip a duplicate at the same recursion level',
      complexity: 'O(n * 2^n) time',
      statement: `
Given an integer array that may contain duplicates, return all possible subsets. The result
must contain no duplicate subset, in any order.
`,
      examples: [
        `Input:  nums = [1, 2, 2]
Output: [[], [1], [1,2], [1,2,2], [2], [2,2]]`,
        `Input:  nums = [0]
Output: [[], [0]]`,
      ],
      constraints: [
        '1 <= nums.length <= 10',
        '-10 <= nums[i] <= 10',
      ],
      followUp: 'The duplicate rule is one line — and it is wrong if you sort after recursing.',
      stub: `
export function subsetsWithDup(nums: number[]): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 75,
      title: 'Combination Sum II',
      slug: 'combination-sum-ii',
      difficulty: 'Medium',
      leetcode: 'combination-sum-ii',
      pattern: 'Sort + skip duplicates + each candidate used at most once',
      complexity: 'O(2^n) time',
      statement: `
Given a collection of candidate numbers that may contain duplicates and a target, find all
unique combinations summing to target. Each number in candidates may be used at most once
per combination, and the result must not contain duplicate combinations.
`,
      examples: [
        `Input:  candidates = [10, 1, 2, 7, 6, 1, 5], target = 8
Output: [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]`,
        `Input:  candidates = [2, 5, 2, 1, 2], target = 5
Output: [[1, 2, 2], [5]]`,
      ],
      constraints: [
        '1 <= candidates.length <= 100',
        '1 <= candidates[i] <= 50',
        '1 <= target <= 30',
      ],
      followUp: 'Two nearly identical off-by-one traps: index + 1 versus index, i > start versus i > 0.',
      stub: `
export function combinationSum2(candidates: number[], target: number): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 76,
      title: 'Word Search',
      slug: 'word-search',
      difficulty: 'Medium',
      leetcode: 'word-search',
      pattern: 'Grid DFS with in-place visited marking',
      complexity: 'O(rows * cols * 4^len) time, O(len) space',
      statement: `
Given an m x n grid of characters and a word, return true when the word can be spelled by
walking through horizontally or vertically adjacent cells. The same cell may not be used
more than once within a single attempt.
`,
      examples: [
        `Input:  board = [["A","B","C","E"], ["S","F","C","S"], ["A","D","E","E"]],
        word = "ABCCED"
Output: true`,
        `Input:  same board, word = "SEE"
Output: true`,
        `Input:  same board, word = "ABCB"
Output: false      // the B would have to be reused`,
      ],
      constraints: [
        'm === board.length, n === board[i].length',
        '1 <= m, n <= 6 and 1 <= word.length <= 15',
        'board and word consist of English letters',
      ],
      followUp: 'Can you prune early using a character count of the whole board?',
      stub: `
export function exist(board: string[][], word: string): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 77,
      title: 'Palindrome Partitioning',
      slug: 'palindrome-partitioning',
      difficulty: 'Medium',
      leetcode: 'palindrome-partitioning',
      pattern: 'Backtrack over cut positions, test each prefix',
      complexity: 'O(n * 2^n) time',
      statement: `
Given a string s, partition it so that every part is a palindrome, and return all possible
partitionings.
`,
      examples: [
        `Input:  s = "aab"
Output: [["a", "a", "b"], ["aa", "b"]]`,
        `Input:  s = "a"
Output: [["a"]]`,
      ],
      constraints: [
        '1 <= s.length <= 16',
        's contains only lowercase English letters',
      ],
      followUp: 'Precomputing an isPalindrome table turns the check from O(n) into O(1).',
      stub: `
export function partition(s: string): string[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 78,
      title: 'Letter Combinations of a Phone Number',
      slug: 'letter-combinations-of-a-phone-number',
      difficulty: 'Medium',
      leetcode: 'letter-combinations-of-a-phone-number',
      pattern: 'Backtracking over a digit -> letters map',
      complexity: 'O(4^n) time',
      statement: `
Given a string of digits from 2 to 9, return every letter combination the number could
spell on a classic phone keypad (2 = abc, 3 = def, ..., 7 = pqrs, 8 = tuv, 9 = wxyz). An
empty input returns an empty list; the answers may be in any order.
`,
      examples: [
        `Input:  digits = "23"
Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]`,
        `Input:  digits = ""
Output: []`,
        `Input:  digits = "2"
Output: ["a", "b", "c"]`,
      ],
      constraints: [
        '0 <= digits.length <= 4',
        "digits[i] is a character in the range '2'-'9'",
      ],
      stub: `
export function letterCombinations(digits: string): string[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 79,
      title: 'N-Queens',
      slug: 'n-queens',
      difficulty: 'Hard',
      leetcode: 'n-queens',
      pattern: 'Row-by-row placement with column and diagonal sets',
      complexity: 'O(n!) time, O(n) space',
      statement: `
Place n queens on an n x n board so that no two attack each other, and return every distinct
solution. Each solution is a list of n strings where 'Q' marks a queen and '.' an empty
square.
`,
      examples: [
        `Input:  n = 4
Output: [[".Q..", "...Q", "Q...", "..Q."],
         ["..Q.", "Q...", "...Q", ".Q.."]]`,
        `Input:  n = 1
Output: [["Q"]]`,
      ],
      constraints: ['1 <= n <= 9'],
      followUp:
        'Two queens share a diagonal when row - col matches, or an anti-diagonal when row + col matches. Both are O(1) lookups.',
      stub: `
export function solveNQueens(n: number): string[][] {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
