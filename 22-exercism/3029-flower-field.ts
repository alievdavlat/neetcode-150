/**
 * 3029. Flower Field   ·   Easy   ·   Exercism
 *
 * Your task is to add flower counts to empty squares in a completed Flower
 * Field garden. The garden itself is a rectangle board composed of squares
 * that are either empty (' ') or a flower ('').
 *
 * For each empty square, count the number of flowers adjacent to it
 * (horizontally, vertically, diagonally). If the empty square has no adjacent
 * flowers, leave it empty. Otherwise replace it with the count of adjacent
 * flowers.
 *
 * For example, you may receive a 5 x 4 board like this (empty spaces are
 * represented here with the '·' character for display on screen):
 *
 * Which your code should transform into this:
 *
 * Example 1:
 *   Input:  garden = []
 *   Output: []
 *
 * Example 2:
 *   Input:  garden = [""]
 *   Output: [""]
 *
 * Example 3:
 *   Input:  garden = ["   ","   ","   "]
 *   Output: ["   ","   ","   "]
 *
 * Example 4:
 *   Input:  garden = ["***","***","***"]
 *   Output: ["***","***","***"]
 *
 * Example 5:
 *   Input:  garden = ["   "," * ","   "]
 *   Output: ["111","1*1","111"]
 *
 * Example 6:
 *   Input:  garden = ["***","* *","***"]
 *   Output: ["***","*8*","***"]
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function annotate(garden: string[]): string[] {
  throw new Error('Not implemented');
}
