export default {
  category: 'Binary Search',
  dir: '05-binary-search',
  intro: `
Binary search is not "search a sorted array" — it is "halve a monotone predicate". Half of
this section searches over an answer range rather than over the input, which is the form
that shows up most often in interviews.
`,
  problems: [
    {
      n: 28,
      title: 'Binary Search',
      slug: 'binary-search',
      difficulty: 'Easy',
      leetcode: 'binary-search',
      pattern: 'Classic halving on a sorted array',
      complexity: 'O(log n) time, O(1) space',
      statement: `
Given a sorted array of distinct integers nums and a value target, return the index of
target, or -1 when it is absent. The runtime must be O(log n).
`,
      examples: [
        `Input:  nums = [-1, 0, 3, 5, 9, 12], target = 9
Output: 4`,
        `Input:  nums = [-1, 0, 3, 5, 9, 12], target = 2
Output: -1`,
      ],
      constraints: [
        '1 <= nums.length <= 10^4',
        '-10^4 < nums[i], target < 10^4',
        'All values in nums are unique and sorted ascending',
      ],
      followUp: 'Write the loop so it terminates for every bound convention you pick.',
      stub: `
export function search(nums: number[], target: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 29,
      title: 'Search a 2D Matrix',
      slug: 'search-a-2d-matrix',
      difficulty: 'Medium',
      leetcode: 'search-a-2d-matrix',
      pattern: 'Treat the matrix as one flat sorted array',
      complexity: 'O(log(m * n)) time, O(1) space',
      statement: `
You are given an m x n matrix where each row is sorted ascending and the first value of
every row is greater than the last value of the previous row. Return true when target is
present. The runtime must be O(log(m * n)).
`,
      examples: [
        `Input:  matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 3
Output: true`,
        `Input:  matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 13
Output: false`,
      ],
      constraints: [
        'm === matrix.length, n === matrix[i].length',
        '1 <= m, n <= 100',
        '-10^4 <= matrix[i][j], target <= 10^4',
      ],
      followUp: 'One binary search, not two — how do you map a flat index back to (row, col)?',
      stub: `
export function searchMatrix(matrix: number[][], target: number): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 30,
      title: 'Koko Eating Bananas',
      slug: 'koko-eating-bananas',
      difficulty: 'Medium',
      leetcode: 'koko-eating-bananas',
      pattern: 'Binary search over the answer range',
      complexity: 'O(n log(max pile)) time, O(1) space',
      statement: `
Koko eats bananas at k per hour. Each hour she picks one pile and eats up to k bananas from
it; if the pile has fewer than k left she eats it and waits out the rest of the hour.
Given piles and h hours, return the smallest k that lets her finish every pile within h
hours.
`,
      examples: [
        `Input:  piles = [3, 6, 7, 11], h = 8
Output: 4`,
        `Input:  piles = [30, 11, 23, 4, 20], h = 5
Output: 30`,
        `Input:  piles = [30, 11, 23, 4, 20], h = 6
Output: 23`,
      ],
      constraints: [
        '1 <= piles.length <= 10^4',
        'piles.length <= h <= 10^9',
        '1 <= piles[i] <= 10^9',
      ],
      followUp: 'What is the search space, and why is "can finish in h hours" monotone in k?',
      stub: `
export function minEatingSpeed(piles: number[], h: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 31,
      title: 'Find Minimum in Rotated Sorted Array',
      slug: 'find-minimum-in-rotated-sorted-array',
      difficulty: 'Medium',
      leetcode: 'find-minimum-in-rotated-sorted-array',
      pattern: 'Binary search comparing mid against the right end',
      complexity: 'O(log n) time, O(1) space',
      statement: `
An ascending array of unique integers has been rotated between 1 and n times. Return its
minimum element in O(log n) time.
`,
      examples: [
        `Input:  nums = [3, 4, 5, 1, 2]
Output: 1          // the original [1,2,3,4,5] rotated 3 times`,
        `Input:  nums = [4, 5, 6, 7, 0, 1, 2]
Output: 0`,
        `Input:  nums = [11, 13, 15, 17]
Output: 11         // rotated a full turn`,
      ],
      constraints: [
        'n === nums.length',
        '1 <= n <= 5000',
        '-5000 <= nums[i] <= 5000',
        'All integers are unique',
      ],
      followUp: 'Comparing mid to left is a trap. Compare it to right and see why.',
      stub: `
export function findMin(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 32,
      title: 'Search in Rotated Sorted Array',
      slug: 'search-in-rotated-sorted-array',
      difficulty: 'Medium',
      leetcode: 'search-in-rotated-sorted-array',
      pattern: 'Binary search, deciding which half is sorted each step',
      complexity: 'O(log n) time, O(1) space',
      statement: `
An ascending array of distinct integers was rotated at some pivot. Given the rotated array
and a target, return the index of target or -1. The runtime must be O(log n).
`,
      examples: [
        `Input:  nums = [4, 5, 6, 7, 0, 1, 2], target = 0
Output: 4`,
        `Input:  nums = [4, 5, 6, 7, 0, 1, 2], target = 3
Output: -1`,
        `Input:  nums = [1], target = 0
Output: -1`,
      ],
      constraints: [
        '1 <= nums.length <= 5000',
        '-10^4 <= nums[i], target <= 10^4',
        'All values are unique; nums is an ascending array rotated at some pivot',
      ],
      followUp: 'At every mid, exactly one side is guaranteed sorted. Which one, and is target in it?',
      stub: `
export function search(nums: number[], target: number): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 33,
      title: 'Time Based Key-Value Store',
      slug: 'time-based-key-value-store',
      difficulty: 'Medium',
      leetcode: 'time-based-key-value-store',
      pattern: 'Per-key append-only list + binary search on timestamp',
      complexity: 'O(1) set, O(log n) get',
      statement: `
Design a key-value store that keeps every version of a value along with its timestamp.
set(key, value, timestamp) stores a value. get(key, timestamp) returns the value whose
stored timestamp is the largest one that is <= the requested timestamp, or "" when no such
version exists. Calls to set for a given key arrive with strictly increasing timestamps.
`,
      examples: [
        `Input:  set("foo", "bar", 1), get("foo", 1), get("foo", 3),
        set("foo", "bar2", 4), get("foo", 4), get("foo", 5)
Output: "bar", "bar", "bar2", "bar2"`,
      ],
      constraints: [
        '1 <= key.length, value.length <= 100',
        'key and value consist of lowercase letters and digits',
        '1 <= timestamp <= 10^7',
        'Timestamps passed to set are strictly increasing per key',
        'At most 2 * 10^5 calls in total',
      ],
      stub: `
export class TimeMap {
  set(key: string, value: string, timestamp: number): void {
    throw new Error('Not implemented');
  }

  get(key: string, timestamp: number): string {
    throw new Error('Not implemented');
  }
}
`,
    },
    {
      n: 34,
      title: 'Median of Two Sorted Arrays',
      slug: 'median-of-two-sorted-arrays',
      difficulty: 'Hard',
      leetcode: 'median-of-two-sorted-arrays',
      pattern: 'Binary search for the partition point on the shorter array',
      complexity: 'O(log(min(m, n))) time, O(1) space',
      statement: `
Given two sorted arrays nums1 and nums2 of sizes m and n, return the median of the combined
sorted array. The runtime must be O(log(m + n)); merging is too slow.
`,
      examples: [
        `Input:  nums1 = [1, 3], nums2 = [2]
Output: 2.0        // merged = [1,2,3]`,
        `Input:  nums1 = [1, 2], nums2 = [3, 4]
Output: 2.5        // merged = [1,2,3,4]`,
      ],
      constraints: [
        'nums1.length === m, nums2.length === n',
        '0 <= m, n <= 1000 and 1 <= m + n <= 2000',
        '-10^6 <= nums1[i], nums2[i] <= 10^6',
      ],
      followUp:
        'Search for a cut such that everything left of it is <= everything right of it, across both arrays.',
      stub: `
export function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
