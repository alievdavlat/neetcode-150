/** Cases stay inside the stated constraint: lowercase English letters only. */
const rotated = (length, offset) =>
  Array.from({ length }, (_, index) => String.fromCharCode(97 + ((index + offset) % 26))).join('');

export default {
  compare: 'exact',
  cases: [
    { label: 'identical single letters', args: ['a', 'a'], expect: true },
    { label: 'two letters swapped', args: ['ab', 'ba'], expect: true },
    { label: 'same letters, different counts', args: ['aacc', 'ccac'], expect: false },
    { label: 'length differs', args: ['a', 'ab'], expect: false },
    { label: 'repeated letter only', args: ['aaa', 'aaa'], expect: true },
    { label: 'one letter apart', args: ['abcd', 'abce'], expect: false },
  ],
  gen: (n) => {
    const forward = rotated(n, 0);
    return [forward, [...forward].reverse().join('')];
  },
  probe: { base: 4000, budgetMs: 200 },
};
