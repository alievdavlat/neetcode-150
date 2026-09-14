import { TreeNode } from '../shared/types.ts';

/**
 * 48. Diameter of Binary Tree   ·   Easy   ·   Trees
 *
 * The diameter of a binary tree is the number of edges on the longest path
 * between any two nodes; that path does not have to pass through the root.
 * Return the diameter.
 *
 * Example 1:
 *   Input:  root = [1, 2, 3, 4, 5]
 *   Output: 3          // the path 4 -> 2 -> 1 -> 3
 *
 * Example 2:
 *   Input:  root = [1, 2]
 *   Output: 1
 *
 * Constraints:
 *   - The tree has 1 to 10^4 nodes
 *   - -100 <= Node.val <= 100
 *
 * Follow-up: One traversal, not one per node. What does each call return, and
 * what does it record?
 *
 * Pattern:   Return height upward while tracking the best through-path
 * Target:    O(n) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/diameter-of-binary-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=39485s  (10:58:05)
 */
export function diameterOfBinaryTree(root: TreeNode | null): number {
  throw new Error('Not implemented');
}
