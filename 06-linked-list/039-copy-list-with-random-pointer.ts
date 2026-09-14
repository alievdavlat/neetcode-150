import { RandomListNode } from '../shared/types.ts';

/**
 * 39. Copy List with Random Pointer   ·   Medium   ·   Linked List
 *
 * Each node of the list has a next pointer and a random pointer that may point
 * at any node in the list or at null. Build a deep copy: n brand new nodes
 * whose values match, whose next and random pointers mirror the original
 * structure, and where no pointer in the copy references a node from the
 * original list.
 *
 * Example 1:
 *   Input:  [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]
 *           (each pair is [val, index the random pointer targets])
 *   Output: an independent list with the same shape
 *
 * Example 2:
 *   Input:  [[1, 1], [2, 1]]
 *   Output: an independent list with the same shape
 *
 * Constraints:
 *   - 0 <= n <= 1000
 *   - -10^4 <= Node.val <= 10^4
 *   - Node.random is null or points at a node in the list
 *
 * Follow-up: The hash map is the obvious answer. Can you do it in O(1) extra
 * space?
 *
 * Pattern:   Map original -> clone, then wire pointers in a second pass
 * Target:    O(n) time, O(n) space (O(1) with node interleaving)
 * LeetCode:  https://leetcode.com/problems/copy-list-with-random-pointer/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=32841s  (09:07:21)
 */
export function copyRandomList(head: RandomListNode | null): RandomListNode | null {
  throw new Error('Not implemented');
}
