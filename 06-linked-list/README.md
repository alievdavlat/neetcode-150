# Linked List

Pointer surgery. Two habits carry this whole section: a dummy head node so the first
element is not a special case, and slow/fast pointers so you can find the middle or a cycle
in one pass. Draw the three nodes you are rewiring before you type anything.

**11 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 35 | ☐ | [Reverse Linked List](./035-reverse-linked-list.ts) | 🟢 Easy | prev / curr / next rewiring | [LC](https://leetcode.com/problems/reverse-linked-list/) · [▶ 08:22:13](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=30133s) |
| 36 | ☐ | [Merge Two Sorted Lists](./036-merge-two-sorted-lists.ts) | 🟢 Easy | Dummy head + splice the smaller node | [LC](https://leetcode.com/problems/merge-two-sorted-lists/) · [▶ 08:22:13](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=30133s) |
| 37 | ☐ | [Reorder List](./037-reorder-list.ts) | 🟡 Medium | Find middle, reverse second half, interleave | [LC](https://leetcode.com/problems/reorder-list/) · [▶ 08:41:04](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=31264s) |
| 38 | ☐ | [Remove Nth Node From End of List](./038-remove-nth-node-from-end-of-list.ts) | 🟡 Medium | Two pointers n apart + dummy head | [LC](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) · [▶ 08:41:04](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=31264s) |
| 39 | ☐ | [Copy List with Random Pointer](./039-copy-list-with-random-pointer.ts) | 🟡 Medium | Map original -> clone, then wire pointers in a second pass | [LC](https://leetcode.com/problems/copy-list-with-random-pointer/) · [▶ 09:07:21](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=32841s) |
| 40 | ☐ | [Add Two Numbers](./040-add-two-numbers.ts) | 🟡 Medium | Digit-by-digit addition with a carry | [LC](https://leetcode.com/problems/add-two-numbers/) · [▶ 09:07:21](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=32841s) |
| 41 | ☐ | [Linked List Cycle](./041-linked-list-cycle.ts) | 🟢 Easy | Floyd's slow and fast pointers | [LC](https://leetcode.com/problems/linked-list-cycle/) · [▶ 09:33:40](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=34420s) |
| 42 | ☐ | [Find the Duplicate Number](./042-find-the-duplicate-number.ts) | 🟡 Medium | Floyd's cycle detection on the array-as-linked-list | [LC](https://leetcode.com/problems/find-the-duplicate-number/) · [▶ 09:33:40](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=34420s) |
| 43 | ☐ | [LRU Cache](./043-lru-cache.ts) | 🟡 Medium | Hash map + doubly linked list (or JS Map ordering) | [LC](https://leetcode.com/problems/lru-cache/) · [▶ 09:59:00](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=35940s) |
| 44 | ☐ | [Merge k Sorted Lists](./044-merge-k-sorted-lists.ts) | 🔴 Hard | Pairwise merge in rounds (or a min-heap of heads) | [LC](https://leetcode.com/problems/merge-k-sorted-lists/) · [▶ 09:59:00](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=35940s) |
| 45 | ☐ | [Reverse Nodes in k-Group](./045-reverse-nodes-in-k-group.ts) | 🔴 Hard | Reverse a bounded window, then reconnect the group boundaries | [LC](https://leetcode.com/problems/reverse-nodes-in-k-group/) · [▶ 10:33:35](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=38015s) |
