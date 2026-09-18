/**
 * 3043. Largest Series Product   ·   Easy   ·   Exercism
 *
 * Your task is to look for patterns in the long sequence of digits in the
 * encrypted signal.
 *
 * The technique you're going to use here is called the largest series product.
 *
 * Let's define a few terms, first.
 *
 * - input: the sequence of digits that you need to analyze
 * - series: a sequence of adjacent digits (those that are next to each other)
 *   that is contained within the input
 * - span: how many digits long each series is
 * - product: what you get when you multiply numbers together
 *
 * Let's work through an example, with the input "63915".
 *
 * - To form a series, take adjacent digits in the original input.
 * - If you are working with a span of 3, there will be three possible series:
 * - "639"
 * - "391"
 * - "915"
 * - Then we need to calculate the product of each series:
 * - The product of the series "639" is 162 (6 × 3 × 9 = 162)
 * - The product of the series "391" is 27 (3 × 9 × 1 = 27)
 * - The product of the series "915" is 45 (9 × 1 × 5 = 45)
 * - 162 is bigger than both 27 and 45, so the largest series product of
 *   "63915" is from the series "639".
 * So the answer is 162.
 *
 * Example 1:
 *   Input:  digits = "29", span = 2
 *   Output: 18
 *
 * Example 2:
 *   Input:  digits = "0123456789", span = 2
 *   Output: 72
 *
 * Example 3:
 *   Input:  digits = "576802143", span = 2
 *   Output: 48
 *
 * Example 4:
 *   Input:  digits = "0123456789", span = 3
 *   Output: 504
 *
 * Example 5:
 *   Input:  digits = "1027839564", span = 3
 *   Output: 270
 *
 * Example 6:
 *   Input:  digits = "0123456789", span = 5
 *   Output: 15120
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function largestProduct(digits: string, span: number): number {
  throw new Error('Not implemented');
}
