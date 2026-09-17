import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ProblemHistory, RunStatus, SourceMode } from '@/lib/types';
import { STUDIO_ROOT } from './workspace';

const HISTORY_FILE = path.join(STUDIO_ROOT, '.studio', 'history.json');
const KEEP_PER_PROBLEM = 60;
const KEEP_OPENS = 40;

interface RunRecord {
  at: string;
  kind: 'run' | 'sync';
  mode: SourceMode;
  status: RunStatus;
  passed: number;
  total: number;
  ok: boolean;
}

interface HistoryFile {
  runs: Record<string, RunRecord[]>;
  hints: Record<string, number>;
  opens: Record<string, string[]>;
}

const EMPTY: HistoryFile = { runs: {}, hints: {}, opens: {} };

export const EMPTY_HISTORY: ProblemHistory = {
  runs: 0,
  runsToFirstPass: null,
  firstPassAt: null,
  lastPassAt: null,
  lastRunAt: null,
  solveMinutes: null,
  reviewDays: null,
  dueInDays: null,
  hintLevel: 0,
  due: false,
};

async function read(): Promise<HistoryFile> {
  const raw = await readFile(HISTORY_FILE, 'utf8').catch(() => null);
  if (raw === null) return { ...EMPTY };

  try {
    const parsed = JSON.parse(raw) as Partial<HistoryFile>;
    return { runs: parsed.runs ?? {}, hints: parsed.hints ?? {}, opens: parsed.opens ?? {} };
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
 * How long until this should come back. A first-try solve with no hints can wait
 * three weeks; one that took six runs and two hints comes back in three days.
 */
const reviewInterval = (runsToFirstPass: number | null, hintLevel: number) => {
  if (hintLevel >= 2 || (runsToFirstPass ?? 99) > 5) return 3;
  if (hintLevel === 1 || (runsToFirstPass ?? 99) > 2) return 7;
  return 21;
};

/** Attempts are what you typed; a bulk recheck is not an attempt and never counts as one. */
function summarize(records: RunRecord[], hintLevel: number, opens: string[]): ProblemHistory {
  const attempts = records.filter((record) => record.kind === 'run');
  const passes = records.filter((record) => record.ok);
  const firstPass = passes[0] ?? null;
  const lastPass = passes[passes.length - 1] ?? null;
  const last = records[records.length - 1] ?? null;
  const indexOfFirstPass = attempts.findIndex((record) => record.ok);

  const runsToFirstPass = indexOfFirstPass === -1 ? null : indexOfFirstPass + 1;
  const started = firstPass ? opens.find((at) => at <= firstPass.at) : null;
  const reviewDays = lastPass ? reviewInterval(runsToFirstPass, hintLevel) : null;

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
    reviewDays,
    dueInDays: lastPass && reviewDays ? Math.ceil(reviewDays - daysSince(lastPass.at)) : null,
    hintLevel,
    due: lastPass !== null && reviewDays !== null && daysSince(lastPass.at) >= reviewDays,
  };
}

export async function getHistories(): Promise<Record<string, ProblemHistory>> {
  const history = await read();
  const numbers = new Set([
    ...Object.keys(history.runs),
    ...Object.keys(history.hints),
    ...Object.keys(history.opens),
  ]);

  return Object.fromEntries(
    [...numbers].map((number) => [
      number,
      summarize(history.runs[number] ?? [], history.hints[number] ?? 0, history.opens[number] ?? []),
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
