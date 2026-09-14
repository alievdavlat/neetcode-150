const TREE = `import { TreeNode } from '../shared/types.ts';`;

export default {
  category: 'Trees',
  dir: '07-trees',
  intro: `
The largest section, and the one that rewards a single habit: decide what each recursive
call returns to its parent before you write the body. Many of these look like they need a
global variable — most of them only need a better return value.
`,
  problems: [
    {
      n: 46,
      title: 'Invert Binary Tree',
      slug: 'invert-binary-tree',
      difficulty: 'Easy',
      leetcode: 'invert-binary-tree',
      pattern: 'Swap children, recurse',
      complexity: 'O(n) time, O(h) space',
      imports: TREE,
      statement: `
Given the root of a binary tree, mirror it — swap every node's left and right child — and
return the root.
`,
      examples: [
        `Input:  root = [4, 2, 7, 1, 3, 6, 9]
Output: [4, 7, 2, 9, 6, 3, 1]`,
        `Input:  root = [2, 1, 3]
Output: [2, 3, 1]`,
        `Input:  root = []
Output: []`,
      ],
      constraints: [
        'The tree has 0 to 100 nodes',
        '-100 <= Node.val <= 100',
      ],
      stub: `
export function invertTree(root: TreeNode | null): TreeNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 47,
      title: 'Maximum Depth of Binary Tree',
      slug: 'maximum-depth-of-binary-tree',
      difficulty: 'Easy',
      leetcode: 'maximum-depth-of-binary-tree',
      pattern: '1 + max(depth(left), depth(right))',
      complexity: 'O(n) time, O(h) space',
      imports: TREE,
      statement: `
Return the maximum depth of a binary tree — the number of nodes on the longest path from
the root down to a leaf.
`,
      examples: [
        `Input:  root = [3, 9, 20, null, null, 15, 7]
Output: 3`,
        `Input:  root = [1, null, 2]
Output: 2`,
      ],
      constraints: [
        'The tree has 0 to 10^4 nodes',
        '-100 <= Node.val <= 100',
      ],
      followUp: 'Write it recursively, then with an explicit BFS queue.',
      stub: `
export function maxDepth(root: TreeNode | null): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 48,
      title: 'Diameter of Binary Tree',
      slug: 'diameter-of-binary-tree',
      difficulty: 'Easy',
      leetcode: 'diameter-of-binary-tree',
      pattern: 'Return height upward while tracking the best through-path',
      complexity: 'O(n) time, O(h) space',
      imports: TREE,
      statement: `
The diameter of a binary tree is the number of edges on the longest path between any two
nodes; that path does not have to pass through the root. Return the diameter.
`,
      examples: [
        `Input:  root = [1, 2, 3, 4, 5]
Output: 3          // the path 4 -> 2 -> 1 -> 3`,
        `Input:  root = [1, 2]
Output: 1`,
      ],
      constraints: [
        'The tree has 1 to 10^4 nodes',
        '-100 <= Node.val <= 100',
      ],
      followUp: 'One traversal, not one per node. What does each call return, and what does it record?',
      stub: `
export function diameterOfBinaryTree(root: TreeNode | null): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 49,
      title: 'Balanced Binary Tree',
      slug: 'balanced-binary-tree',
      difficulty: 'Easy',
      leetcode: 'balanced-binary-tree',
      pattern: 'Return height, propagate an unbalanced sentinel',
      complexity: 'O(n) time, O(h) space',
      imports: TREE,
      statement: `
A binary tree is height-balanced when, for every node, the heights of its two subtrees
differ by at most 1. Return whether the given tree is balanced.
`,
      examples: [
        `Input:  root = [3, 9, 20, null, null, 15, 7]
Output: true`,
        `Input:  root = [1, 2, 2, 3, 3, null, null, 4, 4]
Output: false`,
        `Input:  root = []
Output: true`,
      ],
      constraints: [
        'The tree has 0 to 5000 nodes',
        '-10^4 <= Node.val <= 10^4',
      ],
      followUp: 'Calling a height() helper per node is O(n^2). Fold the check into one pass.',
      stub: `
export function isBalanced(root: TreeNode | null): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 50,
      title: 'Same Tree',
      slug: 'same-tree',
      difficulty: 'Easy',
      leetcode: 'same-tree',
      pattern: 'Simultaneous traversal of both trees',
      complexity: 'O(n) time, O(h) space',
      imports: TREE,
      statement: `
Given the roots of two binary trees, return true when they are structurally identical and
every corresponding pair of nodes holds the same value.
`,
      examples: [
        `Input:  p = [1, 2, 3], q = [1, 2, 3]
Output: true`,
        `Input:  p = [1, 2], q = [1, null, 2]
Output: false      // same values, different shape`,
        `Input:  p = [1, 2, 1], q = [1, 1, 2]
Output: false`,
      ],
      constraints: [
        'Each tree has 0 to 100 nodes',
        '-10^4 <= Node.val <= 10^4',
      ],
      stub: `
export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 51,
      title: 'Subtree of Another Tree',
      slug: 'subtree-of-another-tree',
      difficulty: 'Easy',
      leetcode: 'subtree-of-another-tree',
      pattern: 'isSameTree applied at every candidate node',
      complexity: 'O(n * m) time, O(h) space',
      imports: TREE,
      statement: `
Given the roots of two binary trees root and subRoot, return true when some node of root
together with all of its descendants is identical to subRoot. A tree counts as a subtree of
itself.
`,
      examples: [
        `Input:  root = [3, 4, 5, 1, 2], subRoot = [4, 1, 2]
Output: true`,
        `Input:  root = [3, 4, 5, 1, 2, null, null, null, null, 0], subRoot = [4, 1, 2]
Output: false      // the extra 0 breaks the match`,
      ],
      constraints: [
        'root has 1 to 2000 nodes, subRoot has 1 to 1000 nodes',
        '-10^4 <= Node.val <= 10^4',
      ],
      followUp: 'A serialisation trick can get this to O(n + m). What breaks a naive serialisation?',
      stub: `
export function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 52,
      title: 'Lowest Common Ancestor of a Binary Search Tree',
      slug: 'lowest-common-ancestor-of-a-binary-search-tree',
      difficulty: 'Medium',
      leetcode: 'lowest-common-ancestor-of-a-binary-search-tree',
      pattern: 'Walk down while both targets sit on the same side',
      complexity: 'O(h) time, O(1) space',
      imports: TREE,
      statement: `
Given a binary search tree and two nodes p and q that both exist in it, return their lowest
common ancestor — the deepest node that has both as descendants. A node may be a descendant
of itself.
`,
      examples: [
        `Input:  root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 8
Output: 6`,
        `Input:  root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 4
Output: 2          // a node is a descendant of itself`,
      ],
      constraints: [
        'The tree has 2 to 10^5 nodes',
        '-10^9 <= Node.val <= 10^9',
        'All values are unique; p !== q and both exist in the tree',
      ],
      followUp: 'The BST ordering means you never have to search both subtrees.',
      stub: `
export function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode,
): TreeNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 53,
      title: 'Binary Tree Level Order Traversal',
      slug: 'binary-tree-level-order-traversal',
      difficulty: 'Medium',
      leetcode: 'binary-tree-level-order-traversal',
      pattern: 'BFS, one queue drain per level',
      complexity: 'O(n) time, O(n) space',
      imports: TREE,
      statement: `
Return the values of a binary tree level by level, left to right, as an array of arrays —
one inner array per depth.
`,
      examples: [
        `Input:  root = [3, 9, 20, null, null, 15, 7]
Output: [[3], [9, 20], [15, 7]]`,
        `Input:  root = [1]
Output: [[1]]`,
        `Input:  root = []
Output: []`,
      ],
      constraints: [
        'The tree has 0 to 2000 nodes',
        '-1000 <= Node.val <= 1000',
      ],
      followUp: 'Snapshot the queue length before draining — that is the level boundary.',
      stub: `
export function levelOrder(root: TreeNode | null): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 54,
      title: 'Binary Tree Right Side View',
      slug: 'binary-tree-right-side-view',
      difficulty: 'Medium',
      leetcode: 'binary-tree-right-side-view',
      pattern: 'BFS taking the last node of each level',
      complexity: 'O(n) time, O(n) space',
      imports: TREE,
      statement: `
Standing to the right of a binary tree, return the values you can see from top to bottom —
the rightmost node at each depth.
`,
      examples: [
        `Input:  root = [1, 2, 3, null, 5, null, 4]
Output: [1, 3, 4]`,
        `Input:  root = [1, null, 3]
Output: [1, 3]`,
        `Input:  root = []
Output: []`,
      ],
      constraints: [
        'The tree has 0 to 100 nodes',
        '-100 <= Node.val <= 100',
      ],
      followUp: 'A DFS that visits right first can do it too — what does it need to track?',
      stub: `
export function rightSideView(root: TreeNode | null): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 55,
      title: 'Count Good Nodes in Binary Tree',
      slug: 'count-good-nodes-in-binary-tree',
      difficulty: 'Medium',
      leetcode: 'count-good-nodes-in-binary-tree',
      pattern: 'DFS carrying the max seen on the path so far',
      complexity: 'O(n) time, O(h) space',
      imports: TREE,
      statement: `
A node X is good when no node on the path from the root down to X holds a larger value than
X. Return the number of good nodes in the tree. The root is always good.
`,
      examples: [
        `Input:  root = [3, 1, 4, 3, null, 1, 5]
Output: 4          // nodes 3 (root), 4, 5 and the deeper 3`,
        `Input:  root = [3, 3, null, 4, 2]
Output: 3`,
        `Input:  root = [1]
Output: 1`,
      ],
      constraints: [
        'The tree has 1 to 10^5 nodes',
        '-10^4 <= Node.val <= 10^4',
      ],
      stub: `
export function goodNodes(root: TreeNode): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 56,
      title: 'Validate Binary Search Tree',
      slug: 'validate-binary-search-tree',
      difficulty: 'Medium',
      leetcode: 'validate-binary-search-tree',
      pattern: 'DFS carrying an open (min, max) range',
      complexity: 'O(n) time, O(h) space',
      imports: TREE,
      statement: `
Return whether a binary tree is a valid binary search tree: every node in a left subtree is
strictly smaller than its ancestor, every node in a right subtree is strictly larger, and
both subtrees are themselves valid BSTs.
`,
      examples: [
        `Input:  root = [2, 1, 3]
Output: true`,
        `Input:  root = [5, 1, 4, null, null, 3, 6]
Output: false      // 3 is in 5's right subtree but smaller than 5`,
      ],
      constraints: [
        'The tree has 1 to 10^4 nodes',
        '-2^31 <= Node.val <= 2^31 - 1',
      ],
      followUp: 'Comparing a node only to its direct children is the classic wrong answer.',
      stub: `
export function isValidBST(root: TreeNode | null): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 57,
      title: 'Kth Smallest Element in a BST',
      slug: 'kth-smallest-element-in-a-bst',
      difficulty: 'Medium',
      leetcode: 'kth-smallest-element-in-a-bst',
      pattern: 'In-order traversal with a counter (iterative stack)',
      complexity: 'O(h + k) time, O(h) space',
      imports: TREE,
      statement: `
Given the root of a binary search tree and an integer k, return the kth smallest value in
the tree, counting from 1.
`,
      examples: [
        `Input:  root = [3, 1, 4, null, 2], k = 1
Output: 1`,
        `Input:  root = [5, 3, 6, 2, 4, null, null, 1], k = 3
Output: 3`,
      ],
      constraints: [
        'The tree has n nodes with 1 <= k <= n <= 10^4',
        '0 <= Node.val <= 10^4',
      ],
      followUp:
        'If the BST is modified often and kth-smallest is queried often, what would you store in each node?',
      stub: `
export function kthSmallest(root: TreeNode | null, k: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 58,
      title: 'Construct Binary Tree from Preorder and Inorder Traversal',
      slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
      difficulty: 'Medium',
      leetcode: 'construct-binary-tree-from-preorder-and-inorder-traversal',
      pattern: 'Preorder gives the root, inorder gives the split point',
      complexity: 'O(n) time with an index map, O(n) space',
      imports: TREE,
      statement: `
Given preorder and inorder traversals of a binary tree with unique values, rebuild the tree
and return its root.
`,
      examples: [
        `Input:  preorder = [3, 9, 20, 15, 7], inorder = [9, 3, 15, 20, 7]
Output: [3, 9, 20, null, null, 15, 7]`,
        `Input:  preorder = [-1], inorder = [-1]
Output: [-1]`,
      ],
      constraints: [
        '1 <= preorder.length === inorder.length <= 3000',
        '-3000 <= values <= 3000',
        'All values are unique and inorder is a permutation of preorder',
      ],
      followUp: 'Scanning inorder for the root each call is O(n^2). One map fixes that.',
      stub: `
export function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 59,
      title: 'Binary Tree Maximum Path Sum',
      slug: 'binary-tree-maximum-path-sum',
      difficulty: 'Hard',
      leetcode: 'binary-tree-maximum-path-sum',
      pattern: 'Return the best single-branch gain, record the best split',
      complexity: 'O(n) time, O(h) space',
      imports: TREE,
      statement: `
A path is any sequence of nodes connected by edges, visiting each node at most once, and it
does not have to pass through the root. Return the largest sum of values along any path in
the tree. Values may be negative.
`,
      examples: [
        `Input:  root = [1, 2, 3]
Output: 6          // 2 -> 1 -> 3`,
        `Input:  root = [-10, 9, 20, null, null, 15, 7]
Output: 42         // 15 -> 20 -> 7`,
      ],
      constraints: [
        'The tree has 1 to 3 * 10^4 nodes',
        '-1000 <= Node.val <= 1000',
      ],
      followUp:
        'A node returns one branch to its parent but may consume two. Keep those two numbers apart.',
      stub: `
export function maxPathSum(root: TreeNode | null): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 60,
      title: 'Serialize and Deserialize Binary Tree',
      slug: 'serialize-and-deserialize-binary-tree',
      difficulty: 'Hard',
      leetcode: 'serialize-and-deserialize-binary-tree',
      pattern: 'Preorder with explicit null markers',
      complexity: 'O(n) time and space for both directions',
      imports: TREE,
      statement: `
Design an algorithm that turns a binary tree into a string and rebuilds an identical tree
from that string. The format is yours to choose; only the round trip has to work.
`,
      examples: [
        `Input:  root = [1, 2, 3, null, null, 4, 5]
Output: the same tree after deserialize(serialize(root))`,
        `Input:  root = []
Output: []`,
      ],
      constraints: [
        'The tree has 0 to 10^4 nodes',
        '-1000 <= Node.val <= 1000',
      ],
      followUp: 'Why does a preorder string need null markers while a level-order one also does?',
      stub: `
export function serialize(root: TreeNode | null): string {
  throw new Error('Not implemented');
}

export function deserialize(data: string): TreeNode | null {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
