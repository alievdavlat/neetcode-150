/**
 * 9. Longest Consecutive Sequence   ·   Medium   ·   Arrays & Hashing
 *
 * Given an unsorted array of integers nums, return the length of the longest
 * run of consecutive integers it contains. The elements do not have to be
 * adjacent in the array. You must solve it in O(n) time, which rules out
 * sorting.
 *
 * Example 1:
 *   Input:  nums = [100, 4, 200, 1, 3, 2]
 *   Output: 4          // the run 1, 2, 3, 4
 *
 * Example 2:
 *   Input:  nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
 *   Output: 9          // 0 through 8
 *
 * Example 3:
 *   Input:  nums = []
 *   Output: 0
 *
 * Constraints:
 *   - 0 <= nums.length <= 10^5
 *   - -10^9 <= nums[i] <= 10^9
 *
 * Follow-up: How do you recognise that a number starts a run without scanning
 * twice?
 *
 * Pattern:   Hash set + only walk up from sequence starts
 * Target:    O(n) time, O(n) space
 * LeetCode:  https://leetcode.com/problems/longest-consecutive-sequence/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=5731s  (01:35:31)
 */
export function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let longest = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      let length = 1;
      let current = num + 1;
      while(set.has(current)) {
        length++;
        current++;
      };
      longest = Math.max(longest, length);
    }
  }
  return longest;
};
console.log(longestConsecutive([100,4,200,1,3,2])); // should be 4
