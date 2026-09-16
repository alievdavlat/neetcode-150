/** add() returns the kth largest value seen so far, duplicates counted separately. */
export default {
  cases: [
    {
      label: 'doc block sequence',
      construct: [3, [4, 5, 8, 2]],
      ops: [
        ['add', [3], 4],
        ['add', [5], 5],
        ['add', [10], 5],
        ['add', [9], 8],
        ['add', [4], 8],
      ],
    },
    {
      label: 'stream starts shorter than k',
      construct: [2, [0]],
      ops: [
        ['add', [-1], -1],
        ['add', [1], 0],
        ['add', [-2], 0],
        ['add', [-4], 0],
        ['add', [3], 1],
      ],
    },
  ],
};
