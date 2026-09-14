export default {
  category: 'Intervals',
  dir: '16-intervals',
  intro: `
Six problems, one opening move: sort by start, or by end, and know which one you chose and
why. Overlap is always the same test — one interval starts before the other ends — so the
difficulty lives entirely in what you sweep and what you keep.
`,
  problems: [
    {
      n: 130,
      title: 'Insert Interval',
      slug: 'insert-interval',
      difficulty: 'Medium',
      leetcode: 'insert-interval',
      pattern: 'Three phases: before, overlapping (merge), after',
      complexity: 'O(n) time, O(n) space',
      statement: `
intervals is sorted by start and contains no overlaps. Insert newInterval, merging where it
overlaps, and return the result still sorted and still non-overlapping.
`,
      examples: [
        `Input:  intervals = [[1, 3], [6, 9]], newInterval = [2, 5]
Output: [[1, 5], [6, 9]]`,
        `Input:  intervals = [[1,2], [3,5], [6,7], [8,10], [12,16]], newInterval = [4, 8]
Output: [[1, 2], [3, 10], [12, 16]]`,
        `Input:  intervals = [], newInterval = [5, 7]
Output: [[5, 7]]`,
      ],
      constraints: [
        '0 <= intervals.length <= 10^4',
        '0 <= start <= end <= 10^5',
        'intervals is sorted by start and non-overlapping',
      ],
      followUp: 'No sorting needed — the input is already ordered. One pass is enough.',
      stub: `
export function insert(intervals: number[][], newInterval: number[]): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 131,
      title: 'Merge Intervals',
      slug: 'merge-intervals',
      difficulty: 'Medium',
      leetcode: 'merge-intervals',
      pattern: 'Sort by start, extend the last interval while it overlaps',
      complexity: 'O(n log n) time, O(n) space',
      statement: `
Given a list of intervals, merge every group that overlaps and return the non-overlapping
intervals that cover exactly the same ranges.
`,
      examples: [
        `Input:  intervals = [[1,3], [2,6], [8,10], [15,18]]
Output: [[1, 6], [8, 10], [15, 18]]`,
        `Input:  intervals = [[1, 4], [4, 5]]
Output: [[1, 5]]       // touching counts as overlapping`,
      ],
      constraints: [
        '1 <= intervals.length <= 10^4',
        '0 <= start <= end <= 10^4',
      ],
      stub: `
export function merge(intervals: number[][]): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 132,
      title: 'Non-overlapping Intervals',
      slug: 'non-overlapping-intervals',
      difficulty: 'Medium',
      leetcode: 'non-overlapping-intervals',
      pattern: 'Activity selection — sort by end, keep the earliest finisher',
      complexity: 'O(n log n) time, O(1) space',
      statement: `
Return the minimum number of intervals you must remove so that the rest do not overlap.
Intervals that only touch at an endpoint do not overlap.
`,
      examples: [
        `Input:  intervals = [[1,2], [2,3], [3,4], [1,3]]
Output: 1          // remove [1, 3]`,
        `Input:  intervals = [[1, 2], [1, 2], [1, 2]]
Output: 2`,
        `Input:  intervals = [[1, 2], [2, 3]]
Output: 0`,
      ],
      constraints: [
        '1 <= intervals.length <= 10^5',
        '-5 * 10^4 <= start < end <= 5 * 10^4',
      ],
      followUp: 'Sorting by start also works but needs a different keep/drop rule. Try both.',
      stub: `
export function eraseOverlapIntervals(intervals: number[][]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 133,
      title: 'Meeting Rooms',
      slug: 'meeting-rooms',
      difficulty: 'Easy',
      leetcode: 'meeting-rooms',
      pattern: 'Sort by start, compare each start against the previous end',
      complexity: 'O(n log n) time, O(1) space',
      statement: `
Given meeting time intervals, return whether a single person could attend all of them —
that is, whether no two meetings overlap. A meeting ending exactly when another begins is
fine.
`,
      examples: [
        `Input:  intervals = [[0, 30], [5, 10], [15, 20]]
Output: false`,
        `Input:  intervals = [[7, 10], [2, 4]]
Output: true`,
      ],
      constraints: [
        '0 <= intervals.length <= 10^4',
        '0 <= start < end <= 10^6',
      ],
      stub: `
export function canAttendMeetings(intervals: number[][]): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 134,
      title: 'Meeting Rooms II',
      slug: 'meeting-rooms-ii',
      difficulty: 'Medium',
      leetcode: 'meeting-rooms-ii',
      pattern: 'Sweep line over separated start/end times (or a min-heap of end times)',
      complexity: 'O(n log n) time, O(n) space',
      statement: `
Given meeting time intervals, return the minimum number of rooms needed to hold all of them
at once.
`,
      examples: [
        `Input:  intervals = [[0, 30], [5, 10], [15, 20]]
Output: 2`,
        `Input:  intervals = [[7, 10], [2, 4]]
Output: 1`,
      ],
      constraints: [
        '0 <= intervals.length <= 10^4',
        '0 <= start < end <= 10^6',
      ],
      followUp:
        'Sorting starts and ends into two separate arrays turns this into a running counter. The answer is its peak.',
      stub: `
export function minMeetingRooms(intervals: number[][]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 135,
      title: 'Minimum Interval to Include Each Query',
      slug: 'minimum-interval-to-include-each-query',
      difficulty: 'Hard',
      leetcode: 'minimum-interval-to-include-each-query',
      pattern: 'Sort queries, sweep intervals in, min-heap by interval size',
      complexity: 'O((n + q) log(n + q)) time, O(n) space',
      statement: `
Given intervals and a list of queries, answer each query with the size of the smallest
interval that contains it, where size is end - start + 1. Answer -1 when no interval
contains the query. Answers must be returned in the original query order.
`,
      examples: [
        `Input:  intervals = [[1,4], [2,4], [3,6], [4,4]], queries = [2, 3, 4, 5]
Output: [3, 3, 1, 4]`,
        `Input:  intervals = [[2,3], [2,5], [1,8], [20,25]], queries = [2, 19, 5, 22]
Output: [2, -1, 4, 6]`,
      ],
      constraints: [
        '1 <= intervals.length, queries.length <= 10^5',
        '1 <= start <= end <= 10^7 and 1 <= query <= 10^7',
      ],
      followUp:
        'Processing queries in sorted order is what makes the heap valid — remember to restore the original order at the end.',
      stub: `
export function minInterval(intervals: number[][], queries: number[]): number[] {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
