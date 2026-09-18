export function walkPairs(nums: number[]): number {
  let total = 0;
  for (let i = 0, j = nums.length - 1; i < j; i++, j--) {
    total += nums[i] + nums[j];
  }
  return total;
}
