import test from 'node:test';
import assert from 'node:assert/strict';
import { canMiss, changesOf, consequenceOf, passesOf, reachedIn, stepsChanging } from '../src/lib/trace-view.ts';

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

/**
 * An array is reached by position and a Set by value. Reading one as the other
 * marked every ordinary index a miss, which said the opposite of the truth.
 */
test('an array is reached by position', () => {
  const reached = reachedIn({ t: 'array', items: ['24', '12', '8'], truncated: false });

  assert.equal(reached('0'), true);
  assert.equal(reached('2'), true);
  assert.equal(reached('3'), false);
  assert.equal(reached('24'), false);
});

test('a Set is reached by value', () => {
  const reached = reachedIn({ t: 'array', items: ['100', '4', '200'], truncated: false, set: true });

  assert.equal(reached('100'), true);
  assert.equal(reached('99'), false);
  assert.equal(reached('0'), false);
});

test('a Set of strings is reached without the quotes show added', () => {
  const reached = reachedIn({ t: 'array', items: ["'cat'", "'act'"], truncated: false, set: true });

  assert.equal(reached('cat'), true);
  assert.equal(reached("'cat'"), false);
});

test('a map is reached by its own keys', () => {
  const reached = reachedIn({ t: 'map', entries: [['a', '1'], ['b', '2']], truncated: false });

  assert.equal(reached('a'), true);
  assert.equal(reached('c'), false);
});

test('only a lookup that can fail is worth calling a miss', () => {
  assert.equal(canMiss({ t: 'array', items: ['1'], truncated: false }), false);
  assert.equal(canMiss({ t: 'array', items: ['1'], truncated: false, set: true }), true);
  assert.equal(canMiss({ t: 'map', entries: [], truncated: false }), true);
  assert.equal(canMiss({ t: 'scalar', text: '3' }), false);
});
