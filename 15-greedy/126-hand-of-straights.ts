/**
 * 126. Hand of Straights   ·   Medium   ·   Greedy
 *
 * Given a hand of integer cards and a group size, decide whether the hand can
 * be split entirely into groups of exactly groupSize consecutive cards.
 *
 * Example 1:
 *   Input:  hand = [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize = 3
 *   Output: true       // [1,2,3], [2,3,4], [6,7,8]
 *
 * Example 2:
 *   Input:  hand = [1, 2, 3, 4, 5], groupSize = 4
 *   Output: false
 *
 * Constraints:
 *   - 1 <= hand.length <= 10^4
 *   - 0 <= hand[i] <= 10^9
 *   - 1 <= groupSize <= hand.length
 *
 * Follow-up: The smallest remaining card has no choice about which group it
 * joins.
 *
 * Pattern:   Count map, always start a group at the smallest remaining card
 * Target:    O(n log n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/hand-of-straights/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=119222s  (33:07:02)
 */
export function isNStraightHand(hand: number[], groupSize: number): boolean {
  throw new Error('Not implemented');
}
