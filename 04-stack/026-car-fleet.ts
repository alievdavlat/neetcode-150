/**
 * 26. Car Fleet   ·   Medium   ·   Stack
 *
 * n cars drive toward a destination at position target on a one-lane road. Car
 * i starts at position[i] and drives at speed[i]. A faster car catching a
 * slower one must slow down to its speed, and the two then travel bumper to
 * bumper as one fleet — a fleet can also be a single car that never catches
 * anyone. Cars that meet exactly at the destination still count as one fleet.
 * Return how many fleets arrive at the destination.
 *
 * Example 1:
 *   Input:  target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]
 *   Output: 3
 *
 * Example 2:
 *   Input:  target = 10, position = [3], speed = [3]
 *   Output: 1
 *
 * Example 3:
 *   Input:  target = 100, position = [0, 2, 4], speed = [4, 2, 1]
 *   Output: 1
 *
 * Constraints:
 *   - n === position.length === speed.length
 *   - 1 <= n <= 10^5
 *   - 0 < target <= 10^6
 *   - 0 <= position[i] < target, all positions distinct
 *   - 0 < speed[i] <= 10^6
 *
 * Follow-up: Think in arrival times, not distances — who can never catch whom?
 *
 * Pattern:   Sort by position descending, stack of arrival times
 * Target:    O(n log n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/car-fleet/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=20754s  (05:45:54)
 */
export function carFleet(target: number, position: number[], speed: number[]): number {
  throw new Error('Not implemented');
}
