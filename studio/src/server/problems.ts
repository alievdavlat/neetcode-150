import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Problem, ProblemSource, ProblemStatus, RunReport } from '@/lib/types';
import { resolveProblemFile, runBridge, STUDIO_ROOT } from './workspace';

const RESULTS_FILE = path.join(STUDIO_ROOT, '.studio', 'results.json');
const MAX_SOURCE_BYTES = 256 * 1024;

interface StoredResult {
  passed: number;
  total: number;
  failingVariants: number;
  at: string;
}

type ResultStore = Record<string, StoredResult>;

let problemsPromise: Promise<Problem[]> | null = null;

export function getProblems(): Promise<Problem[]> {
  problemsPromise ??= runBridge<Problem[]>({ script: 'problems.mjs', timeoutMs: 30000 });
  return problemsPromise;
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

async function writeResults(store: ResultStore): Promise<void> {
  await mkdir(path.dirname(RESULTS_FILE), { recursive: true });
  await writeFile(RESULTS_FILE, JSON.stringify(store, null, 2));
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

  return {
    number: problem.number,
    state: result.failingVariants > 0 ? 'failing' : 'solved',
    stale: new Date(result.at).getTime() < mtimeMs,
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

export async function readProblemSource(file: string): Promise<ProblemSource> {
  const source = await readFile(resolveProblemFile(file), 'utf8');

  return {
    file,
    source,
    leetcode: source.match(LEETCODE_LINE)?.[1] ?? null,
    video: source.match(VIDEO_LINE)?.[1] ?? null,
  };
}

export async function writeProblemSource(file: string, source: string): Promise<void> {
  if (source.trim() === '') throw new Error('refusing to save an empty file');
  if (Buffer.byteLength(source) > MAX_SOURCE_BYTES) throw new Error('refusing to save a file this large');

  await writeFile(resolveProblemFile(file), source, 'utf8');
}

export async function runProblem(number: string): Promise<RunReport> {
  const report = await runBridge<RunReport>({ script: 'run.mjs', args: [number], timeoutMs: 120000 });
  if (report.status !== 'attempted') return report;

  const totals = report.variants.reduce(
    (sum, variant) => ({
      passed: sum.passed + variant.passed,
      total: sum.total + variant.total,
      failingVariants: sum.failingVariants + (variant.passed < variant.total ? 1 : 0),
    }),
    { passed: 0, total: 0, failingVariants: 0 },
  );

  const store = await readResults();
  store[number] = { ...totals, at: new Date().toISOString() };
  await writeResults(store);

  return report;
}
