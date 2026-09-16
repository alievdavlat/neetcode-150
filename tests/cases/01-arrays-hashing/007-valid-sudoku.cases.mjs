/**
 * Only the filled cells are checked; the board does not have to be solvable.
 * The second board is the first with the top-left 5 changed to 8, which puts
 * two 8s in the same 3x3 box.
 */
const VALID = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];

const EMPTY = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '.'));

const place = (cells) =>
  EMPTY.map((row, r) => row.map((cell, c) => cells[`${r},${c}`] ?? cell));

const boxClash = VALID.map((row, index) => (index === 0 ? ['8', ...row.slice(1)] : [...row]));

export default {
  compare: 'exact',
  cases: [
    { label: 'standard puzzle', args: [VALID], expect: true },
    { label: 'duplicate inside a 3x3 box', args: [boxClash], expect: false },
    { label: 'empty board', args: [EMPTY], expect: true },
    { label: 'duplicate in a row', args: [place({ '0,0': '1', '0,8': '1' })], expect: false },
    { label: 'duplicate in a column', args: [place({ '0,0': '1', '8,0': '1' })], expect: false },
    { label: 'same value in two different boxes is fine', args: [place({ '0,0': '9', '3,3': '9' })], expect: true },
  ],
};
