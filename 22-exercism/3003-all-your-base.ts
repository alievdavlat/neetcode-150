/**
 * 3003. All Your Base   ·   Easy   ·   Exercism
 *
 * Convert a sequence of digits in one base, representing a number, into a
 * sequence of digits in another base, representing the same number.
 *
 * exercism/note Try to implement the conversion yourself. Do not use something
 * else to perform the conversion for you.
 *
 * In positional notation, a number in base b can be understood as a linear
 * combination of powers of b.
 *
 * The number 42, in base 10, means:
 *
 * (4 × 10¹) + (2 × 10⁰)
 *
 * The number 101010, in base 2, means:
 *
 * (1 × 2⁵) + (0 × 2⁴) + (1 × 2³) + (0 × 2²) + (1 × 2¹) + (0 × 2⁰)
 *
 * The number 1120, in base 3, means:
 *
 * (1 × 3³) + (1 × 3²) + (2 × 3¹) + (0 × 3⁰)
 *
 * Yes. Those three numbers above are exactly the same. Congratulations!
 *
 * [positional-notation]: https://en.wikipedia.org/wiki/Positionalnotation
 *
 * Example 1:
 *   Input:  inputBase = 2, digits = [1], outputBase = 10
 *   Output: [1]
 *
 * Example 2:
 *   Input:  inputBase = 2, digits = [1,0,1], outputBase = 10
 *   Output: [5]
 *
 * Example 3:
 *   Input:  inputBase = 10, digits = [5], outputBase = 2
 *   Output: [1,0,1]
 *
 * Example 4:
 *   Input:  inputBase = 2, digits = [1,0,1,0,1,0], outputBase = 10
 *   Output: [4,2]
 *
 * Example 5:
 *   Input:  inputBase = 10, digits = [4,2], outputBase = 2
 *   Output: [1,0,1,0,1,0]
 *
 * Example 6:
 *   Input:  inputBase = 3, digits = [1,1,2,0], outputBase = 16
 *   Output: [2,10]
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function rebase(inputBase: number, digits: number[], outputBase: number): number[] {
  throw new Error('Not implemented');
}
