import { ListNode } from '../shared/types.ts';

/**
 * 44. Merge k Sorted Lists   ·   Hard   ·   Linked List
 *
 * Given an array of k sorted linked lists, merge them into a single sorted
 * list and return its head.
 *
 * Example 1:
 *   Input:  lists = [1 -> 4 -> 5, 1 -> 3 -> 4, 2 -> 6]
 *   Output: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6
 *
 * Example 2:
 *   Input:  lists = []
 *   Output: null
 *
 * Example 3:
 *   Input:  lists = [null]
 *   Output: null
 *
 * Constraints:
 *   - 0 <= k <= 10^4
 *   - Each list has 0 to 500 nodes sorted ascending
 *   - -10^4 <= Node.val <= 10^4
 *   - The total number of nodes across all lists does not exceed 10^4
 *
 * Follow-up: Merging one list at a time is O(kn). Halving the number of lists
 * each round is not.
 *
 * Pattern:   Pairwise merge in rounds (or a min-heap of heads)
 * Target:    O(n log k) time, O(1) space with pairwise merging
 * LeetCode:  https://leetcode.com/problems/merge-k-sorted-lists/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=35940s  (09:59:00)
 */
export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  throw new Error('Not implemented');
}
