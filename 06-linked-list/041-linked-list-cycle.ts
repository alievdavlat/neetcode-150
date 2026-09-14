import { ListNode } from '../shared/types.ts';

/**
 * 41. Linked List Cycle   ·   Easy   ·   Linked List
 *
 * Return true when the linked list contains a cycle — that is, when some node
 * can be reached again by following next pointers.
 *
 * Example 1:
 *   Input:  head = 3 -> 2 -> 0 -> -4, tail connects to index 1
 *   Output: true
 *
 * Example 2:
 *   Input:  head = 1 -> 2, tail connects to index 0
 *   Output: true
 *
 * Example 3:
 *   Input:  head = 1, no cycle
 *   Output: false
 *
 * Constraints:
 *   - The list has 0 to 10^4 nodes
 *   - -10^5 <= Node.val <= 10^5
 *
 * Follow-up: Can you do it with O(1) memory instead of a visited set?
 *
 * Pattern:   Floyd's slow and fast pointers
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/linked-list-cycle/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=34420s  (09:33:40)
 */
export function hasCycle(head: ListNode | null): boolean {
  throw new Error('Not implemented');
}
