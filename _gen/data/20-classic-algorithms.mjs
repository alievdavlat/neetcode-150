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
    {
      n: 160,
      title: 'Copy Overlapping Range',
      slug: 'copy-overlapping-range',
      difficulty: 'Medium',
      source: 'Classic algorithm',
      pattern: 'Choose the copy direction from the overlap',
      complexity: 'O(count) time, O(1) space',
      statement: `
Copy count elements of data, starting at index from, to index to. The ranges may overlap,
and the result must be what a copy through a scratch buffer would give - so a naive loop
forward can read a value it has already written. Change data in place and return it.
This is memmove, and getting it wrong is the classic C bug.
`,
      examples: [
        `Input:  data = [1, 2, 3, 4, 5, 6], to = 2, from = 0, count = 3
Output: [1, 2, 1, 2, 3, 6]     // copying forward would give [1, 2, 1, 2, 1, 6]`,
        `Input:  data = [1, 2, 3, 4, 5, 6], to = 0, from = 2, count = 3
Output: [3, 4, 5, 4, 5, 6]`,
        `Input:  data = [1, 2, 3], to = 0, from = 0, count = 0
Output: [1, 2, 3]`,
      ],
      constraints: [
        '0 <= data.length <= 10^5',
        '0 <= to, from <= data.length',
        '0 <= count <= data.length - max(to, from)',
      ],
      followUp: 'Which way round do you walk when the destination sits after the source, and why the other way when it sits before?',
      stub: `
export function copyRange(data: number[], to: number, from: number, count: number): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 161,
      title: 'Rotate In Place',
      slug: 'rotate-in-place',
      difficulty: 'Medium',
      source: 'Classic algorithm',
      pattern: 'Reverse the whole, then reverse each part',
      complexity: 'O(n) time, O(1) space',
      statement: `
Rotate nums to the right by k steps, using no extra array. k may be larger than the
length. Change nums in place and return it.
`,
      examples: [
        `Input:  nums = [1, 2, 3, 4, 5, 6, 7], k = 3
Output: [5, 6, 7, 1, 2, 3, 4]`,
        `Input:  nums = [1, 2], k = 3
Output: [2, 1]         // three steps over two elements is one step`,
        `Input:  nums = [1], k = 0
Output: [1]`,
      ],
      constraints: [
        '1 <= nums.length <= 10^5',
        '0 <= k <= 10^9',
      ],
      followUp: 'Reversing three times touches every element twice. The cycle-following version touches each once - can you write it?',
      stub: `
export function rotate(nums: number[], k: number): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 162,
      title: 'Swap Byte Order',
      slug: 'swap-byte-order',
      difficulty: 'Easy',
      source: 'Classic algorithm',
      pattern: 'Mask one byte at a time and shift it home',
      complexity: 'O(1) time, O(1) space',
      statement: `
Read value as a 32-bit unsigned integer and return it with its four bytes in the opposite
order. This is what a machine does when it reads a number written by a machine of the
other endianness.
`,
      examples: [
        `Input:  value = 1
Output: 16777216       // 0x00000001 becomes 0x01000000`,
        `Input:  value = 305419896
Output: 2018915346     // 0x12345678 becomes 0x78563412`,
        `Input:  value = 0
Output: 0`,
      ],
      constraints: ['0 <= value <= 2^32 - 1'],
      followUp: 'JavaScript bit operators work on signed 32-bit integers, so the last step needs the unsigned shift. Which one, and why?',
      stub: `
export function swapBytes(value: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 163,
      title: 'Align Up',
      slug: 'align-up',
      difficulty: 'Easy',
      source: 'Classic algorithm',
      pattern: 'A power of two masks the bits below it',
      complexity: 'O(1) time, O(1) space',
      statement: `
Return the smallest multiple of alignment that is not less than offset. alignment is always
a power of two. Every allocator starts here: a value has to sit on an address its type can
be read from.
`,
      examples: [
        `Input:  offset = 13, alignment = 8
Output: 16`,
        `Input:  offset = 16, alignment = 8
Output: 16         // already aligned, so it does not move`,
        `Input:  offset = 0, alignment = 4
Output: 0`,
      ],
      constraints: [
        '0 <= offset <= 2^31 - 1',
        'alignment is a power of two, 1 <= alignment <= 2^16',
      ],
      followUp: 'There is a version with no division and no branch, using only alignment - 1. Find it.',
      stub: `
export function alignUp(offset: number, alignment: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 164,
      title: 'Bump Allocator',
      slug: 'bump-allocator',
      difficulty: 'Medium',
      source: 'Classic algorithm',
      pattern: 'One cursor, aligned before every handout',
      complexity: 'O(n) time, O(1) space',
      statement: `
Hand out capacity bytes to the requests in sizes, in order. Each block starts at the next
offset that is aligned to alignment, and the cursor moves to the end of the block it just
gave out. A request that would run past capacity gets -1 and leaves the cursor where it
was, so a later smaller request can still be served. Return the offset given to each
request.
`,
      examples: [
        `Input:  capacity = 64, sizes = [10, 10, 10], alignment = 8
Output: [0, 16, 32]        // 10 rounds up to 16, then 26 rounds up to 32`,
        `Input:  capacity = 20, sizes = [10, 10], alignment = 8
Output: [0, -1]            // the second would end at 26, past 20`,
        `Input:  capacity = 8, sizes = [], alignment = 4
Output: []`,
      ],
      constraints: [
        '0 <= capacity <= 2^31 - 1',
        '0 <= sizes.length <= 10^4',
        '0 <= sizes[i] <= capacity',
        'alignment is a power of two, 1 <= alignment <= 4096',
      ],
      followUp: 'This allocator can never free one block. What would you have to record to be able to?',
      stub: `
export function allocate(capacity: number, sizes: number[], alignment: number): number[] {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
