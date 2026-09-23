import type { ReviewGrade, ReviewKind } from '@/lib/types';

/**
 * When a solved problem should come back. Pure on purpose: no clock, no files,
 * so it can be tested directly.
 *
 * Everything runs on one ladder of intervals rather than an ease factor. A
 * ladder is explainable - every number on it is a real number of days the
 * learner can reason about - and it cannot drift into the odd corners an ease
 * multiplier reaches after a few bad gradings.
 */

/** Days between reviews, each step roughly twice the last. */
export const LADDER = [1, 3, 7, 16, 35, 90] as const;

/** Enough consecutive failures to say the problem needs re-learning, not review. */
export const LEECH_LAPSES = 3;

/**
 * A drill answers "which pattern, and why" in under a minute. Worth something,
 * but not as much as writing the solution again, so it cannot climb past here.
 */
export const DRILL_CEILING_STEP = 2;

export interface Review {
  kind: ReviewKind;
  grade: ReviewGrade;
}

export interface Schedule {
  /** Where on the ladder this problem sits. */
  step: number;
  /** Days until it comes back, read off the ladder. */
  interval: number;
  lapses: number;
  /** Consecutive failures, for spotting a problem that is not being learned. */
  streak: number;
}

export const intervalAt = (step: number) => LADDER[Math.min(Math.max(step, 0), LADDER.length - 1)];

/**
 * Where a problem joins the ladder, from how its first solve went. The worst
 * case is tomorrow and the best is a week - never three weeks, which is far too
 * long to wait before finding out whether a new pattern stuck.
 */
export function seedStep(runsToFirstPass: number | null, hintLevel: number): number {
  if (hintLevel >= 2 || (runsToFirstPass ?? 99) > 5) return 0;
  if (hintLevel === 1 || (runsToFirstPass ?? 99) > 2) return 1;
  return 2;
}

/**
 * Replayed from the review log rather than stored, so the schedule can never
 * drift away from the history it claims to summarise.
 *
 * A clean pass climbs a step, a slow or hinted pass holds the same interval,
 * and a failure drops back to the bottom. Holding rather than shrinking on a
 * middling pass matters: it keeps a problem you half-know from sliding all the
 * way back and crowding out the ones you do not know at all.
 */
export function replay(seed: number, reviews: Review[]): Schedule {
  let step = seed;
  let lapses = 0;
  let streak = 0;

  for (const review of reviews) {
    if (review.grade === 0) {
      lapses += 1;
      streak += 1;
      step = 0;
      continue;
    }

    streak = 0;
    if (review.grade === 2) step += 1;

    if (review.kind === 'drill') step = Math.min(step, DRILL_CEILING_STEP);
    step = Math.min(step, LADDER.length - 1);
  }

  return { step, interval: intervalAt(step), lapses, streak };
}

/**
 * The grade a review earned, from what was measured rather than what was felt.
 * `baseline` is how long this took the first time, so "as fast as before" is
 * the bar rather than some absolute number of minutes.
 */
export function gradeReview({
  passed,
  revealed,
  runs,
  hints,
  minutes,
  baseline,
}: {
  passed: boolean;
  revealed: boolean;
  runs: number;
  hints: number;
  minutes: number | null;
  baseline: number | null;
}): ReviewGrade {
  if (!passed || revealed) return 0;
  if (runs > 2 || hints > 0) return 1;
  if (minutes !== null && baseline !== null && minutes > baseline) return 1;
  return 2;
}

/**
 * A plan the learner asked for by hand: "I know I have not learned this one,
 * hold it at the bottom of the ladder until I can prove it."
 *
 * It counts clean passes, not exposures. Repeating the same problem three times
 * in one afternoon mostly measures short-term memory - the answer is still in
 * mind from the last attempt - so a plan never schedules two repetitions on the
 * same day. What makes a hard problem stick is coming back tomorrow, and then
 * in three days, having had to reconstruct it each time.
 */
export interface RepeatPlan {
  createdAt: string;
  /** How many clean passes before it graduates back to the normal ladder. */
  target: number;
  /** Completed repetitions, newest last. */
  done: string[];
  /** The earliest the first repetition may be asked for: tomorrow, at the soonest. */
  startAt: string;
  /** Why it was hard, in the learner's own words. */
  note: string | null;
}

export interface PlanState {
  target: number;
  done: number;
  /** When the next repetition is due, or null once the plan is finished. */
  nextAt: string | null;
  finished: boolean;
}

export const MIN_PLAN_TARGET = 2;
export const MAX_PLAN_TARGET = 6;

/**
 * Where a plan stands. It reports the earliest the next repetition may be asked
 * for rather than whether it is due yet, so it never reads a clock and the
 * caller owns the comparison. The board decides where that lands among
 * everything else waiting - see `placeQueue`.
 */
export function planState(plan: RepeatPlan): PlanState {
  const target = Math.max(1, plan.target);
  const done = plan.done.length;

  if (done >= target) return { target, done, nextAt: null, finished: true };

  /**
   * The first repetition sits where the plan was paced to start; every one
   * after climbs the bottom of the ladder from the last pass, so a learner who
   * keeps passing sees it less often rather than the same amount.
   */
  const last = plan.done[plan.done.length - 1];
  const nextAt =
    last === undefined
      ? plan.startAt
      : new Date(new Date(last).getTime() + intervalAt(done - 1) * 86_400_000).toISOString();

  return { target, done, nextAt, finished: false };
}

/**
 * The hours a review may be asked for, local time.
 *
 * Outside them the queue is quiet. A problem that falls due at two in the
 * morning is not a review, it is a notification waiting to be resented - and a
 * backlog left to spill through the night arrives as one wall at breakfast,
 * which is the shape this whole module exists to avoid.
 */
export const REVIEW_WINDOW = { open: 9, close: 21 } as const;

const MINUTE = 60_000;

/**
 * Minutes between two consecutive reviews. It is the daily cap read the other
 * way round - fit that many into the waking window and this is the gap - so
 * there is one number to tune rather than two that can drift apart.
 */
export const gapMinutes = (cap: number) =>
  Math.round(((REVIEW_WINDOW.close - REVIEW_WINDOW.open) * 60) / Math.min(40, Math.max(1, cap)));

/** The same clock hour on whatever local day `date` falls in. */
function atHour(date: Date, hour: number): Date {
  const out = new Date(date);
  out.setHours(hour, 0, 0, 0);
  return out;
}

/**
 * `date`, moved into a review window if it landed outside one. Only ever
 * forward: the allocator below relies on that to keep its cursor monotonic.
 */
export function insideWindow(date: Date): Date {
  const open = atHour(date, REVIEW_WINDOW.open);
  if (date.getTime() < open.getTime()) return open;

  if (date.getTime() < atHour(date, REVIEW_WINDOW.close).getTime()) return date;

  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return atHour(tomorrow, REVIEW_WINDOW.open);
}

export interface DueWant {
  number: string;
  /** The earliest this problem may come back, read off its own history alone. */
  earliest: string;
}

/**
 * When each problem actually comes back, decided for the whole board at once.
 *
 * Deciding it one problem at a time was the bug this replaces: a ladder and a
 * plan each know when their own problem is ready and neither can see the other
 * nine that are ready at the same minute. Ten problems marked hard in one
 * sitting came back in one sitting, were cleared in one sitting, and re-armed
 * themselves into the same sitting a day later - a queue that reproduces its
 * own pile-up every time it is emptied.
 *
 * So nothing is ever placed within `gap` of the item before it. The most
 * overdue problem keeps its own time and the rest fall in behind it, which is
 * what makes a queue something you walk through rather than a wall.
 *
 * `quietUntil` is the last thing graded anywhere on the board, and it seeds the
 * cursor so finishing one review pushes the next one out rather than handing it
 * over immediately.
 *
 * No clock is read. Two calls a second apart, or either side of a restart,
 * return the same answer for the same history - which is the other half of the
 * promise, because a schedule that re-rolls on every page load is not a
 * schedule.
 */
export function placeQueue(wants: DueWant[], cap: number, quietUntil: string | null): Map<string, string> {
  const gap = gapMinutes(cap) * MINUTE;
  const ordered = [...wants].sort(
    (left, right) =>
      Date.parse(left.earliest) - Date.parse(right.earliest) || left.number.localeCompare(right.number),
  );

  const placed = new Map<string, string>();
  let cursor = quietUntil === null ? Number.NEGATIVE_INFINITY : Date.parse(quietUntil) + gap;

  for (const want of ordered) {
    const slot = insideWindow(new Date(Math.max(Date.parse(want.earliest), cursor)));

    placed.set(want.number, slot.toISOString());
    cursor = slot.getTime() + gap;
  }

  return placed;
}

/** Tomorrow, when the window opens: never today, and never the small hours. */
export function nextWindowOpen(from: Date): Date {
  const tomorrow = new Date(from);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return atHour(tomorrow, REVIEW_WINDOW.open);
}
