/**
 * 3036. Hamming   ·   Easy   ·   Exercism
 *
 * Calculate the Hamming distance between two DNA strands.
 *
 * We read DNA using the letters C, A, G and T. Two strands might look like
 * this:
 *
 * GAGCCTACTAACGGGAT CATCGTAATGACGGCCT ^ ^ ^ ^ ^ ^^
 *
 * They have 7 differences, and therefore the Hamming distance is 7.
 *
 * The Hamming distance is only defined for sequences of equal length, so an
 * attempt to calculate it between sequences of different lengths should not
 * work.
 *
 * Example 1:
 *   Input:  strand1 = "", strand2 = ""
 *   Output: 0
 *
 * Example 2:
 *   Input:  strand1 = "A", strand2 = "A"
 *   Output: 0
 *
 * Example 3:
 *   Input:  strand1 = "G", strand2 = "T"
 *   Output: 1
 *
 * Example 4:
 *   Input:  strand1 = "GGACTGAAATCTG", strand2 = "GGACTGAAATCTG"
 *   Output: 0
 *
 * Example 5:
 *   Input:  strand1 = "GGACGGATTCTG", strand2 = "AGGACGGATTCT"
 *   Output: 9
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function distance(strand1: string, strand2: string): number {
  throw new Error('Not implemented');
}
