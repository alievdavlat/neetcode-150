/**
 * 3047. Luhn   ·   Easy   ·   Exercism
 *
 * Determine whether a number is valid according to the [Luhn formula][luhn].
 *
 * The number will be provided as a string.
 *
 * Strings of length 1 or less are not valid. Spaces are allowed in the input,
 * but they should be stripped before checking. All other non-digit characters
 * are disallowed.
 *
 * The number to be checked is 4539 3195 0343 6467.
 *
 * The first step of the Luhn algorithm is to start at the end of the number
 * and double every second digit, beginning with the second digit from the
 * right and moving left.
 *
 * If the result of doubling a digit is greater than 9, we subtract 9 from that
 * result. We end up with:
 *
 * Finally, we sum all digits. If the sum is evenly divisible by 10, the
 * original number is valid.
 *
 * 80 is evenly divisible by 10, so number 4539 3195 0343 6467 is valid!
 *
 * The number to be checked is 066 123 478.
 *
 * We start at the end of the number and double every second digit, beginning
 * with the second digit from the right and moving left.
 *
 * If the result of doubling a digit is greater than 9, we subtract 9 from that
 * result. We end up with:
 *
 * We sum the digits:
 *
 * 36 is not evenly divisible by 10, so number 066 123 478 is not valid!
 *
 * [luhn]: https://en.wikipedia.org/wiki/Luhnalgorithm
 *
 * Example 1:
 *   Input:  value = "1"
 *   Output: false
 *
 * Example 2:
 *   Input:  value = "0"
 *   Output: false
 *
 * Example 3:
 *   Input:  value = "059"
 *   Output: true
 *
 * Example 4:
 *   Input:  value = "59"
 *   Output: true
 *
 * Example 5:
 *   Input:  value = "055 444 285"
 *   Output: true
 *
 * Example 6:
 *   Input:  value = "055 444 286"
 *   Output: false
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function valid(value: string): boolean {
  throw new Error('Not implemented');
}
