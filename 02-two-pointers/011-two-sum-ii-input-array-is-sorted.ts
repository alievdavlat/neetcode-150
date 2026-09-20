/**
 * 11. Two Sum II - Input Array Is Sorted   ·   Medium   ·   Two Pointers
 *
 * Given a 1-indexed array numbers sorted in non-decreasing order, find the two
 * numbers that add up to target and return their 1-based indices as [index1,
 * index2] with index1 < index2. Exactly one solution exists, you may not use
 * the same element twice, and you must use only constant extra space.
 *
 * Example 1:
 *   Input:  numbers = [2, 7, 11, 15], target = 9
 *   Output: [1, 2]
 *
 * Example 2:
 *   Input:  numbers = [2, 3, 4], target = 6
 *   Output: [1, 3]
 *
 * Example 3:
 *   Input:  numbers = [-1, 0], target = -1
 *   Output: [1, 2]
 *
 * Constraints:
 *   - 2 <= numbers.length <= 3 * 10^4
 *   - -1000 <= numbers[i] <= 1000
 *   - numbers is sorted in non-decreasing order
 *   - Exactly one solution exists
 *   - Constant extra space only — a hash map is not allowed
 *
 * Pattern:   Converging pointers on a sorted array
 * Target:    O(n) time, O(1) space
 * LeetCode:  https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=7693s  (02:08:13)
 */
export function twoSum(numbers: number[], target: number): [number, number] {
  let obj: Record<string, number> = {};
  for (let i = 0; i < numbers.length; i++) {
    let calc = target - numbers[i];
    if (calc in obj) return [obj[calc] + 1, i + 1]
    obj[numbers[i]] = i;
  }
  return [-1, -1]
}
console.log(twoSum([2, 7, 11, 15], 9)); // should be [1,2]


export function twoSum2(nums: number[], target: number): [number, number] {
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)! + 1, i + 1];
    seen.set(nums[i], i);
  }

  return [-1, -1];
}

export function twoSum3(numbers: number[], target: number): [number, number] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) return [left + 1, right + 1];

    if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [-1, -1];
}