/**
 * 125. Gas Station   ·   Medium   ·   Greedy
 *
 * There are n gas stations on a circular route; station i holds gas[i] fuel
 * and it costs cost[i] to drive from station i to the next. Starting with an
 * empty tank, return the index of the only station you can start from to
 * complete the whole circuit, or -1 when none works.
 *
 * Example 1:
 *   Input:  gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]
 *   Output: 3
 *
 * Example 2:
 *   Input:  gas = [2, 3, 4], cost = [3, 4, 3]
 *   Output: -1
 *
 * Constraints:
 *   - n === gas.length === cost.length and 1 <= n <= 10^5
 *   - 0 <= gas[i], cost[i] <= 10^4
 *   - The answer, when it exists, is unique
 *
 * Follow-up: If the running tank goes negative at station j, no station
 * between the old start and j can work either. Prove that and the loop is one
 * pass.
 *
 * Pattern:   Total feasibility check + reset the start on a deficit
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/gas-station/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=119222s  (33:07:02)
 */
export function canCompleteCircuit(gas: number[], cost: number[]): number {
  throw new Error('Not implemented');
}
