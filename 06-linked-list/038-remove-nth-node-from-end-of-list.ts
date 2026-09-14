import { ListNode } from '../shared/types.ts';

/**
 * 38. Remove Nth Node From End of List   ·   Medium   ·   Linked List
 *
 * Given the head of a linked list, remove the nth node counting from the end
 * and return the head of the modified list.
 *
 * Example 1:
 *   Input:  head = 1 -> 2 -> 3 -> 4 -> 5, n = 2
 *   Output: 1 -> 2 -> 3 -> 5
 *
 * Example 2:
 *   Input:  head = 1, n = 1
 *   Output: null
 *
 * Example 3:
 *   Input:  head = 1 -> 2, n = 1
 *   Output: 1
 *
 * Constraints:
 *   - The list has sz nodes with 1 <= sz <= 30
 *   - 0 <= Node.val <= 100
 *   - 1 <= n <= sz
 *
 * Follow-up: Can you do it in one pass?
 *
 * Pattern:   Two pointers n apart + dummy head
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/remove-nth-node-from-end-of-list/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=31264s  (08:41:04)
 */
export function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  throw new Error('Not implemented');
}
