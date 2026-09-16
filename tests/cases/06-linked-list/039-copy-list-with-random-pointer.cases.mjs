/**
 * Each pair is [value, index the random pointer targets], or [value, null].
 * This compares shape only. Proving the copy is independent of the original
 * would need the raw nodes, which the report does not carry.
 */
export default {
  compare: 'exact',
  cases: [
    {
      label: 'doc block list',
      args: [
        [
          [7, null],
          [13, 0],
          [11, 4],
          [10, 2],
          [1, 0],
        ],
      ],
      expect: [
        [7, null],
        [13, 0],
        [11, 4],
        [10, 2],
        [1, 0],
      ],
    },
    {
      label: 'both nodes point at the same target',
      args: [
        [
          [1, 1],
          [2, 1],
        ],
      ],
      expect: [
        [1, 1],
        [2, 1],
      ],
    },
    { label: 'single self-referencing node', args: [[[3, 0]]], expect: [[3, 0]] },
    { label: 'empty list', args: [[]], expect: [] },
  ],
};
