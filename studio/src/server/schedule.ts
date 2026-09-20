import type { ReviewGrade, ReviewKind } from '@/lib/types';

/**
 * When a solved problem should come back, and what a review earned. Pure on
 * purpose: no clock, no files, so it can be tested directly.
 */

export const SEED_EASE = 2.3;
export const MIN_EASE = 1.3;
export const MAX_EASE = 2.8;
export const MAX_INTERVAL = 180;

/**
 * A drill answers "which pattern, and why" in under a minute. That is worth
 * spacing, but not as much as writing the solution again, so it grows the
 * interval at a lower rate and cannot push a problem past this. Past the
 * ceiling only a full re-solve moves the schedule.
 */
export const DRILL_CEILING = 30;
export const LEECH_LAPSES = 3;

/** Ease is stepped by hundredths, so it is kept at that precision rather than drifting. */
const round2 = (value: number) => Math.round(value * 100) / 100;

export interface Review {
  kind: ReviewKind;
  grade: ReviewGrade;
}

export interface Schedule {
  interval: number;
  ease: number;
  lapses: number;
  streak: number;
}

/**
 * Where the schedule starts. The first solve is a real signal: one that needed
 * six attempts and two hints has not been learned yet and should come back in
 * days, not weeks.
 */
export function seedInterval(runsToFirstPass: number | null, hintLevel: number): number {
  if (hintLevel >= 2 || (runsToFirstPass ?? 99) > 5) return 3;
  if (hintLevel === 1 || (runsToFirstPass ?? 99) > 2) return 7;
  return 21;
}

/**
 * Replayed from the review log rather than stored, so the schedule can never
 * drift away from the history it claims to summarise.
 */
export function replay(seed: number, reviews: Review[]): Schedule {
  let interval = seed;
  let ease = SEED_EASE;
  let lapses = 0;
  let streak = 0;

  for (const review of reviews) {
    if (review.grade === 0) {
      lapses += 1;
      streak += 1;
      ease = round2(Math.max(MIN_EASE, ease - 0.2));
      interval = 1;
      continue;
    }

    streak = 0;
    ease = round2(
      review.grade === 1 ? Math.max(MIN_EASE, ease - 0.05) : Math.min(MAX_EASE, ease + 0.05),
    );

    const growth = review.grade === 1 ? 1.2 : ease;
    const grown = Math.max(1, Math.round(interval * growth));

    interval =
      review.kind === 'drill'
        ? Math.max(interval, Math.min(DRILL_CEILING, grown))
        : Math.min(MAX_INTERVAL, grown);
  }

  return { interval, ease, lapses, streak };
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
 * A plan the learner asked for by hand: "this one was hard, put it in front of
 * me N times a day for D days". It is deliberately not SM-2. Spacing earned by
 * measured recall is the right default, but it cannot help with a problem you
 * already know you have not learned, because it only reacts after the fact.
 *
 * Repetitions are spaced from the last one completed rather than from clock
 * slots, so a day that starts late does not dump every repetition at once.
 */
export interface RepeatPlan {
  /** When the plan was asked for. */
  createdAt: string;
  /** How many days the plan should run. */
  days: number;
  /** How many repetitions a day. */
  perDay: number;
  /** Completed repetitions, newest last. */
  done: string[];
  /** Why it was hard, in the learner's own words. */
  note: string | null;
}

export interface PlanState {
  /** Repetitions asked for in total. */
  total: number;
  /** Repetitions completed. */
  done: number;
  /** When the next repetition is due, or null once the plan is finished. */
  nextAt: string | null;
  /** True once every repetition is done or the window has closed. */
  finished: boolean;
}

export const MAX_PLAN_DAYS = 30;
export const MAX_PLAN_PER_DAY = 12;

/** Milliseconds between repetitions, spread across a 16-hour waking day. */
const spacing = (perDay: number) => Math.round((16 * 3_600_000) / Math.max(1, perDay));

/**
 * Where a plan stands right now. `now` is passed in so this stays pure and can
 * be tested at a fixed instant.
 */
export function planState(plan: RepeatPlan, now: number = Date.now()): PlanState {
  const total = Math.max(1, plan.days) * Math.max(1, plan.perDay);
  const done = plan.done.length;

  if (done >= total) return { total, done, nextAt: null, finished: true };

  const window = Math.max(1, plan.days) * 86_400_000;
  const expiry = new Date(plan.createdAt).getTime() + window;
  if (now > expiry) return { total, done, nextAt: null, finished: true };

  /**
   * The first repetition is due immediately - the learner asked for this one
   * because it is unlearned now, not tomorrow.
   */
  const last = plan.done[plan.done.length - 1];
  const nextAt = last === undefined ? plan.createdAt : new Date(new Date(last).getTime() + spacing(plan.perDay)).toISOString();

  return { total, done, nextAt, finished: false };
}
