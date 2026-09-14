# Backtracking

One template, nine costumes: choose, recurse, un-choose. What changes between problems is
only the candidate set at each level and the rule that kills duplicate branches. Sorting the
input first is what makes the duplicate rule expressible.

**9 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 71 | ☐ | [Subsets](./071-subsets.ts) | 🟡 Medium | Include / exclude each element | [LC](https://leetcode.com/problems/subsets/) · [▶ 16:15:43](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=58543s) |
| 72 | ☐ | [Combination Sum](./072-combination-sum.ts) | 🟡 Medium | Backtracking with reuse — recurse on the same index | [LC](https://leetcode.com/problems/combination-sum/) · [▶ 16:15:43](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=58543s) |
| 73 | ☐ | [Permutations](./073-permutations.ts) | 🟡 Medium | Swap-in-place or a used[] mask | [LC](https://leetcode.com/problems/permutations/) · [▶ 16:15:43](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=58543s) |
| 74 | ☐ | [Subsets II](./074-subsets-ii.ts) | 🟡 Medium | Sort, then skip a duplicate at the same recursion level | [LC](https://leetcode.com/problems/subsets-ii/) · [▶ 16:15:43](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=58543s) |
| 75 | ☐ | [Combination Sum II](./075-combination-sum-ii.ts) | 🟡 Medium | Sort + skip duplicates + each candidate used at most once | [LC](https://leetcode.com/problems/combination-sum-ii/) · [▶ 16:49:54](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=60594s) |
| 76 | ☐ | [Word Search](./076-word-search.ts) | 🟡 Medium | Grid DFS with in-place visited marking | [LC](https://leetcode.com/problems/word-search/) · [▶ 16:49:54](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=60594s) |
| 77 | ☐ | [Palindrome Partitioning](./077-palindrome-partitioning.ts) | 🟡 Medium | Backtrack over cut positions, test each prefix | [LC](https://leetcode.com/problems/palindrome-partitioning/) · [▶ 17:16:03](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=62163s) |
| 78 | ☐ | [Letter Combinations of a Phone Number](./078-letter-combinations-of-a-phone-number.ts) | 🟡 Medium | Backtracking over a digit -> letters map | [LC](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) · [▶ 17:16:03](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=62163s) |
| 79 | ☐ | [N-Queens](./079-n-queens.ts) | 🔴 Hard | Row-by-row placement with column and diagonal sets | [LC](https://leetcode.com/problems/n-queens/) · [▶ 17:44:08](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=63848s) |
