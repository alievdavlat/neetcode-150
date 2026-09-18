/**
 * 3055. Ocr Numbers   ·   Easy   ·   Exercism
 *
 * Optical Character Recognition or OCR is software that converts images of
 * text into machine-readable text. Given a grid of characters representing
 * some digits, convert the grid to a string of digits. If the grid has
 * multiple rows of cells, the rows should be separated in the output with a
 * ",".
 *
 * - The grid is made of one of more lines of cells.
 * - Each line of the grid is made of one or more cells.
 * - Each cell is three columns wide and four rows high (3x4) and represents
 *   one digit.
 * - Digits are drawn using pipes ("|"), underscores (""), and spaces (" ").
 *
 * - If the input is not a valid size, your program should indicate there is an
 *   error.
 * - If the input is the correct size, but a cell is not recognizable, your
 *   program should output a "?" for that character.
 *
 * The following input (without the comments) is converted to "1234567890".
 *
 * The following input is converted to "123,456,789".
 *
 * <!-- prettier-ignore-start -->
 *
 * <!-- prettier-ignore-end -->
 *
 * Example 1:
 *   Input:  rows = [" _ ","| |","|_|","   "]
 *   Output: "0"
 *
 * Example 2:
 *   Input:  rows = ["   ","  |","  |","   "]
 *   Output: "1"
 *
 * Example 3:
 *   Input:  rows = ["   ","  _","  |","   "]
 *   Output: "?"
 *
 * Example 4:
 *   Input:  rows = ["       _     _        _  _ ","  |  || |  || |  |  || || |","  |  ||_|  ||_|  |  ||_||_|","                           "]
 *   Output: "110101100"
 *
 * Example 5:
 *   Input:  rows = ["       _     _           _ ","  |  || |  || |     || || |","  |  | _|  ||_|  |  ||_||_|","                           "]
 *   Output: "11?10?1?0"
 *
 * Example 6:
 *   Input:  rows = [" _ "," _|","|_ ","   "]
 *   Output: "2"
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function convert(rows: string[]): string {
  throw new Error('Not implemented');
}
