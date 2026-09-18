export default {
  category: 'Fundamentals',
  dir: '19-fundamentals',
  intro: `
Short exercises in the Codewars mould: one idea each, no data structure to design, and an
answer you can usually see once you have said the rule out loud. They are here as warm-ups
and as a reminder that a tidy loop beats a clever one when the input is small.
`,
  problems: [
    {
      n: 155,
      title: 'Digital Root',
      slug: 'digital-root',
      difficulty: 'Easy',
      source: 'Codewars-style fundamentals',
      pattern: 'Sum the digits until one is left, or use the mod 9 identity',
      complexity: 'O(1) time, O(1) space',
      statement: `
Add the digits of a non-negative integer. If the result has more than one digit, add its
digits too, and keep going until a single digit is left. Return that digit.
`,
      examples: [
        `Input:  n = 16
Output: 7         // 1 + 6`,
        `Input:  n = 942
Output: 6         // 9 + 4 + 2 = 15, then 1 + 5`,
        `Input:  n = 0
Output: 0`,
      ],
      constraints: ['0 <= n <= 10^9'],
      followUp: 'There is a closed form that needs no loop. Work out what it does at multiples of nine.',
      stub: `
export function digitalRoot(n: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 156,
      title: 'Reverse Long Words',
      slug: 'reverse-long-words',
      difficulty: 'Easy',
      source: 'Codewars-style fundamentals',
      pattern: 'Split on spaces, reverse the long words, join back',
      complexity: 'O(n) time, O(n) space',
      statement: `
Given a sentence of words separated by single spaces, reverse the letters of every word
that is five characters or longer and leave the shorter words untouched. Word order and
spacing stay exactly as they were.
`,
      examples: [
        `Input:  sentence = "Hey fellow warriors"
Output: "Hey wollef sroirraw"`,
        `Input:  sentence = "This is a test"
Output: "This is a test"        // nothing reaches five letters`,
        `Input:  sentence = "Welcome"
Output: "emocleW"`,
      ],
      constraints: [
        '0 <= sentence.length <= 10^4',
        'sentence contains only English letters and single spaces',
      ],
      stub: `
export function reverseLongWords(sentence: string): string {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 157,
      title: 'Odd Row Sum',
      slug: 'odd-row-sum',
      difficulty: 'Easy',
      source: 'Codewars-style fundamentals',
      pattern: 'Find the first odd number of the row, then sum an arithmetic run',
      complexity: 'O(row) time, or O(1) with the identity',
      statement: `
The odd numbers are laid out in a triangle: one in the first row, two in the second, three
in the third, and so on.

  1
  3  5
  7  9 11
 13 15 17 19

Given a 1-based row number, return the sum of the numbers in that row.
`,
      examples: [
        `Input:  row = 1
Output: 1`,
        `Input:  row = 2
Output: 8         // 3 + 5`,
        `Input:  row = 3
Output: 27        // 7 + 9 + 11`,
      ],
      constraints: ['1 <= row <= 1000'],
      followUp: 'Compute the first three answers and the pattern will hand you a one-line formula.',
      stub: `
export function oddRowSum(row: number): number {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
