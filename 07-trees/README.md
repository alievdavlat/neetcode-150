# Trees

The largest section, and the one that rewards a single habit: decide what each recursive
call returns to its parent before you write the body. Many of these look like they need a
global variable — most of them only need a better return value.

**15 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 46 | ☐ | [Invert Binary Tree](./046-invert-binary-tree.ts) | 🟢 Easy | Swap children, recurse | [LC](https://leetcode.com/problems/invert-binary-tree/) · [▶ 10:33:35](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=38015s) |
| 47 | ☐ | [Maximum Depth of Binary Tree](./047-maximum-depth-of-binary-tree.ts) | 🟢 Easy | 1 + max(depth(left), depth(right)) | [LC](https://leetcode.com/problems/maximum-depth-of-binary-tree/) · [▶ 10:58:05](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=39485s) |
| 48 | ☐ | [Diameter of Binary Tree](./048-diameter-of-binary-tree.ts) | 🟢 Easy | Return height upward while tracking the best through-path | [LC](https://leetcode.com/problems/diameter-of-binary-tree/) · [▶ 10:58:05](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=39485s) |
| 49 | ☐ | [Balanced Binary Tree](./049-balanced-binary-tree.ts) | 🟢 Easy | Return height, propagate an unbalanced sentinel | [LC](https://leetcode.com/problems/balanced-binary-tree/) · [▶ 11:12:42](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=40362s) |
| 50 | ☐ | [Same Tree](./050-same-tree.ts) | 🟢 Easy | Simultaneous traversal of both trees | [LC](https://leetcode.com/problems/same-tree/) · [▶ 11:12:42](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=40362s) |
| 51 | ☐ | [Subtree of Another Tree](./051-subtree-of-another-tree.ts) | 🟢 Easy | isSameTree applied at every candidate node | [LC](https://leetcode.com/problems/subtree-of-another-tree/) · [▶ 11:28:36](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=41316s) |
| 52 | ☐ | [Lowest Common Ancestor of a Binary Search Tree](./052-lowest-common-ancestor-of-a-binary-search-tree.ts) | 🟡 Medium | Walk down while both targets sit on the same side | [LC](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) · [▶ 11:28:36](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=41316s) |
| 53 | ☐ | [Binary Tree Level Order Traversal](./053-binary-tree-level-order-traversal.ts) | 🟡 Medium | BFS, one queue drain per level | [LC](https://leetcode.com/problems/binary-tree-level-order-traversal/) · [▶ 11:47:38](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=42458s) |
| 54 | ☐ | [Binary Tree Right Side View](./054-binary-tree-right-side-view.ts) | 🟡 Medium | BFS taking the last node of each level | [LC](https://leetcode.com/problems/binary-tree-right-side-view/) · [▶ 11:47:38](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=42458s) |
| 55 | ☐ | [Count Good Nodes in Binary Tree](./055-count-good-nodes-in-binary-tree.ts) | 🟡 Medium | DFS carrying the max seen on the path so far | [LC](https://leetcode.com/problems/count-good-nodes-in-binary-tree/) · [▶ 12:09:32](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=43772s) |
| 56 | ☐ | [Validate Binary Search Tree](./056-validate-binary-search-tree.ts) | 🟡 Medium | DFS carrying an open (min, max) range | [LC](https://leetcode.com/problems/validate-binary-search-tree/) · [▶ 12:09:32](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=43772s) |
| 57 | ☐ | [Kth Smallest Element in a BST](./057-kth-smallest-element-in-a-bst.ts) | 🟡 Medium | In-order traversal with a counter (iterative stack) | [LC](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) · [▶ 12:30:28](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=45028s) |
| 58 | ☐ | [Construct Binary Tree from Preorder and Inorder Traversal](./058-construct-binary-tree-from-preorder-and-inorder-traversal.ts) | 🟡 Medium | Preorder gives the root, inorder gives the split point | [LC](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) · [▶ 12:30:28](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=45028s) |
| 59 | ☐ | [Binary Tree Maximum Path Sum](./059-binary-tree-maximum-path-sum.ts) | 🔴 Hard | Return the best single-branch gain, record the best split | [LC](https://leetcode.com/problems/binary-tree-maximum-path-sum/) · [▶ 12:53:46](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=46426s) |
| 60 | ☐ | [Serialize and Deserialize Binary Tree](./060-serialize-and-deserialize-binary-tree.ts) | 🔴 Hard | Preorder with explicit null markers | [LC](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) · [▶ 12:53:46](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=46426s) |
