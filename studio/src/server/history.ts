import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ProblemHistory, ReviewGrade, ReviewKind, RunStatus, SourceMode } from '@/lib/types';
import { LEECH_LAPSES, MAX_PLAN_DAYS, MAX_PLAN_PER_DAY, planState, replay, seedInterval, type RepeatPlan } from './schedule';
import { STUDIO_ROOT } from './workspace';

const HISTORY_FILE = path.join(STUDIO_ROOT, '.studio', 'history.json');
const KEEP_PER_PROBLEM = 60;
const KEEP_OPENS = 40;
const KEEP_REVIEWS = 60;

interface RunRecord {
  at: string;
  kind: 'run' | 'sync';
  mode: SourceMode;
  status: RunStatus;
  passed: number;
  total: number;
  ok: boolean;
}

interface ReviewRecord {
  at: string;
  kind: ReviewKind;
  grade: ReviewGrade;
  minutes: number | null;
  runs: number;
  hints: number;
  revealed: boolean;
}

interface HistoryFile {
  runs: Record<string, RunRecord[]>;
  hints: Record<string, number>;
  opens: Record<string, string[]>;
  reviews: Record<string, ReviewRecord[]>;
  /** Repeat plans the learner asked for by hand, keyed by problem number. */
  plans: Record<string, RepeatPlan>;
}

const EMPTY: HistoryFile = { runs: {}, hints: {}, opens: {}, reviews: {}, plans: {} };

export const EMPTY_HISTORY: ProblemHistory = {
  runs: 0,
  runsToFirstPass: null,
  firstPassAt: null,
  lastPassAt: null,
  lastRunAt: null,
  solveMinutes: null,
  reviewDays: null,
  dueInDays: null,
  dueAt: null,
  hintLevel: 0,
  due: false,
  reviews: 0,
  lapses: 0,
  ease: null,
  lastReviewAt: null,
  leech: false,
  reviewMinutes: [],
  plan: null,
};

async function read(): Promise<HistoryFile> {
  const raw = await readFile(HISTORY_FILE, 'utf8').catch(() => null);
  if (raw === null) return { ...EMPTY };

  try {
    const parsed = JSON.parse(raw) as Partial<HistoryFile>;
    return {
      runs: parsed.runs ?? {},
      hints: parsed.hints ?? {},
      opens: parsed.opens ?? {},
      reviews: parsed.reviews ?? {},
      plans: parsed.plans ?? {},
    };
  } catch {
    return { ...EMPTY };
  }
}

/** Written through a temp file so an interrupted write cannot lose the log. */
async function write(history: HistoryFile): Promise<void> {
  const temp = `${HISTORY_FILE}.tmp`;

  await mkdir(path.dirname(HISTORY_FILE), { recursive: true });
  await writeFile(temp, JSON.stringify(history, null, 2));
  await rename(temp, HISTORY_FILE);
}

const daysSince = (iso: string) => (Date.now() - new Date(iso).getTime()) / 86_400_000;

/**
 * Attempts are what you typed. A bulk recheck proves the file still passes; it
 * says nothing about whether you could write it again, so it is never an
 * attempt, never a pass, and never advances the schedule.
 */
function summarize(
  records: RunRecord[],
  hintLevel: number,
  opens: string[],
  reviews: ReviewRecord[],
  plan: RepeatPlan | null,
): ProblemHistory {
  const attempts = records.filter((record) => record.kind === 'run');
  const passes = attempts.filter((record) => record.ok);
  const firstPass = passes[0] ?? null;
  const lastPass = passes[passes.length - 1] ?? null;
  const last = records[records.length - 1] ?? null;
  const indexOfFirstPass = attempts.findIndex((record) => record.ok);

  const runsToFirstPass = indexOfFirstPass === -1 ? null : indexOfFirstPass + 1;
  const started = firstPass ? opens.find((at) => at <= firstPass.at) : null;

  const solved = firstPass !== null;
  const seed = seedInterval(runsToFirstPass, hintLevel);
  const schedule = solved ? replay(seed, reviews) : null;

  const lastReview = reviews[reviews.length - 1] ?? null;
  const anchor = lastReview?.at ?? lastPass?.at ?? null;
  const elapsed = anchor === null ? null : daysSince(anchor);

  /**
   * The measured schedule and the hand-made plan are separate clocks. The plan
   * wins while it is running, because the learner asked for it precisely
   * because the measured one was not bringing the problem back soon enough.
   */
  const state = plan ? planState(plan) : null;
  const planDue = state !== null && !state.finished && state.nextAt !== null && Date.parse(state.nextAt) <= Date.now();
  const scheduleDue = schedule !== null && elapsed !== null && elapsed >= schedule.interval;

  const scheduledAt =
    schedule && anchor ? new Date(new Date(anchor).getTime() + schedule.interval * 86_400_000).toISOString() : null;

  return {
    runs: attempts.length,
    runsToFirstPass,
    firstPassAt: firstPass?.at ?? null,
    lastPassAt: lastPass?.at ?? null,
    lastRunAt: last?.at ?? null,
    solveMinutes:
      firstPass && started
        ? Math.max(1, Math.round((new Date(firstPass.at).getTime() - new Date(started).getTime()) / 60000))
        : null,
    reviewDays: schedule?.interval ?? null,
    dueInDays: schedule && elapsed !== null ? Math.ceil(schedule.interval - elapsed) : null,
    hintLevel,
    dueAt: state && !state.finished ? state.nextAt : scheduledAt,
    due: planDue || scheduleDue,
    reviews: reviews.length,
    lapses: schedule?.lapses ?? 0,
    ease: schedule ? Math.round(schedule.ease * 100) / 100 : null,
    lastReviewAt: lastReview?.at ?? null,
    leech: (schedule?.streak ?? 0) >= LEECH_LAPSES && state === null,
    reviewMinutes: reviews
      .filter((review) => review.kind === 'solve' && !review.revealed && review.grade > 0)
      .flatMap((review) => (review.minutes === null ? [] : [review.minutes]))
      .slice(-12),
    plan:
      plan && state && !state.finished
        ? { days: plan.days, perDay: plan.perDay, done: state.done, total: state.total, nextAt: state.nextAt, note: plan.note }
        : null,
  };
}

export async function getHistories(): Promise<Record<string, ProblemHistory>> {
  const history = await read();
  const numbers = new Set([
    ...Object.keys(history.runs),
    ...Object.keys(history.hints),
    ...Object.keys(history.opens),
    ...Object.keys(history.reviews),
    ...Object.keys(history.plans),
  ]);

  return Object.fromEntries(
    [...numbers].map((number) => [
      number,
      summarize(
        history.runs[number] ?? [],
        history.hints[number] ?? 0,
        history.opens[number] ?? [],
        history.reviews[number] ?? [],
        history.plans[number] ?? null,
      ),
    ]),
  );
}

interface RecordRunInput {
  number: string;
  kind: RunRecord['kind'];
  mode: SourceMode;
  status: RunStatus;
  passed: number;
  total: number;
  ok: boolean;
}

export async function recordRun(input: RecordRunInput): Promise<void> {
  const history = await read();
  const { number, ...rest } = input;
  const records = history.runs[number] ?? [];

  history.runs[number] = [...records, { at: new Date().toISOString(), ...rest }].slice(-KEEP_PER_PROBLEM);
  await write(history);
}

/** When a problem was opened, so "solved in 23 minutes" is a measurement and not a guess. */
export async function recordOpen(number: string): Promise<void> {
  const history = await read();
  const opens = history.opens[number] ?? [];
  const last = opens[opens.length - 1];
  if (last && Date.now() - new Date(last).getTime() < 60_000) return;

  history.opens[number] = [...opens, new Date().toISOString()].slice(-KEEP_OPENS);
  await write(history);
}

export async function recordHint(number: string, level: number): Promise<void> {
  const history = await read();

  history.hints[number] = Math.max(history.hints[number] ?? 0, level);
  await write(history);
}

export interface RecordReviewInput {
  number: string;
  kind: ReviewKind;
  grade: ReviewGrade;
  minutes: number | null;
  runs: number;
  hints: number;
  revealed: boolean;
}

export async function recordReview({ number, ...rest }: RecordReviewInput): Promise<void> {
  const history = await read();
  const reviews = history.reviews[number] ?? [];

  history.reviews[number] = [...reviews, { at: new Date().toISOString(), ...rest }].slice(-KEEP_REVIEWS);

  /**
   * A repetition the learner asked for is spent by doing it, whatever it
   * earned: the plan counts exposures, not successes, and a bad one is already
   * punished by the measured schedule. Advancing here rather than at the call
   * site means no route can record a review and forget the plan.
   */
  const plan = history.plans[number];
  if (plan) {
    plan.done = [...plan.done, new Date().toISOString()].slice(-(planState(plan).total + 4));
    if (planState(plan).finished) delete history.plans[number];
    else history.plans[number] = plan;
  }

  await write(history);
}

export interface ActivityDay {
  day: string;
  runs: number;
  reviews: number;
}

const pad = (value: number) => String(value).padStart(2, '0');

/** Local days. `toISOString()` would push an hour past midnight onto yesterday. */
const dayOf = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * What actually happened, per day, out of the run log: hand attempts and
 * reviews. A bulk recheck is neither, so it never lights up a day you did not
 * work.
 */
export async function getActivity(days = 119): Promise<{ days: ActivityDay[]; total: number; streak: number }> {
  const history = await read();
  const counted = new Map<string, ActivityDay>();

  const bump = (day: string, key: 'runs' | 'reviews') => {
    const entry = counted.get(day) ?? { day, runs: 0, reviews: 0 };
    entry[key] += 1;
    counted.set(day, entry);
  };

  for (const records of Object.values(history.runs)) {
    for (const record of records) {
      if (record.kind === 'run') bump(dayOf(new Date(record.at)), 'runs');
    }
  }

  for (const records of Object.values(history.reviews)) {
    for (const record of records) bump(dayOf(new Date(record.at)), 'reviews');
  }

  const out: ActivityDay[] = [];
  const cursor = new Date();

  for (let back = days; back >= 0; back -= 1) {
    const date = new Date(cursor.getTime() - back * 86_400_000);
    const day = dayOf(date);
    out.push(counted.get(day) ?? { day, runs: 0, reviews: 0 });
  }

  let streak = 0;
  for (let index = out.length - 1; index >= 0; index -= 1) {
    const entry = out[index];
    const busy = entry.runs + entry.reviews > 0;

    /** Today not being over yet should not break a streak that is otherwise alive. */
    if (!busy && index === out.length - 1) continue;
    if (!busy) break;
    streak += 1;
  }

  return {
    days: out,
    total: out.reduce((sum, entry) => sum + entry.runs + entry.reviews, 0),
    streak,
  };
}

/**
 * Put a problem in front of the learner on their own terms. Spaced repetition
 * reacts to what it measured; this is the learner saying "I know I have not
 * got this" before the measurement catches up.
 */
export async function startPlan({
  number,
  days,
  perDay,
  note,
}: {
  number: string;
  days: number;
  perDay: number;
  note: string | null;
}): Promise<void> {
  const history = await read();

  history.plans[number] = {
    createdAt: new Date().toISOString(),
    days: Math.min(MAX_PLAN_DAYS, Math.max(1, Math.round(days))),
    perDay: Math.min(MAX_PLAN_PER_DAY, Math.max(1, Math.round(perDay))),
    done: [],
    note: note?.trim() ? note.trim() : null,
  };

  await write(history);
}

export async function stopPlan(number: string): Promise<void> {
  const history = await read();
  if (!history.plans[number]) return;

  delete history.plans[number];
  await write(history);
}
