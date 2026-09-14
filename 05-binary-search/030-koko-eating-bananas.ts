/**
 * 30. Koko Eating Bananas   ·   Medium   ·   Binary Search
 *
 * Koko eats bananas at k per hour. Each hour she picks one pile and eats up to
 * k bananas from it; if the pile has fewer than k left she eats it and waits
 * out the rest of the hour. Given piles and h hours, return the smallest k
 * that lets her finish every pile within h hours.
 *
 * Example 1:
 *   Input:  piles = [3, 6, 7, 11], h = 8
 *   Output: 4
 *
 * Example 2:
 *   Input:  piles = [30, 11, 23, 4, 20], h = 5
 *   Output: 30
 *
 * Example 3:
 *   Input:  piles = [30, 11, 23, 4, 20], h = 6
 *   Output: 23
 *
 * Constraints:
 *   - 1 <= piles.length <= 10^4
 *   - piles.length <= h <= 10^9
 *   - 1 <= piles[i] <= 10^9
 *
 * Follow-up: What is the search space, and why is "can finish in h hours"
 * monotone in k?
 *
 * Pattern:   Binary search over the answer range
 * Target:    O(n log(max pile)) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/koko-eating-bananas/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=24383s  (06:46:23)
 */
export function minEatingSpeed(piles: number[], h: number): number {
  throw new Error('Not implemented');
}
