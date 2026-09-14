/**
 * 23. Evaluate Reverse Polish Notation   ·   Medium   ·   Stack
 *
 * Evaluate an arithmetic expression written in Reverse Polish Notation. Valid
 * operators are +, -, * and /; every operand is an integer or another
 * expression. Division truncates toward zero, there is never a division by
 * zero, and the input is always a valid expression whose intermediate results
 * fit in a 32-bit integer.
 *
 * Example 1:
 *   Input:  tokens = ["2", "1", "+", "3", "*"]
 *   Output: 9          // (2 + 1) * 3
 *
 * Example 2:
 *   Input:  tokens = ["4", "13", "5", "/", "+"]
 *   Output: 6          // 4 + (13 / 5)
 *
 * Example 3:
 *   Input:  tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
 *   Output: 22
 *
 * Constraints:
 *   - 1 <= tokens.length <= 10^4
 *   - Each token is an operator or an integer in [-200, 200]
 *   - Division truncates toward zero
 *
 * Pattern:   Operand stack
 * Target:    O(n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/evaluate-reverse-polish-notation/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=19233s  (05:20:33)
 */
export function evalRPN(tokens: string[]): number {
  throw new Error('Not implemented');
}
