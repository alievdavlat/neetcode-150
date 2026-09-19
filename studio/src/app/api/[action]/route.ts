import { fail, modeOf, ok } from '@/server/http';
import { recordHint, recordOpen } from '@/server/history';
import { readNote, writeNote } from '@/server/notes';
import {
  getStatus,
  promoteScratch,
  readProblemSource,
  runCategory,
  runProblem,
  syncStatuses,
  writeProblemSource,
} from '@/server/problems';
import { listSolutions } from '@/server/solutions';
import { typecheckFile } from '@/server/typecheck';

export const dynamic = 'force-dynamic';

type Handler = (request: Request) => Promise<Response>;

/** A problem file is `12-category/034-slug.ts`, so its number heads the name. */
const numberOf = (file: string) => file.split('/')[1].slice(0, 3);

const query = (request: Request) => new URL(request.url).searchParams;

const body = async <T>(request: Request) => (await request.json().catch(() => null)) as T | null;

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
};

const post: Record<string, Handler> = {
  async hint(request) {
    const payload = await body<{ number?: string; level?: number }>(request);
    if (!payload?.number || !/^\d{3}$/.test(payload.number)) return fail('a three digit problem number is required');
    if (typeof payload.level !== 'number' || payload.level < 1 || payload.level > 3)
      return fail('level must be 1, 2 or 3');

    await recordHint(payload.number, payload.level);
    return ok({ status: await getStatus(payload.number) });
  },

  async open(request) {
    const payload = await body<{ number?: string }>(request);
    if (!payload?.number || !/^\d{3}$/.test(payload.number)) return fail('a three digit problem number is required');

    await recordOpen(payload.number);
    return ok({ recorded: true });
  },

  async promote(request) {
    const payload = await body<{ file?: string }>(request);
    if (!payload?.file) return fail('file is required');

    await promoteScratch(payload.file);
    return ok({ status: await getStatus(numberOf(payload.file)) });
  },

  async run(request) {
    const payload = await body<{ number?: string; mode?: string; bigO?: boolean }>(request);
    if (!payload?.number || !/^\d{3}$/.test(payload.number)) return fail('a three digit problem number is required');

    const report = await runProblem(payload.number, modeOf(payload.mode), payload.bigO === true);
    return ok({ report, status: await getStatus(payload.number) });
  },

  async 'run-category'(request) {
    const payload = await body<{ dir?: string }>(request);
    if (!payload?.dir || !/^\d{2}-[a-z0-9-]+$/.test(payload.dir)) return fail('a category folder is required');

    return ok({ statuses: await runCategory(payload.dir) });
  },

  async sync() {
    return ok({ statuses: await syncStatuses() });
  },

  async typecheck(request) {
    const payload = await body<{ file?: string }>(request);
    if (!payload?.file) return fail('file is required');

    return ok({ markers: await typecheckFile(payload.file) });
  },
};

const put: Record<string, Handler> = {
  async file(request) {
    const payload = await body<{ file?: string; source?: string; mode?: string }>(request);
    if (!payload?.file || typeof payload.source !== 'string') return fail('file and source are required');

    await writeProblemSource(payload.file, payload.source, modeOf(payload.mode));
    return ok({ status: await getStatus(numberOf(payload.file)) });
  },

  async notes(request) {
    const payload = await body<{ number?: string; note?: string }>(request);
    if (!payload?.number || typeof payload.note !== 'string') return fail('number and note are required');

    await writeNote(payload.number, payload.note);
    return ok({ saved: true });
  },
};

/** The work these endpoints hand off can fail on its own terms, not the caller's. */
const SERVER_FAULT = new Set(['run', 'run-category', 'sync', 'typecheck']);

/**
 * Every endpoint behind one function. A deployment on the Hobby plan may carry
 * twelve serverless functions and a file per route overshot that, so the routes
 * became a table keyed by the path segment. The URLs are unchanged.
 */
async function dispatch(table: Record<string, Handler>, request: Request): Promise<Response> {
  const action = new URL(request.url).pathname.split('/').filter(Boolean).pop() ?? '';
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
