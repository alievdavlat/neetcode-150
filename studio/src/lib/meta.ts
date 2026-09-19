import type { Difficulty, Problem, ProblemHistory, ProblemState, ProblemStatus } from './types';

interface Facet {
  label: string;
  dot: string;
  text: string;
  chip: string;
}

export const DIFFICULTY_META: Record<Difficulty, Facet> = {
  Easy: { label: 'Easy', dot: 'bg-easy', text: 'text-easy', chip: 'bg-easy/10 text-easy border-easy/25' },
  Medium: {
    label: 'Medium',
    dot: 'bg-medium',
    text: 'text-medium',
    chip: 'bg-medium/10 text-medium border-medium/25',
  },
  Hard: { label: 'Hard', dot: 'bg-hard', text: 'text-hard', chip: 'bg-hard/10 text-hard border-hard/25' },
};

export const STATE_META: Record<ProblemState, Facet> = {
  'not-started': {
    label: 'Not started',
    dot: 'bg-muted-foreground/35',
    text: 'text-muted-foreground',
    chip: 'bg-muted/40 text-muted-foreground border-line',
  },
  attempted: {
    label: 'In progress',
    dot: 'bg-cool',
    text: 'text-cool',
    chip: 'bg-cool/10 text-cool border-cool/25',
  },
  failing: { label: 'Failing', dot: 'bg-fail', text: 'text-fail', chip: 'bg-fail/10 text-fail border-fail/25' },
  solved: { label: 'Solved', dot: 'bg-pass', text: 'text-pass', chip: 'bg-pass/10 text-pass border-pass/25' },
};

export const NO_HISTORY: ProblemHistory = {
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
  reviews: 0,
  lapses: 0,
  ease: null,
  lastReviewAt: null,
  leech: false,
  reviewMinutes: [],
};

export const UNKNOWN_STATUS: ProblemStatus = {
  number: '',
  state: 'not-started',
  stale: false,
  passed: null,
  total: null,
  ranAt: null,
  history: NO_HISTORY,
};

/**
 * Every problem carries its own one-line pattern, so grouping by that string gives
 * 150 groups of one. These rules fold those lines into the techniques behind them.
 */
const TAG_RULES: { tag: string; test: RegExp }[] = [
  { tag: 'hash map', test: /hash\s*(map|set|table)|frequency|counter|seen/i },
  { tag: 'two pointers', test: /two pointer|both ends|left and right/i },
  { tag: 'sliding window', test: /window/i },
  { tag: 'binary search', test: /binary search|halve/i },
  { tag: 'stack', test: /stack/i },
  { tag: 'heap', test: /heap|priority queue/i },
  { tag: 'linked list', test: /linked list|fast and slow|node pointer/i },
  { tag: 'tree', test: /tree|in-?order|pre-?order|post-?order|subtree/i },
  { tag: 'bfs', test: /bfs|breadth|level order|queue/i },
  { tag: 'dfs', test: /dfs|depth.first|flood fill|recurse/i },
  { tag: 'graph', test: /graph|union.find|topological|adjacen|island/i },
  { tag: 'backtracking', test: /backtrack/i },
  { tag: 'dynamic programming', test: /dp|dynamic programming|memo|bottom.up|top.down|tabulat/i },
  { tag: 'greedy', test: /greedy/i },
  { tag: 'intervals', test: /interval|overlap/i },
  { tag: 'trie', test: /trie|prefix tree/i },
  { tag: 'bit tricks', test: /bit|xor|mask|shift/i },
  { tag: 'prefix sums', test: /prefix|suffix/i },
  { tag: 'sorting', test: /sort/i },
  { tag: 'math', test: /math|modulo|digit|prime|geometry/i },
];

/** The techniques a piece of text is about — a problem, or a lesson title. */
export const tagsOfText = (text: string) =>
  TAG_RULES.filter((rule) => rule.test.test(text)).map((rule) => rule.tag);

export const tagsOf = (problem: Problem) =>
  tagsOfText(`${problem.title} ${problem.pattern} ${problem.category}`);

/** The board every problem in the workspace belongs to, with no file behind it. */
export const ALL_BOARD = 'all';

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const STATES: ProblemState[] = ['solved', 'failing', 'attempted', 'not-started'];

export const formatBytes = (bytes: number | null) => {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const relativeTime = (iso: string | null) => {
  if (!iso) return 'never';

  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
};

export const formatMs = (ms: number | null) => {
  if (ms === null) return '—';
  if (ms < 0.001) return '< 0.001 ms';
  if (ms < 1) return `${ms.toFixed(3)} ms`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};

/** A lesson is minutes, a course is hours: the same helper says both. */
export const duration = (seconds: number) => {
  const total = Math.round(seconds / 60);
  if (total < 60) return `${total}m`;

  return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, '0')}m`;
};

/** `1:04:22` next to the lesson, the way the video's own scrubber writes it. */
export const stamp = (seconds: number) => {
  const parts = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60];
  const [hours, ...rest] = parts;

  return (hours > 0 ? parts : rest).map((part, index) => (index === 0 ? part : String(part).padStart(2, '0'))).join(':');
};

const ACCENTS = [
  'from-violet-600 to-indigo-800',
  'from-rose-600 to-red-900',
  'from-sky-500 to-blue-800',
  'from-emerald-500 to-teal-800',
  'from-amber-500 to-orange-800',
  'from-fuchsia-600 to-purple-900',
];

/**
 * A card keeps its colour for as long as it keeps its id. Picking by position
 * meant one new course repainted every card after it, and a grid this size is
 * scanned by colour before it is read.
 */
export function accentFor(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) hash = (hash * 31 + id.charCodeAt(index)) | 0;

  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}
