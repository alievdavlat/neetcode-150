/**
 * 7. Valid Sudoku   ·   Medium   ·   Arrays & Hashing
 *
 * Given a 9 x 9 Sudoku board, decide whether the filled cells are valid. Only
 * the cells that already carry a digit need to be checked, and the board does
 * not have to be solvable. A board is valid when each row, each column, and
 * each of the nine 3 x 3 sub-boxes contains the digits 1-9 without repetition.
 * Empty cells are written as '.'.
 *
 * Example 1:
 *   Input:  a board whose first row is ["5","3",".",".","7",".",".",".","."]
 *           and the rest is a standard puzzle
 *   Output: true
 *
 * Example 2:
 *   Input:  the same board with the top-left 5 changed to 8
 *   Output: false     // two 8s now share the top-left 3x3 box
 *
 * Constraints:
 *   - board.length === 9 and board[i].length === 9
 *   - board[i][j] is a digit '1'-'9' or '.'
 *
 * Follow-up: Can you validate all three constraints in a single pass over the
 * board?
 *
 * Pattern:   Three sets of hash sets: rows, columns, 3x3 boxes
 * Target:    O(1) time and space (fixed 9x9 board)
 * LeetCode:  https://leetcode.com/problems/valid-sudoku/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=4113s  (01:08:33)
 */
export function isValidSudoku(board: string[][]): boolean {
  throw new Error('Not implemented');
}
