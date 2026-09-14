import { ListNode } from '../shared/types.ts';

/**
 * 45. Reverse Nodes in k-Group   ·   Hard   ·   Linked List
 *
 * Reverse the nodes of a linked list k at a time and return the modified list.
 * If the number of remaining nodes is smaller than k, leave that tail as it
 * is. Node values may not be changed — only the links.
 *
 * Example 1:
 *   Input:  head = 1 -> 2 -> 3 -> 4 -> 5, k = 2
 *   Output: 2 -> 1 -> 4 -> 3 -> 5
 *
 * Example 2:
 *   Input:  head = 1 -> 2 -> 3 -> 4 -> 5, k = 3
 *   Output: 3 -> 2 -> 1 -> 4 -> 5
 *
 * Constraints:
 *   - The list has n nodes with 1 <= k <= n <= 5000
 *   - 0 <= Node.val <= 1000
 *
 * Follow-up: Can you do it with O(1) extra memory — no recursion stack?
 *
 * Pattern:   Reverse a bounded window, then reconnect the group boundaries
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/reverse-nodes-in-k-group/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=38015s  (10:33:35)
 */
export function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  throw new Error('Not implemented');
}
