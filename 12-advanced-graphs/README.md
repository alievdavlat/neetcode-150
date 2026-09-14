# Advanced Graphs

Named algorithms, finally: Dijkstra, Prim, Bellman-Ford, Hierholzer, topological sort on a
graph you first have to infer. The hard part is rarely the algorithm — it is recognising
which one the problem statement is describing.

**6 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 93 | ☐ | [Reconstruct Itinerary](./093-reconstruct-itinerary.ts) | 🔴 Hard | Hierholzer's Eulerian path, neighbours in lexical order | [LC](https://leetcode.com/problems/reconstruct-itinerary/) · [▶ 21:42:50](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=78170s) |
| 94 | ☐ | [Min Cost to Connect All Points](./094-min-cost-to-connect-all-points.ts) | 🟡 Medium | Prim's minimum spanning tree on a complete graph | [LC](https://leetcode.com/problems/min-cost-to-connect-all-points/) · [▶ 21:42:50](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=78170s) |
| 95 | ☐ | [Network Delay Time](./095-network-delay-time.ts) | 🟡 Medium | Dijkstra's shortest path from a single source | [LC](https://leetcode.com/problems/network-delay-time/) · [▶ 22:34:37](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=81277s) |
| 96 | ☐ | [Swim in Rising Water](./096-swim-in-rising-water.ts) | 🔴 Hard | Dijkstra on max-edge cost (or binary search + flood fill) | [LC](https://leetcode.com/problems/swim-in-rising-water/) · [▶ 22:34:37](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=81277s) |
| 97 | ☐ | [Alien Dictionary](./097-alien-dictionary.ts) | 🔴 Hard | Derive edges from adjacent word pairs, then topological sort | [LC](https://leetcode.com/problems/alien-dictionary/) · [▶ 23:14:40](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=83680s) |
| 98 | ☐ | [Cheapest Flights Within K Stops](./098-cheapest-flights-within-k-stops.ts) | 🟡 Medium | Bellman-Ford limited to k + 1 relaxation rounds | [LC](https://leetcode.com/problems/cheapest-flights-within-k-stops/) · [▶ 23:14:40](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=83680s) |
