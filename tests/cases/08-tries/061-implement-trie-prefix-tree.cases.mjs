export default {
  cases: [
    {
      label: 'doc block sequence',
      construct: [],
      ops: [
        ['insert', ['apple']],
        ['search', ['apple'], true],
        ['search', ['app'], false],
        ['startsWith', ['app'], true],
        ['insert', ['app']],
        ['search', ['app'], true],
      ],
    },
    {
      label: 'a prefix is not a word, and an empty trie matches nothing',
      construct: [],
      ops: [
        ['search', ['a'], false],
        ['startsWith', ['a'], false],
        ['insert', ['abc']],
        ['startsWith', ['abcd'], false],
        ['search', ['ab'], false],
        ['startsWith', ['abc'], true],
      ],
    },
  ],
};
