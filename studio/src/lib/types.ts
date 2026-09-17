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

export interface ProblemHistory {
  runs: number;
  runsToFirstPass: number | null;
  firstPassAt: string | null;
  lastPassAt: string | null;
  lastRunAt: string | null;
  hintLevel: number;
  due: boolean;
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

export type RunStatus = 'attempted' | 'not-started' | 'no-cases' | 'stalled' | 'crashed' | 'missing' | 'error';

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
