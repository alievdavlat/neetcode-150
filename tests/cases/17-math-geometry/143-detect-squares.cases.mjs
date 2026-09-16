/** count() counts axis-aligned squares of positive area that use the query point. */
export default {
  cases: [
    {
      label: 'doc block sequence',
      construct: [],
      ops: [
        ['add', [[3, 10]]],
        ['add', [[11, 2]]],
        ['add', [[3, 2]]],
        ['count', [[11, 10]], 1],
        ['count', [[14, 8]], 0],
        ['add', [[11, 2]]],
        ['count', [[11, 10]], 2],
      ],
    },
    {
      label: 'two distinct squares share the query point',
      construct: [],
      ops: [
        ['add', [[0, 0]]],
        ['add', [[0, 2]]],
        ['add', [[2, 0]]],
        ['count', [[2, 2]], 1],
        ['add', [[4, 0]]],
        ['add', [[4, 2]]],
        ['count', [[2, 2]], 2],
        ['count', [[2, 3]], 0],
      ],
    },
    {
      label: 'the query point is itself in the set - no zero-area square',
      construct: [],
      ops: [
        ['add', [[0, 0]]],
        ['add', [[0, 2]]],
        ['add', [[2, 0]]],
        ['add', [[2, 2]]],
        ['count', [[2, 2]], 1],
        ['count', [[0, 0]], 1],
      ],
    },
    {
      label: 'a rectangle is not a square until the fourth corner squares it off',
      construct: [],
      ops: [
        ['add', [[1, 1]]],
        ['add', [[1, 5]]],
        ['add', [[9, 1]]],
        ['count', [[9, 5]], 0],
        ['add', [[5, 1]]],
        ['count', [[5, 5]], 1],
      ],
    },
    {
      label: 'no square from a single point',
      construct: [],
      ops: [
        ['add', [[0, 0]]],
        ['count', [[1, 1]], 0],
      ],
    },
  ],
};
