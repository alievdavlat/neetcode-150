# Binary Search

Binary search is not "search a sorted array" — it is "halve a monotone predicate". Half of
this section searches over an answer range rather than over the input, which is the form
that shows up most often in interviews.

**7 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 28 | ☐ | [Binary Search](./028-binary-search.ts) | 🟢 Easy | Classic halving on a sorted array | [LC](https://leetcode.com/problems/binary-search/) · [▶ 06:19:22](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=22762s) |
| 29 | ☐ | [Search a 2D Matrix](./029-search-a-2d-matrix.ts) | 🟡 Medium | Treat the matrix as one flat sorted array | [LC](https://leetcode.com/problems/search-a-2d-matrix/) · [▶ 06:46:23](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=24383s) |
| 30 | ☐ | [Koko Eating Bananas](./030-koko-eating-bananas.ts) | 🟡 Medium | Binary search over the answer range | [LC](https://leetcode.com/problems/koko-eating-bananas/) · [▶ 06:46:23](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=24383s) |
| 31 | ☐ | [Find Minimum in Rotated Sorted Array](./031-find-minimum-in-rotated-sorted-array.ts) | 🟡 Medium | Binary search comparing mid against the right end | [LC](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) · [▶ 07:11:21](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=25881s) |
| 32 | ☐ | [Search in Rotated Sorted Array](./032-search-in-rotated-sorted-array.ts) | 🟡 Medium | Binary search, deciding which half is sorted each step | [LC](https://leetcode.com/problems/search-in-rotated-sorted-array/) · [▶ 07:11:21](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=25881s) |
| 33 | ☐ | [Time Based Key-Value Store](./033-time-based-key-value-store.ts) | 🟡 Medium | Per-key append-only list + binary search on timestamp | [LC](https://leetcode.com/problems/time-based-key-value-store/) · [▶ 07:37:45](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=27465s) |
| 34 | ☐ | [Median of Two Sorted Arrays](./034-median-of-two-sorted-arrays.ts) | 🔴 Hard | Binary search for the partition point on the shorter array | [LC](https://leetcode.com/problems/median-of-two-sorted-arrays/) · [▶ 07:37:45](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=27465s) |
