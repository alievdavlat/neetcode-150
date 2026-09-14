/**
 * 87. Course Schedule   ·   Medium   ·   Graphs
 *
 * There are numCourses courses labelled 0 to numCourses - 1, and
 * prerequisites[i] = [a, b] means course b must be taken before course a.
 * Return whether it is possible to finish all courses.
 *
 * Example 1:
 *   Input:  numCourses = 2, prerequisites = [[1, 0]]
 *   Output: true
 *
 * Example 2:
 *   Input:  numCourses = 2, prerequisites = [[1, 0], [0, 1]]
 *   Output: false      // the two depend on each other
 *
 * Constraints:
 *   - 1 <= numCourses <= 2000
 *   - 0 <= prerequisites.length <= 5000
 *   - All prerequisite pairs are unique
 *
 * Follow-up: Three states, not two: unvisited, in the current path, fully
 * done.
 *
 * Pattern:   Cycle detection in a directed graph (DFS colours or Kahn)
 * Target:    O(V + E) time and space
 * LeetCode:  https://leetcode.com/problems/course-schedule/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=71723s  (19:55:23)
 */
export function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  throw new Error('Not implemented');
}
