/**
 * 88. Course Schedule II   ·   Medium   ·   Graphs
 *
 * Same setup as Course Schedule, but now return a valid order in which all
 * courses can be taken. Any valid order is accepted; return an empty array
 * when no order exists.
 *
 * Example 1:
 *   Input:  numCourses = 2, prerequisites = [[1, 0]]
 *   Output: [0, 1]
 *
 * Example 2:
 *   Input:  numCourses = 4, prerequisites = [[1,0], [2,0], [3,1], [3,2]]
 *   Output: [0, 1, 2, 3]     // [0, 2, 1, 3] is equally valid
 *
 * Example 3:
 *   Input:  numCourses = 1, prerequisites = []
 *   Output: [0]
 *
 * Constraints:
 *   - 1 <= numCourses <= 2000
 *   - 0 <= prerequisites.length <= numCourses * (numCourses - 1)
 *   - All prerequisite pairs are distinct
 *
 * Follow-up: Kahn gives the order directly; DFS gives it reversed. Know which
 * you wrote.
 *
 * Pattern:   Topological sort
 * Target:    O(V + E) time and space
 * LeetCode:  https://leetcode.com/problems/course-schedule-ii/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=71723s  (19:55:23)
 */
export function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  throw new Error('Not implemented');
}
