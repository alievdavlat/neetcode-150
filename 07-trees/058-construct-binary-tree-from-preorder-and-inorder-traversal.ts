import { TreeNode } from '../shared/types.ts';

/**
 * 58. Construct Binary Tree from Preorder and Inorder Traversal   ·   Medium   ·   Trees
 *
 * Given preorder and inorder traversals of a binary tree with unique values,
 * rebuild the tree and return its root.
 *
 * Example 1:
 *   Input:  preorder = [3, 9, 20, 15, 7], inorder = [9, 3, 15, 20, 7]
 *   Output: [3, 9, 20, null, null, 15, 7]
 *
 * Example 2:
 *   Input:  preorder = [-1], inorder = [-1]
 *   Output: [-1]
 *
 * Constraints:
 *   - 1 <= preorder.length === inorder.length <= 3000
 *   - -3000 <= values <= 3000
 *   - All values are unique and inorder is a permutation of preorder
 *
 * Follow-up: Scanning inorder for the root each call is O(n^2). One map fixes
 * that.
 *
 * Pattern:   Preorder gives the root, inorder gives the split point
 * Target:    O(n) time with an index map, O(n) space
 * LeetCode:  https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=45028s  (12:30:28)
 */
export function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  throw new Error('Not implemented');
}
