export default {
  category: 'Graphs',
  dir: '11-graphs',
  intro: `
Most of these are grids in disguise: a cell is a node, an adjacent cell is an edge. Pick the
traversal by the question — BFS when the answer is a distance or a number of rounds, DFS
when it is a shape, union-find when the question is only "same component or not".
`,
  problems: [
    {
      n: 80,
      title: 'Number of Islands',
      slug: 'number-of-islands',
      difficulty: 'Medium',
      leetcode: 'number-of-islands',
      pattern: 'Flood fill from every unvisited land cell',
      complexity: 'O(rows * cols) time and space',
      statement: `
Given an m x n grid of '1' (land) and '0' (water), count the islands. An island is land
connected horizontally or vertically, and the grid is surrounded by water on all four
edges.
`,
      examples: [
        `Input:  grid = [["1","1","1","1","0"], ["1","1","0","1","0"],
                 ["1","1","0","0","0"], ["0","0","0","0","0"]]
Output: 1`,
        `Input:  grid = [["1","1","0","0","0"], ["1","1","0","0","0"],
                 ["0","0","1","0","0"], ["0","0","0","1","1"]]
Output: 3`,
      ],
      constraints: [
        'm === grid.length, n === grid[i].length',
        '1 <= m, n <= 300',
        "grid[i][j] is '0' or '1'",
      ],
      followUp: 'Can you avoid a visited array by mutating the grid — and should you?',
      stub: `
export function numIslands(grid: string[][]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 81,
      title: 'Clone Graph',
      slug: 'clone-graph',
      difficulty: 'Medium',
      leetcode: 'clone-graph',
      pattern: 'DFS/BFS with an original -> clone map',
      complexity: 'O(V + E) time and space',
      statement: `
Given a reference to a node in a connected undirected graph, return a deep copy of the whole
graph. Each node holds a value and a list of neighbours; the copy must share no node with
the original. A null input returns null.
`,
      examples: [
        `Input:  adjList = [[2, 4], [1, 3], [2, 4], [1, 3]]
Output: an independent graph with the same shape`,
        `Input:  adjList = [[]]
Output: a single node with no neighbours`,
        `Input:  adjList = []
Output: null`,
      ],
      constraints: [
        'The graph has 0 to 100 nodes',
        '1 <= Node.val <= 100 and values are unique',
        'The graph is connected, undirected and has no self-loops or repeated edges',
      ],
      followUp: 'The map must be written before you recurse, not after. Why?',
      imports: `import { GraphNode } from '../shared/types.ts';`,
      stub: `
export function cloneGraph(node: GraphNode | null): GraphNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 82,
      title: 'Max Area of Island',
      slug: 'max-area-of-island',
      difficulty: 'Medium',
      leetcode: 'max-area-of-island',
      pattern: 'Flood fill returning the size of each component',
      complexity: 'O(rows * cols) time and space',
      statement: `
Given a binary grid where 1 is land and 0 is water, return the area of the largest island —
the largest number of 1-cells connected horizontally or vertically. Return 0 when there is
no island.
`,
      examples: [
        `Input:  grid = [[0,0,1,0,0], [0,0,0,0,0], [0,1,1,0,0], [0,1,0,0,0]]
Output: 3`,
        `Input:  grid = [[0, 0, 0, 0]]
Output: 0`,
      ],
      constraints: [
        'm === grid.length, n === grid[i].length',
        '1 <= m, n <= 50',
        'grid[i][j] is 0 or 1',
      ],
      stub: `
export function maxAreaOfIsland(grid: number[][]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 83,
      title: 'Pacific Atlantic Water Flow',
      slug: 'pacific-atlantic-water-flow',
      difficulty: 'Medium',
      leetcode: 'pacific-atlantic-water-flow',
      pattern: 'Reverse traversal inward from both shorelines',
      complexity: 'O(rows * cols) time and space',
      statement: `
heights is an m x n grid of cell elevations. The Pacific touches the top and left edges, the
Atlantic the bottom and right edges. Water flows from a cell to a neighbour of equal or
lower height. Return the coordinates of every cell from which water can reach both oceans.
`,
      examples: [
        `Input:  heights = [[1,2,2,3,5], [3,2,3,4,4], [2,4,5,3,1],
                    [6,7,1,4,5], [5,1,1,2,4]]
Output: [[0,4], [1,3], [1,4], [2,2], [3,0], [3,1], [4,0]]`,
        `Input:  heights = [[1]]
Output: [[0, 0]]`,
      ],
      constraints: [
        'm === heights.length, n === heights[i].length',
        '1 <= m, n <= 200',
        '0 <= heights[i][j] <= 10^5',
      ],
      followUp:
        'Running a search per cell is O((mn)^2). Start at the oceans and walk uphill instead.',
      stub: `
export function pacificAtlantic(heights: number[][]): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 84,
      title: 'Surrounded Regions',
      slug: 'surrounded-regions',
      difficulty: 'Medium',
      leetcode: 'surrounded-regions',
      pattern: 'Mark border-connected regions first, flip the rest',
      complexity: 'O(rows * cols) time and space',
      statement: `
Given an m x n board of 'X' and 'O', capture every region of 'O' that is fully surrounded by
'X' by flipping those cells to 'X'. A region is connected horizontally or vertically, and a
region touching the border is never captured. Modify the board in place.
`,
      examples: [
        `Input:  board = [["X","X","X","X"], ["X","O","O","X"],
                 ["X","X","O","X"], ["X","O","X","X"]]
Output: [["X","X","X","X"], ["X","X","X","X"],
         ["X","X","X","X"], ["X","O","X","X"]]`,
        `Input:  board = [["X"]]
Output: [["X"]]`,
      ],
      constraints: [
        'm === board.length, n === board[i].length',
        "1 <= m, n <= 200 and board[i][j] is 'X' or 'O'",
      ],
      followUp: 'Solve the complement of the problem — it is much easier to state.',
      stub: `
export function solve(board: string[][]): void {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 85,
      title: 'Rotting Oranges',
      slug: 'rotting-oranges',
      difficulty: 'Medium',
      leetcode: 'rotting-oranges',
      pattern: 'Multi-source BFS counting rounds',
      complexity: 'O(rows * cols) time and space',
      statement: `
In a grid, 0 is empty, 1 is a fresh orange and 2 is a rotten one. Every minute, a fresh
orange adjacent (4-directionally) to a rotten one becomes rotten. Return the minutes until
no fresh orange remains, or -1 when that never happens.
`,
      examples: [
        `Input:  grid = [[2,1,1], [1,1,0], [0,1,1]]
Output: 4`,
        `Input:  grid = [[2,1,1], [0,1,1], [1,0,1]]
Output: -1         // the bottom-left orange is unreachable`,
        `Input:  grid = [[0, 2]]
Output: 0          // nothing fresh to rot`,
      ],
      constraints: [
        'm === grid.length, n === grid[i].length',
        '1 <= m, n <= 10',
        'grid[i][j] is 0, 1 or 2',
      ],
      followUp: 'All rotten cells start in the queue together — that is what makes the count a time.',
      stub: `
export function orangesRotting(grid: number[][]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 86,
      title: 'Walls and Gates',
      slug: 'walls-and-gates',
      difficulty: 'Medium',
      leetcode: 'walls-and-gates',
      pattern: 'Multi-source BFS from every gate',
      complexity: 'O(rows * cols) time and space',
      statement: `
A grid holds -1 for a wall, 0 for a gate and 2147483647 (treated as infinity) for an empty
room. Fill each empty room with the distance to its nearest gate, leaving rooms that no gate
can reach untouched. Modify the grid in place.
`,
      examples: [
        `Input:  rooms = [[INF, -1, 0, INF], [INF, INF, INF, -1],
                 [INF, -1, INF, -1], [0, -1, INF, INF]]
Output: [[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]]`,
        `Input:  rooms = [[-1]]
Output: [[-1]]`,
      ],
      constraints: [
        'm === rooms.length, n === rooms[i].length',
        '1 <= m, n <= 250',
        'rooms[i][j] is -1, 0 or 2147483647',
      ],
      followUp: 'BFS from each room is O((mn)^2). One BFS from all gates at once is linear.',
      stub: `
export function wallsAndGates(rooms: number[][]): void {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 87,
      title: 'Course Schedule',
      slug: 'course-schedule',
      difficulty: 'Medium',
      leetcode: 'course-schedule',
      pattern: 'Cycle detection in a directed graph (DFS colours or Kahn)',
      complexity: 'O(V + E) time and space',
      statement: `
There are numCourses courses labelled 0 to numCourses - 1, and prerequisites[i] = [a, b]
means course b must be taken before course a. Return whether it is possible to finish all
courses.
`,
      examples: [
        `Input:  numCourses = 2, prerequisites = [[1, 0]]
Output: true`,
        `Input:  numCourses = 2, prerequisites = [[1, 0], [0, 1]]
Output: false      // the two depend on each other`,
      ],
      constraints: [
        '1 <= numCourses <= 2000',
        '0 <= prerequisites.length <= 5000',
        'All prerequisite pairs are unique',
      ],
      followUp: 'Three states, not two: unvisited, in the current path, fully done.',
      stub: `
export function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 88,
      title: 'Course Schedule II',
      slug: 'course-schedule-ii',
      difficulty: 'Medium',
      leetcode: 'course-schedule-ii',
      pattern: 'Topological sort',
      complexity: 'O(V + E) time and space',
      statement: `
Same setup as Course Schedule, but now return a valid order in which all courses can be
taken. Any valid order is accepted; return an empty array when no order exists.
`,
      examples: [
        `Input:  numCourses = 2, prerequisites = [[1, 0]]
Output: [0, 1]`,
        `Input:  numCourses = 4, prerequisites = [[1,0], [2,0], [3,1], [3,2]]
Output: [0, 1, 2, 3]     // [0, 2, 1, 3] is equally valid`,
        `Input:  numCourses = 1, prerequisites = []
Output: [0]`,
      ],
      constraints: [
        '1 <= numCourses <= 2000',
        '0 <= prerequisites.length <= numCourses * (numCourses - 1)',
        'All prerequisite pairs are distinct',
      ],
      followUp: 'Kahn gives the order directly; DFS gives it reversed. Know which you wrote.',
      stub: `
export function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 89,
      title: 'Redundant Connection',
      slug: 'redundant-connection',
      difficulty: 'Medium',
      leetcode: 'redundant-connection',
      pattern: 'Union-find — the first edge that joins two already-connected nodes',
      complexity: 'O(n * alpha(n)) time, O(n) space',
      statement: `
A tree on n nodes had one extra edge added, producing a graph with exactly one cycle. Given
the edge list, return the edge that can be removed to make it a tree again. If several
answers exist, return the one that appears last in the input.
`,
      examples: [
        `Input:  edges = [[1, 2], [1, 3], [2, 3]]
Output: [2, 3]`,
        `Input:  edges = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]
Output: [1, 4]`,
      ],
      constraints: [
        'n === edges.length and 3 <= n <= 1000',
        '1 <= ai < bi <= n with no repeated edges and no self-loops',
        'The graph is connected',
      ],
      followUp: 'Processing edges in order means the answer is simply the first union that fails.',
      stub: `
export function findRedundantConnection(edges: number[][]): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 90,
      title: 'Number of Connected Components in an Undirected Graph',
      slug: 'number-of-connected-components-in-an-undirected-graph',
      difficulty: 'Medium',
      leetcode: 'number-of-connected-components-in-an-undirected-graph',
      pattern: 'Union-find with a component counter (or DFS per node)',
      complexity: 'O(V + E) time, O(V) space',
      statement: `
Given n nodes labelled 0 to n - 1 and a list of undirected edges, return the number of
connected components in the graph.
`,
      examples: [
        `Input:  n = 5, edges = [[0, 1], [1, 2], [3, 4]]
Output: 2`,
        `Input:  n = 5, edges = [[0, 1], [1, 2], [2, 3], [3, 4]]
Output: 1`,
      ],
      constraints: [
        '1 <= n <= 2000',
        '1 <= edges.length <= 5000',
        'No repeated edges and no self-loops',
      ],
      followUp: 'Start at n components and subtract one per successful union.',
      stub: `
export function countComponents(n: number, edges: number[][]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 91,
      title: 'Graph Valid Tree',
      slug: 'graph-valid-tree',
      difficulty: 'Medium',
      leetcode: 'graph-valid-tree',
      pattern: 'Exactly n - 1 edges and fully connected, no cycle',
      complexity: 'O(V + E) time, O(V) space',
      statement: `
Given n nodes labelled 0 to n - 1 and a list of undirected edges, return true when the graph
is a valid tree — connected and acyclic.
`,
      examples: [
        `Input:  n = 5, edges = [[0, 1], [0, 2], [0, 3], [1, 4]]
Output: true`,
        `Input:  n = 5, edges = [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]
Output: false      // 1 - 2 - 3 - 1 is a cycle`,
      ],
      constraints: [
        '1 <= n <= 2000',
        '0 <= edges.length <= 5000',
        'No self-loops and no duplicate edges',
      ],
      followUp: 'Two cheap checks settle it before you traverse anything. What are they?',
      stub: `
export function validTree(n: number, edges: number[][]): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 92,
      title: 'Word Ladder',
      slug: 'word-ladder',
      difficulty: 'Hard',
      leetcode: 'word-ladder',
      pattern: 'BFS over words, neighbours generated by wildcard patterns',
      complexity: 'O(n * L^2) time with pattern buckets',
      statement: `
Given beginWord, endWord and a dictionary wordList, a transformation sequence changes one
letter at a time and every intermediate word must be in wordList. Return the number of words
in the shortest such sequence from beginWord to endWord, counting both ends, or 0 when none
exists. beginWord does not need to be in wordList.
`,
      examples: [
        `Input:  beginWord = "hit", endWord = "cog",
        wordList = ["hot", "dot", "dog", "lot", "log", "cog"]
Output: 5          // hit -> hot -> dot -> dog -> cog`,
        `Input:  beginWord = "hit", endWord = "cog",
        wordList = ["hot", "dot", "dog", "lot", "log"]
Output: 0          // "cog" is not in the list`,
      ],
      constraints: [
        '1 <= beginWord.length <= 10 and endWord.length === beginWord.length',
        '1 <= wordList.length <= 5000',
        'All words are lowercase, the same length, and unique',
      ],
      followUp: 'Comparing every pair of words is O(n^2). Bucket by patterns like h*t instead.',
      stub: `
export function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
