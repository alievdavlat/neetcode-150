import test from 'node:test';
import assert from 'node:assert/strict';
import { createCounter, createIdle, createRecorder, show, snapshot, TraceBudgetExceeded } from './recorder.mjs';

test('numbers and booleans are scalars', () => {
  assert.deepEqual(snapshot(3), { t: 'scalar', text: '3' });
  assert.deepEqual(snapshot(true), { t: 'scalar', text: 'true' });
  assert.deepEqual(snapshot(undefined), { t: 'scalar', text: 'undefined' });
});

test('strings keep their quotes', () => {
  assert.deepEqual(snapshot('cat'), { t: 'scalar', text: "'cat'" });
});

test('an array becomes indexed items', () => {
  assert.deepEqual(snapshot([3, 2, 4]), { t: 'array', items: ['3', '2', '4'], truncated: false });
});

test('a typed array is an array too', () => {
  assert.deepEqual(snapshot(new Int32Array(2)), { t: 'array', items: ['0', '0'], truncated: false });
});

test('a plain object becomes key to value rows', () => {
  assert.deepEqual(snapshot({ 3: 0, 2: 1 }), {
    t: 'map',
    entries: [
      ['2', '1'],
      ['3', '0'],
    ],
    truncated: false,
  });
});

test('a Map becomes rows as well', () => {
  assert.deepEqual(snapshot(new Map([['act', ['cat']]])), {
    t: 'map',
    entries: [['act', '["cat"]']],
    truncated: false,
  });
});

test('a long array is cut and says so', () => {
  const big = snapshot(Array.from({ length: 300 }, (_, i) => i));
  assert.equal(big.items.length, 200);
  assert.equal(big.truncated, true);
});

test('a long string is cut and says so', () => {
  const long = snapshot('x'.repeat(300));
  assert.equal(long.text.length <= 124, true);
  assert.match(long.text, /…/);
});

const META = [
  {
    id: 0,
    kind: 'stmt',
    line: 4,
    text: 'target - nums[i]',
    changed: 'calc',
    leaves: [
      { start: 0, end: 6 },
      { start: 9, end: 16 },
    ],
  },
  { id: 1, kind: 'loop-update', line: 3, text: 'i++', changed: 'i', op: '+', leaves: [] },
];

test('a value site builds a three part chain', () => {
  const { api, steps } = createRecorder(META);
  api.l(0, 0, 6);
  api.l(0, 1, 3);
  api.v(0, 3);
  api.s(0, { i: 0, calc: 3 });

  assert.equal(steps.length, 1);
  assert.deepEqual(steps[0].chain, ['target - nums[i]', '6 - 3', '3']);
  assert.equal(steps[0].line, 4);
  assert.equal(steps[0].changed, 'calc');
  assert.deepEqual(steps[0].vars, { i: { t: 'scalar', text: '0' }, calc: { t: 'scalar', text: '3' } });
});

test('a value site returns its value untouched', () => {
  const { api } = createRecorder(META);
  assert.equal(api.v(0, 42), 42);
  assert.equal(api.l(0, 0, 'cat'), 'cat');
});

test('an update records both sides', () => {
  const { api, steps } = createRecorder(META);
  api.u(1, 0, 1);
  assert.deepEqual(steps[0].chain, ['i++', '0 + 1', '1']);
  assert.equal(steps[0].kind, 'loop-update');
});

test('element accesses land in touched', () => {
  const { api, steps } = createRecorder(META);
  assert.equal(api.x(0, 'nums', 2, false, 'i'), 2);
  api.v(0, 4);
  assert.deepEqual(steps[0].touched, [{ name: 'nums', key: 2, write: false, from: 'i' }]);
});

test('the budget stops the run rather than the machine', () => {
  const { api } = createRecorder(META, { maxSteps: 2 });
  api.v(0, 1);
  api.v(0, 2);
  assert.throws(() => api.v(0, 3), TraceBudgetExceeded);
});

test('a map shows what is in it rather than an empty object', () => {
  assert.equal(show(new Map([[1, 3], ['a', 2]])), "Map(2) {1 → 3, 'a' → 2}");
  assert.equal(show(new Set([1, 2])), 'Set(2) {1, 2}');
  assert.equal(show(new Map()), 'Map(0) {}');
});

/**
 * The instrumenter calls whichever recorder is installed, so one that is short a
 * call throws inside the student's own file. That is how `f` and `g` came to be
 * missing from the idle recorder, where it read as "could not read your file".
 */
test('every recorder answers the same calls', () => {
  const calls = (made) => Object.keys(made.api).sort();
  const expected = calls(createRecorder(META));

  assert.deepEqual(calls(createIdle()), expected);
  assert.deepEqual(calls(createCounter()), expected);
});

test('the idle recorder hands every value straight back', () => {
  const { api } = createIdle();

  assert.equal(api.l(0, 0, 7), 7);
  assert.equal(api.x(0, 'nums', 2, false, 'i'), 2);
  assert.equal(api.v(0, 'kept'), 'kept');
  assert.equal(api.u(0, 4, 5), 4);
  assert.deepEqual([...api.i(0, [1, 2, 3])], [1, 2, 3]);
});
