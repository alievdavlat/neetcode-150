# 1-D Dynamic Programming

Write the recurrence before the loop, every time. Ask three questions in order: what does
dp[i] mean in one sentence, what does dp[i] depend on, and what are the base cases. Only
then decide whether you need the whole array or just the last two values.

**12 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 99 | ☐ | [Climbing Stairs](./099-climbing-stairs.ts) | 🟢 Easy | Fibonacci recurrence, two rolling variables | [LC](https://leetcode.com/problems/climbing-stairs/) · [▶ 23:46:50](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=85610s) |
| 100 | ☐ | [Min Cost Climbing Stairs](./100-min-cost-climbing-stairs.ts) | 🟢 Easy | dp[i] = cost[i] + min(dp[i+1], dp[i+2]) | [LC](https://leetcode.com/problems/min-cost-climbing-stairs/) · [▶ 23:46:50](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=85610s) |
| 101 | ☐ | [House Robber](./101-house-robber.ts) | 🟡 Medium | rob[i] = max(skip this house, take it + best two back) | [LC](https://leetcode.com/problems/house-robber/) · [▶ 24:50:25](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=89425s) |
| 102 | ☐ | [House Robber II](./102-house-robber-ii.ts) | 🟡 Medium | Run House Robber twice on two open ranges | [LC](https://leetcode.com/problems/house-robber-ii/) · [▶ 24:50:25](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=89425s) |
| 103 | ☐ | [Longest Palindromic Substring](./103-longest-palindromic-substring.ts) | 🟡 Medium | Expand around every centre (2n - 1 centres) | [LC](https://leetcode.com/problems/longest-palindromic-substring/) · [▶ 25:11:04](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=90664s) |
| 104 | ☐ | [Palindromic Substrings](./104-palindromic-substrings.ts) | 🟡 Medium | Same expand-around-centre, counting instead of measuring | [LC](https://leetcode.com/problems/palindromic-substrings/) · [▶ 25:11:04](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=90664s) |
| 105 | ☐ | [Decode Ways](./105-decode-ways.ts) | 🟡 Medium | dp[i] from a one-digit and a two-digit read | [LC](https://leetcode.com/problems/decode-ways/) · [▶ 25:39:56](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=92396s) |
| 106 | ☐ | [Coin Change](./106-coin-change.ts) | 🟡 Medium | Unbounded knapsack over amounts, minimising count | [LC](https://leetcode.com/problems/coin-change/) · [▶ 25:39:56](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=92396s) |
| 107 | ☐ | [Maximum Product Subarray](./107-maximum-product-subarray.ts) | 🟡 Medium | Carry both the running max and the running min | [LC](https://leetcode.com/problems/maximum-product-subarray/) · [▶ 26:10:23](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=94223s) |
| 108 | ☐ | [Word Break](./108-word-break.ts) | 🟡 Medium | dp[i] = some word ends at i and dp[start] was reachable | [LC](https://leetcode.com/problems/word-break/) · [▶ 26:10:23](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=94223s) |
| 109 | ☐ | [Longest Increasing Subsequence](./109-longest-increasing-subsequence.ts) | 🟡 Medium | O(n^2) dp, or patience sorting with binary search | [LC](https://leetcode.com/problems/longest-increasing-subsequence/) · [▶ 27:07:00](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=97620s) |
| 110 | ☐ | [Partition Equal Subset Sum](./110-partition-equal-subset-sum.ts) | 🟡 Medium | Subset-sum knapsack over a set of reachable sums | [LC](https://leetcode.com/problems/partition-equal-subset-sum/) · [▶ 27:07:00](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=97620s) |
