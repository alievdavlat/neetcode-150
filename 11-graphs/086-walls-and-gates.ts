/**
 * 86. Walls and Gates   ·   Medium   ·   Graphs
 *
 * A grid holds -1 for a wall, 0 for a gate and 2147483647 (treated as
 * infinity) for an empty room. Fill each empty room with the distance to its
 * nearest gate, leaving rooms that no gate can reach untouched. Modify the
 * grid in place.
 *
 * Example 1:
 *   Input:  rooms = [[INF, -1, 0, INF], [INF, INF, INF, -1],
 *                    [INF, -1, INF, -1], [0, -1, INF, INF]]
 *   Output: [[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]]
 *
 * Example 2:
 *   Input:  rooms = [[-1]]
 *   Output: [[-1]]
 *
 * Constraints:
 *   - m === rooms.length, n === rooms[i].length
 *   - 1 <= m, n <= 250
 *   - rooms[i][j] is -1, 0 or 2147483647
 *
 * Follow-up: BFS from each room is O((mn)^2). One BFS from all gates at once
 * is linear.
 *
 * Pattern:   Multi-source BFS from every gate
 * Target:    O(rows * cols) time and space
 * LeetCode:  https://leetcode.com/problems/walls-and-gates/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=69688s  (19:21:28)
 */
export function wallsAndGates(rooms: number[][]): void {
  throw new Error('Not implemented');
}
