/**
 * 22. Min Stack   ·   Medium   ·   Stack
 *
 * Design a stack that supports push, pop, top and retrieving the minimum
 * element, each in constant time. pop, top and getMin are always called on a
 * non-empty stack.
 *
 * Example 1:
 *   Input:  push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()
 *   Output: -3, then top() === 0 and getMin() === -2
 *
 * Constraints:
 *   - -2^31 <= val <= 2^31 - 1
 *   - At most 3 * 10^4 calls in total
 *   - Every method must run in O(1)
 *
 * Follow-up: Can you avoid the second stack and store deltas instead?
 *
 * Pattern:   Parallel stack of running minima
 * Target:    O(1) per operation, O(n) space
 * LeetCode:  https://leetcode.com/problems/min-stack/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=17984s  (04:59:44)
 */
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
