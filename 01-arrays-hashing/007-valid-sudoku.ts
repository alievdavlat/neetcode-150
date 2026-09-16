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



// 1) VALID board → true
const board1 = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"]
];

// 2) INVALID — duplicate in 3x3 box
//    board2[0][0] = "8" and board2[2][2] = "8" are both in the top-left box
const board2 = [
  ["8", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"]
];

// 3) INVALID — duplicate in row
//    two "7" in the first row
const board3 = [
  ["5", "3", ".", ".", "7", ".", "7", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"]
];

// 4) INVALID — duplicate in column
//    two "8" in column 0: board4[3][0] and board4[6][0]
const board4 = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", ".", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  ["8", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"]
];

console.log(isValidSudoku(board1)); // true
console.log(isValidSudoku(board2)); // false  (box)
console.log(isValidSudoku(board3)); // false  (row)
console.log(isValidSudoku(board4)); // false  (column)