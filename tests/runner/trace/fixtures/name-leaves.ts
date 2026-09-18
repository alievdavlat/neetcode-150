export function counts(nums: number[]): number {
  const seen = { total: 0 };

  for (const value of nums) {
    seen.total += value;
  }

  const out = [seen.total];

  return out.length
}
