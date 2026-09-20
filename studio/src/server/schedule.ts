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
  /** When the first repetition is due; set when the plan is made, to pace the queue. */
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
 * Where a plan stands. `now` is passed in so this stays pure and can be tested
 * at a fixed instant.
 */
export function planState(plan: RepeatPlan, now: number = Date.now()): PlanState {
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
 * The first day at or after `from` that has room under the cap.
 *
 * Marking five problems as hard in one sitting used to make all five due at
 * once, which turns a queue into a wall and stops it being followed at all.
 * Spreading them is what keeps the promise the cap is making.
 */
export function firstDayWithRoom(load: Map<string, number>, cap: number, from: Date, dayOf: (date: Date) => string): Date {
  /** A month out is well past the point where the queue is the problem. */
  for (let ahead = 0; ahead <= 30; ahead += 1) {
    const candidate = new Date(from.getTime() + ahead * 86_400_000);
    if ((load.get(dayOf(candidate)) ?? 0) < cap) return candidate;
  }

  return from;
}
