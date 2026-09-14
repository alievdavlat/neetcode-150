import { ListNode } from '../shared/types.ts';

/**
 * 35. Reverse Linked List   ·   Easy   ·   Linked List
 *
 * Given the head of a singly linked list, reverse it and return the new head.
 *
 * Example 1:
 *   Input:  head = 1 -> 2 -> 3 -> 4 -> 5
 *   Output: 5 -> 4 -> 3 -> 2 -> 1
 *
 * Example 2:
 *   Input:  head = 1 -> 2
 *   Output: 2 -> 1
 *
 * Example 3:
 *   Input:  head = null
 *   Output: null
 *
 * Constraints:
 *   - The list has 0 to 5000 nodes
 *   - -5000 <= Node.val <= 5000
 *
 * Follow-up: Write it both iteratively and recursively.
 *
 * Pattern:   prev / curr / next rewiring
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/reverse-linked-list/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=30133s  (08:22:13)
 */
export function reverseList(head: ListNode | null): ListNode | null {
  throw new Error('Not implemented');
}
