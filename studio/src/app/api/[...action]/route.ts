import { fail, modeOf, ok } from '@/server/http';
import { getCourse, setCourseNote, setWatched } from '@/server/courses';
import { recordHint, recordOpen, recordReview, startPlan, stopPlan } from '@/server/history';
import { readNote, writeNote } from '@/server/notes';
import {
  countOperations,
  forgetProblems,
  getProblems,
  getStatus,
  numberOfFile,
  promoteScratch,
  readProblemSource,
  resetScratch,
  runBoard,
  runCategory,
  runProblem,
  syncStatuses,
  traceProblem,
  writeProblemSource,
} from '@/server/problems';
import { gradeReview, MAX_PLAN_TARGET, MIN_PLAN_TARGET } from '@/server/schedule';
import { getSettings, saveSettings } from '@/server/settings';
import { listSolutions } from '@/server/solutions';
import { typecheckFile } from '@/server/typecheck';
import type { ReviewGrade, ReviewKind } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** A run spawns the whole suite for a category; ten seconds is not always enough. */
export const maxDuration = 60;

type Handler = (request: Request) => Promise<Response>;

const query = (request: Request) => new URL(request.url).searchParams;

const body = async <T>(request: Request) => (await request.json().catch(() => null)) as T | null;

/** A finite number, rounded. Negatives survive so a range check can reject them. */
const rounded = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback;

/** The same, for a count: below zero is not one. */
const counted = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : fallback;

const MAX_TRACE_INPUT = 32 * 1024;

interface LessonRef {
  course: string;
  at: number;
}

/** Both course endpoints name a lesson the same way and reject it the same way. */
async function lessonRef(payload: { course?: string; at?: number } | null): Promise<LessonRef | string> {
  const course = payload?.course;
  const at = payload?.at;

  if (!course || !/^[a-z0-9-]{1,64}$/.test(course)) return 'a course id is required';
  if (typeof at !== 'number' || !Number.isInteger(at) || at < 0) return 'a lesson start is required';

  const found = await getCourse(course);
  if (!found) return `no course called ${course}`;
  if (!found.lessons.some((lesson) => lesson.at === at)) return 'that lesson is not in this course';

  return { course, at };
}

const get: Record<string, Handler> = {
  async file(request) {
    const params = query(request);
    const file = params.get('file');
    if (!file) return fail('file is required');

    return ok(await readProblemSource(file, modeOf(params.get('source'))));
  },

  async notes(request) {
    const number = query(request).get('number');
    if (!number) return fail('number is required');

    return ok({ note: await readNote(number) });
  },

  async solutions(request) {
    const number = query(request).get('number');
    if (!number) return fail('number is required');

    return ok({ snapshots: await listSolutions(number) });
  },

  async settings() {
    return ok({ settings: await getSettings() });
  },
};

const post: Record<string, Handler> = {
  async hint(request) {
    const payload = await body<{ number?: string; level?: number }>(request);
    if (!payload?.number || !/^\d{3,4}$/.test(payload.number)) return fail('a problem number is required');
    if (typeof payload.level !== 'number' || payload.level < 1 || payload.level > 3) {
      return fail('level must be 1, 2 or 3');
    }

    await recordHint(payload.number, payload.level);
    return ok({ status: await getStatus(payload.number) });
  },

  async open(request) {
    const payload = await body<{ number?: string }>(request);
    if (!payload?.number || !/^\d{3,4}$/.test(payload.number)) return fail('a problem number is required');

    await recordOpen(payload.number);
    return ok({ recorded: true });
  },

  async promote(request) {
    const payload = await body<{ file?: string }>(request);
    if (!payload?.file) return fail('file is required');

    await promoteScratch(payload.file);
    return ok({ status: await getStatus(numberOfFile(payload.file)) });
  },

  async run(request) {
    const payload = await body<{ number?: string; mode?: string; bigO?: boolean }>(request);
    if (!payload?.number || !/^\d{3,4}$/.test(payload.number)) return fail('a problem number is required');

    const report = await runProblem(payload.number, modeOf(payload.mode), payload.bigO === true);
    return ok({ report, status: await getStatus(payload.number) });
  },

  async 'run-category'(request) {
    const payload = await body<{ dir?: string }>(request);
    if (!payload?.dir || !/^\d{2}-[a-z0-9-]+$/.test(payload.dir)) return fail('a category folder is required');

    return ok({ statuses: await runCategory(payload.dir) });
  },

  async 'run-board'(request) {
    const payload = await body<{ numbers?: unknown }>(request);
    const numbers = Array.isArray(payload?.numbers) ? payload.numbers : null;

    if (!numbers || numbers.length === 0) return fail('a list of problem numbers is required');
    if (numbers.length > 5000) return fail('that is more problems than this workspace has');
    if (!numbers.every((number) => typeof number === 'string' && /^\d{3,4}$/.test(number))) {
      return fail('those are not problem numbers');
    }

    return ok({ statuses: await runBoard(numbers as string[]) });
  },

  async sync() {
    forgetProblems();
    return ok({ statuses: await syncStatuses() });
  },

  async typecheck(request) {
    const payload = await body<{ file?: string }>(request);
    if (!payload?.file) return fail('file is required');

    return ok({ markers: await typecheckFile(payload.file) });
  },

  async ops(request) {
    const payload = await body<{ number?: string; variant?: string; mode?: string }>(request);
    if (!payload?.number || !/^\d{3,4}$/.test(payload.number)) return fail('a problem number is required');
    if (!payload.variant || !/^[A-Za-z_$][\w$]*$/.test(payload.variant)) return fail('a variant name is required');

    return ok({ ops: await countOperations(payload.number, payload.variant, modeOf(payload.mode)) });
  },

  async trace(request) {
    const payload = await body<{
      number?: string;
      variant?: string;
      caseIndex?: number;
      mode?: string;
      input?: unknown;
    }>(request);

    if (!payload?.number || !/^\d{3,4}$/.test(payload.number)) return fail('a problem number is required');
    if (!payload.variant || !/^[A-Za-z_$][\w$]*$/.test(payload.variant)) return fail('a variant name is required');

    const index = counted(payload.caseIndex);
    const input = Array.isArray(payload.input) ? payload.input : null;
    if (input !== null && JSON.stringify(input).length > MAX_TRACE_INPUT) return fail('that input is too long');

    return ok({ trace: await traceProblem(payload.number, payload.variant, index, modeOf(payload.mode), input) });
  },

  async repeat(request) {
    const payload = await body<{
      number?: string;
      action?: 'start' | 'stop';
      target?: number;
      note?: string | null;
    }>(request);

    if (!payload?.number || !/^\d{3,4}$/.test(payload.number)) return fail('a problem number is required');

    if (payload.action === 'stop') {
      await stopPlan(payload.number);
      return ok({ status: await getStatus(payload.number) });
    }

    if (payload.action !== 'start') return fail('action must be start or stop');

    const target = rounded(payload.target, 3);
    if (target < MIN_PLAN_TARGET || target > MAX_PLAN_TARGET) {
      return fail(`target must be between ${MIN_PLAN_TARGET} and ${MAX_PLAN_TARGET}`);
    }

    await startPlan({
      number: payload.number,
      target,
      note: typeof payload.note === 'string' ? payload.note : null,
    });

    return ok({ status: await getStatus(payload.number) });
  },

  async review(request) {
    const payload = await body<{
      number?: string;
      kind?: ReviewKind;
      passed?: boolean;
      revealed?: boolean;
      runs?: number;
      hints?: number;
      minutes?: number | null;
      baseline?: number | null;
      grade?: ReviewGrade;
    }>(request);

    if (!payload?.number || !/^\d{3,4}$/.test(payload.number)) return fail('a problem number is required');
    if (payload.kind !== 'solve' && payload.kind !== 'drill') return fail('kind must be solve or drill');

    const runs = counted(payload.runs);
    const hints = counted(payload.hints);
    const minutes = payload.minutes === null || payload.minutes === undefined ? null : counted(payload.minutes, 1);

    const measured = gradeReview({
      passed: payload.passed === true,
      revealed: payload.revealed === true,
      runs,
      hints,
      minutes,
      baseline: payload.baseline ?? null,
    });

    /** A review may be marked down but never up: only the flattering lie costs anything. */
    const grade = payload.grade !== undefined && payload.grade < measured ? payload.grade : measured;

    await recordReview({
      number: payload.number,
      kind: payload.kind,
      grade,
      minutes,
      runs,
      hints,
      revealed: payload.revealed === true,
    });

    return ok({ grade, measured, status: await getStatus(payload.number) });
  },

  async 'review/start'(request) {
    const payload = await body<{ number?: string }>(request);
    if (!payload?.number || !/^\d{3,4}$/.test(payload.number)) return fail('a problem number is required');

    const problem = (await getProblems()).find((entry) => entry.number === payload.number);
    if (!problem) return fail(`no problem numbered ${payload.number}`);

    return ok({ source: await resetScratch(problem.file) });
  },
};

const put: Record<string, Handler> = {
  async file(request) {
    const payload = await body<{ file?: string; source?: string; mode?: string }>(request);
    if (!payload?.file || typeof payload.source !== 'string') return fail('file and source are required');

    await writeProblemSource(payload.file, payload.source, modeOf(payload.mode));
    return ok({ status: await getStatus(numberOfFile(payload.file)) });
  },

  async notes(request) {
    const payload = await body<{ number?: string; note?: string }>(request);
    if (!payload?.number || typeof payload.note !== 'string') return fail('number and note are required');

    await writeNote(payload.number, payload.note);
    return ok({ saved: true });
  },

  async settings(request) {
    const payload = await body<Record<string, unknown>>(request);
    if (!payload) return fail('a settings body is required');

    return ok({
      settings: await saveSettings({
        reviewEnabled: typeof payload.reviewEnabled === 'boolean' ? payload.reviewEnabled : undefined,
        strictMode: typeof payload.strictMode === 'boolean' ? payload.strictMode : undefined,
        dailyCap: typeof payload.dailyCap === 'number' ? payload.dailyCap : undefined,
      }),
    });
  },

  async courses(request) {
    const payload = await body<{ course?: string; at?: number; watched?: boolean }>(request);
    const lesson = await lessonRef(payload);
    if (typeof lesson === 'string') return fail(lesson);

    return ok({ watched: await setWatched(lesson.course, lesson.at, payload?.watched === true) });
  },

  async 'courses/note'(request) {
    const payload = await body<{ course?: string; at?: number; note?: string }>(request);
    if (typeof payload?.note !== 'string') return fail('a note is required');

    const lesson = await lessonRef(payload);
    if (typeof lesson === 'string') return fail(lesson);

    return ok({ note: await setCourseNote(lesson.course, lesson.at, payload.note) });
  },
};

/** The work these endpoints hand off can fail on its own terms, not the caller's. */
const SERVER_FAULT = new Set(['run', 'run-category', 'run-board', 'sync', 'typecheck', 'ops', 'trace']);

/**
 * Every endpoint behind one function. A deployment on the Hobby plan may carry
 * twelve serverless functions and a file per route overshot that, so the routes
 * became a table keyed by the path under `/api`. The URLs are unchanged, and a
 * nested one like `courses/note` is its own key.
 */
async function dispatch(table: Record<string, Handler>, request: Request): Promise<Response> {
  const action = new URL(request.url).pathname.replace(/^\/api\//, '').replace(/\/+$/, '');
  const handler = table[action];
  if (!handler) return fail(`no such endpoint: ${action}`, 404);

  try {
    return await handler(request);
  } catch (error) {
    return fail(error, SERVER_FAULT.has(action) ? 500 : 400);
  }
}

export const GET = (request: Request) => dispatch(get, request);
export const POST = (request: Request) => dispatch(post, request);
export const PUT = (request: Request) => dispatch(put, request);
