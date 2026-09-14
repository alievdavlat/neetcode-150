export default {
  category: 'Advanced Graphs',
  dir: '12-advanced-graphs',
  intro: `
Named algorithms, finally: Dijkstra, Prim, Bellman-Ford, Hierholzer, topological sort on a
graph you first have to infer. The hard part is rarely the algorithm — it is recognising
which one the problem statement is describing.
`,
  problems: [
    {
      n: 93,
      title: 'Reconstruct Itinerary',
      slug: 'reconstruct-itinerary',
      difficulty: 'Hard',
      leetcode: 'reconstruct-itinerary',
      pattern: "Hierholzer's Eulerian path, neighbours in lexical order",
      complexity: 'O(E log E) time, O(E) space',
      statement: `
Given a list of airline tickets [from, to], reconstruct the itinerary that uses every ticket
exactly once, starting at "JFK". At least one valid itinerary exists; when several do,
return the one that is smallest in lexical order when read as a single list.
`,
      examples: [
        `Input:  tickets = [["MUC","LHR"], ["JFK","MUC"], ["SFO","SJC"], ["LHR","SFO"]]
Output: ["JFK", "MUC", "LHR", "SFO", "SJC"]`,
        `Input:  tickets = [["JFK","SFO"], ["JFK","ATL"], ["SFO","ATL"],
                   ["ATL","JFK"], ["ATL","SFO"]]
Output: ["JFK", "ATL", "JFK", "SFO", "ATL", "SFO"]`,
      ],
      constraints: [
        '1 <= tickets.length <= 300',
        'Airport codes are three uppercase letters',
        'from !== to for every ticket',
      ],
      followUp:
        'Plain greedy DFS can strand you at a dead end. Appending on the way back out fixes it — why?',
      stub: `
export function findItinerary(tickets: string[][]): string[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 94,
      title: 'Min Cost to Connect All Points',
      slug: 'min-cost-to-connect-all-points',
      difficulty: 'Medium',
      leetcode: 'min-cost-to-connect-all-points',
      pattern: "Prim's minimum spanning tree on a complete graph",
      complexity: 'O(n^2 log n) time, O(n) space',
      statement: `
Given n points on a plane, connect all of them so that exactly one path exists between any
two. The cost of an edge is the Manhattan distance between its endpoints. Return the minimum
total cost.
`,
      examples: [
        `Input:  points = [[0,0], [2,2], [3,10], [5,2], [7,0]]
Output: 20`,
        `Input:  points = [[3, 12], [-2, 5], [-4, 1]]
Output: 18`,
      ],
      constraints: [
        '1 <= points.length <= 1000',
        '-10^6 <= xi, yi <= 10^6',
        'All points are distinct',
      ],
      followUp: 'The graph is complete, so Prim beats Kruskal here. Why?',
      stub: `
export function minCostConnectPoints(points: number[][]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 95,
      title: 'Network Delay Time',
      slug: 'network-delay-time',
      difficulty: 'Medium',
      leetcode: 'network-delay-time',
      pattern: "Dijkstra's shortest path from a single source",
      complexity: 'O(E log V) time, O(V + E) space',
      statement: `
times[i] = [u, v, w] is a directed edge from node u to node v taking w time. A signal is sent
from node k; return the time it takes for every one of the n nodes to receive it, or -1 when
some node never does.
`,
      examples: [
        `Input:  times = [[2,1,1], [2,3,1], [3,4,1]], n = 4, k = 2
Output: 2`,
        `Input:  times = [[1, 2, 1]], n = 2, k = 1
Output: 1`,
        `Input:  times = [[1, 2, 1]], n = 2, k = 2
Output: -1`,
      ],
      constraints: [
        '1 <= k <= n <= 100 and 1 <= times.length <= 6000',
        '1 <= ui, vi <= n and ui !== vi',
        '0 <= wi <= 100, with all (ui, vi) pairs unique',
      ],
      followUp: 'The answer is the maximum of the shortest distances, not their sum.',
      stub: `
export function networkDelayTime(times: number[][], n: number, k: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 96,
      title: 'Swim in Rising Water',
      slug: 'swim-in-rising-water',
      difficulty: 'Hard',
      leetcode: 'swim-in-rising-water',
      pattern: 'Dijkstra on max-edge cost (or binary search + flood fill)',
      complexity: 'O(n^2 log n) time, O(n^2) space',
      statement: `
grid[i][j] is the elevation of a square. At time t, water depth is t everywhere, and you may
swim from a square to a 4-directionally adjacent one only when both elevations are at most t.
Swimming is instantaneous. Return the least time to reach the bottom-right corner from the
top-left one.
`,
      examples: [
        `Input:  grid = [[0, 2], [1, 3]]
Output: 3`,
        `Input:  grid = [[0,1,2,3,4], [24,23,22,21,5], [12,13,14,15,16],
                 [11,17,18,19,20], [10,9,8,7,6]]
Output: 16`,
      ],
      constraints: [
        'n === grid.length === grid[i].length and 1 <= n <= 50',
        'grid[i][j] is a permutation of 0 .. n^2 - 1',
      ],
      followUp: 'The path cost is the maximum cell on the path, not the sum. Adjust the relaxation.',
      stub: `
export function swimInWater(grid: number[][]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 97,
      title: 'Alien Dictionary',
      slug: 'alien-dictionary',
      difficulty: 'Hard',
      leetcode: 'alien-dictionary',
      pattern: 'Derive edges from adjacent word pairs, then topological sort',
      complexity: 'O(total characters) time, O(1) space (26 letters)',
      statement: `
A list of words is sorted according to an unknown alphabet that uses the usual lowercase
letters. Derive an ordering of those letters consistent with the sorting and return it as a
string. Return "" when the input is contradictory; when several orders are valid, any one is
accepted.
`,
      examples: [
        `Input:  words = ["wrt", "wrf", "er", "ett", "rftt"]
Output: "wertf"`,
        `Input:  words = ["z", "x"]
Output: "zx"`,
        `Input:  words = ["z", "x", "z"]
Output: ""         // contradictory`,
      ],
      constraints: [
        '1 <= words.length <= 100 and 1 <= words[i].length <= 100',
        'words[i] consists of lowercase English letters',
      ],
      followUp:
        'The prefix case is the trap: ["abc", "ab"] is invalid input, not a missing edge.',
      stub: `
export function alienOrder(words: string[]): string {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 98,
      title: 'Cheapest Flights Within K Stops',
      slug: 'cheapest-flights-within-k-stops',
      difficulty: 'Medium',
      leetcode: 'cheapest-flights-within-k-stops',
      pattern: 'Bellman-Ford limited to k + 1 relaxation rounds',
      complexity: 'O(k * E) time, O(V) space',
      statement: `
flights[i] = [from, to, price] describes a directed flight. Return the cheapest price from
src to dst using at most k stops, or -1 when no such route exists.
`,
      examples: [
        `Input:  n = 4, flights = [[0,1,100], [1,2,100], [2,0,100], [1,3,600], [2,3,200]],
        src = 0, dst = 3, k = 1
Output: 700`,
        `Input:  n = 3, flights = [[0,1,100], [1,2,100], [0,2,500]], src = 0, dst = 2, k = 1
Output: 200`,
        `Input:  n = 3, flights = [[0,1,100], [1,2,100], [0,2,500]], src = 0, dst = 2, k = 0
Output: 500`,
      ],
      constraints: [
        '1 <= n <= 100 and 0 <= flights.length <= n * (n - 1) / 2',
        '0 <= src, dst, k < n and src !== dst',
        '1 <= price <= 10^4, with no duplicate flights',
      ],
      followUp:
        'Relaxing in place lets one round use edges added in the same round. Snapshot the distances.',
      stub: `
export function findCheapestPrice(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number,
): number {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
