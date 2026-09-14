# 2-D Dynamic Programming

Now the state has two coordinates — usually a position in each of two sequences, or a
position plus a budget. Draw the grid on paper, fill the first row and column by hand, and
the recurrence tends to write itself. The last two are interval DP, a different animal.

**11 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 111 | ☐ | [Unique Paths](./111-unique-paths.ts) | 🟡 Medium | dp[r][c] = dp[r-1][c] + dp[r][c-1] | [LC](https://leetcode.com/problems/unique-paths/) · [▶ 28:45:52](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=103552s) |
| 112 | ☐ | [Longest Common Subsequence](./112-longest-common-subsequence.ts) | 🟡 Medium | Classic two-sequence grid DP | [LC](https://leetcode.com/problems/longest-common-subsequence/) · [▶ 28:45:52](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=103552s) |
| 113 | ☐ | [Best Time to Buy and Sell Stock with Cooldown](./113-best-time-to-buy-and-sell-stock-with-cooldown.ts) | 🟡 Medium | State machine: holding / free-to-buy / cooling down | [LC](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) · [▶ 29:14:46](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=105286s) |
| 114 | ☐ | [Coin Change II](./114-coin-change-ii.ts) | 🟡 Medium | Unbounded knapsack counting combinations | [LC](https://leetcode.com/problems/coin-change-ii/) · [▶ 29:14:46](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=105286s) |
| 115 | ☐ | [Target Sum](./115-target-sum.ts) | 🟡 Medium | Memoise on (index, running sum), or reduce to subset-sum | [LC](https://leetcode.com/problems/target-sum/) · [▶ 29:50:06](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=107406s) |
| 116 | ☐ | [Interleaving String](./116-interleaving-string.ts) | 🟡 Medium | Grid DP over consumed prefixes of s1 and s2 | [LC](https://leetcode.com/problems/interleaving-string/) · [▶ 29:50:06](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=107406s) |
| 117 | ☐ | [Longest Increasing Path in a Matrix](./117-longest-increasing-path-in-a-matrix.ts) | 🔴 Hard | DFS + memoisation on each cell (the grid is a DAG) | [LC](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) · [▶ 30:33:26](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=110006s) |
| 118 | ☐ | [Distinct Subsequences](./118-distinct-subsequences.ts) | 🔴 Hard | Grid DP counting matches, skip-or-take on equal characters | [LC](https://leetcode.com/problems/distinct-subsequences/) · [▶ 30:33:26](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=110006s) |
| 119 | ☐ | [Edit Distance](./119-edit-distance.ts) | 🟡 Medium | Levenshtein grid: insert, delete, replace | [LC](https://leetcode.com/problems/edit-distance/) · [▶ 31:11:49](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=112309s) |
| 120 | ☐ | [Burst Balloons](./120-burst-balloons.ts) | 🔴 Hard | Interval DP on the LAST balloon burst in each range | [LC](https://leetcode.com/problems/burst-balloons/) · [▶ 31:11:49](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=112309s) |
| 121 | ☐ | [Regular Expression Matching](./121-regular-expression-matching.ts) | 🔴 Hard | Grid DP with a special case for x* | [LC](https://leetcode.com/problems/regular-expression-matching/) · [▶ 31:54:37](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=114877s) |
