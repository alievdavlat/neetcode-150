import { TreeNode } from '../shared/types.ts';

/**
 * 46. Invert Binary Tree   ·   Easy   ·   Trees
 *
 * Given the root of a binary tree, mirror it — swap every node's left and
 * right child — and return the root.
 *
 * Example 1:
 *   Input:  root = [4, 2, 7, 1, 3, 6, 9]
 *   Output: [4, 7, 2, 9, 6, 3, 1]
 *
 * Example 2:
 *   Input:  root = [2, 1, 3]
 *   Output: [2, 3, 1]
 *
 * Example 3:
 *   Input:  root = []
 *   Output: []
 *
 * Constraints:
 *   - The tree has 0 to 100 nodes
 *   - -100 <= Node.val <= 100
 *
 * Pattern:   Swap children, recurse
 * Target:    O(n) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/invert-binary-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=38015s  (10:33:35)
 */
export function invertTree(root: TreeNode | null): TreeNode | null {
  throw new Error('Not implemented');
}
