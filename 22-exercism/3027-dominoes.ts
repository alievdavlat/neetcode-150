/**
 * 3027. Dominoes   ·   Easy   ·   Exercism
 *
 * Make a chain of dominoes.
 *
 * Compute a way to order a given set of domino stones so that they form a
 * correct domino chain. In the chain, the dots on one half of a stone must
 * match the dots on the neighboring half of an adjacent stone. Additionally,
 * the dots on the halves of the stones without neighbors (the first and last
 * stone) must match each other.
 *
 * For example given the stones [2|1], [2|3] and [1|3] you should compute
 * something like [1|2] [2|3] [3|1] or [3|2] [2|1] [1|3] or [1|3] [3|2] [2|1]
 * etc, where the first and last numbers are the same.
 *
 * For stones [1|2], [4|1] and [2|3] the resulting chain is not valid: [4|1]
 * [1|2] [2|3]'s first and last numbers are not the same. 4 != 3
 *
 * Some test cases may use duplicate stones in a chain solution, assume that
 * multiple Domino sets are being used.
 *
 * Example 1:
 *   Input:  dominoes = []
 *   Output: true
 *
 * Example 2:
 *   Input:  dominoes = [[1,1]]
 *   Output: true
 *
 * Example 3:
 *   Input:  dominoes = [[1,2]]
 *   Output: false
 *
 * Example 4:
 *   Input:  dominoes = [[1,2],[3,1],[2,3]]
 *   Output: true
 *
 * Example 5:
 *   Input:  dominoes = [[1,2],[1,3],[2,3]]
 *   Output: true
 *
 * Example 6:
 *   Input:  dominoes = [[1,2],[4,1],[2,3]]
 *   Output: false
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function canChain(dominoes: number[][]): boolean {
  throw new Error('Not implemented');
}
