# Heap / Priority Queue

JavaScript ships no priority queue, so the first job here is writing a binary heap once and
reusing it — put it in shared/ when you get tired of retyping it. The recurring insight is
that a size-k heap answers "top k" questions without sorting the whole input.

**7 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 64 | ☐ | [Kth Largest Element in a Stream](./064-kth-largest-element-in-a-stream.ts) | 🟢 Easy | Min-heap capped at size k | [LC](https://leetcode.com/problems/kth-largest-element-in-a-stream/) · [▶ 14:01:28](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=50488s) |
| 65 | ☐ | [Last Stone Weight](./065-last-stone-weight.ts) | 🟢 Easy | Max-heap, smash the two heaviest repeatedly | [LC](https://leetcode.com/problems/last-stone-weight/) · [▶ 14:30:37](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=52237s) |
| 66 | ☐ | [K Closest Points to Origin](./066-k-closest-points-to-origin.ts) | 🟡 Medium | Max-heap of size k on squared distance (or quickselect) | [LC](https://leetcode.com/problems/k-closest-points-to-origin/) · [▶ 14:30:37](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=52237s) |
| 67 | ☐ | [Kth Largest Element in an Array](./067-kth-largest-element-in-an-array.ts) | 🟡 Medium | Quickselect (or a size-k min-heap) | [LC](https://leetcode.com/problems/kth-largest-element-in-an-array/) · [▶ 14:50:44](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=53444s) |
| 68 | ☐ | [Task Scheduler](./068-task-scheduler.ts) | 🟡 Medium | Greedy on the most frequent task (heap + cooldown queue) | [LC](https://leetcode.com/problems/task-scheduler/) · [▶ 14:50:44](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=53444s) |
| 69 | ☐ | [Design Twitter](./069-design-twitter.ts) | 🟡 Medium | Per-user tweet lists + k-way merge for the feed | [LC](https://leetcode.com/problems/design-twitter/) · [▶ 15:19:56](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=55196s) |
| 70 | ☐ | [Find Median from Data Stream](./070-find-median-from-data-stream.ts) | 🔴 Hard | Two heaps: max-heap of the low half, min-heap of the high half | [LC](https://leetcode.com/problems/find-median-from-data-stream/) · [▶ 15:19:56](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=55196s) |
