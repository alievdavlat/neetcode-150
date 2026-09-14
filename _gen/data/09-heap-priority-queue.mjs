export default {
  category: 'Heap / Priority Queue',
  dir: '09-heap-priority-queue',
  intro: `
JavaScript ships no priority queue, so the first job here is writing a binary heap once and
reusing it — put it in shared/ when you get tired of retyping it. The recurring insight is
that a size-k heap answers "top k" questions without sorting the whole input.
`,
  problems: [
    {
      n: 64,
      title: 'Kth Largest Element in a Stream',
      slug: 'kth-largest-element-in-a-stream',
      difficulty: 'Easy',
      leetcode: 'kth-largest-element-in-a-stream',
      pattern: 'Min-heap capped at size k',
      complexity: 'O(log k) per add, O(k) space',
      statement: `
Design a class that reports the kth largest value seen so far in a stream — the kth largest
in sorted order, not the kth distinct value. The constructor takes k and an initial array;
add(val) appends a value and returns the current kth largest. It is guaranteed that there
are always at least k elements when add returns.
`,
      examples: [
        `Input:  k = 3, nums = [4, 5, 8, 2]; add(3), add(5), add(10), add(9), add(4)
Output: 4, 5, 5, 8, 8`,
      ],
      constraints: [
        '1 <= k <= 10^4 and 0 <= nums.length <= 10^4',
        '-10^4 <= nums[i], val <= 10^4',
        'At most 10^4 calls to add',
      ],
      followUp: 'Why a min-heap of size k rather than a max-heap of everything?',
      stub: `
export class KthLargest {
  constructor(k: number, nums: number[]) {
    throw new Error('Not implemented');
  }

  add(val: number): number {
    throw new Error('Not implemented');
  }
}
`,
    },
    {
      n: 65,
      title: 'Last Stone Weight',
      slug: 'last-stone-weight',
      difficulty: 'Easy',
      leetcode: 'last-stone-weight',
      pattern: 'Max-heap, smash the two heaviest repeatedly',
      complexity: 'O(n log n) time, O(n) space',
      statement: `
Each turn, the two heaviest stones are smashed together. If they weigh the same, both are
destroyed; otherwise the lighter one is destroyed and the heavier one is left with the
difference. Return the weight of the last remaining stone, or 0 when none remain.
`,
      examples: [
        `Input:  stones = [2, 7, 4, 1, 8, 1]
Output: 1`,
        `Input:  stones = [1]
Output: 1`,
      ],
      constraints: ['1 <= stones.length <= 30', '1 <= stones[i] <= 1000'],
      stub: `
export function lastStoneWeight(stones: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 66,
      title: 'K Closest Points to Origin',
      slug: 'k-closest-points-to-origin',
      difficulty: 'Medium',
      leetcode: 'k-closest-points-to-origin',
      pattern: 'Max-heap of size k on squared distance (or quickselect)',
      complexity: 'O(n log k) time, O(k) space',
      statement: `
Given an array of points on the plane and an integer k, return the k points closest to the
origin by Euclidean distance. The answer may be returned in any order, and it is unique
apart from that ordering.
`,
      examples: [
        `Input:  points = [[1, 3], [-2, 2]], k = 1
Output: [[-2, 2]]`,
        `Input:  points = [[3, 3], [5, -1], [-2, 4]], k = 2
Output: [[3, 3], [-2, 4]]`,
      ],
      constraints: [
        '1 <= k <= points.length <= 10^4',
        '-10^4 <= xi, yi <= 10^4',
      ],
      followUp: 'You never need the square root. Quickselect gets the average case to O(n).',
      stub: `
export function kClosest(points: number[][], k: number): number[][] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 67,
      title: 'Kth Largest Element in an Array',
      slug: 'kth-largest-element-in-an-array',
      difficulty: 'Medium',
      leetcode: 'kth-largest-element-in-an-array',
      pattern: 'Quickselect (or a size-k min-heap)',
      complexity: 'O(n) average with quickselect, O(1) extra space',
      statement: `
Return the kth largest element of an unsorted array, counting in sorted order rather than
by distinct value. Solve it without sorting the whole array.
`,
      examples: [
        `Input:  nums = [3, 2, 1, 5, 6, 4], k = 2
Output: 5`,
        `Input:  nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4
Output: 4`,
      ],
      constraints: [
        '1 <= k <= nums.length <= 10^5',
        '-10^4 <= nums[i] <= 10^4',
      ],
      followUp: 'What input makes a naive quickselect pivot degrade to O(n^2)?',
      stub: `
export function findKthLargest(nums: number[], k: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 68,
      title: 'Task Scheduler',
      slug: 'task-scheduler',
      difficulty: 'Medium',
      leetcode: 'task-scheduler',
      pattern: 'Greedy on the most frequent task (heap + cooldown queue)',
      complexity: 'O(n) time, O(1) space (26 task types)',
      statement: `
Each task takes one CPU interval, and two runs of the same task must be separated by at
least n intervals, during which the CPU may run another task or sit idle. Given the task
list and the cooldown n, return the minimum number of intervals needed to finish all tasks.
`,
      examples: [
        `Input:  tasks = ["A", "A", "A", "B", "B", "B"], n = 2
Output: 8          // A B idle A B idle A B`,
        `Input:  tasks = ["A", "C", "A", "B", "D", "B"], n = 1
Output: 6          // no idling needed`,
        `Input:  tasks = ["A", "A", "A", "B", "B", "B"], n = 3
Output: 10`,
      ],
      constraints: [
        '1 <= tasks.length <= 10^4',
        'tasks[i] is an uppercase English letter',
        '0 <= n <= 100',
      ],
      followUp:
        'There is a closed-form answer driven only by the most frequent task. Derive it, then check it against the heap simulation.',
      stub: `
export function leastInterval(tasks: string[], n: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 69,
      title: 'Design Twitter',
      slug: 'design-twitter',
      difficulty: 'Medium',
      leetcode: 'design-twitter',
      pattern: 'Per-user tweet lists + k-way merge for the feed',
      complexity: 'O(followees * log followees) per feed read',
      statement: `
Design a simplified Twitter with four operations: postTweet(userId, tweetId) publishes a
tweet; getNewsFeed(userId) returns the 10 most recent tweet ids posted by the user or by
anyone they follow, newest first; follow(followerId, followeeId) and
unfollow(followerId, followeeId) manage the follow graph. A user implicitly follows
themselves.
`,
      examples: [
        `Input:  postTweet(1, 5), getNewsFeed(1), follow(1, 2), postTweet(2, 6),
        getNewsFeed(1), unfollow(1, 2), getNewsFeed(1)
Output: [5], [6, 5], [5]`,
      ],
      constraints: [
        '1 <= userId, followerId, followeeId <= 500',
        '0 <= tweetId <= 10^4',
        'All tweet ids are unique',
        'At most 3 * 10^4 calls in total',
      ],
      followUp: 'What timestamp do you need if tweet ids are not monotonically increasing?',
      stub: `
export class Twitter {
  postTweet(userId: number, tweetId: number): void {
    throw new Error('Not implemented');
  }

  getNewsFeed(userId: number): number[] {
    throw new Error('Not implemented');
  }

  follow(followerId: number, followeeId: number): void {
    throw new Error('Not implemented');
  }

  unfollow(followerId: number, followeeId: number): void {
    throw new Error('Not implemented');
  }
}
`,
    },
    {
      n: 70,
      title: 'Find Median from Data Stream',
      slug: 'find-median-from-data-stream',
      difficulty: 'Hard',
      leetcode: 'find-median-from-data-stream',
      pattern: 'Two heaps: max-heap of the low half, min-heap of the high half',
      complexity: 'O(log n) per insert, O(1) per median',
      statement: `
Design a structure that supports addNum(num) to feed values from a stream and findMedian()
to return the median of everything added so far. With an even count the median is the mean
of the two middle values. Answers within 1e-5 of the true median are accepted.
`,
      examples: [
        `Input:  addNum(1), addNum(2), findMedian(), addNum(3), findMedian()
Output: 1.5, then 2.0`,
      ],
      constraints: [
        '-10^5 <= num <= 10^5',
        'findMedian is only called after at least one addNum',
        'At most 5 * 10^4 calls in total',
      ],
      followUp:
        'If all numbers were in [0, 100], could you answer in O(1)? What if 99% of them were?',
      stub: `
export class MedianFinder {
  addNum(num: number): void {
    throw new Error('Not implemented');
  }

  findMedian(): number {
    throw new Error('Not implemented');
  }
}
`,
    },
  ],
};
