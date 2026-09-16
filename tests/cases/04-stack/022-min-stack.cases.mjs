/** Design problem: a constructor plus a call sequence. Each op is [method, args, expected]. */
export default {
  cases: [
    {
      label: 'min survives a pop',
      construct: [],
      ops: [
        ['push', [-2]],
        ['push', [0]],
        ['push', [-3]],
        ['getMin', [], -3],
        ['pop', []],
        ['top', [], 0],
        ['getMin', [], -2],
      ],
    },
    {
      label: 'repeated minimum must not be lost by one pop',
      construct: [],
      ops: [
        ['push', [1]],
        ['push', [1]],
        ['push', [2]],
        ['getMin', [], 1],
        ['pop', []],
        ['pop', []],
        ['getMin', [], 1],
      ],
    },
    {
      label: 'single element',
      construct: [],
      ops: [
        ['push', [5]],
        ['top', [], 5],
        ['getMin', [], 5],
      ],
    },
    {
      label: 'minimum sits deep under later pushes',
      construct: [],
      ops: [
        ['push', [3]],
        ['push', [1]],
        ['push', [2]],
        ['push', [4]],
        ['getMin', [], 1],
        ['top', [], 4],
        ['pop', []],
        ['getMin', [], 1],
        ['pop', []],
        ['getMin', [], 1],
        ['pop', []],
        ['getMin', [], 3],
      ],
    },
    {
      label: 'a new minimum arrives last',
      construct: [],
      ops: [
        ['push', [5]],
        ['push', [4]],
        ['push', [3]],
        ['push', [-9]],
        ['getMin', [], -9],
        ['pop', []],
        ['getMin', [], 3],
      ],
    },
  ],
};
