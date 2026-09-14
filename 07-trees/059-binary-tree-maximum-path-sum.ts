import { TreeNode } from '../shared/types.ts';

/**
 * 59. Binary Tree Maximum Path Sum   ·   Hard   ·   Trees
 *
 * A path is any sequence of nodes connected by edges, visiting each node at
 * most once, and it does not have to pass through the root. Return the largest
 * sum of values along any path in the tree. Values may be negative.
 *
 * Example 1:
 *   Input:  root = [1, 2, 3]
 *   Output: 6          // 2 -> 1 -> 3
 *
 * Example 2:
 *   Input:  root = [-10, 9, 20, null, null, 15, 7]
 *   Output: 42         // 15 -> 20 -> 7
 *
 * Constraints:
 *   - The tree has 1 to 3 * 10^4 nodes
 *   - -1000 <= Node.val <= 1000
 *
 * Follow-up: A node returns one branch to its parent but may consume two. Keep
 * those two numbers apart.
 *
 * Pattern:   Return the best single-branch gain, record the best split
 * Target:    O(n) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/binary-tree-maximum-path-sum/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=46426s  (12:53:46)
 */
export function maxPathSum(root: TreeNode | null): number {
  throw new Error('Not implemented');
}
