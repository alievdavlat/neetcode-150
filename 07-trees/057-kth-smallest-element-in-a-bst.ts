import { TreeNode } from '../shared/types.ts';

/**
 * 57. Kth Smallest Element in a BST   ·   Medium   ·   Trees
 *
 * Given the root of a binary search tree and an integer k, return the kth
 * smallest value in the tree, counting from 1.
 *
 * Example 1:
 *   Input:  root = [3, 1, 4, null, 2], k = 1
 *   Output: 1
 *
 * Example 2:
 *   Input:  root = [5, 3, 6, 2, 4, null, null, 1], k = 3
 *   Output: 3
 *
 * Constraints:
 *   - The tree has n nodes with 1 <= k <= n <= 10^4
 *   - 0 <= Node.val <= 10^4
 *
 * Follow-up: If the BST is modified often and kth-smallest is queried often,
 * what would you store in each node?
 *
 * Pattern:   In-order traversal with a counter (iterative stack)
 * Target:    O(h + k) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/kth-smallest-element-in-a-bst/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=45028s  (12:30:28)
 */
export function kthSmallest(root: TreeNode | null, k: number): number {
  throw new Error('Not implemented');
}
