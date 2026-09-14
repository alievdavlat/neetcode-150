import { ListNode } from '../shared/types.ts';

/**
 * 40. Add Two Numbers   ·   Medium   ·   Linked List
 *
 * Two non-negative integers are stored as linked lists with the digits in
 * reverse order, one digit per node. Add them and return the sum as a linked
 * list in the same format. Neither number has a leading zero, except the
 * number 0 itself.
 *
 * Example 1:
 *   Input:  l1 = 2 -> 4 -> 3, l2 = 5 -> 6 -> 4
 *   Output: 7 -> 0 -> 8        // 342 + 465 = 807
 *
 * Example 2:
 *   Input:  l1 = 0, l2 = 0
 *   Output: 0
 *
 * Example 3:
 *   Input:  l1 = 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9, l2 = 9 -> 9 -> 9 -> 9
 *   Output: 8 -> 9 -> 9 -> 9 -> 0 -> 0 -> 0 -> 1
 *
 * Constraints:
 *   - Each list has 1 to 100 nodes
 *   - 0 <= Node.val <= 9
 *   - The numbers have no leading zeros
 *
 * Follow-up: Do not convert to numbers — the lists are longer than Number can
 * hold.
 *
 * Pattern:   Digit-by-digit addition with a carry
 * Target:    O(max(n, m)) time, O(max(n, m)) space
 * LeetCode:  https://leetcode.com/problems/add-two-numbers/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=32841s  (09:07:21)
 */
export function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  throw new Error('Not implemented');
}
