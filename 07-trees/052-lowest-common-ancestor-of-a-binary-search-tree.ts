import { TreeNode } from '../shared/types.ts';

/**
 * 52. Lowest Common Ancestor of a Binary Search Tree   ·   Medium   ·   Trees
 *
 * Given a binary search tree and two nodes p and q that both exist in it,
 * return their lowest common ancestor — the deepest node that has both as
 * descendants. A node may be a descendant of itself.
 *
 * Example 1:
 *   Input:  root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 8
 *   Output: 6
 *
 * Example 2:
 *   Input:  root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 4
 *   Output: 2          // a node is a descendant of itself
 *
 * Constraints:
 *   - The tree has 2 to 10^5 nodes
 *   - -10^9 <= Node.val <= 10^9
 *   - All values are unique; p !== q and both exist in the tree
 *
 * Follow-up: The BST ordering means you never have to search both subtrees.
 *
 * Pattern:   Walk down while both targets sit on the same side
 * Target:    O(h) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=41316s  (11:28:36)
 */
export function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode,
): TreeNode | null {
  throw new Error('Not implemented');
}
