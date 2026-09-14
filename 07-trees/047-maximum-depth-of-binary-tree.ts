import { TreeNode } from '../shared/types.ts';

/**
 * 47. Maximum Depth of Binary Tree   ·   Easy   ·   Trees
 *
 * Return the maximum depth of a binary tree — the number of nodes on the
 * longest path from the root down to a leaf.
 *
 * Example 1:
 *   Input:  root = [3, 9, 20, null, null, 15, 7]
 *   Output: 3
 *
 * Example 2:
 *   Input:  root = [1, null, 2]
 *   Output: 2
 *
 * Constraints:
 *   - The tree has 0 to 10^4 nodes
 *   - -100 <= Node.val <= 100
 *
 * Follow-up: Write it recursively, then with an explicit BFS queue.
 *
 * Pattern:   1 + max(depth(left), depth(right))
 * Target:    O(n) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/maximum-depth-of-binary-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=39485s  (10:58:05)
 */
export function maxDepth(root: TreeNode | null): number {
  throw new Error('Not implemented');
}
