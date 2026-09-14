# Greedy

Greedy problems are easy to code and hard to trust. For each one, state the local rule in a
sentence and then argue why taking it can never cost you the optimum — if you cannot, it is
a DP problem wearing a disguise.

**8 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 122 | ☐ | [Maximum Subarray](./122-maximum-subarray.ts) | 🟡 Medium | Kadane: drop the prefix as soon as it turns negative | [LC](https://leetcode.com/problems/maximum-subarray/) · [▶ 31:54:37](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=114877s) |
| 123 | ☐ | [Jump Game](./123-jump-game.ts) | 🟡 Medium | Track the furthest reachable index (or walk the goal backwards) | [LC](https://leetcode.com/problems/jump-game/) · [▶ 32:31:46](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=117106s) |
| 124 | ☐ | [Jump Game II](./124-jump-game-ii.ts) | 🟡 Medium | BFS-style level expansion over index ranges | [LC](https://leetcode.com/problems/jump-game-ii/) · [▶ 32:31:46](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=117106s) |
| 125 | ☐ | [Gas Station](./125-gas-station.ts) | 🟡 Medium | Total feasibility check + reset the start on a deficit | [LC](https://leetcode.com/problems/gas-station/) · [▶ 33:07:02](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=119222s) |
| 126 | ☐ | [Hand of Straights](./126-hand-of-straights.ts) | 🟡 Medium | Count map, always start a group at the smallest remaining card | [LC](https://leetcode.com/problems/hand-of-straights/) · [▶ 33:07:02](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=119222s) |
| 127 | ☐ | [Merge Triplets to Form Target Triplet](./127-merge-triplets-to-form-target-triplet.ts) | 🟡 Medium | Ignore any triplet that overshoots, then check coverage | [LC](https://leetcode.com/problems/merge-triplets-to-form-target-triplet/) · [▶ 33:34:15](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=120855s) |
| 128 | ☐ | [Partition Labels](./128-partition-labels.ts) | 🟡 Medium | Last-index map + extend the current partition end | [LC](https://leetcode.com/problems/partition-labels/) · [▶ 33:34:15](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=120855s) |
| 129 | ☐ | [Valid Parenthesis String](./129-valid-parenthesis-string.ts) | 🟡 Medium | Track the reachable range [minOpen, maxOpen] | [LC](https://leetcode.com/problems/valid-parenthesis-string/) · [▶ 33:55:28](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=122128s) |
