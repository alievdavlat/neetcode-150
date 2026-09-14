import { TreeNode } from '../shared/types.ts';

/**
 * 56. Validate Binary Search Tree   ·   Medium   ·   Trees
 *
 * Return whether a binary tree is a valid binary search tree: every node in a
 * left subtree is strictly smaller than its ancestor, every node in a right
 * subtree is strictly larger, and both subtrees are themselves valid BSTs.
 *
 * Example 1:
 *   Input:  root = [2, 1, 3]
 *   Output: true
 *
 * Example 2:
 *   Input:  root = [5, 1, 4, null, null, 3, 6]
 *   Output: false      // 3 is in 5's right subtree but smaller than 5
 *
 * Constraints:
 *   - The tree has 1 to 10^4 nodes
 *   - -2^31 <= Node.val <= 2^31 - 1
 *
 * Follow-up: Comparing a node only to its direct children is the classic wrong
 * answer.
 *
 * Pattern:   DFS carrying an open (min, max) range
 * Target:    O(n) time, O(h) space
 * LeetCode:  https://leetcode.com/problems/validate-binary-search-tree/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=43772s  (12:09:32)
 */
export function isValidBST(root: TreeNode | null): boolean {
  throw new Error('Not implemented');
}
