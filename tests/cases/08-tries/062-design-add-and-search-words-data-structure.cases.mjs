/** A dot matches any single letter, so length still has to line up. */
export default {
  cases: [
    {
      label: 'doc block sequence',
      construct: [],
      ops: [
        ['addWord', ['bad']],
        ['addWord', ['dad']],
        ['addWord', ['mad']],
        ['search', ['pad'], false],
        ['search', ['bad'], true],
        ['search', ['.ad'], true],
        ['search', ['b..'], true],
      ],
    },
    {
      label: 'wildcards must respect length',
      construct: [],
      ops: [
        ['addWord', ['a']],
        ['search', ['.'], true],
        ['search', ['..'], false],
        ['addWord', ['ab']],
        ['search', ['..'], true],
        ['search', ['a.'], true],
        ['search', ['.b'], true],
      ],
    },
  ],
};
