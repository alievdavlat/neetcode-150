import type { Difficulty, ProblemHistory, ProblemState, ProblemStatus } from './types';

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
  hintLevel: 0,
  due: false,
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
