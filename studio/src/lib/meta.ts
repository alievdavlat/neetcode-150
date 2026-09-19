import type { Difficulty, Problem, ProblemHistory, ProblemState, ProblemStatus } from './types';

interface Facet {
  /** A dictionary key, not prose: resolve it with `t()` where it is drawn. */
  label: string;
  dot: string;
  text: string;
  chip: string;
}

export const DIFFICULTY_META: Record<Difficulty, Facet> = {
  Easy: { label: 'meta.easy', dot: 'bg-easy', text: 'text-easy', chip: 'bg-easy/10 text-easy border-easy/25' },
  Medium: {
    label: 'meta.medium',
    dot: 'bg-medium',
    text: 'text-medium',
    chip: 'bg-medium/10 text-medium border-medium/25',
  },
  Hard: { label: 'meta.hard', dot: 'bg-hard', text: 'text-hard', chip: 'bg-hard/10 text-hard border-hard/25' },
};

export const STATE_META: Record<ProblemState, Facet> = {
  'not-started': {
    label: 'meta.notStarted',
    dot: 'bg-muted-foreground/35',
    text: 'text-muted-foreground',
    chip: 'bg-muted/40 text-muted-foreground border-line',
  },
  attempted: {
    label: 'meta.attempted',
    dot: 'bg-cool',
    text: 'text-cool',
    chip: 'bg-cool/10 text-cool border-cool/25',
  },
  failing: { label: 'meta.failing', dot: 'bg-fail', text: 'text-fail', chip: 'bg-fail/10 text-fail border-fail/25' },
  solved: { label: 'meta.solved', dot: 'bg-pass', text: 'text-pass', chip: 'bg-pass/10 text-pass border-pass/25' },
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

/**
 * Both the client hook and the server `translator()` satisfy this, so these
 * helpers read the same on either side of the boundary.
 */
export type Translate = (key: string, values?: Record<string, string | number>) => string;

export const relativeTime = (t: Translate, iso: string | null) => {
  if (!iso) return t('meta.never');

  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return t('meta.justNow');
  if (minutes < 60) return t('meta.minutesAgo', { count: minutes });
  if (minutes < 1440) return t('meta.hoursAgo', { count: Math.round(minutes / 60) });
  return t('meta.daysAgo', { count: Math.round(minutes / 1440) });
};

export const formatMs = (ms: number | null) => {
  if (ms === null) return '—';
  if (ms < 0.001) return '< 0.001 ms';
  if (ms < 1) return `${ms.toFixed(3)} ms`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};

/** A lesson is minutes, a course is hours: the same helper says both. */
export const duration = (t: Translate, seconds: number) => {
  const total = Math.round(seconds / 60);
  if (total < 60) return t('meta.minutesShort', { minutes: total });

  return t('meta.hoursShort', { hours: Math.floor(total / 60), minutes: String(total % 60).padStart(2, '0') });
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

export interface Shortcut {
  id: string;
  /** How it is written for a reader. */
  keys: string;
  /** The `event.key` it binds to, when the studio itself binds it. */
  key: string | null;
  what: string;
  /** Where it works: anywhere in the board, or only with the replay focused. */
  scope: 'board' | 'replay';
}

/**
 * Every shortcut, written once. The studio binds its handler from the `key`
 * fields here and the settings page prints the same rows, so the list a reader
 * sees cannot drift away from the list that actually fires.
 */
export const SHORTCUTS: Shortcut[] = [
  { id: 'palette', keys: 'Ctrl/Cmd + K', key: 'k', scope: 'board', what: 'Jump to any problem by number, title, category or pattern' },
  { id: 'save', keys: 'Ctrl/Cmd + S', key: 's', scope: 'board', what: 'Save the file' },
  { id: 'run', keys: 'Ctrl/Cmd + Enter', key: 'Enter', scope: 'board', what: 'Save if needed, then run the tests' },
  { id: 'next', keys: 'Ctrl/Cmd + ↓', key: 'ArrowDown', scope: 'board', what: 'Next problem in this list' },
  { id: 'previous', keys: 'Ctrl/Cmd + ↑', key: 'ArrowUp', scope: 'board', what: 'Previous problem in this list' },
  { id: 'unsolved', keys: 'Ctrl/Cmd + →', key: 'ArrowRight', scope: 'board', what: 'Next problem that is not solved yet' },
  { id: 'focus', keys: 'Ctrl/Cmd + ' + String.fromCharCode(92), key: String.fromCharCode(92), scope: 'board', what: 'Focus mode: the editor alone, without the list and the brief' },
  { id: 'step', keys: '← / →', key: null, scope: 'replay', what: 'One step back or forward through the replay' },
  { id: 'play', keys: 'Space', key: null, scope: 'replay', what: 'Play or pause the replay' },
];

/** The `event.key` each shortcut binds to, for the handler that fires them. */
export const SHORTCUT_KEY = Object.fromEntries(
  SHORTCUTS.map((shortcut) => [shortcut.id, shortcut.key]),
) as Record<string, string | null>;
