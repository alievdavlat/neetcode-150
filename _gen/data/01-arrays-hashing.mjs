export default {
  category: 'Arrays & Hashing',
  dir: '01-arrays-hashing',
  intro: `
The foundation section. Almost every problem here trades memory for time: a hash map or
hash set turns a nested scan into a single pass. Learn to spot the moment a lookup should
stop being a search.
`,
  problems: [
    {
      n: 1,
      title: 'Contains Duplicate',
      slug: 'contains-duplicate',
      difficulty: 'Easy',
      leetcode: 'contains-duplicate',
      pattern: 'Hash set',
      complexity: 'O(n) time, O(n) space',
      statement: `
Given an integer array nums, return true when any value shows up at least twice, and
false when every element is distinct.
`,
      examples: [
        `Input:  nums = [1, 2, 3, 1]
Output: true       // 1 appears twice`,
        `Input:  nums = [1, 2, 3, 4]
Output: false      // every value is unique`,
        `Input:  nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]
Output: true`,
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
      stub: `
export function containsDuplicate(nums: number[]): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 2,
      title: 'Valid Anagram',
      slug: 'valid-anagram',
      difficulty: 'Easy',
      leetcode: 'valid-anagram',
      pattern: 'Character frequency count',
      complexity: 'O(n) time, O(1) space (26 letters)',
      statement: `
Given two strings s and t, return true when t is an anagram of s — the same characters in
the same quantities, only reordered.
`,
      examples: [
        `Input:  s = "anagram", t = "nagaram"
Output: true`,
        `Input:  s = "rat", t = "car"
Output: false`,
      ],
      constraints: [
        '1 <= s.length, t.length <= 5 * 10^4',
        's and t consist of lowercase English letters',
      ],
      followUp: 'What changes if the inputs may contain Unicode characters?',
      stub: `
export function isAnagram(s: string, t: string): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 3,
      title: 'Two Sum',
      slug: 'two-sum',
      difficulty: 'Easy',
      leetcode: 'two-sum',
      pattern: 'Hash map of value -> index, one pass',
      complexity: 'O(n) time, O(n) space',
      statement: `
Given an array of integers nums and an integer target, return the indices of the two
numbers that add up to target. Exactly one valid answer exists, and you may not reuse the
same element twice. The order of the two returned indices does not matter.
`,
      examples: [
        `Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]     // nums[0] + nums[1] === 9`,
        `Input:  nums = [3, 2, 4], target = 6
Output: [1, 2]`,
        `Input:  nums = [3, 3], target = 6
Output: [0, 1]`,
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Exactly one valid answer exists',
      ],
      followUp: 'Can you do it in one pass instead of two?',
      stub: `
export function twoSum(nums: number[], target: number): [number, number] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 4,
      title: 'Group Anagrams',
      slug: 'group-anagrams',
      difficulty: 'Medium',
      leetcode: 'group-anagrams',
      pattern: 'Hash map keyed by a canonical form of the word',
      complexity: 'O(n * k) time with a count key, O(n * k) space',
      statement: `
Given an array of strings, group the anagrams together. Return the groups in any order,
and the strings inside each group in any order.
`,
      examples: [
        `Input:  strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]`,
        `Input:  strs = [""]
Output: [[""]]`,
        `Input:  strs = ["a"]
Output: [["a"]]`,
      ],
      constraints: [
        '1 <= strs.length <= 10^4',
        '0 <= strs[i].length <= 100',
        'strs[i] consists of lowercase English letters',
      ],
      followUp: 'Sorting each word is O(k log k) per word. What key avoids the sort?',
      stub: `
export function groupAnagrams(strs: string[]): string[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 5,
      title: 'Top K Frequent Elements',
      slug: 'top-k-frequent-elements',
      difficulty: 'Medium',
      leetcode: 'top-k-frequent-elements',
      pattern: 'Frequency map + bucket sort (or a size-k heap)',
      complexity: 'O(n) time with bucket sort, O(n) space',
      statement: `
Given an integer array nums and an integer k, return the k most frequent elements. The
answer may be returned in any order, and it is guaranteed to be unique.
`,
      examples: [
        `Input:  nums = [1, 1, 1, 2, 2, 3], k = 2
Output: [1, 2]`,
        `Input:  nums = [1], k = 1
Output: [1]`,
      ],
      constraints: [
        '1 <= nums.length <= 10^5',
        '-10^4 <= nums[i] <= 10^4',
        'k is in the range [1, number of distinct elements]',
        'The answer is guaranteed to be unique',
      ],
      followUp: 'The expected complexity is better than O(n log n) — no full sort.',
      stub: `
export function topKFrequent(nums: number[], k: number): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 6,
      title: 'Product of Array Except Self',
      slug: 'product-of-array-except-self',
      difficulty: 'Medium',
      leetcode: 'product-of-array-except-self',
      pattern: 'Prefix product pass + suffix product pass',
      complexity: 'O(n) time, O(1) extra space (output excluded)',
      statement: `
Given an integer array nums, return an array answer where answer[i] is the product of
every element of nums except nums[i]. Every product is guaranteed to fit in a 32-bit
integer. You must solve it without division and in O(n) time.
`,
      examples: [
        `Input:  nums = [1, 2, 3, 4]
Output: [24, 12, 8, 6]`,
        `Input:  nums = [-1, 1, 0, -3, 3]
Output: [0, 0, 9, 0, 0]`,
      ],
      constraints: [
        '2 <= nums.length <= 10^5',
        '-30 <= nums[i] <= 30',
        'Every prefix/suffix product fits in a 32-bit integer',
        'The division operator is not allowed',
      ],
      followUp: 'Can you use O(1) extra space, treating the output array as free?',
      stub: `
export function productExceptSelf(nums: number[]): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 7,
      title: 'Valid Sudoku',
      slug: 'valid-sudoku',
      difficulty: 'Medium',
      leetcode: 'valid-sudoku',
      pattern: 'Three sets of hash sets: rows, columns, 3x3 boxes',
      complexity: 'O(1) time and space (fixed 9x9 board)',
      statement: `
Given a 9 x 9 Sudoku board, decide whether the filled cells are valid. Only the cells that
already carry a digit need to be checked, and the board does not have to be solvable. A
board is valid when each row, each column, and each of the nine 3 x 3 sub-boxes contains
the digits 1-9 without repetition. Empty cells are written as '.'.
`,
      examples: [
        `Input:  a board whose first row is ["5","3",".",".","7",".",".",".","."]
        and the rest is a standard puzzle
Output: true`,
        `Input:  the same board with the top-left 5 changed to 8
Output: false     // two 8s now share the top-left 3x3 box`,
      ],
      constraints: [
        'board.length === 9 and board[i].length === 9',
        "board[i][j] is a digit '1'-'9' or '.'",
      ],
      followUp: 'Can you validate all three constraints in a single pass over the board?',
      stub: `
export function isValidSudoku(board: string[][]): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 8,
      title: 'Encode and Decode Strings',
      slug: 'encode-and-decode-strings',
      difficulty: 'Medium',
      leetcode: 'encode-and-decode-strings',
      pattern: 'Length-prefixed serialization',
      complexity: 'O(n) time for both directions, O(n) space',
      statement: `
Design an algorithm that turns a list of strings into one string and back again. Implement
encode(strs) and decode(str) so that decode(encode(strs)) returns the original list. The
strings may contain any character, including whatever delimiter you are tempted to use —
so a plain join on a separator is not enough.
`,
      examples: [
        `Input:  ["neet", "code", "love", "you"]
Output: ["neet", "code", "love", "you"]     // after a round trip`,
        `Input:  ["we", "say", ":", "yes"]
Output: ["we", "say", ":", "yes"]           // ':' must survive the round trip`,
      ],
      constraints: [
        '0 <= strs.length < 100',
        '0 <= strs[i].length < 200',
        'strs[i] may contain any ASCII character',
      ],
      followUp: 'Your encoding must be stateless — decode gets only the encoded string.',
      stub: `
export function encode(strs: string[]): string {
  throw new Error('Not implemented');
}

export function decode(str: string): string[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 9,
      title: 'Longest Consecutive Sequence',
      slug: 'longest-consecutive-sequence',
      difficulty: 'Medium',
      leetcode: 'longest-consecutive-sequence',
      pattern: 'Hash set + only walk up from sequence starts',
      complexity: 'O(n) time, O(n) space',
      statement: `
Given an unsorted array of integers nums, return the length of the longest run of
consecutive integers it contains. The elements do not have to be adjacent in the array.
You must solve it in O(n) time, which rules out sorting.
`,
      examples: [
        `Input:  nums = [100, 4, 200, 1, 3, 2]
Output: 4          // the run 1, 2, 3, 4`,
        `Input:  nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
Output: 9          // 0 through 8`,
        `Input:  nums = []
Output: 0`,
      ],
      constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
      followUp: 'How do you recognise that a number starts a run without scanning twice?',
      stub: `
export function longestConsecutive(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
