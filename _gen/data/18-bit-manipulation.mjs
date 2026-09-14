export default {
  category: 'Bit Manipulation',
  dir: '18-bit-manipulation',
  intro: `
Short problems, sharp edges. In JavaScript the bitwise operators coerce to signed 32-bit
integers and >> keeps the sign while >>> does not — most of the bugs in this section are
that one distinction. Keep a truth table for XOR and for n & (n - 1) within reach.
`,
  problems: [
    {
      n: 144,
      title: 'Single Number',
      slug: 'single-number',
      difficulty: 'Easy',
      leetcode: 'single-number',
      pattern: 'XOR cancels every pair',
      complexity: 'O(n) time, O(1) space',
      statement: `
Every element of nums appears twice except one, which appears once. Return that element in
linear time using only constant extra space.
`,
      examples: [
        `Input:  nums = [2, 2, 1]
Output: 1`,
        `Input:  nums = [4, 1, 2, 1, 2]
Output: 4`,
        `Input:  nums = [1]
Output: 1`,
      ],
      constraints: [
        '1 <= nums.length <= 3 * 10^4',
        '-3 * 10^4 <= nums[i] <= 3 * 10^4',
        'Every element appears twice except one',
      ],
      followUp: 'Two properties of XOR do all the work here. Name them.',
      stub: `
export function singleNumber(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 145,
      title: 'Number of 1 Bits',
      slug: 'number-of-1-bits',
      difficulty: 'Easy',
      leetcode: 'number-of-1-bits',
      pattern: 'n & (n - 1) clears the lowest set bit',
      complexity: 'O(set bits) time, O(1) space',
      statement: `
Return the number of set bits in the binary representation of a 32-bit unsigned integer —
its Hamming weight.
`,
      examples: [
        `Input:  n = 11        // 0000...1011
Output: 3`,
        `Input:  n = 128       // 0000...10000000
Output: 1`,
        `Input:  n = 2147483645
Output: 30`,
      ],
      constraints: ['1 <= n <= 2^31 - 1'],
      followUp: 'Looping 32 times always works. Looping once per set bit is better — how?',
      stub: `
export function hammingWeight(n: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 146,
      title: 'Counting Bits',
      slug: 'counting-bits',
      difficulty: 'Easy',
      leetcode: 'counting-bits',
      pattern: 'dp[i] = dp[i >> 1] + (i & 1)',
      complexity: 'O(n) time, O(1) extra space',
      statement: `
Given an integer n, return an array of length n + 1 where the ith entry is the number of set
bits in i.
`,
      examples: [
        `Input:  n = 2
Output: [0, 1, 1]`,
        `Input:  n = 5
Output: [0, 1, 1, 2, 1, 2]`,
      ],
      constraints: ['0 <= n <= 10^5'],
      followUp: 'Can you do it in one pass without calling a popcount routine per number?',
      stub: `
export function countBits(n: number): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 147,
      title: 'Reverse Bits',
      slug: 'reverse-bits',
      difficulty: 'Easy',
      leetcode: 'reverse-bits',
      pattern: 'Shift out of the input, shift into the output, 32 times',
      complexity: 'O(1) time, O(1) space',
      statement: `
Reverse the bits of a given 32-bit unsigned integer and return the result as an unsigned
value.
`,
      examples: [
        `Input:  n = 43261596      // 00000010100101000001111010011100
Output: 964176192         // 00111001011110000010100101000000`,
        `Input:  n = 2147483644
Output: 1073741822`,
      ],
      constraints: ['The input is a 32-bit unsigned integer'],
      followUp:
        'In JavaScript the result must be coerced back to unsigned with >>> 0, or you get a negative number.',
      stub: `
export function reverseBits(n: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 148,
      title: 'Missing Number',
      slug: 'missing-number',
      difficulty: 'Easy',
      leetcode: 'missing-number',
      pattern: 'XOR of indices and values (or the Gauss sum)',
      complexity: 'O(n) time, O(1) space',
      statement: `
nums holds n distinct numbers taken from the range [0, n]. Return the one number in that
range that is missing.
`,
      examples: [
        `Input:  nums = [3, 0, 1]
Output: 2`,
        `Input:  nums = [0, 1]
Output: 2`,
        `Input:  nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]
Output: 8`,
      ],
      constraints: [
        'n === nums.length and 1 <= n <= 10^4',
        '0 <= nums[i] <= n with all values distinct',
      ],
      followUp: 'Two O(n) answers with O(1) space. One of them cannot overflow — which?',
      stub: `
export function missingNumber(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 149,
      title: 'Sum of Two Integers',
      slug: 'sum-of-two-integers',
      difficulty: 'Medium',
      leetcode: 'sum-of-two-integers',
      pattern: 'XOR is the sum without carry; AND << 1 is the carry',
      complexity: 'O(1) time, O(1) space',
      statement: `
Return the sum of two integers a and b without using the + or - operators.
`,
      examples: [
        `Input:  a = 1, b = 2
Output: 3`,
        `Input:  a = 2, b = 3
Output: 5`,
        `Input:  a = -1, b = 1
Output: 0`,
      ],
      constraints: ['-1000 <= a, b <= 1000'],
      followUp: 'Loop until the carry is zero. Negative numbers work for free in two-complement.',
      stub: `
export function getSum(a: number, b: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 150,
      title: 'Reverse Integer',
      slug: 'reverse-integer',
      difficulty: 'Medium',
      leetcode: 'reverse-integer',
      pattern: 'Pop the last digit, push it, check the 32-bit bound before pushing',
      complexity: 'O(log n) time, O(1) space',
      statement: `
Reverse the digits of a signed 32-bit integer, keeping the sign. Return 0 when the reversed
value falls outside the signed 32-bit range. Assume the environment cannot store 64-bit
integers.
`,
      examples: [
        `Input:  x = 123
Output: 321`,
        `Input:  x = -123
Output: -321`,
        `Input:  x = 120
Output: 21`,
      ],
      constraints: ['-2^31 <= x <= 2^31 - 1'],
      followUp:
        'The overflow check has to happen before the multiplication, not after — otherwise you are testing a value you already lost.',
      stub: `
export function reverse(x: number): number {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
