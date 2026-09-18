/**
 * 3032. Game Of Life   ·   Easy   ·   Exercism
 *
 * After each generation, the cells interact with their eight neighbors, which
 * are cells adjacent horizontally, vertically, or diagonally.
 *
 * The following rules are applied to each cell:
 *
 * - Any live cell with two or three live neighbors lives on.
 * - Any dead cell with exactly three live neighbors becomes a live cell.
 * - All other cells die or stay dead.
 *
 * Given a matrix of 1s and 0s (corresponding to live and dead cells), apply
 * the rules to each cell, and return the next generation.
 *
 * Example 1:
 *   Input:  matrix = []
 *   Output: []
 *
 * Example 2:
 *   Input:  matrix = [[0,0,0],[0,1,0],[0,0,0]]
 *   Output: [[0,0,0],[0,0,0],[0,0,0]]
 *
 * Example 3:
 *   Input:  matrix = [[0,0,0],[0,1,0],[0,1,0]]
 *   Output: [[0,0,0],[0,0,0],[0,0,0]]
 *
 * Example 4:
 *   Input:  matrix = [[1,0,1],[1,0,1],[1,0,1]]
 *   Output: [[0,0,0],[1,0,1],[0,0,0]]
 *
 * Example 5:
 *   Input:  matrix = [[0,1,0],[1,0,0],[1,1,0]]
 *   Output: [[0,0,0],[1,0,0],[1,1,0]]
 *
 * Example 6:
 *   Input:  matrix = [[1,1,0],[0,0,0],[1,0,0]]
 *   Output: [[0,0,0],[1,1,0],[0,0,0]]
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function tick(matrix: number[][]): number[][] {
  throw new Error('Not implemented');
}
