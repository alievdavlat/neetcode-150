/**
 * 143. Detect Squares   ·   Medium   ·   Math & Geometry
 *
 * Design a structure that collects points on a plane and answers queries.
 * add(point) records a point, duplicates allowed. count(point) returns how
 * many axis-aligned squares can be formed using the query point plus three
 * recorded points, where all four corners are distinct positions.
 *
 * Example 1:
 *   Input:  add([3,10]), add([11,2]), add([3,2]),
 *           count([11,10]), count([14,8]), add([11,2]), count([11,10])
 *   Output: 1, 0, 2
 *
 * Constraints:
 *   - 0 <= x, y <= 1000
 *   - At most 3000 calls to add and count in total
 *
 * Follow-up: Fix the diagonal corner first — the other two are then forced.
 *
 * Pattern:   Point count map, enumerate the diagonal partner
 * Target:    O(1) add, O(points) count
 * LeetCode:  https://leetcode.com/problems/detect-squares/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=133913s  (37:11:53)
 */
export class DetectSquares {
  add(point: [number, number]): void {
    throw new Error('Not implemented');
  }

  count(point: [number, number]): number {
    throw new Error('Not implemented');
  }
}
