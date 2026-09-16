/** A get counts as a use, so it changes which key is evicted next. */
export default {
  cases: [
    {
      label: 'doc block sequence',
      construct: [2],
      ops: [
        ['put', [1, 1]],
        ['put', [2, 2]],
        ['get', [1], 1],
        ['put', [3, 3]],
        ['get', [2], -1],
        ['put', [4, 4]],
        ['get', [1], -1],
        ['get', [3], 3],
        ['get', [4], 4],
      ],
    },
    {
      label: 'overwriting a key refreshes it instead of evicting it',
      construct: [2],
      ops: [
        ['put', [1, 1]],
        ['put', [2, 2]],
        ['put', [1, 10]],
        ['put', [3, 3]],
        ['get', [1], 10],
        ['get', [2], -1],
      ],
    },
    {
      label: 'capacity of one',
      construct: [1],
      ops: [
        ['put', [1, 1]],
        ['put', [2, 2]],
        ['get', [1], -1],
        ['get', [2], 2],
      ],
    },
  ],
};
