/**
 * 3081. Secret Handshake   ·   Easy   ·   Exercism
 *
 * Your task is to convert a number between 1 and 31 to a sequence of actions
 * in the secret handshake.
 *
 * The sequence of actions is chosen by looking at the rightmost five digits of
 * the number once it's been converted to binary. Start at the right-most digit
 * and move left.
 *
 * The actions for each number place are:
 *
 * Let's use the number 9 as an example:
 *
 * - 9 in binary is 1001.
 * - The digit that is farthest to the right is 1, so the first action is wink.
 * - Going left, the next digit is 0, so there is no double-blink.
 * - Going left again, the next digit is 0, so you leave your eyes open.
 * - Going left again, the next digit is 1, so you jump.
 *
 * That was the last digit, so the final code is:
 *
 * Given the number 26, which is 11010 in binary, we get the following actions:
 *
 * - double blink
 * - jump
 * - reverse actions
 *
 * The secret handshake for 26 is therefore:
 *
 * exercism/note If you aren't sure what binary is or how it works, check out
 * [this binary tutorial][intro-to-binary].
 *
 * [intro-to-binary]:
 * https://medium.com/basecs/bits-bytes-building-with-binary-13cb4289aafa
 *
 * Example 1:
 *   Input:  number = 1
 *   Output: ["wink"]
 *
 * Example 2:
 *   Input:  number = 2
 *   Output: ["double blink"]
 *
 * Example 3:
 *   Input:  number = 4
 *   Output: ["close your eyes"]
 *
 * Example 4:
 *   Input:  number = 8
 *   Output: ["jump"]
 *
 * Example 5:
 *   Input:  number = 3
 *   Output: ["wink","double blink"]
 *
 * Example 6:
 *   Input:  number = 19
 *   Output: ["double blink","wink"]
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function commands(number: number): string[] {
  throw new Error('Not implemented');
}
