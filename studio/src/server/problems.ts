import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  OperationProbe,
  Problem,
  ProblemHistory,
  ProblemSource,
  ProblemStatus,
  RunReport,
  RunStatus,
  SourceMode,
  TraceResult,
} from '@/lib/types';
import { getLocale } from '@/i18n/server';
import { EMPTY_HISTORY, getHistories, recordRun } from './history';
import { syncCategoryReadme } from './readme';
import { snapshotSolution } from './solutions';
import { problemPath, resolveProblemFile, runBridge, SCRATCH_PREFIX, STUDIO_ROOT, WORKSPACE_ROOT } from './workspace';

const RESULTS_FILE = path.join(STUDIO_ROOT, '.studio', 'results.json');
const SCRATCH_ROOT = path.join(WORKSPACE_ROOT, SCRATCH_PREFIX);
const SHARED_REEXPORT = "export * from '../../../../shared/types.ts';\n";
const SCRATCH_PACKAGE = '{ "type": "module" }\n';
const MAX_SOURCE_BYTES = 256 * 1024;

interface StoredResult {
  status: RunStatus;
  passed: number;
  total: number;
  failingVariants: number;
  at: string;
}

interface SyncResult {
  number: string;
  status: RunStatus;
  passed: number;
  total: number;
  failingVariants: number;
}

type ResultStore = Record<string, StoredResult>;

/** One list per language, because the prose differs and the rest does not. */
const problemsByLocale = new Map<string, Promise<Problem[]>>();

/** Drop the cached lists, so newly generated problems are picked up. */
export function forgetProblems(): void {
  problemsByLocale.clear();
}

export async function getProblems(): Promise<Problem[]> {
  const locale = await getLocale();

  const held = problemsByLocale.get(locale);
  if (held) return held;

  const loading = runBridge<Problem[]>({ script: 'problems.mjs', args: [locale], timeoutMs: 30000 });
  problemsByLocale.set(locale, loading);

  return loading;
}

/** `01-arrays-hashing/1004-slug.ts` -> `1004`. Numbers are three or four digits. */
export const numberOfFile = (file: string) => /(\d{3,4})-/.exec(file.split('/')[1] ?? '')?.[1] ?? '';

const numberOf = numberOfFile;

async function problemFor(file: string): Promise<Problem> {
  const number = numberOf(file);
  const problem = (await getProblems()).find((entry) => entry.number === number);
  if (!problem) throw new Error(`no problem numbered ${number}`);

  return problem;
}

async function readResults(): Promise<ResultStore> {
  const raw = await readFile(RESULTS_FILE, 'utf8').catch(() => null);
  if (raw === null) return {};

  try {
    return JSON.parse(raw) as ResultStore;
  } catch {
    return {};
  }
}

/** Written through a temp file so an interrupted write cannot wipe the history. */
async function writeResults(store: ResultStore): Promise<void> {
  const temp = `${RESULTS_FILE}.tmp`;

  await mkdir(path.dirname(RESULTS_FILE), { recursive: true });
  await writeFile(temp, JSON.stringify(store, null, 2));
  await rename(temp, RESULTS_FILE);
}

/** Comments and spacing are the author's; only the code decides whether a stub was touched. */
const codeOnly = (source: string) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

interface DeriveInput {
  problem: Problem;
  source: string | null;
  mtimeMs: number;
  result?: StoredResult;
  history: ProblemHistory;
}

function deriveStatus({ problem, source, mtimeMs, result, history }: DeriveInput): ProblemStatus {
  const untouched = source === null || codeOnly(source) === codeOnly(`${problem.imports ?? ''}\n${problem.stub}`);
  const shell = { number: problem.number, stale: false, passed: null, total: null, ranAt: null, history };

  if (untouched) return { ...shell, state: 'not-started' };
  if (!result) return { ...shell, state: 'attempted' };

  const stale = new Date(result.at).getTime() < mtimeMs;
  if ((result.status ?? 'attempted') !== 'attempted') return { ...shell, state: 'attempted', stale, ranAt: result.at };

  return {
    number: problem.number,
    state: result.failingVariants > 0 ? 'failing' : 'solved',
    stale,
    passed: result.passed,
    total: result.total,
    ranAt: result.at,
    history,
  };
}

async function statusFor(
  problem: Problem,
  results: ResultStore,
  histories: Record<string, ProblemHistory>,
): Promise<ProblemStatus> {
  const absolute = resolveProblemFile(problem.file);
  const [source, info] = await Promise.all([
    readFile(absolute, 'utf8').catch(() => null),
    stat(absolute).catch(() => null),
  ]);

  return deriveStatus({
    problem,
    source,
    mtimeMs: info?.mtimeMs ?? 0,
    result: results[problem.number],
    history: histories[problem.number] ?? EMPTY_HISTORY,
  });
}

export async function getStatuses(): Promise<ProblemStatus[]> {
  const [problems, results, histories] = await Promise.all([getProblems(), readResults(), getHistories()]);
  return Promise.all(problems.map((problem) => statusFor(problem, results, histories)));
}

export async function getStatus(number: string): Promise<ProblemStatus> {
  const [problems, results, histories] = await Promise.all([getProblems(), readResults(), getHistories()]);
  const problem = problems.find((entry) => entry.number === number);
  if (!problem) throw new Error(`no problem numbered ${number}`);

  return statusFor(problem, results, histories);
}

/** Tick the generated category tables from the verdicts we actually hold. */
export async function syncReadmes(dirs?: string[]): Promise<void> {
  const [problems, results] = await Promise.all([getProblems(), readResults()]);
  const wanted = dirs ? new Set(dirs) : null;
  const byDir = new Map<string, Set<string>>();

  for (const problem of problems) {
    if (wanted && !wanted.has(problem.dir)) continue;

    const result = results[problem.number];
    const solved = Boolean(result) && (result.status ?? 'attempted') === 'attempted' && result.failingVariants === 0;
    const set = byDir.get(problem.dir) ?? new Set<string>();
    if (solved) set.add(problem.number);
    byDir.set(problem.dir, set);
  }

  await Promise.all([...byDir].map(([dir, solved]) => syncCategoryReadme(dir, solved)));
}

const VIDEO_LINE = /Video:\s+(https:\/\/\S+)/;
const LEETCODE_LINE = /LeetCode:\s+(https:\/\/\S+)/;

/**
 * A practice copy is the file's own doc block plus the generated stub — never the
 * saved solution. Keeping the header means promoting the copy back cannot lose it.
 */
async function seedScratch(file: string, saved: string | null): Promise<string> {
  const problem = await problemFor(file);
  const headerEnd = saved?.indexOf('*/') ?? -1;
  const seed =
    headerEnd === -1
      ? `${[problem.imports, problem.stub].filter(Boolean).join('\n\n')}\n`
      : `${saved?.slice(0, headerEnd + 2)}\n${problem.stub}\n`;

  const absolute = resolveProblemFile(file, 'scratch');

  await mkdir(path.join(SCRATCH_ROOT, 'shared'), { recursive: true });
  await writeFile(path.join(SCRATCH_ROOT, 'shared', 'types.ts'), SHARED_REEXPORT);
  await writeFile(path.join(SCRATCH_ROOT, 'package.json'), SCRATCH_PACKAGE);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, seed, 'utf8');

  return seed;
}

/**
 * Throw away the practice copy and lay the stub down again. A review has to
 * start from a blank page: reading your own solution feels like remembering and
 * is not, so there has to be no solution to read.
 */
export async function resetScratch(file: string): Promise<string> {
  const saved = await readFile(resolveProblemFile(file), 'utf8').catch(() => null);
  return seedScratch(file, saved);
}

export async function readProblemSource(file: string, mode: SourceMode = 'file'): Promise<ProblemSource> {
  const saved = await readFile(resolveProblemFile(file), 'utf8').catch(() => null);
  const links = {
    leetcode: saved?.match(LEETCODE_LINE)?.[1] ?? null,
    video: saved?.match(VIDEO_LINE)?.[1] ?? null,
  };

  if (mode === 'file') {
    if (saved === null) throw new Error(`cannot read ${file}`);
    return { file, mode, source: saved, ...links };
  }

  const scratch = await readFile(resolveProblemFile(file, 'scratch'), 'utf8').catch(() => null);
  return { file, mode, source: scratch ?? (await seedScratch(file, saved)), ...links };
}

export async function writeProblemSource(file: string, source: string, mode: SourceMode = 'file'): Promise<void> {
  if (source.trim() === '') throw new Error('refusing to save an empty file');
  if (Buffer.byteLength(source) > MAX_SOURCE_BYTES) throw new Error('refusing to save a file this large');

  const absolute = resolveProblemFile(file, mode);
  if (mode === 'scratch') await mkdir(path.dirname(absolute), { recursive: true });

  await writeFile(absolute, source, 'utf8');
}

/** Copy a finished practice attempt over the real solution file. */
export async function promoteScratch(file: string): Promise<void> {
  const source = await readFile(resolveProblemFile(file, 'scratch'), 'utf8').catch(() => null);
  if (source === null) throw new Error('there is no practice copy to promote');

  await writeProblemSource(file, source);
}

/** Trace one case of one variant. The run path is untouched; this is a sibling. */
export async function traceProblem(
  number: string,
  variant: string,
  caseIndex: number,
  mode: SourceMode = 'file',
  input: unknown[] | null = null,
): Promise<TraceResult> {
  const problems = await getProblems();
  const problem = problems.find((entry) => entry.number === number);
  if (!problem) throw new Error(`no problem numbered ${number}`);

  const args = [number, variant, String(caseIndex)];
  if (mode === 'scratch') args.push('--file', problemPath(problem.file, 'scratch'));
  if (input !== null) args.push('--args', JSON.stringify(input));

  return runBridge<TraceResult>({ script: 'trace.mjs', args, timeoutMs: 30000 });
}

/** Count the statements one variant runs as the input doubles. */
export async function countOperations(
  number: string,
  variant: string,
  mode: SourceMode = 'file',
): Promise<OperationProbe> {
  const problems = await getProblems();
  const problem = problems.find((entry) => entry.number === number);
  if (!problem) throw new Error(`no problem numbered ${number}`);

  const args = [number, variant];
  if (mode === 'scratch') args.push('--file', problemPath(problem.file, 'scratch'));

  return runBridge<OperationProbe>({ script: 'ops.mjs', args, timeoutMs: 90000 });
}

export async function runProblem(number: string, mode: SourceMode = 'file', bigO = false): Promise<RunReport> {
  const problems = await getProblems();
  const problem = problems.find((entry) => entry.number === number);
  if (!problem) throw new Error(`no problem numbered ${number}`);

  const args = [number, '--memory'];
  if (mode === 'scratch') args.push('--file', problemPath(problem.file, 'scratch'));
  if (bigO) args.push('--big-o');

  const report = await runBridge<RunReport>({ script: 'run.mjs', args, timeoutMs: bigO ? 180000 : 120000 });

  const totals = report.variants.reduce(
    (sum, variant) => ({
      passed: sum.passed + variant.passed,
      total: sum.total + variant.total,
      failingVariants: sum.failingVariants + (variant.passed < variant.total ? 1 : 0),
    }),
    { passed: 0, total: 0, failingVariants: 0 },
  );

  const ok = report.status === 'attempted' && report.variants.length > 0 && totals.failingVariants === 0;
  await recordRun({ number, kind: 'run', mode, status: report.status, passed: totals.passed, total: totals.total, ok });

  if (mode === 'scratch') return report;

  const store = await readResults();
  store[number] = { ...totals, status: report.status, at: new Date().toISOString() };
  await writeResults(store);
  await syncReadmes([problem.dir]);

  if (ok) {
    const source = await readFile(resolveProblemFile(problem.file), 'utf8').catch(() => null);
    if (source !== null) await snapshotSolution(number, source);
  }

  return report;
}

/** Run a list of problems in one process and fold the verdicts into the cache. */
async function runMany(numbers: string[]): Promise<void> {
  if (numbers.length === 0) return;

  const results = await runBridge<SyncResult[]>({
    script: 'run-all.mjs',
    args: numbers,
    timeoutMs: 300000,
  });

  const store = await readResults();
  const at = new Date().toISOString();

  for (const result of results) {
    store[result.number] = {
      status: result.status,
      passed: result.passed,
      total: result.total,
      failingVariants: result.failingVariants,
      at,
    };

    await recordRun({
      number: result.number,
      kind: 'sync',
      mode: 'file',
      status: result.status,
      passed: result.passed,
      total: result.total,
      ok: result.status === 'attempted' && result.failingVariants === 0,
    });
  }

  await writeResults(store);
  await syncReadmes();
}

/** A status is only true once the code has been run, so run everything unverified. */
export async function syncStatuses(): Promise<ProblemStatus[]> {
  const statuses = await getStatuses();
  const pending = statuses.filter((status) => status.state !== 'not-started' && (status.ranAt === null || status.stale));

  await runMany(pending.map((status) => status.number));
  return pending.length === 0 ? statuses : getStatuses();
}

/** Run the started problems out of a set, whatever their current verdict. */
async function runStarted(wanted: string[]): Promise<ProblemStatus[]> {
  const statuses = await getStatuses();
  const started = new Set(
    statuses.filter((status) => status.state !== 'not-started').map((status) => status.number),
  );

  await runMany(wanted.filter((number) => started.has(number)));
  return getStatuses();
}

export async function runCategory(dir: string): Promise<ProblemStatus[]> {
  const problems = (await getProblems()).filter((problem) => problem.dir === dir);
  if (problems.length === 0) throw new Error(`no category named ${dir}`);

  return runStarted(problems.map((problem) => problem.number));
}

/** Everything on one board - the rail's list, not the whole workspace. */
export async function runBoard(numbers: string[]): Promise<ProblemStatus[]> {
  return runStarted(numbers);
}
