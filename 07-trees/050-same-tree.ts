import { TreeNode } from '../shared/types.ts';

/**
 * 50. Same Tree   ·   Easy   ·   Trees
 *
 * Given the roots of two binary trees, return true when they are structurally
 * identical and every corresponding pair of nodes holds the same value.
 *
 * Example 1:
 *   Input:  p = [1, 2, 3], q = [1, 2, 3]
 *   Output: true
 *
 * Example 2:
 *   Input:  p = [1, 2], q = [1, null, 2]
 *   Output: false      // same values, different shape
 *
 * Example 3:
 *   Input:  p = [1, 2, 1], q = [1, 1, 2]
 *   Output: false
 *
 * Constraints:
 *   - Each tree has 0 to 100 nodes
 *   - -10^4 <= Node.val <= 10^4
 *
 * Pattern:   Simultaneous traversal of both trees
 * Target:    O(n) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/same-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=40362s  (11:12:42)
 */
export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  throw new Error('Not implemented');
}
