import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DRILL_CEILING_STEP,
  LADDER,
  LEECH_LAPSES,
  firstDayWithRoom,
  gradeReview,
  intervalAt,
  planState,
  replay,
  seedStep,
} from '../../../studio/src/server/schedule.ts';

const solve = (grade) => ({ kind: 'solve', grade });
const drill = (grade) => ({ kind: 'drill', grade });

test('the ladder only ever grows, so a review is never sooner than the last', () => {
  for (let index = 1; index < LADDER.length; index += 1) {
    assert.ok(LADDER[index] > LADDER[index - 1], `step ${index} must be longer than ${index - 1}`);
  }
});

test('the first solve joins the ladder by how hard it was, and never later than a week', () => {
  assert.equal(intervalAt(seedStep(1, 0)), 7, 'clean first try');
  assert.equal(intervalAt(seedStep(3, 0)), 3, 'took a few goes');
  assert.equal(intervalAt(seedStep(1, 1)), 3, 'needed a hint');
  assert.equal(intervalAt(seedStep(6, 0)), 1, 'took many goes');
  assert.equal(intervalAt(seedStep(1, 2)), 1, 'needed real help');
  assert.equal(intervalAt(seedStep(null, 0)), 1, 'never passed');
});

test('a clean review climbs one step, and keeps climbing', () => {
  assert.equal(replay(0, [solve(2)]).interval, 3);
  assert.equal(replay(0, [solve(2), solve(2)]).interval, 7);
  assert.equal(replay(0, [solve(2), solve(2), solve(2)]).interval, 16);
});

test('a review that took work holds the same interval rather than shrinking it', () => {
  const held = replay(2, [solve(1)]);

  assert.equal(held.step, 2);
  assert.equal(held.interval, 7, 'a problem you half-know should not crowd out one you do not know');
});

test('failing drops back to the bottom of the ladder', () => {
  const failed = replay(3, [solve(0)]);

  assert.equal(failed.interval, 1);
  assert.equal(failed.lapses, 1);
});

test('the ladder has a top, so nothing disappears for years', () => {
  const many = Array.from({ length: 20 }, () => solve(2));

  assert.equal(replay(0, many).interval, LADDER[LADDER.length - 1]);
});

test('a drill cannot push a problem past the ceiling', () => {
  const drilled = replay(0, [drill(2), drill(2), drill(2), drill(2)]);

  assert.equal(drilled.step, DRILL_CEILING_STEP);
  assert.equal(drilled.interval, intervalAt(DRILL_CEILING_STEP));
});

test('a drill never drags a long interval back down', () => {
  const earned = replay(4, [drill(2)]);

  assert.equal(earned.step, DRILL_CEILING_STEP, 'a drill caps where it can reach');
  assert.ok(replay(4, [solve(2)]).step > DRILL_CEILING_STEP, 'a real re-solve still climbs');
});

test('three failures in a row make it a leech, and one success clears it', () => {
  const stuck = replay(2, [solve(0), solve(0), solve(0)]);
  assert.ok(stuck.streak >= LEECH_LAPSES);

  assert.equal(replay(2, [solve(0), solve(0), solve(0), solve(2)]).streak, 0);
});

test('the grade comes from what was measured', () => {
  const base = { passed: true, revealed: false, runs: 1, hints: 0, minutes: 5, baseline: 10 };

  assert.equal(gradeReview(base), 2);
  assert.equal(gradeReview({ ...base, passed: false }), 0);
  assert.equal(gradeReview({ ...base, revealed: true }), 0);
  assert.equal(gradeReview({ ...base, runs: 3 }), 1);
  assert.equal(gradeReview({ ...base, hints: 1 }), 1);
  assert.equal(gradeReview({ ...base, minutes: 20 }), 1, 'slower than the first solve');
});

const DAY = 86_400_000;
const START = '2026-01-02T09:00:00.000Z';
const plan = (over) => ({ createdAt: '2026-01-01T08:00:00.000Z', target: 3, done: [], startAt: START, note: null, ...over });

test('a plan waits for the day it was paced to, not the moment it was asked for', () => {
  const state = planState(plan(), Date.parse('2026-01-01T08:00:00.000Z'));

  assert.equal(state.nextAt, START);
  assert.ok(Date.parse(state.nextAt) > Date.parse('2026-01-01T08:00:00.000Z'), 'never due the same instant');
});

test('a plan never asks twice in one day', () => {
  const done = ['2026-01-02T09:00:00.000Z'];
  const state = planState(plan({ done }), Date.parse(done[0]) + 60_000);

  const gap = Date.parse(state.nextAt) - Date.parse(done[0]);
  assert.ok(gap >= DAY, `the next repetition must be at least a day later, got ${gap / DAY}`);
});

test('repetitions inside a plan climb the bottom of the ladder', () => {
  const first = '2026-01-02T09:00:00.000Z';
  const second = '2026-01-03T09:00:00.000Z';

  assert.equal(planState(plan({ done: [first] })).nextAt, new Date(Date.parse(first) + 1 * DAY).toISOString());
  assert.equal(planState(plan({ done: [first, second] })).nextAt, new Date(Date.parse(second) + 3 * DAY).toISOString());
});

test('a plan finishes once it has been passed the number of times asked for', () => {
  const done = ['2026-01-02T09:00:00.000Z', '2026-01-03T09:00:00.000Z', '2026-01-06T09:00:00.000Z'];
  const state = planState(plan({ done }), Date.parse('2026-01-20T09:00:00.000Z'));

  assert.equal(state.finished, true);
  assert.equal(state.nextAt, null);
  assert.equal(state.done, 3);
});

test('a repetition already done is spent, so the same one does not come back', () => {
  const before = planState(plan(), Date.parse(START));
  assert.equal(before.nextAt, START);

  const after = planState(plan({ done: [START] }), Date.parse(START) + 60_000);

  assert.equal(after.done, 1);
  assert.notEqual(after.nextAt, START);
  assert.ok(Date.parse(after.nextAt) > Date.parse(START) + 60_000);
});

const dayKey = (date) => date.toISOString().slice(0, 10);

test('a new plan lands on the first day that is not already full', () => {
  const from = new Date('2026-01-05T09:00:00.000Z');
  const load = new Map([
    ['2026-01-05', 8],
    ['2026-01-06', 8],
    ['2026-01-07', 3],
  ]);

  assert.equal(dayKey(firstDayWithRoom(load, 8, from, dayKey)), '2026-01-07');
});

test('an empty schedule takes the first day offered', () => {
  const from = new Date('2026-01-05T09:00:00.000Z');

  assert.equal(dayKey(firstDayWithRoom(new Map(), 8, from, dayKey)), '2026-01-05');
});

test('pacing gives up rather than searching forever when every day is full', () => {
  const from = new Date('2026-01-05T09:00:00.000Z');
  const full = new Map();
  for (let ahead = 0; ahead <= 40; ahead += 1) {
    full.set(dayKey(new Date(from.getTime() + ahead * 86_400_000)), 99);
  }

  assert.equal(dayKey(firstDayWithRoom(full, 8, from, dayKey)), '2026-01-05');
});
