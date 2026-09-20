import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DRILL_CEILING,
  MAX_INTERVAL,
  MIN_EASE,
  gradeReview,
  planState,
  replay,
  seedInterval,
} from '../../../studio/src/server/schedule.ts';

const solve = (grade) => ({ kind: 'solve', grade });
const drill = (grade) => ({ kind: 'drill', grade });

test('the first solve seeds the interval from how hard it was', () => {
  assert.equal(seedInterval(1, 0), 21);
  assert.equal(seedInterval(3, 0), 7);
  assert.equal(seedInterval(1, 1), 7);
  assert.equal(seedInterval(6, 0), 3);
  assert.equal(seedInterval(1, 2), 3);
  assert.equal(seedInterval(null, 0), 3, 'never solved means it comes back soon');
});

test('a clean review pushes the interval out, and keeps pushing', () => {
  const once = replay(21, [solve(2)]);
  const twice = replay(21, [solve(2), solve(2)]);

  assert.equal(once.interval, 49);
  assert.equal(twice.interval, 118);
  assert.equal(twice.ease > once.ease, true, 'ease climbs on clean recall');
});

test('a review that took work moves the interval only a little', () => {
  const { interval, ease } = replay(21, [solve(1)]);

  assert.equal(interval, 25);
  assert.equal(ease < 2.3, true, 'ease drops when it was hard');
});

test('failing collapses the interval to a day and costs ease', () => {
  const { interval, ease, lapses } = replay(117, [solve(0)]);

  assert.equal(interval, 1);
  assert.equal(lapses, 1);
  assert.equal(ease, 2.1);
});

test('the interval is capped so nothing disappears for years', () => {
  const many = Array.from({ length: 20 }, () => solve(2));
  assert.equal(replay(21, many).interval, MAX_INTERVAL);
});

test('ease has a floor, so a repeatedly failed problem still comes back', () => {
  const many = Array.from({ length: 20 }, () => solve(0));
  assert.equal(replay(21, many).ease, MIN_EASE);
});

test('a drill cannot push a problem past the ceiling', () => {
  const drilled = replay(21, [drill(2), drill(2), drill(2), drill(2)]);
  assert.equal(drilled.interval, DRILL_CEILING);
});

test('a drill never drags a long interval back down', () => {
  const long = replay(21, [solve(2), solve(2)]);
  const thenDrilled = replay(21, [solve(2), solve(2), drill(2)]);

  assert.equal(long.interval, 118);
  assert.equal(thenDrilled.interval, 118, 'the drill is a no-op above the ceiling');
});

test('three failures in a row make it a leech, and one success clears it', () => {
  assert.equal(replay(21, [solve(0), solve(0), solve(0)]).streak, 3);
  assert.equal(replay(21, [solve(0), solve(0), solve(0), solve(2)]).streak, 0);
});

test('the grade comes from what was measured', () => {
  const base = { passed: true, revealed: false, runs: 1, hints: 0, minutes: 4, baseline: 10 };

  assert.equal(gradeReview(base), 2);
  assert.equal(gradeReview({ ...base, revealed: true }), 0, 'looking at the answer is a zero');
  assert.equal(gradeReview({ ...base, passed: false }), 0);
  assert.equal(gradeReview({ ...base, runs: 5 }), 1);
  assert.equal(gradeReview({ ...base, hints: 1 }), 1);
  assert.equal(gradeReview({ ...base, minutes: 30 }), 1, 'slower than the first solve is not clean');
  assert.equal(gradeReview({ ...base, minutes: 30, baseline: null }), 2, 'no baseline, no penalty');
});

const HOUR = 3_600_000;
const DAY = 86_400_000;
const plan = (over) => ({ createdAt: '2026-01-01T08:00:00.000Z', days: 3, perDay: 2, done: [], note: null, ...over });

test('a hand-made repeat plan is due the moment it is asked for', () => {
  const state = planState(plan(), Date.parse('2026-01-01T08:00:00.000Z'));

  assert.equal(state.total, 6);
  assert.equal(state.done, 0);
  assert.equal(state.finished, false);
  assert.equal(state.nextAt, '2026-01-01T08:00:00.000Z');
});

test('repetitions space out across a waking day, counted from the last one done', () => {
  const done = ['2026-01-01T09:00:00.000Z'];
  const state = planState(plan({ done }), Date.parse('2026-01-01T10:00:00.000Z'));

  /** Two a day over sixteen waking hours is one every eight. */
  assert.equal(state.nextAt, new Date(Date.parse(done[0]) + 8 * HOUR).toISOString());
  assert.equal(state.done, 1);
});

test('a plan finishes once every repetition is done', () => {
  const done = Array.from({ length: 6 }, (_, index) => new Date(Date.parse('2026-01-01T08:00:00.000Z') + index * HOUR).toISOString());
  const state = planState(plan({ done }), Date.parse('2026-01-02T08:00:00.000Z'));

  assert.equal(state.finished, true);
  assert.equal(state.nextAt, null);
});

test('a plan expires when its window closes, even half-finished', () => {
  const state = planState(plan({ done: ['2026-01-01T09:00:00.000Z'] }), Date.parse('2026-01-01T08:00:00.000Z') + 3 * DAY + HOUR);

  assert.equal(state.finished, true);
  assert.equal(state.nextAt, null);
  assert.equal(state.done, 1, 'the work that was done is still reported');
});

test('a one-a-day plan spaces repetitions sixteen hours apart, not twenty-four', () => {
  const done = ['2026-01-01T08:00:00.000Z'];
  const state = planState(plan({ perDay: 1, done }), Date.parse('2026-01-01T09:00:00.000Z'));

  assert.equal(state.nextAt, new Date(Date.parse(done[0]) + 16 * HOUR).toISOString());
});

test('a repetition already done is spent, so the same one does not come back', () => {
  const at = '2026-01-01T08:00:00.000Z';
  const before = planState(plan(), Date.parse(at));
  assert.equal(before.nextAt, at, 'due the moment it is asked for');

  /** What recordReview does: append the moment it was done. */
  const after = planState(plan({ done: [at] }), Date.parse(at) + 60_000);

  assert.equal(after.done, 1);
  assert.notEqual(after.nextAt, at, 'the next one must not be the one just finished');
  assert.ok(Date.parse(after.nextAt) > Date.parse(at) + 60_000, 'and it must be in the future');
});
