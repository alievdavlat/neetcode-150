import { TreeNode } from '../shared/types.ts';

/**
 * 55. Count Good Nodes in Binary Tree   ·   Medium   ·   Trees
 *
 * A node X is good when no node on the path from the root down to X holds a
 * larger value than X. Return the number of good nodes in the tree. The root
 * is always good.
 *
 * Example 1:
 *   Input:  root = [3, 1, 4, 3, null, 1, 5]
 *   Output: 4          // nodes 3 (root), 4, 5 and the deeper 3
 *
 * Example 2:
 *   Input:  root = [3, 3, null, 4, 2]
 *   Output: 3
 *
 * Example 3:
 *   Input:  root = [1]
 *   Output: 1
 *
 * Constraints:
 *   - The tree has 1 to 10^5 nodes
 *   - -10^4 <= Node.val <= 10^4
 *
 * Pattern:   DFS carrying the max seen on the path so far
 * Target:    O(n) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/count-good-nodes-in-binary-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=43772s  (12:09:32)
 */
export function goodNodes(root: TreeNode): number {
  throw new Error('Not implemented');
}
