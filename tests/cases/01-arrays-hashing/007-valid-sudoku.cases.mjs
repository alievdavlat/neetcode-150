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

import { intBetween, makeRng, series } from '../_support/random.mjs';

const rng = makeRng(1007);

const filledCells = VALID.flatMap((row, r) => row.map((cell, c) => ({ r, c, cell })).filter((entry) => entry.cell !== '.'));
const emptyCells = VALID.flatMap((row, r) => row.map((cell, c) => ({ r, c, cell })).filter((entry) => entry.cell === '.'));

const copy = (board) => board.map((row) => [...row]);

/** Removing a value can never introduce a clash, so a thinned board stays valid. */
const thinned = series(10, 'generated cells removed', () => {
  const board = copy(VALID);
  for (let removals = intBetween(rng, 1, 20); removals > 0; removals -= 1) {
    const { r, c } = filledCells[intBetween(rng, 0, filledCells.length - 1)];
    board[r][c] = '.';
  }
  return { args: [board], expect: true };
});

const sameBox = (a, b) => Math.floor(a.r / 3) === Math.floor(b.r / 3) && Math.floor(a.c / 3) === Math.floor(b.c / 3);

/** Copy a filled value into an empty cell that shares its row, column or box. */
const clashing = series(20, 'generated planted clash', () => {
  const board = copy(VALID);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const source = filledCells[intBetween(rng, 0, filledCells.length - 1)];
    const targets = emptyCells.filter(
      (target) => target.r === source.r || target.c === source.c || sameBox(target, source),
    );
    if (targets.length === 0) continue;

    const target = targets[intBetween(rng, 0, targets.length - 1)];
    board[target.r][target.c] = source.cell;
    return { args: [board], expect: false };
  }

  return { args: [board], expect: true };
});

export default {
  compare: 'exact',
  cases: [
    ...thinned,
    ...clashing,
    { label: 'standard puzzle', args: [VALID], expect: true },
    { label: 'duplicate inside a 3x3 box', args: [boxClash], expect: false },
    { label: 'empty board', args: [EMPTY], expect: true },
    { label: 'duplicate in a row', args: [place({ '0,0': '1', '0,8': '1' })], expect: false },
    { label: 'duplicate in a column', args: [place({ '0,0': '1', '8,0': '1' })], expect: false },
    { label: 'same value in two different boxes is fine', args: [place({ '0,0': '9', '3,3': '9' })], expect: true },
  ],
};
