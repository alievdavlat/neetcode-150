/** get(key, t) returns the value stored at the largest timestamp not after t. */
export default {
  cases: [
    {
      label: 'doc block sequence',
      construct: [],
      ops: [
        ['set', ['foo', 'bar', 1]],
        ['get', ['foo', 1], 'bar'],
        ['get', ['foo', 3], 'bar'],
        ['set', ['foo', 'bar2', 4]],
        ['get', ['foo', 4], 'bar2'],
        ['get', ['foo', 5], 'bar2'],
      ],
    },
    {
      label: 'timestamp earlier than anything stored',
      construct: [],
      ops: [
        ['set', ['a', 'x', 5]],
        ['get', ['a', 4], ''],
      ],
    },
    {
      label: 'unknown key',
      construct: [],
      ops: [['get', ['missing', 1], '']],
    },
    {
      label: 'several timestamps - the answer is the newest one not after t',
      construct: [],
      ops: [
        ['set', ['a', 'first', 1]],
        ['set', ['a', 'second', 5]],
        ['set', ['a', 'third', 10]],
        ['get', ['a', 0], ''],
        ['get', ['a', 1], 'first'],
        ['get', ['a', 4], 'first'],
        ['get', ['a', 5], 'second'],
        ['get', ['a', 9], 'second'],
        ['get', ['a', 10], 'third'],
        ['get', ['a', 99], 'third'],
      ],
    },
    {
      label: 'keys do not leak into each other',
      construct: [],
      ops: [
        ['set', ['a', 'x', 1]],
        ['set', ['b', 'y', 1]],
        ['get', ['a', 1], 'x'],
        ['get', ['b', 1], 'y'],
      ],
    },
  ],
};
