export default {
  category: 'Math & Geometry',
  dir: '17-math-geometry',
  intro: `
Simulation with an index-arithmetic trap in almost every one. The matrix problems reward
drawing a 4x4 grid and labelling the coordinates by hand; the numeric ones reward knowing
what overflows and where.
`,
  problems: [
    {
      n: 136,
      title: 'Rotate Image',
      slug: 'rotate-image',
      difficulty: 'Medium',
      leetcode: 'rotate-image',
      pattern: 'Transpose, then reverse each row (or rotate ring by ring)',
      complexity: 'O(n^2) time, O(1) space',
      statement: `
Rotate an n x n matrix 90 degrees clockwise, in place. You may not allocate another matrix.
`,
      examples: [
        `Input:  matrix = [[1,2,3], [4,5,6], [7,8,9]]
Output: [[7,4,1], [8,5,2], [9,6,3]]`,
        `Input:  matrix = [[5,1,9,11], [2,4,8,10], [13,3,6,7], [15,14,12,16]]
Output: [[15,13,2,5], [14,3,4,1], [12,6,8,9], [16,7,10,11]]`,
      ],
      constraints: [
        'n === matrix.length === matrix[i].length',
        '1 <= n <= 20',
        '-1000 <= matrix[i][j] <= 1000',
      ],
      followUp: 'Which two one-line transformations compose into a rotation? Does their order matter?',
      stub: `
export function rotate(matrix: number[][]): void {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 137,
      title: 'Spiral Matrix',
      slug: 'spiral-matrix',
      difficulty: 'Medium',
      leetcode: 'spiral-matrix',
      pattern: 'Four shrinking boundaries: top, bottom, left, right',
      complexity: 'O(m * n) time, O(1) extra space',
      statement: `
Return all elements of an m x n matrix in spiral order, starting at the top-left corner and
moving clockwise.
`,
      examples: [
        `Input:  matrix = [[1,2,3], [4,5,6], [7,8,9]]
Output: [1, 2, 3, 6, 9, 8, 7, 4, 5]`,
        `Input:  matrix = [[1,2,3,4], [5,6,7,8], [9,10,11,12]]
Output: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]`,
      ],
      constraints: [
        'm === matrix.length, n === matrix[i].length',
        '1 <= m, n <= 10 and -100 <= matrix[i][j] <= 100',
      ],
      followUp: 'A non-square matrix will re-read a row or column unless you re-check the bounds mid-loop.',
      stub: `
export function spiralOrder(matrix: number[][]): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 138,
      title: 'Set Matrix Zeroes',
      slug: 'set-matrix-zeroes',
      difficulty: 'Medium',
      leetcode: 'set-matrix-zeroes',
      pattern: 'Use the first row and column as the marker storage',
      complexity: 'O(m * n) time, O(1) space',
      statement: `
If an element of an m x n matrix is 0, set its entire row and column to 0. Do it in place.
`,
      examples: [
        `Input:  matrix = [[1,1,1], [1,0,1], [1,1,1]]
Output: [[1,0,1], [0,0,0], [1,0,1]]`,
        `Input:  matrix = [[0,1,2,0], [3,4,5,2], [1,3,1,5]]
Output: [[0,0,0,0], [0,4,5,0], [0,3,1,0]]`,
      ],
      constraints: [
        'm === matrix.length, n === matrix[0].length',
        '1 <= m, n <= 200',
        '-2^31 <= matrix[i][j] <= 2^31 - 1',
      ],
      followUp:
        'O(m + n) space is the obvious improvement. O(1) needs one extra flag — which cell is ambiguous?',
      stub: `
export function setZeroes(matrix: number[][]): void {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 139,
      title: 'Happy Number',
      slug: 'happy-number',
      difficulty: 'Easy',
      leetcode: 'happy-number',
      pattern: 'Cycle detection on the digit-square-sum sequence',
      complexity: 'O(log n) time, O(1) space with slow/fast',
      statement: `
Repeatedly replace a number with the sum of the squares of its digits. The number is happy
when this reaches 1; otherwise it loops forever. Return whether n is happy.
`,
      examples: [
        `Input:  n = 19
Output: true       // 82 -> 68 -> 100 -> 1`,
        `Input:  n = 2
Output: false`,
      ],
      constraints: ['1 <= n <= 2^31 - 1'],
      followUp: "The sequence is a linked list in disguise — Floyd's trick removes the set.",
      stub: `
export function isHappy(n: number): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 140,
      title: 'Plus One',
      slug: 'plus-one',
      difficulty: 'Easy',
      leetcode: 'plus-one',
      pattern: 'Propagate the carry from the last digit backwards',
      complexity: 'O(n) time, O(1) extra space',
      statement: `
digits holds the decimal digits of a large integer, most significant first, with no leading
zeros. Add one to the number and return the resulting digit array.
`,
      examples: [
        `Input:  digits = [1, 2, 3]
Output: [1, 2, 4]`,
        `Input:  digits = [4, 3, 2, 1]
Output: [4, 3, 2, 2]`,
        `Input:  digits = [9, 9]
Output: [1, 0, 0]`,
      ],
      constraints: [
        '1 <= digits.length <= 100',
        '0 <= digits[i] <= 9 with no leading zeros',
      ],
      followUp: 'Only one input shape grows the array. Which one?',
      stub: `
export function plusOne(digits: number[]): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 141,
      title: 'Pow(x, n)',
      slug: 'powx-n',
      difficulty: 'Medium',
      leetcode: 'powx-n',
      pattern: 'Fast exponentiation by squaring',
      complexity: 'O(log n) time, O(1) space iteratively',
      statement: `
Implement x raised to the power n, where n may be negative. Do not use the built-in
exponentiation operator.
`,
      examples: [
        `Input:  x = 2.00000, n = 10
Output: 1024.00000`,
        `Input:  x = 2.10000, n = 3
Output: 9.26100`,
        `Input:  x = 2.00000, n = -2
Output: 0.25000`,
      ],
      constraints: [
        '-100.0 < x < 100.0',
        '-2^31 <= n <= 2^31 - 1 and n is an integer',
        'Either x is non-zero or n > 0',
      ],
      followUp: 'Negating n overflows at exactly one value in the range. Handle it deliberately.',
      stub: `
export function myPow(x: number, n: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 142,
      title: 'Multiply Strings',
      slug: 'multiply-strings',
      difficulty: 'Medium',
      leetcode: 'multiply-strings',
      pattern: 'Schoolbook multiplication into a digit array',
      complexity: 'O(n * m) time, O(n + m) space',
      statement: `
Given two non-negative integers as strings, return their product as a string. You may not
convert the inputs to a number type or use a big-integer library.
`,
      examples: [
        `Input:  num1 = "2", num2 = "3"
Output: "6"`,
        `Input:  num1 = "123", num2 = "456"
Output: "56088"`,
      ],
      constraints: [
        '1 <= num1.length, num2.length <= 200',
        'Both consist of digits only and have no leading zeros except "0" itself',
      ],
      followUp: 'digits[i + j + 1] is where num1[i] * num2[j] lands. Convince yourself before coding.',
      stub: `
export function multiply(num1: string, num2: string): string {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 143,
      title: 'Detect Squares',
      slug: 'detect-squares',
      difficulty: 'Medium',
      leetcode: 'detect-squares',
      pattern: 'Point count map, enumerate the diagonal partner',
      complexity: 'O(1) add, O(points) count',
      statement: `
Design a structure that collects points on a plane and answers queries. add(point) records a
point, duplicates allowed. count(point) returns how many axis-aligned squares can be formed
using the query point plus three recorded points, where all four corners are distinct
positions.
`,
      examples: [
        `Input:  add([3,10]), add([11,2]), add([3,2]),
        count([11,10]), count([14,8]), add([11,2]), count([11,10])
Output: 1, 0, 2`,
      ],
      constraints: [
        '0 <= x, y <= 1000',
        'At most 3000 calls to add and count in total',
      ],
      followUp: 'Fix the diagonal corner first — the other two are then forced.',
      stub: `
export class DetectSquares {
  add(point: [number, number]): void {
    throw new Error('Not implemented');
  }

  count(point: [number, number]): number {
    throw new Error('Not implemented');
  }
}
`,
    },
  ],
};
