export default {
  category: 'Greedy',
  dir: '15-greedy',
  intro: `
Greedy problems are easy to code and hard to trust. For each one, state the local rule in a
sentence and then argue why taking it can never cost you the optimum — if you cannot, it is
a DP problem wearing a disguise.
`,
  problems: [
    {
      n: 122,
      title: 'Maximum Subarray',
      slug: 'maximum-subarray',
      difficulty: 'Medium',
      leetcode: 'maximum-subarray',
      pattern: "Kadane: drop the prefix as soon as it turns negative",
      complexity: 'O(n) time, O(1) space',
      statement: `
Given an integer array nums, return the largest sum of any contiguous non-empty subarray.
`,
      examples: [
        `Input:  nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6          // [4, -1, 2, 1]`,
        `Input:  nums = [1]
Output: 1`,
        `Input:  nums = [5, 4, -1, 7, 8]
Output: 23`,
      ],
      constraints: [
        '1 <= nums.length <= 10^5',
        '-10^4 <= nums[i] <= 10^4',
      ],
      followUp: 'There is a divide-and-conquer O(n log n) solution too — try it once.',
      stub: `
export function maxSubArray(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 123,
      title: 'Jump Game',
      slug: 'jump-game',
      difficulty: 'Medium',
      leetcode: 'jump-game',
      pattern: 'Track the furthest reachable index (or walk the goal backwards)',
      complexity: 'O(n) time, O(1) space',
      statement: `
nums[i] is the maximum jump length from index i. Starting at index 0, return whether you can
reach the last index.
`,
      examples: [
        `Input:  nums = [2, 3, 1, 1, 4]
Output: true`,
        `Input:  nums = [3, 2, 1, 0, 4]
Output: false      // every route lands on the 0`,
      ],
      constraints: [
        '1 <= nums.length <= 10^4',
        '0 <= nums[i] <= 10^5',
      ],
      followUp: 'Moving the goal post leftwards is the version you will remember under pressure.',
      stub: `
export function canJump(nums: number[]): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 124,
      title: 'Jump Game II',
      slug: 'jump-game-ii',
      difficulty: 'Medium',
      leetcode: 'jump-game-ii',
      pattern: 'BFS-style level expansion over index ranges',
      complexity: 'O(n) time, O(1) space',
      statement: `
Same jump rules, but now the last index is always reachable. Return the minimum number of
jumps needed to get there.
`,
      examples: [
        `Input:  nums = [2, 3, 1, 1, 4]
Output: 2          // jump 1 step to index 1, then 3 steps to the end`,
        `Input:  nums = [2, 3, 0, 1, 4]
Output: 2`,
      ],
      constraints: [
        '1 <= nums.length <= 10^4',
        '0 <= nums[i] <= 1000',
        'The last index is always reachable',
      ],
      followUp: 'Think of each jump count as a BFS level covering a contiguous window of indices.',
      stub: `
export function jump(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 125,
      title: 'Gas Station',
      slug: 'gas-station',
      difficulty: 'Medium',
      leetcode: 'gas-station',
      pattern: 'Total feasibility check + reset the start on a deficit',
      complexity: 'O(n) time, O(1) space',
      statement: `
There are n gas stations on a circular route; station i holds gas[i] fuel and it costs
cost[i] to drive from station i to the next. Starting with an empty tank, return the index
of the only station you can start from to complete the whole circuit, or -1 when none works.
`,
      examples: [
        `Input:  gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]
Output: 3`,
        `Input:  gas = [2, 3, 4], cost = [3, 4, 3]
Output: -1`,
      ],
      constraints: [
        'n === gas.length === cost.length and 1 <= n <= 10^5',
        '0 <= gas[i], cost[i] <= 10^4',
        'The answer, when it exists, is unique',
      ],
      followUp:
        'If the running tank goes negative at station j, no station between the old start and j can work either. Prove that and the loop is one pass.',
      stub: `
export function canCompleteCircuit(gas: number[], cost: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 126,
      title: 'Hand of Straights',
      slug: 'hand-of-straights',
      difficulty: 'Medium',
      leetcode: 'hand-of-straights',
      pattern: 'Count map, always start a group at the smallest remaining card',
      complexity: 'O(n log n) time, O(n) space',
      statement: `
Given a hand of integer cards and a group size, decide whether the hand can be split
entirely into groups of exactly groupSize consecutive cards.
`,
      examples: [
        `Input:  hand = [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize = 3
Output: true       // [1,2,3], [2,3,4], [6,7,8]`,
        `Input:  hand = [1, 2, 3, 4, 5], groupSize = 4
Output: false`,
      ],
      constraints: [
        '1 <= hand.length <= 10^4',
        '0 <= hand[i] <= 10^9',
        '1 <= groupSize <= hand.length',
      ],
      followUp: 'The smallest remaining card has no choice about which group it joins.',
      stub: `
export function isNStraightHand(hand: number[], groupSize: number): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 127,
      title: 'Merge Triplets to Form Target Triplet',
      slug: 'merge-triplets-to-form-target-triplet',
      difficulty: 'Medium',
      leetcode: 'merge-triplets-to-form-target-triplet',
      pattern: 'Ignore any triplet that overshoots, then check coverage',
      complexity: 'O(n) time, O(1) space',
      statement: `
A merge replaces two triplets with their element-wise maximum. Given a list of triplets and
a target triplet, return whether repeated merges can produce the target. Merging is
optional and may be applied any number of times to any triplets.
`,
      examples: [
        `Input:  triplets = [[2,5,3], [1,8,4], [1,7,5]], target = [2, 7, 5]
Output: true       // merge [2,5,3] with [1,7,5]`,
        `Input:  triplets = [[3,4,5], [4,5,6]], target = [3, 2, 5]
Output: false`,
      ],
      constraints: [
        '1 <= triplets.length <= 10^5',
        '1 <= values, target values <= 1000',
      ],
      followUp: 'A triplet with any value above the target can never be used. What is left to check?',
      stub: `
export function mergeTriplets(triplets: number[][], target: number[]): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 128,
      title: 'Partition Labels',
      slug: 'partition-labels',
      difficulty: 'Medium',
      leetcode: 'partition-labels',
      pattern: 'Last-index map + extend the current partition end',
      complexity: 'O(n) time, O(1) space (26 letters)',
      statement: `
Partition a string into as many parts as possible so that each letter appears in at most one
part. Concatenating the parts in order must rebuild the original string. Return the sizes of
the parts.
`,
      examples: [
        `Input:  s = "ababcbacadefegdehijhklij"
Output: [9, 7, 8]`,
        `Input:  s = "eccbbbbdec"
Output: [10]`,
      ],
      constraints: [
        '1 <= s.length <= 500',
        's consists of lowercase English letters',
      ],
      stub: `
export function partitionLabels(s: string): number[] {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 129,
      title: 'Valid Parenthesis String',
      slug: 'valid-parenthesis-string',
      difficulty: 'Medium',
      leetcode: 'valid-parenthesis-string',
      pattern: 'Track the reachable range [minOpen, maxOpen]',
      complexity: 'O(n) time, O(1) space',
      statement: `
A string contains '(', ')' and '*', where '*' may act as '(', as ')' or as an empty string.
Return whether some interpretation makes the string a valid parenthesis sequence.
`,
      examples: [
        `Input:  s = "()"
Output: true`,
        `Input:  s = "(*)"
Output: true`,
        `Input:  s = "(*))"
Output: true`,
      ],
      constraints: [
        '1 <= s.length <= 100',
        "s consists of '(', ')' and '*' only",
      ],
      followUp:
        'Instead of one open counter, carry the smallest and largest number of open brackets still possible.',
      stub: `
export function checkValidString(s: string): boolean {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
