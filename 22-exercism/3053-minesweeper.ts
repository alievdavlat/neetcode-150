/**
 * 3053. Minesweeper   ·   Easy   ·   Exercism
 *
 * Your task is to add the mine counts to empty squares in a completed
 * Minesweeper board. The board itself is a rectangle composed of squares that
 * are either empty (' ') or a mine ('').
 *
 * For each empty square, count the number of mines adjacent to it
 * (horizontally, vertically, diagonally). If the empty square has no adjacent
 * mines, leave it empty. Otherwise replace it with the adjacent mines count.
 *
 * For example, you may receive a 5 x 4 board like this (empty spaces are
 * represented here with the '·' character for display on screen):
 *
 * Which your code should transform into this:
 *
 * Example 1:
 *   Input:  minefield = []
 *   Output: []
 *
 * Example 2:
 *   Input:  minefield = [""]
 *   Output: [""]
 *
 * Example 3:
 *   Input:  minefield = ["   ","   ","   "]
 *   Output: ["   ","   ","   "]
 *
 * Example 4:
 *   Input:  minefield = ["***","***","***"]
 *   Output: ["***","***","***"]
 *
 * Example 5:
 *   Input:  minefield = ["   "," * ","   "]
 *   Output: ["111","1*1","111"]
 *
 * Example 6:
 *   Input:  minefield = ["***","* *","***"]
 *   Output: ["***","*8*","***"]
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function annotate(minefield: string[]): string[] {
  throw new Error('Not implemented');
}
