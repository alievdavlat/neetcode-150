# Sliding Window

A window [left, right] that only ever grows on the right and shrinks on the left, so every
index is visited at most twice. The design questions are always the same two: what does the
window have to satisfy, and what is the cheapest state that tells you when it stops.

**6 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 15 | ☐ | [Best Time to Buy and Sell Stock](./015-best-time-to-buy-and-sell-stock.ts) | 🟢 Easy | Track the minimum seen so far | [LC](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) · [▶ 03:22:29](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=12149s) |
| 16 | ☐ | [Longest Substring Without Repeating Characters](./016-longest-substring-without-repeating-characters.ts) | 🟡 Medium | Sliding window + set (or last-seen index map) | [LC](https://leetcode.com/problems/longest-substring-without-repeating-characters/) · [▶ 03:22:29](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=12149s) |
| 17 | ☐ | [Longest Repeating Character Replacement](./017-longest-repeating-character-replacement.ts) | 🟡 Medium | Window valid while (size - count of most frequent char) <= k | [LC](https://leetcode.com/problems/longest-repeating-character-replacement/) · [▶ 03:43:04](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=13384s) |
| 18 | ☐ | [Permutation in String](./018-permutation-in-string.ts) | 🟡 Medium | Fixed-size window + frequency match | [LC](https://leetcode.com/problems/permutation-in-string/) · [▶ 03:43:04](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=13384s) |
| 19 | ☐ | [Minimum Window Substring](./019-minimum-window-substring.ts) | 🔴 Hard | Expand to satisfy, then shrink while still satisfied | [LC](https://leetcode.com/problems/minimum-window-substring/) · [▶ 04:17:11](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=15431s) |
| 20 | ☐ | [Sliding Window Maximum](./020-sliding-window-maximum.ts) | 🔴 Hard | Monotonic decreasing deque of indices | [LC](https://leetcode.com/problems/sliding-window-maximum/) · [▶ 04:17:11](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=15431s) |
