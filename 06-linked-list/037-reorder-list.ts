import { ListNode } from '../shared/types.ts';

/**
 * 37. Reorder List   ·   Medium   ·   Linked List
 *
 * Given the head of a list L0 -> L1 -> ... -> Ln-1 -> Ln, reorder it in place
 * to L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... You may not change the node
 * values, only the links. The function returns nothing — mutate the list.
 *
 * Example 1:
 *   Input:  head = 1 -> 2 -> 3 -> 4
 *   Output: 1 -> 4 -> 2 -> 3
 *
 * Example 2:
 *   Input:  head = 1 -> 2 -> 3 -> 4 -> 5
 *   Output: 1 -> 5 -> 2 -> 4 -> 3
 *
 * Constraints:
 *   - The list has 1 to 5 * 10^4 nodes
 *   - 1 <= Node.val <= 1000
 *
 * Follow-up: Three familiar sub-problems in a row. Name them before you code.
 *
 * Pattern:   Find middle, reverse second half, interleave
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/reorder-list/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=31264s  (08:41:04)
 */
export function reorderList(head: ListNode | null): void {
  throw new Error('Not implemented');
}
