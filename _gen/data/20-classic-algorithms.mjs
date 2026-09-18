export default {
  category: 'Classic Algorithms',
  dir: '20-classic-algorithms',
  intro: `
The algorithms every other section quietly calls into. Nothing here is a puzzle - the work
is writing the routine correctly from memory, with the boundary cases that the library
version hides from you.
`,
  problems: [
    {
      n: 158,
      title: 'Merge Sort',
      slug: 'merge-sort',
      difficulty: 'Medium',
      source: 'Classic algorithm',
      pattern: 'Split in half, sort each half, merge with two pointers',
      complexity: 'O(n log n) time, O(n) space',
      statement: `
Sort an array of integers ascending by splitting it in half, sorting each half the same
way, and merging the two sorted halves. Return a new array and leave the input alone. Do
not call the built-in sort.
`,
      examples: [
        `Input:  nums = [5, 2, 3, 1]
Output: [1, 2, 3, 5]`,
        `Input:  nums = [5, 1, 1, 2, 0, 0]
Output: [0, 0, 1, 1, 2, 5]`,
        `Input:  nums = []
Output: []`,
      ],
      constraints: [
        '0 <= nums.length <= 5 * 10^4',
        '-10^5 <= nums[i] <= 10^5',
      ],
      followUp: 'Keep it stable: when two values are equal, the one that was first must stay first.',
      stub: `
export function mergeSort(nums: number[]): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 159,
      title: 'Integer Square Root',
      slug: 'integer-square-root',
      difficulty: 'Easy',
      source: 'Classic algorithm',
      pattern: 'Binary search the answer, not the input',
      complexity: 'O(log n) time, O(1) space',
      statement: `
Given a non-negative integer n, return the largest integer r for which r * r is at most n.
In other words, the square root rounded down. Do it without Math.sqrt.
`,
      examples: [
        `Input:  n = 4
Output: 2`,
        `Input:  n = 8
Output: 2         // 3 * 3 is already past 8`,
        `Input:  n = 0
Output: 0`,
      ],
      constraints: ['0 <= n <= 2^31 - 1'],
      followUp: 'The answer is never above n / 2 + 1, which is a tighter upper bound to search from.',
      stub: `
export function integerSqrt(n: number): number {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
