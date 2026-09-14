# Intervals

Six problems, one opening move: sort by start, or by end, and know which one you chose and
why. Overlap is always the same test — one interval starts before the other ends — so the
difficulty lives entirely in what you sweep and what you keep.

**6 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 130 | ☐ | [Insert Interval](./130-insert-interval.ts) | 🟡 Medium | Three phases: before, overlapping (merge), after | [LC](https://leetcode.com/problems/insert-interval/) · [▶ 33:55:28](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=122128s) |
| 131 | ☐ | [Merge Intervals](./131-merge-intervals.ts) | 🟡 Medium | Sort by start, extend the last interval while it overlaps | [LC](https://leetcode.com/problems/merge-intervals/) · [▶ 34:27:14](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=124034s) |
| 132 | ☐ | [Non-overlapping Intervals](./132-non-overlapping-intervals.ts) | 🟡 Medium | Activity selection — sort by end, keep the earliest finisher | [LC](https://leetcode.com/problems/non-overlapping-intervals/) · [▶ 34:27:14](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=124034s) |
| 133 | ☐ | [Meeting Rooms](./133-meeting-rooms.ts) | 🟢 Easy | Sort by start, compare each start against the previous end | [LC](https://leetcode.com/problems/meeting-rooms/) · [▶ 35:00:49](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=126049s) |
| 134 | ☐ | [Meeting Rooms II](./134-meeting-rooms-ii.ts) | 🟡 Medium | Sweep line over separated start/end times (or a min-heap of end times) | [LC](https://leetcode.com/problems/meeting-rooms-ii/) · [▶ 35:00:49](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=126049s) |
| 135 | ☐ | [Minimum Interval to Include Each Query](./135-minimum-interval-to-include-each-query.ts) | 🔴 Hard | Sort queries, sweep intervals in, min-heap by interval size | [LC](https://leetcode.com/problems/minimum-interval-to-include-each-query/) · [▶ 35:26:18](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=127578s) |
