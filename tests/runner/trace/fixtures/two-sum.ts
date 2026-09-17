export function twoSum(nums: number[], target: number): [number, number] {
  const obj: Record<string, number> = {}
  for (let i = 0; i < nums.length; i++) {
    const calc = target - nums[i];
    if (calc in obj) return [i, obj[calc]];
    obj[nums[i]] = i;
  }

  return [-1, -1];
}
