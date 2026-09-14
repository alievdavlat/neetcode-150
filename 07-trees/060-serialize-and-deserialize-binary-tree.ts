import { TreeNode } from '../shared/types.ts';

/**
 * 60. Serialize and Deserialize Binary Tree   ·   Hard   ·   Trees
 *
 * Design an algorithm that turns a binary tree into a string and rebuilds an
 * identical tree from that string. The format is yours to choose; only the
 * round trip has to work.
 *
 * Example 1:
 *   Input:  root = [1, 2, 3, null, null, 4, 5]
 *   Output: the same tree after deserialize(serialize(root))
 *
 * Example 2:
 *   Input:  root = []
 *   Output: []
 *
 * Constraints:
 *   - The tree has 0 to 10^4 nodes
 *   - -1000 <= Node.val <= 1000
 *
 * Follow-up: Why does a preorder string need null markers while a level-order
 * one also does?
 *
 * Pattern:   Preorder with explicit null markers
 * Target:    O(n) time and space for both directions
 * LeetCode:  https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=46426s  (12:53:46)
 */
export function serialize(root: TreeNode | null): string {
  throw new Error('Not implemented');
}

export function deserialize(data: string): TreeNode | null {
  throw new Error('Not implemented');
}
