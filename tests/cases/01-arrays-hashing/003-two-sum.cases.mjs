/**
 * The problem says the order of the two returned indices does not matter, so
 * results are compared as an unordered pair. The generator hides the answer at
 * the end of the array, which is the worst case for a scanning solution.
 */
export default {
  cases: [
    { label: 'duplicate values form the pair', args: [[3, 3], 6], expect: [0, 1] },
    { label: 'answer skips the first element', args: [[3, 2, 4], 6], expect: [1, 2] },
    { label: 'negatives', args: [[-3, 4, 3, 90], 0], expect: [0, 2] },
    { label: 'answer at both ends', args: [[1, 5, 9, 2], 3], expect: [0, 3] },
  ],
  gen: (n) => [Array.from({ length: n }, (_, index) => index * 2), 4 * n - 6],
  probe: { base: 1000, budgetMs: 200 },
};
