export function pairSum(nums: number[]): number {
  let left = 0, right = nums.length - 1;
  let total = 0;
  while (left < right) {
    total += nums[left] * nums[right];
    left++;
    right--;
  }
  return total;
}
