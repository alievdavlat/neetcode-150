import { ListNode } from '../shared/types.ts';

/**
 * 36. Merge Two Sorted Lists   ·   Easy   ·   Linked List
 *
 * Given the heads of two sorted linked lists, splice them into one sorted list
 * built from the original nodes, and return its head.
 *
 * Example 1:
 *   Input:  list1 = 1 -> 2 -> 4, list2 = 1 -> 3 -> 4
 *   Output: 1 -> 1 -> 2 -> 3 -> 4 -> 4
 *
 * Example 2:
 *   Input:  list1 = null, list2 = null
 *   Output: null
 *
 * Example 3:
 *   Input:  list1 = null, list2 = 0
 *   Output: 0
 *
 * Constraints:
 *   - Each list has 0 to 50 nodes
 *   - -100 <= Node.val <= 100
 *   - Both lists are sorted in non-decreasing order
 *
 * Follow-up: Reuse the existing nodes — do not allocate new ones.
 *
 * Pattern:   Dummy head + splice the smaller node
 * Target:    O(n + m) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/merge-two-sorted-lists/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=30133s  (08:22:13)
 */
export function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  throw new Error('Not implemented');
}
