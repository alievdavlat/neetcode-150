/**
 * 84. Surrounded Regions   ·   Medium   ·   Graphs
 *
 * Given an m x n board of 'X' and 'O', capture every region of 'O' that is
 * fully surrounded by 'X' by flipping those cells to 'X'. A region is
 * connected horizontally or vertically, and a region touching the border is
 * never captured. Modify the board in place.
 *
 * Example 1:
 *   Input:  board = [["X","X","X","X"], ["X","O","O","X"],
 *                    ["X","X","O","X"], ["X","O","X","X"]]
 *   Output: [["X","X","X","X"], ["X","X","X","X"],
 *            ["X","X","X","X"], ["X","O","X","X"]]
 *
 * Example 2:
 *   Input:  board = [["X"]]
 *   Output: [["X"]]
 *
 * Constraints:
 *   - m === board.length, n === board[i].length
 *   - 1 <= m, n <= 200 and board[i][j] is 'X' or 'O'
 *
 * Follow-up: Solve the complement of the problem — it is much easier to state.
 *
 * Pattern:   Mark border-connected regions first, flip the rest
 * Target:    O(rows * cols) time and space
 * LeetCode:  https://leetcode.com/problems/surrounded-regions/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=68045s  (18:54:05)
 */
export function solve(board: string[][]): void {
  throw new Error('Not implemented');
}
