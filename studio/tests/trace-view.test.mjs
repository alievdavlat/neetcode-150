import test from 'node:test';
import assert from 'node:assert/strict';
import { changesOf, consequenceOf, passesOf, stepsChanging } from '../src/lib/trace-view.ts';

const step = (over = {}) => ({
  line: 1,
  fn: 'f',
  depth: 1,
  kind: 'stmt',
  chain: ['x'],
  vars: {},
  changed: null,
  touched: [],
  ...over,
});

const array = (items) => ({ t: 'array', items, truncated: false });

test('a cell that moved is the only one reported', () => {
  const before = step({ vars: { nums: array(['1', '2', '3']) } });
  const after = step({ vars: { nums: array(['1', '9', '3']) } });

  assert.deepEqual(changesOf(after, before).nums.cells, [1]);
  assert.equal(changesOf(after, before).nums.changed, true);
});

test('an unchanged variable says so', () => {
  const same = step({ vars: { total: { t: 'scalar', text: '4' } } });
  assert.equal(changesOf(same, same).total.changed, false);
});

test('a loop step knows which pass it is on', () => {
  const steps = [
    step({ kind: 'loop-cond', line: 2 }),
    step({ kind: 'stmt', line: 3 }),
    step({ kind: 'loop-cond', line: 2 }),
    step({ kind: 'stmt', line: 3 }),
  ];

  const passes = passesOf(steps);
  assert.equal(passes[0]?.pass, 1);
  assert.equal(passes[2]?.pass, 2);
  assert.equal(passes[0]?.total, 2);
});

test('watching a variable marks only the steps that move it', () => {
  const steps = [
    step({ vars: { i: { t: 'scalar', text: '0' } } }),
    step({ vars: { i: { t: 'scalar', text: '1' } } }),
    step({ vars: { i: { t: 'scalar', text: '1' } } }),
  ];

  /** The first step has nothing to have moved from, so it is never a change. */
  assert.deepEqual(stepsChanging(steps, 'i'), [false, true, false]);
});

test('a return says what the function gives back', () => {
  const returned = step({ kind: 'return', chain: ['res', '[1, 2]'] });
  assert.match(consequenceOf(returned) ?? '', /ends|return/i);
});
