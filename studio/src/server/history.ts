import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ProblemHistory, RunStatus, SourceMode } from '@/lib/types';
import { STUDIO_ROOT } from './workspace';

const HISTORY_FILE = path.join(STUDIO_ROOT, '.studio', 'history.json');
const KEEP_PER_PROBLEM = 60;
const REVIEW_DAYS = 14;

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
}

const EMPTY: HistoryFile = { runs: {}, hints: {} };

export const EMPTY_HISTORY: ProblemHistory = {
  runs: 0,
  runsToFirstPass: null,
  firstPassAt: null,
  lastPassAt: null,
  lastRunAt: null,
  hintLevel: 0,
  due: false,
};

async function read(): Promise<HistoryFile> {
  const raw = await readFile(HISTORY_FILE, 'utf8').catch(() => null);
  if (raw === null) return { ...EMPTY };

  try {
    const parsed = JSON.parse(raw) as Partial<HistoryFile>;
    return { runs: parsed.runs ?? {}, hints: parsed.hints ?? {} };
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

/** Attempts are what you typed; a bulk recheck is not an attempt and never counts as one. */
function summarize(records: RunRecord[], hintLevel: number): ProblemHistory {
  const attempts = records.filter((record) => record.kind === 'run');
  const passes = records.filter((record) => record.ok);
  const firstPass = passes[0] ?? null;
  const lastPass = passes[passes.length - 1] ?? null;
  const last = records[records.length - 1] ?? null;
  const indexOfFirstPass = attempts.findIndex((record) => record.ok);

  return {
    runs: attempts.length,
    runsToFirstPass: indexOfFirstPass === -1 ? null : indexOfFirstPass + 1,
    firstPassAt: firstPass?.at ?? null,
    lastPassAt: lastPass?.at ?? null,
    lastRunAt: last?.at ?? null,
    hintLevel,
    due: lastPass !== null && daysSince(lastPass.at) >= REVIEW_DAYS,
  };
}

export async function getHistories(): Promise<Record<string, ProblemHistory>> {
  const history = await read();
  const numbers = new Set([...Object.keys(history.runs), ...Object.keys(history.hints)]);

  return Object.fromEntries(
    [...numbers].map((number) => [number, summarize(history.runs[number] ?? [], history.hints[number] ?? 0)]),
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

export async function recordHint(number: string, level: number): Promise<void> {
  const history = await read();

  history.hints[number] = Math.max(history.hints[number] ?? 0, level);
  await write(history);
}
