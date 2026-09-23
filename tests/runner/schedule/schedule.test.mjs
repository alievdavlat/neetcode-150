import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DRILL_CEILING_STEP,
  LADDER,
  LEECH_LAPSES,
  REVIEW_WINDOW,
  gapMinutes,
  gradeReview,
  insideWindow,
  intervalAt,
  nextWindowOpen,
  placeQueue,
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
  const state = planState(plan());

  assert.equal(state.nextAt, START);
  assert.ok(Date.parse(state.nextAt) > Date.parse('2026-01-01T08:00:00.000Z'), 'never due the same instant');
});

test('a plan never asks twice in one day', () => {
  const done = ['2026-01-02T09:00:00.000Z'];
  const state = planState(plan({ done }));

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
  const state = planState(plan({ done }));

  assert.equal(state.finished, true);
  assert.equal(state.nextAt, null);
  assert.equal(state.done, 3);
});

test('a repetition already done is spent, so the same one does not come back', () => {
  const before = planState(plan());
  assert.equal(before.nextAt, START);

  const after = planState(plan({ done: [START] }));

  assert.equal(after.done, 1);
  assert.notEqual(after.nextAt, START);
  assert.ok(Date.parse(after.nextAt) > Date.parse(START) + 60_000);
});

test('a repetition that is not due yet cannot be spent', () => {
  const done = ['2026-01-02T09:00:00.000Z'];
  const state = planState(plan({ done }));

  /** What the store checks before counting a pass. */
  const dueNow = state.nextAt !== null && Date.parse(state.nextAt) <= Date.parse(done[0]) + 60_000;

  assert.equal(dueNow, false, 'running it again minutes later must not burn the plan');
});

test('a plan can be put on a problem that was never solved', () => {
  const fresh = planState(plan({ done: [] }));

  assert.equal(fresh.done, 0);
  assert.equal(fresh.finished, false);
  assert.equal(fresh.nextAt, START, 'nothing about a plan needs a previous pass');
});


const CAP = 8;
const GAP = gapMinutes(CAP) * 60_000;

/** Local, because the window is local: a UTC hour would drift with the machine. */
const hourOf = (iso) => new Date(iso).getHours();
const want = (number, earliest) => ({ number, earliest });

/** The state that reproduces the pile-up, taken from a real history.json. */
const PILE_UP = [
  want('007', '2026-09-23T15:46:51.175Z'),
  want('009', '2026-09-23T15:56:13.208Z'),
  want('010', '2026-09-23T15:58:35.938Z'),
  want('011', '2026-09-23T16:05:14.740Z'),
  want('005', '2026-09-23T16:14:09.097Z'),
  want('006', '2026-09-23T16:17:08.631Z'),
];

const placedTimes = (map) => [...map.values()].map(Date.parse).sort((a, b) => a - b);

test('the gap is the daily cap read the other way round', () => {
  const waking = (REVIEW_WINDOW.close - REVIEW_WINDOW.open) * 60;

  assert.equal(gapMinutes(CAP) * CAP, waking, 'the cap must be exactly what fits in a day');
  assert.ok(gapMinutes(1) > gapMinutes(40), 'a smaller cap means a longer gap');
});

test('six problems that fall due in one half hour do not come back in one half hour', () => {
  const times = placedTimes(placeQueue(PILE_UP, CAP, null));

  assert.equal(times.length, 6);
  for (let index = 1; index < times.length; index += 1) {
    assert.ok(
      times[index] - times[index - 1] >= GAP,
      `items ${index - 1} and ${index} are ${(times[index] - times[index - 1]) / 60_000} minutes apart`,
    );
  }
});

test('the most overdue problem keeps its own time, so the queue is never empty when work is owed', () => {
  const placed = placeQueue(PILE_UP, CAP, null);

  assert.equal(placed.get('007'), PILE_UP[0].earliest, 'the front of the queue is not pushed back');
});

test('clearing one problem pushes the next one out rather than handing it straight over', () => {
  const cleared = '2026-09-23T16:30:00.000Z';
  const rest = PILE_UP.slice(1);

  const handedOver = Date.parse(placeQueue(rest, CAP, null).get('009'));
  const paced = Date.parse(placeQueue(rest, CAP, cleared).get('009'));

  assert.ok(handedOver <= Date.parse(cleared), 'without the guard the next one is already due');
  assert.ok(paced - Date.parse(cleared) >= GAP, 'after it, the next one is a full gap away');
});

test('the same history always places the same queue, so a restart changes nothing', () => {
  const first = placeQueue(PILE_UP, CAP, '2026-09-23T16:30:00.000Z');
  const again = placeQueue([...PILE_UP].reverse(), CAP, '2026-09-23T16:30:00.000Z');

  assert.deepEqual([...again.entries()].sort(), [...first.entries()].sort());
});

test('a day never takes more than the cap', () => {
  const crowd = Array.from({ length: 20 }, (_, index) =>
    want(String(index).padStart(3, '0'), '2026-09-23T04:00:00.000Z'),
  );

  const perDay = new Map();
  for (const iso of placeQueue(crowd, CAP, null).values()) {
    const day = new Date(iso).toDateString();
    perDay.set(day, (perDay.get(day) ?? 0) + 1);
  }

  for (const [day, count] of perDay) assert.ok(count <= CAP, `${day} took ${count}`);
});

test('nothing is ever asked for in the middle of the night', () => {
  const crowd = Array.from({ length: 20 }, (_, index) =>
    want(String(index).padStart(3, '0'), '2026-09-23T04:00:00.000Z'),
  );

  for (const iso of placeQueue(crowd, CAP, null).values()) {
    const hour = hourOf(iso);
    assert.ok(hour >= REVIEW_WINDOW.open && hour < REVIEW_WINDOW.close, `placed at ${hour}:00 local`);
  }
});

test('the window only ever moves a time forward', () => {
  const inside = new Date(2026, 8, 23, 14, 0, 0);
  const early = new Date(2026, 8, 23, 3, 0, 0);
  const late = new Date(2026, 8, 23, 23, 30, 0);

  assert.equal(insideWindow(inside).getTime(), inside.getTime(), 'a time already inside is left alone');
  assert.equal(insideWindow(early).getHours(), REVIEW_WINDOW.open);
  assert.ok(insideWindow(late).getTime() > late.getTime());
  assert.equal(insideWindow(late).getDate(), late.getDate() + 1, 'after hours rolls to the next morning');
});

test('a problem due next week is not dragged forward by a backlog today', () => {
  const later = want('099', '2026-09-30T06:00:00.000Z');
  const placed = placeQueue([...PILE_UP, later], CAP, null);

  assert.ok(Date.parse(placed.get('099')) >= Date.parse(later.earliest));
});

test('a new plan starts tomorrow morning, never today', () => {
  const evening = new Date(2026, 8, 23, 20, 30, 0);
  const start = nextWindowOpen(evening);

  assert.equal(start.getDate(), evening.getDate() + 1);
  assert.equal(start.getHours(), REVIEW_WINDOW.open);
});
