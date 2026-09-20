# Two Pointers

Two indices walking a sorted or symmetric structure. The whole trick is the invariant: at
every step you must be able to prove that moving one pointer can never discard the answer.
Write that proof down before you write the loop.

**6 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 10 | ☑ | [Valid Palindrome](./010-valid-palindrome.ts) | 🟢 Easy | Pointers from both ends, skipping non-alphanumerics | [LC](https://leetcode.com/problems/valid-palindrome/) · [▶ 01:35:31](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=5731s) |
| 11 | ☑ | [Two Sum II - Input Array Is Sorted](./011-two-sum-ii-input-array-is-sorted.ts) | 🟡 Medium | Converging pointers on a sorted array | [LC](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) · [▶ 02:08:13](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=7693s) |
| 12 | ☑ | [3Sum](./012-3sum.ts) | 🟡 Medium | Sort, then fix one number and run two pointers | [LC](https://leetcode.com/problems/3sum/) · [▶ 02:08:13](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=7693s) |
| 13 | ☐ | [Container With Most Water](./013-container-with-most-water.ts) | 🟡 Medium | Greedy two pointers — always move the shorter wall | [LC](https://leetcode.com/problems/container-with-most-water/) · [▶ 02:40:58](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=9658s) |
| 14 | ☐ | [Trapping Rain Water](./014-trapping-rain-water.ts) | 🔴 Hard | Two pointers carrying running left/right maxima | [LC](https://leetcode.com/problems/trapping-rain-water/) · [▶ 02:40:58](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=9658s) |
| 154 | ☐ | [Sort Colors](./154-sort-colors.ts) | 🟡 Medium | Dutch national flag: a low, a high and a cursor between them | [LC](https://leetcode.com/problems/sort-colors/) |
