import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Problem, ProblemSource, ProblemStatus, RunReport, RunStatus, SourceMode } from '@/lib/types';
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

let problemsPromise: Promise<Problem[]> | null = null;

export function getProblems(): Promise<Problem[]> {
  problemsPromise ??= runBridge<Problem[]>({ script: 'problems.mjs', timeoutMs: 30000 });
  return problemsPromise;
}

const numberOf = (file: string) => file.split('/')[1].slice(0, 3);

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

function deriveStatus(problem: Problem, source: string | null, mtimeMs: number, result?: StoredResult): ProblemStatus {
  const untouched = source === null || codeOnly(source) === codeOnly(`${problem.imports ?? ''}\n${problem.stub}`);
  const shell = { number: problem.number, stale: false, passed: null, total: null, ranAt: null };

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
  };
}

async function statusFor(problem: Problem, results: ResultStore): Promise<ProblemStatus> {
  const absolute = resolveProblemFile(problem.file);
  const [source, info] = await Promise.all([
    readFile(absolute, 'utf8').catch(() => null),
    stat(absolute).catch(() => null),
  ]);

  return deriveStatus(problem, source, info?.mtimeMs ?? 0, results[problem.number]);
}

export async function getStatuses(): Promise<ProblemStatus[]> {
  const [problems, results] = await Promise.all([getProblems(), readResults()]);
  return Promise.all(problems.map((problem) => statusFor(problem, results)));
}

export async function getStatus(number: string): Promise<ProblemStatus> {
  const [problems, results] = await Promise.all([getProblems(), readResults()]);
  const problem = problems.find((entry) => entry.number === number);
  if (!problem) throw new Error(`no problem numbered ${number}`);

  return statusFor(problem, results);
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

export async function runProblem(number: string, mode: SourceMode = 'file', bigO = false): Promise<RunReport> {
  const problems = await getProblems();
  const problem = problems.find((entry) => entry.number === number);
  if (!problem) throw new Error(`no problem numbered ${number}`);

  const args = [number];
  if (mode === 'scratch') args.push('--file', problemPath(problem.file, 'scratch'));
  if (bigO) args.push('--big-o');

  const report = await runBridge<RunReport>({ script: 'run.mjs', args, timeoutMs: bigO ? 180000 : 120000 });

  if (mode === 'scratch') return report;

  const totals = report.variants.reduce(
    (sum, variant) => ({
      passed: sum.passed + variant.passed,
      total: sum.total + variant.total,
      failingVariants: sum.failingVariants + (variant.passed < variant.total ? 1 : 0),
    }),
    { passed: 0, total: 0, failingVariants: 0 },
  );

  const store = await readResults();
  store[number] = { ...totals, status: report.status, at: new Date().toISOString() };
  await writeResults(store);

  return report;
}

/** A status is only true once the code has been run, so run everything unverified. */
export async function syncStatuses(): Promise<ProblemStatus[]> {
  const statuses = await getStatuses();
  const pending = statuses.filter((status) => status.state !== 'not-started' && (status.ranAt === null || status.stale));
  if (pending.length === 0) return statuses;

  const results = await runBridge<SyncResult[]>({
    script: 'run-all.mjs',
    args: pending.map((status) => status.number),
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
  }

  await writeResults(store);
  return getStatuses();
}
