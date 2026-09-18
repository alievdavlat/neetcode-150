export default {
  category: 'Two Pointers',
  dir: '02-two-pointers',
  intro: `
Two indices walking a sorted or symmetric structure. The whole trick is the invariant: at
every step you must be able to prove that moving one pointer can never discard the answer.
Write that proof down before you write the loop.
`,
  problems: [
    {
      n: 10,
      title: 'Valid Palindrome',
      slug: 'valid-palindrome',
      difficulty: 'Easy',
      leetcode: 'valid-palindrome',
      pattern: 'Pointers from both ends, skipping non-alphanumerics',
      complexity: 'O(n) time, O(1) space',
      statement: `
A phrase is a palindrome when, after dropping every non-alphanumeric character and
lowercasing the rest, it reads the same forwards and backwards. Given a string s, return
true when it is a palindrome.
`,
      examples: [
        `Input:  s = "A man, a plan, a canal: Panama"
Output: true       // normalises to "amanaplanacanalpanama"`,
        `Input:  s = "race a car"
Output: false      // normalises to "raceacar"`,
        `Input:  s = " "
Output: true       // an empty string is a palindrome`,
      ],
      constraints: [
        '1 <= s.length <= 2 * 10^5',
        's consists of printable ASCII characters',
      ],
      followUp: 'Solve it without building a cleaned copy of the string.',
      stub: `
export function isPalindrome(s: string): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 11,
      title: 'Two Sum II - Input Array Is Sorted',
      slug: 'two-sum-ii-input-array-is-sorted',
      difficulty: 'Medium',
      leetcode: 'two-sum-ii-input-array-is-sorted',
      pattern: 'Converging pointers on a sorted array',
      complexity: 'O(n) time, O(1) space',
      statement: `
Given a 1-indexed array numbers sorted in non-decreasing order, find the two numbers that
add up to target and return their 1-based indices as [index1, index2] with
index1 < index2. Exactly one solution exists, you may not use the same element twice, and
you must use only constant extra space.
`,
      examples: [
        `Input:  numbers = [2, 7, 11, 15], target = 9
Output: [1, 2]`,
        `Input:  numbers = [2, 3, 4], target = 6
Output: [1, 3]`,
        `Input:  numbers = [-1, 0], target = -1
Output: [1, 2]`,
      ],
      constraints: [
        '2 <= numbers.length <= 3 * 10^4',
        '-1000 <= numbers[i] <= 1000',
        'numbers is sorted in non-decreasing order',
        'Exactly one solution exists',
        'Constant extra space only — a hash map is not allowed',
      ],
      stub: `
export function twoSum(numbers: number[], target: number): [number, number] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 12,
      title: '3Sum',
      slug: '3sum',
      difficulty: 'Medium',
      leetcode: '3sum',
      pattern: 'Sort, then fix one number and run two pointers',
      complexity: 'O(n^2) time, O(1) extra space (sort excluded)',
      statement: `
Given an integer array nums, return every unique triplet [nums[i], nums[j], nums[k]] with
distinct indices i, j, k that sums to zero. The result must not contain duplicate
triplets; the order of the triplets and of the values inside them does not matter.
`,
      examples: [
        `Input:  nums = [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]`,
        `Input:  nums = [0, 1, 1]
Output: []`,
        `Input:  nums = [0, 0, 0]
Output: [[0, 0, 0]]`,
      ],
      constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
      followUp: 'Skipping duplicates is the whole problem — do it without a Set of strings.',
      stub: `
export function threeSum(nums: number[]): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 13,
      title: 'Container With Most Water',
      slug: 'container-with-most-water',
      difficulty: 'Medium',
      leetcode: 'container-with-most-water',
      pattern: 'Greedy two pointers — always move the shorter wall',
      complexity: 'O(n) time, O(1) space',
      statement: `
Each element of height is the height of a vertical line drawn at that index. Pick two
lines so that the container they form with the x-axis holds the most water, and return
that maximum area. The container may not be tilted, so the area is the distance between
the two lines times the shorter of the two heights.
`,
      examples: [
        `Input:  height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
Output: 49         // lines at index 1 and 8: min(8, 7) * (8 - 1)`,
        `Input:  height = [1, 1]
Output: 1`,
      ],
      constraints: [
        'n === height.length',
        '2 <= n <= 10^5',
        '0 <= height[i] <= 10^4',
      ],
      followUp: 'Why is it always safe to discard the shorter of the two current walls?',
      stub: `
export function maxArea(height: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 14,
      title: 'Trapping Rain Water',
      slug: 'trapping-rain-water',
      difficulty: 'Hard',
      leetcode: 'trapping-rain-water',
      pattern: 'Two pointers carrying running left/right maxima',
      complexity: 'O(n) time, O(1) space',
      statement: `
Given n non-negative integers where height[i] is the elevation at index i and every bar is
1 wide, compute how much rain water the elevation map traps after it rains. Water above a
bar is bounded by the tallest bar to its left and the tallest bar to its right.
`,
      examples: [
        `Input:  height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
Output: 6`,
        `Input:  height = [4, 2, 0, 3, 2, 5]
Output: 9`,
      ],
      constraints: [
        'n === height.length',
        '1 <= n <= 2 * 10^4',
        '0 <= height[i] <= 10^5',
      ],
      followUp:
        'The prefix/suffix-max arrays are the easy version. Can you drop both arrays and keep O(1) space?',
      stub: `
export function trap(height: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 154,
      title: 'Sort Colors',
      slug: 'sort-colors',
      difficulty: 'Medium',
      leetcode: 'sort-colors',
      pattern: 'Dutch national flag: a low, a high and a cursor between them',
      complexity: 'O(n) time, O(1) space',
      statement: `
nums holds only the values 0, 1 and 2. Rearrange it in place so every 0 comes first, then
every 1, then every 2. Do it in a single pass without calling a library sort. The function
returns nothing - change the array itself.
`,
      examples: [
        `Input:  nums = [2, 0, 2, 1, 1, 0]
Output: [0, 0, 1, 1, 2, 2]`,
        `Input:  nums = [2, 0, 1]
Output: [0, 1, 2]`,
        `Input:  nums = [0]
Output: [0]`,
      ],
      constraints: [
        '1 <= nums.length <= 300',
        'nums[i] is 0, 1 or 2',
      ],
      followUp: 'Counting each value and rewriting takes two passes. One pass needs three pointers.',
      stub: `
export function sortColors(nums: number[]): void {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
