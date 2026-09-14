export default {
  category: 'Stack',
  dir: '04-stack',
  intro: `
Half of these are literal stacks, half are monotonic stacks — a stack you keep sorted by
popping everything that the new element makes irrelevant. When a problem asks "what is the
next larger / how far until something taller", reach for the monotonic stack first.
`,
  problems: [
    {
      n: 21,
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      difficulty: 'Easy',
      leetcode: 'valid-parentheses',
      pattern: 'Stack of expected closers',
      complexity: 'O(n) time, O(n) space',
      statement: `
Given a string containing only the characters ( ) [ ] { }, decide whether it is valid:
every bracket must be closed by the matching kind, in the correct order, and no closer may
appear before its opener.
`,
      examples: [
        `Input:  s = "()[]{}"
Output: true`,
        `Input:  s = "(]"
Output: false`,
        `Input:  s = "([)]"
Output: false      // right kinds, wrong order`,
        `Input:  s = "{[]}"
Output: true`,
      ],
      constraints: [
        '1 <= s.length <= 10^4',
        's consists of the characters ()[]{} only',
      ],
      stub: `
export function isValid(s: string): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 22,
      title: 'Min Stack',
      slug: 'min-stack',
      difficulty: 'Medium',
      leetcode: 'min-stack',
      pattern: 'Parallel stack of running minima',
      complexity: 'O(1) per operation, O(n) space',
      statement: `
Design a stack that supports push, pop, top and retrieving the minimum element, each in
constant time. pop, top and getMin are always called on a non-empty stack.
`,
      examples: [
        `Input:  push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()
Output: -3, then top() === 0 and getMin() === -2`,
      ],
      constraints: [
        '-2^31 <= val <= 2^31 - 1',
        'At most 3 * 10^4 calls in total',
        'Every method must run in O(1)',
      ],
      followUp: 'Can you avoid the second stack and store deltas instead?',
      stub: `
export class MinStack {
  push(val: number): void {
    throw new Error('Not implemented');
  }

  pop(): void {
    throw new Error('Not implemented');
  }

  top(): number {
    throw new Error('Not implemented');
  }

  getMin(): number {
    throw new Error('Not implemented');
  }
}
`,
    },
    {
      n: 23,
      title: 'Evaluate Reverse Polish Notation',
      slug: 'evaluate-reverse-polish-notation',
      difficulty: 'Medium',
      leetcode: 'evaluate-reverse-polish-notation',
      pattern: 'Operand stack',
      complexity: 'O(n) time, O(n) space',
      statement: `
Evaluate an arithmetic expression written in Reverse Polish Notation. Valid operators are
+, -, * and /; every operand is an integer or another expression. Division truncates
toward zero, there is never a division by zero, and the input is always a valid expression
whose intermediate results fit in a 32-bit integer.
`,
      examples: [
        `Input:  tokens = ["2", "1", "+", "3", "*"]
Output: 9          // (2 + 1) * 3`,
        `Input:  tokens = ["4", "13", "5", "/", "+"]
Output: 6          // 4 + (13 / 5)`,
        `Input:  tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
Output: 22`,
      ],
      constraints: [
        '1 <= tokens.length <= 10^4',
        'Each token is an operator or an integer in [-200, 200]',
        'Division truncates toward zero',
      ],
      stub: `
export function evalRPN(tokens: string[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 24,
      title: 'Generate Parentheses',
      slug: 'generate-parentheses',
      difficulty: 'Medium',
      leetcode: 'generate-parentheses',
      pattern: 'Backtracking with an open/close counter',
      complexity: 'O(4^n / sqrt(n)) time — the nth Catalan number',
      statement: `
Given n pairs of parentheses, generate every well-formed combination. Order does not
matter.
`,
      examples: [
        `Input:  n = 3
Output: ["((()))", "(()())", "(())()", "()(())", "()()()"]`,
        `Input:  n = 1
Output: ["()"]`,
      ],
      constraints: ['1 <= n <= 8'],
      followUp: 'What are the two rules that make a partial string still extendable?',
      stub: `
export function generateParenthesis(n: number): string[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 25,
      title: 'Daily Temperatures',
      slug: 'daily-temperatures',
      difficulty: 'Medium',
      leetcode: 'daily-temperatures',
      pattern: 'Monotonic decreasing stack of indices',
      complexity: 'O(n) time, O(n) space',
      statement: `
Given an array of daily temperatures, return an array answer where answer[i] is the number
of days you have to wait after day i for a warmer temperature. If no warmer day ever
comes, answer[i] is 0.
`,
      examples: [
        `Input:  temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
Output: [1, 1, 4, 2, 1, 1, 0, 0]`,
        `Input:  temperatures = [30, 40, 50, 60]
Output: [1, 1, 1, 0]`,
        `Input:  temperatures = [30, 60, 90]
Output: [1, 1, 0]`,
      ],
      constraints: [
        '1 <= temperatures.length <= 10^5',
        '30 <= temperatures[i] <= 100',
      ],
      stub: `
export function dailyTemperatures(temperatures: number[]): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 26,
      title: 'Car Fleet',
      slug: 'car-fleet',
      difficulty: 'Medium',
      leetcode: 'car-fleet',
      pattern: 'Sort by position descending, stack of arrival times',
      complexity: 'O(n log n) time, O(n) space',
      statement: `
n cars drive toward a destination at position target on a one-lane road. Car i starts at
position[i] and drives at speed[i]. A faster car catching a slower one must slow down to
its speed, and the two then travel bumper to bumper as one fleet — a fleet can also be a
single car that never catches anyone. Cars that meet exactly at the destination still count
as one fleet. Return how many fleets arrive at the destination.
`,
      examples: [
        `Input:  target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]
Output: 3`,
        `Input:  target = 10, position = [3], speed = [3]
Output: 1`,
        `Input:  target = 100, position = [0, 2, 4], speed = [4, 2, 1]
Output: 1`,
      ],
      constraints: [
        'n === position.length === speed.length',
        '1 <= n <= 10^5',
        '0 < target <= 10^6',
        '0 <= position[i] < target, all positions distinct',
        '0 < speed[i] <= 10^6',
      ],
      followUp: 'Think in arrival times, not distances — who can never catch whom?',
      stub: `
export function carFleet(target: number, position: number[], speed: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 27,
      title: 'Largest Rectangle in Histogram',
      slug: 'largest-rectangle-in-histogram',
      difficulty: 'Hard',
      leetcode: 'largest-rectangle-in-histogram',
      pattern: 'Monotonic increasing stack of (index, height)',
      complexity: 'O(n) time, O(n) space',
      statement: `
Given an array heights representing a histogram where every bar is 1 wide, return the area
of the largest rectangle that fits inside the histogram.
`,
      examples: [
        `Input:  heights = [2, 1, 5, 6, 2, 3]
Output: 10         // bars 5 and 6 give height 5 across width 2`,
        `Input:  heights = [2, 4]
Output: 4`,
      ],
      constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
      followUp:
        'When a bar is popped, how far left could its rectangle have started? That index is the answer to the whole problem.',
      stub: `
export function largestRectangleArea(heights: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
