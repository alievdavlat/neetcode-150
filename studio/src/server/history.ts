import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ProblemHistory, ReviewGrade, ReviewKind, RunStatus, SourceMode } from '@/lib/types';
import {
  LEECH_LAPSES,
  MAX_PLAN_TARGET,
  MIN_PLAN_TARGET,
  nextWindowOpen,
  placeQueue,
  planState,
  replay,
  seedStep,
  type RepeatPlan,
} from './schedule';
import { getSettings } from './settings';
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

/**
 * Plans were once "N times a day for D days". Same-day repetition turned out to
 * measure short-term memory rather than build long-term recall, so a plan is now
 * a number of clean passes on the ladder. An old plan keeps the work already
 * done and is given a target in proportion to the days it asked for.
 */
function migratePlan(plan: RepeatPlan & { days?: number; perDay?: number }): RepeatPlan {
  if (typeof plan.target === 'number' && typeof plan.startAt === 'string') return plan;

  const days = typeof plan.days === 'number' ? plan.days : 3;
  const done = Array.isArray(plan.done) ? plan.done : [];

  /**
   * An old plan had no start date, so its first repetition was due the instant
   * it was made. One that has not been started yet is moved to tomorrow
   * morning; one already in progress is paced by its own last pass.
   */
  return {
    createdAt: plan.createdAt,
    target: Math.min(MAX_PLAN_TARGET, Math.max(MIN_PLAN_TARGET, Math.round(days / 2))),
    done,
    startAt: plan.startAt ?? (done.length === 0 ? nextWindowOpen(new Date()).toISOString() : plan.createdAt),
    note: plan.note ?? null,
  };
}

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
      plans: Object.fromEntries(
        Object.entries(parsed.plans ?? {}).map(([number, plan]) => [number, migratePlan(plan)]),
      ),
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

/** A problem's own reading of itself, before the board is allowed a say. */
interface Reading {
  history: ProblemHistory;
  /** The earliest it may come back. `null` means it is not in the rotation. */
  earliest: string | null;
}

/**
 * Attempts are what you typed. A bulk recheck proves the file still passes; it
 * says nothing about whether you could write it again, so it is never an
 * attempt, never a pass, and never advances the schedule.
 *
 * `dueAt`, `dueInDays` and `due` are deliberately left empty here. When a
 * problem comes back is not a fact about that problem alone - it depends on
 * what else is already waiting - so it is settled once, for the whole board, in
 * `summarizeAll`.
 */
function summarize(
  records: RunRecord[],
  hintLevel: number,
  opens: string[],
  reviews: ReviewRecord[],
  plan: RepeatPlan | null,
): Reading {
  const attempts = records.filter((record) => record.kind === 'run');
  const passes = attempts.filter((record) => record.ok);
  const firstPass = passes[0] ?? null;
  const lastPass = passes[passes.length - 1] ?? null;
  const last = records[records.length - 1] ?? null;
  const indexOfFirstPass = attempts.findIndex((record) => record.ok);

  const runsToFirstPass = indexOfFirstPass === -1 ? null : indexOfFirstPass + 1;
  const started = firstPass ? opens.find((at) => at <= firstPass.at) : null;

  const solved = firstPass !== null;
  const seed = seedStep(runsToFirstPass, hintLevel);
  const schedule = solved ? replay(seed, reviews) : null;

  const lastReview = reviews[reviews.length - 1] ?? null;
  const anchor = lastReview?.at ?? lastPass?.at ?? null;

  /**
   * The measured schedule and the hand-made plan are separate clocks, and the
   * plan wins outright while it is running - the learner asked for it precisely
   * because the measured one was not bringing the problem back soon enough.
   *
   * It has to win outright rather than whichever fires first. Read as an
   * either-or, a plan that had climbed to a three-day gap could still be
   * dragged in tomorrow by a ladder sitting at one, so the problem came back on
   * a date nothing on screen had ever promised.
   */
  const state = plan ? planState(plan) : null;
  const running = state !== null && !state.finished;

  const laddered =
    schedule && anchor ? new Date(new Date(anchor).getTime() + schedule.interval * 86_400_000).toISOString() : null;

  return {
    earliest: running ? state.nextAt : laddered,
    history: {
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
      dueInDays: null,
      hintLevel,
      dueAt: null,
      due: false,
      reviews: reviews.length,
      lapses: schedule?.lapses ?? 0,
      ease: null,
      lastReviewAt: lastReview?.at ?? null,
      leech: (schedule?.streak ?? 0) >= LEECH_LAPSES && !running,
      reviewMinutes: reviews
        .filter((review) => review.kind === 'solve' && !review.revealed && review.grade > 0)
        .flatMap((review) => (review.minutes === null ? [] : [review.minutes]))
        .slice(-12),
      plan: running ? { target: state.target, done: state.done, nextAt: state.nextAt, note: plan?.note ?? null } : null,
    },
  };
}

/**
 * The last thing graded anywhere on the board. It is what stops a cleared queue
 * handing over the next problem the same minute, so a repetition proved by a
 * plain run counts here too - otherwise that path would still hand straight
 * over.
 */
function lastGradedAt(history: HistoryFile): string | null {
  const stamps = [
    ...Object.values(history.reviews).flatMap((records) => records.map((record) => record.at)),
    ...Object.values(history.plans).flatMap((plan) => plan.done),
  ];

  return stamps.length === 0 ? null : stamps.reduce((latest, at) => (at > latest ? at : latest));
}

/**
 * Every problem the log knows about, summarised, with the queue laid out across
 * all of them at once. Pure apart from reading the clock to answer "is it due
 * yet", which is the one question that genuinely needs it.
 */
function summarizeAll(history: HistoryFile, dailyCap: number): Record<string, ProblemHistory> {
  const numbers = new Set([
    ...Object.keys(history.runs),
    ...Object.keys(history.hints),
    ...Object.keys(history.opens),
    ...Object.keys(history.reviews),
    ...Object.keys(history.plans),
  ]);

  const readings = [...numbers].map((number): [string, Reading] => [
    number,
    summarize(
      history.runs[number] ?? [],
      history.hints[number] ?? 0,
      history.opens[number] ?? [],
      history.reviews[number] ?? [],
      history.plans[number] ?? null,
    ),
  ]);

  const placed = placeQueue(
    readings.flatMap(([number, reading]) =>
      reading.earliest === null || reading.history.leech ? [] : [{ number, earliest: reading.earliest }],
    ),
    dailyCap,
    lastGradedAt(history),
  );

  const now = Date.now();

  return Object.fromEntries(
    readings.map(([number, reading]) => {
      const dueAt = placed.get(number) ?? null;
      if (dueAt === null) return [number, reading.history];

      const at = Date.parse(dueAt);

      return [
        number,
        {
          ...reading.history,
          dueAt,
          dueInDays: Math.ceil((at - now) / 86_400_000),
          due: at <= now,
        },
      ];
    }),
  );
}

export async function getHistories(): Promise<Record<string, ProblemHistory>> {
  const [history, settings] = await Promise.all([read(), getSettings()]);

  return summarizeAll(history, settings.dailyCap);
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

  /**
   * A plan can be put on a problem that has never been solved - "make me come
   * back to this until I can do it" - and those are proved by an ordinary run
   * rather than by a review session. A bulk recheck is not an attempt, so it
   * never counts.
   */
  if (rest.kind === 'run' && rest.ok) advancePlan(history, number);

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

  advancePlan(history, number);
  await write(history);
}

/**
 * One repetition of a hand-made plan, spent.
 *
 * Only a repetition that is actually due counts. Without that guard a learner
 * who ran the same problem four times in one sitting would burn the whole plan
 * in an afternoon, which is exactly the massed repetition the plan exists to
 * avoid. Mutates `history`; the caller writes.
 */
function advancePlan(history: HistoryFile, number: string): void {
  const plan = history.plans[number];
  if (!plan) return;

  const state = planState(plan);
  if (state.finished || state.nextAt === null || Date.parse(state.nextAt) > Date.now()) return;

  plan.done = [...plan.done, new Date().toISOString()].slice(-(plan.target + 4));

  /** A finished plan is cleared, so the normal ladder takes over again. */
  if (planState(plan).finished) delete history.plans[number];
  else history.plans[number] = plan;
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
  target,
  note,
}: {
  number: string;
  target: number;
  note: string | null;
}): Promise<void> {
  const history = await read();

  /**
   * Tomorrow morning, never today: asking for a problem back means you want to
   * reconstruct it, and you cannot reconstruct something you finished ten
   * minutes ago. Where it lands among everything else already waiting is not
   * decided here - the whole queue is laid out on every read, so a plan made
   * today is paced against the board as it will be tomorrow rather than as it
   * happened to look at the moment the button was pressed.
   */
  history.plans[number] = {
    createdAt: new Date().toISOString(),
    target: Math.min(MAX_PLAN_TARGET, Math.max(MIN_PLAN_TARGET, Math.round(target))),
    done: [],
    startAt: nextWindowOpen(new Date()).toISOString(),
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
