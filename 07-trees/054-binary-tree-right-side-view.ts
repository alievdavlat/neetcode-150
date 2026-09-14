import { TreeNode } from '../shared/types.ts';

/**
 * 54. Binary Tree Right Side View   ·   Medium   ·   Trees
 *
 * Standing to the right of a binary tree, return the values you can see from
 * top to bottom — the rightmost node at each depth.
 *
 * Example 1:
 *   Input:  root = [1, 2, 3, null, 5, null, 4]
 *   Output: [1, 3, 4]
 *
 * Example 2:
 *   Input:  root = [1, null, 3]
 *   Output: [1, 3]
 *
 * Example 3:
 *   Input:  root = []
 *   Output: []
 *
 * Constraints:
 *   - The tree has 0 to 100 nodes
 *   - -100 <= Node.val <= 100
 *
 * Follow-up: A DFS that visits right first can do it too — what does it need
 * to track?
 *
 * Pattern:   BFS taking the last node of each level
 * Target:    O(n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/binary-tree-right-side-view/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=42458s  (11:47:38)
 */
export function rightSideView(root: TreeNode | null): number[] {
  throw new Error('Not implemented');
}
