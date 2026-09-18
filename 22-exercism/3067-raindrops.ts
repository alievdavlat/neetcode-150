/**
 * 3067. Raindrops   ·   Easy   ·   Exercism
 *
 * Your task is to convert a number into its corresponding raindrop sounds.
 *
 * If a given number:
 *
 * - is divisible by 3, add "Pling" to the result.
 * - is divisible by 5, add "Plang" to the result.
 * - is divisible by 7, add "Plong" to the result.
 * - is not divisible by 3, 5, or 7, the result should be the number as a
 *   string.
 *
 * - 28 is divisible by 7, but not 3 or 5, so the result would be "Plong".
 * - 30 is divisible by 3 and 5, but not 7, so the result would be
 *   "PlingPlang".
 * - 34 is not divisible by 3, 5, or 7, so the result would be "34".
 *
 * exercism/note A common way to test if one number is evenly divisible by
 * another is to compare the [remainder][remainder] or [modulus][modulo] to
 * zero. Most languages provide operators or functions for one (or both) of
 * these.
 *
 * [remainder]: https://exercism.org/docs/programming/operators/remainder
 * [modulo]: https://en.wikipedia.org/wiki/Modulooperation
 *
 * Example 1:
 *   Input:  number = 1
 *   Output: "1"
 *
 * Example 2:
 *   Input:  number = 3
 *   Output: "Pling"
 *
 * Example 3:
 *   Input:  number = 5
 *   Output: "Plang"
 *
 * Example 4:
 *   Input:  number = 7
 *   Output: "Plong"
 *
 * Example 5:
 *   Input:  number = 6
 *   Output: "Pling"
 *
 * Example 6:
 *   Input:  number = 8
 *   Output: "8"
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function convert(number: number): string {
  throw new Error('Not implemented');
}
