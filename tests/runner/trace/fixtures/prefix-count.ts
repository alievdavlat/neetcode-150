export function countUp(nums: number[]): number {
  let seen = 0;
  for (let i = 0; i < nums.length; ++i) {
    ++seen;
  }
  return seen;
}
