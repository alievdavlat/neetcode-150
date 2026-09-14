/**
 * 68. Task Scheduler   ·   Medium   ·   Heap / Priority Queue
 *
 * Each task takes one CPU interval, and two runs of the same task must be
 * separated by at least n intervals, during which the CPU may run another task
 * or sit idle. Given the task list and the cooldown n, return the minimum
 * number of intervals needed to finish all tasks.
 *
 * Example 1:
 *   Input:  tasks = ["A", "A", "A", "B", "B", "B"], n = 2
 *   Output: 8          // A B idle A B idle A B
 *
 * Example 2:
 *   Input:  tasks = ["A", "C", "A", "B", "D", "B"], n = 1
 *   Output: 6          // no idling needed
 *
 * Example 3:
 *   Input:  tasks = ["A", "A", "A", "B", "B", "B"], n = 3
 *   Output: 10
 *
 * Constraints:
 *   - 1 <= tasks.length <= 10^4
 *   - tasks[i] is an uppercase English letter
 *   - 0 <= n <= 100
 *
 * Follow-up: There is a closed-form answer driven only by the most frequent
 * task. Derive it, then check it against the heap simulation.
 *
 * Pattern:   Greedy on the most frequent task (heap + cooldown queue)
 * Target:    O(n) time, O(1) space (26 task types)
 * LeetCode:  https://leetcode.com/problems/task-scheduler/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=53444s  (14:50:44)
 */
export function leastInterval(tasks: string[], n: number): number {
  throw new Error('Not implemented');
}
