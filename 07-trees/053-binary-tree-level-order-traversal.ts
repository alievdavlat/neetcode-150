import { TreeNode } from '../shared/types.ts';

/**
 * 53. Binary Tree Level Order Traversal   ·   Medium   ·   Trees
 *
 * Return the values of a binary tree level by level, left to right, as an
 * array of arrays — one inner array per depth.
 *
 * Example 1:
 *   Input:  root = [3, 9, 20, null, null, 15, 7]
 *   Output: [[3], [9, 20], [15, 7]]
 *
 * Example 2:
 *   Input:  root = [1]
 *   Output: [[1]]
 *
 * Example 3:
 *   Input:  root = []
 *   Output: []
 *
 * Constraints:
 *   - The tree has 0 to 2000 nodes
 *   - -1000 <= Node.val <= 1000
 *
 * Follow-up: Snapshot the queue length before draining — that is the level
 * boundary.
 *
 * Pattern:   BFS, one queue drain per level
 * Target:    O(n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/binary-tree-level-order-traversal/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=42458s  (11:47:38)
 */
export function levelOrder(root: TreeNode | null): number[][] {
  throw new Error('Not implemented');
}
