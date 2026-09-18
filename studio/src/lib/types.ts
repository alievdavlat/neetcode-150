export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemKind = 'function' | 'class';

/** Which copy of a problem the editor and runner work on. */
export type SourceMode = 'file' | 'scratch';

export interface Problem {
  number: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  dir: string;
  file: string;
  pattern: string;
  complexity: string;
  statement: string;
  examples: string[];
  constraints: string[];
  followUp: string | null;
  leetcode: string;
  imports: string | null;
  stub: string;
  kind: ProblemKind;
  caseCount: number;
}

export type ProblemState = 'not-started' | 'attempted' | 'failing' | 'solved';

export interface Settings {
  /** Turn the whole review system off: no queue, no due badges, no strict gate. */
  reviewEnabled: boolean;
  /** While anything is due, nothing else in the app opens until it is re-solved. */
  strictMode: boolean;
  dailyCap: number;
}

/** 0 could not do it, 1 got there the hard way, 2 came back cleanly. */
export type ReviewGrade = 0 | 1 | 2;

/** A full re-solve, or the sixty-second question about which pattern it is. */
export type ReviewKind = 'solve' | 'drill';

export interface ProblemHistory {
  runs: number;
  runsToFirstPass: number | null;
  firstPassAt: string | null;
  lastPassAt: string | null;
  lastRunAt: string | null;
  solveMinutes: number | null;
  reviewDays: number | null;
  dueInDays: number | null;
  hintLevel: number;
  due: boolean;
  reviews: number;
  lapses: number;
  ease: number | null;
  lastReviewAt: string | null;
  leech: boolean;
  reviewMinutes: number[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  numbers: string[];
  /** The home page section this list belongs under. */
  group?: string;
}

/** How often a company asked each problem, as read from a published interview sheet. */
export interface Company {
  name: string;
  numbers: string[];
}

/** A collection with the numbers already counted, which is what the home page draws. */
export interface Board {
  id: string;
  name: string;
  description: string;
  group: string;
  numbers: string[];
  total: number;
  easy: number;
  medium: number;
  hard: number;
  solved: number;
}

export interface SolutionSnapshot {
  at: string;
  source: string;
}

export interface ProblemStatus {
  number: string;
  state: ProblemState;
  stale: boolean;
  passed: number | null;
  total: number | null;
  ranAt: string | null;
  history: ProblemHistory;
}

export interface RunCase {
  label: string;
  passed: boolean;
  trace: string[] | null;
  input: string | null;
  output: string | null;
}

export interface RunFailure {
  label: string;
  input: string;
  expected: string | null;
  got: string | null;
  thrown: string | null;
  detail: string | null;
}

export interface ComplexityPoint {
  n: number;
  ms: number;
}

export interface RunComplexity {
  verdict: string | null;
  members: string[];
  band: boolean;
  confident: boolean;
  deviation: number | null;
  runnerUp: { name: string; deviation: number } | null;
  reason: string | null;
  points: ComplexityPoint[];
  target: string | null;
  relation: 'match' | 'differs' | 'unknown';
}

export interface RunVariant {
  name: string;
  passed: number;
  total: number;
  ms: number | null;
  heap: number | null;
  target: string | null;
  complexity: RunComplexity | null;
  cases: RunCase[];
  failures: RunFailure[];
}

export type RunStatus =
  | 'attempted'
  | 'not-started'
  | 'no-cases'
  | 'stalled'
  | 'crashed'
  | 'missing'
  | 'load-error'
  | 'error';

export interface RunReport {
  number: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  dir: string;
  slug: string;
  status: RunStatus;
  variants: RunVariant[];
  timeoutMs?: number;
  message?: string | null;
  isFunctionProblem?: boolean;
  hasGenerator?: boolean;
  scratch?: string | null;
  unparsedExamples?: { index: number; reason: string }[];
}

export interface TypeMarker {
  line: number;
  column: number;
  code: string;
  message: string;
}

export interface ProblemSource {
  file: string;
  mode: SourceMode;
  source: string;
  leetcode: string | null;
  video: string | null;
}

export type TraceKind = 'call' | 'stmt' | 'loop-init' | 'loop-cond' | 'loop-update' | 'cond' | 'return';

export type TraceValue =
  | { t: 'scalar'; text: string }
  | { t: 'array'; items: string[]; truncated: boolean }
  | { t: 'map'; entries: [string, string][]; truncated: boolean }
  | { t: 'list'; items: string[]; truncated: boolean; cyclic: boolean }
  | { t: 'tree'; rows: (string | null)[][]; truncated: boolean };

/** One chapter of a course video, exactly as its own chapter list names it. */
export interface Lesson {
  title: string;
  /** Seconds into the video. Stable enough to key progress on. */
  at: number;
  seconds: number;
}

export interface Course {
  id: string;
  track: string;
  name: string;
  blurb: string;
  video: string;
  url: string;
  title: string;
  channel: string;
  seconds: number;
  lessons: Lesson[];
  /** Where the chapter list came from, so the page can say so. */
  from: string;
  fetchedAt: string;
}

export interface CourseProgress {
  watched: number[];
}

export interface TraceStep {
  line: number;
  /** Which function the step is in; a case may run more than one. */
  fn: string | null;
  /** How many calls deep, so recursion reads as a tree rather than a list. */
  depth: number;
  kind: TraceKind;
  chain: string[];
  vars: Record<string, TraceValue>;
  changed: string | null;
  touched: { name: string; key: string | number; write: boolean; from: string }[];
}

export type TraceStatus = 'ok' | 'unsupported' | 'uninstrumentable' | 'threw' | 'stalled' | 'crashed';

/** Statements counted at doubling sizes: exact where a clock is not. */
export interface OperationProbe {
  number: string;
  variant: string;
  status: TraceStatus;
  message: string | null;
  points: { n: number; ops: number }[];
  verdict: string | null;
  deviation: number | null;
  target: string | null;
  comparison: 'match' | 'differs' | 'unknown' | null;
}

export interface TraceResult {
  number: string;
  variant: string;
  caseIndex: number;
  status: TraceStatus;
  message: string | null;
  args: string[];
  /** The arguments as JSON, which is what an input of your own is edited as. */
  input: string;
  custom: boolean;
  expect: string | null;
  result: string | null;
  /** This replay's own verdict, judged exactly as a run judges it. */
  passed: boolean | null;
  detail: string | null;
  steps: TraceStep[];
  truncated: boolean;
  source: string;
}
