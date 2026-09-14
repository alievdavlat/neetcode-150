import { TreeNode } from '../shared/types.ts';

/**
 * 49. Balanced Binary Tree   ·   Easy   ·   Trees
 *
 * A binary tree is height-balanced when, for every node, the heights of its
 * two subtrees differ by at most 1. Return whether the given tree is balanced.
 *
 * Example 1:
 *   Input:  root = [3, 9, 20, null, null, 15, 7]
 *   Output: true
 *
 * Example 2:
 *   Input:  root = [1, 2, 2, 3, 3, null, null, 4, 4]
 *   Output: false
 *
 * Example 3:
 *   Input:  root = []
 *   Output: true
 *
 * Constraints:
 *   - The tree has 0 to 5000 nodes
 *   - -10^4 <= Node.val <= 10^4
 *
 * Follow-up: Calling a height() helper per node is O(n^2). Fold the check into
 * one pass.
 *
 * Pattern:   Return height, propagate an unbalanced sentinel
 * Target:    O(n) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/balanced-binary-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=40362s  (11:12:42)
 */
export function isBalanced(root: TreeNode | null): boolean {
  throw new Error('Not implemented');
}
