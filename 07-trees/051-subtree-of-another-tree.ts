import { TreeNode } from '../shared/types.ts';

/**
 * 51. Subtree of Another Tree   ·   Easy   ·   Trees
 *
 * Given the roots of two binary trees root and subRoot, return true when some
 * node of root together with all of its descendants is identical to subRoot. A
 * tree counts as a subtree of itself.
 *
 * Example 1:
 *   Input:  root = [3, 4, 5, 1, 2], subRoot = [4, 1, 2]
 *   Output: true
 *
 * Example 2:
 *   Input:  root = [3, 4, 5, 1, 2, null, null, null, null, 0], subRoot = [4, 1, 2]
 *   Output: false      // the extra 0 breaks the match
 *
 * Constraints:
 *   - root has 1 to 2000 nodes, subRoot has 1 to 1000 nodes
 *   - -10^4 <= Node.val <= 10^4
 *
 * Follow-up: A serialisation trick can get this to O(n + m). What breaks a
 * naive serialisation?
 *
 * Pattern:   isSameTree applied at every candidate node
 * Target:    O(n * m) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/subtree-of-another-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=41316s  (11:28:36)
 */
export function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  throw new Error('Not implemented');
}
