import type { Difficulty, ProblemState, ProblemStatus } from './types';

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

export const UNKNOWN_STATUS: ProblemStatus = {
  number: '',
  state: 'not-started',
  stale: false,
  passed: null,
  total: null,
  ranAt: null,
};

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const STATES: ProblemState[] = ['solved', 'failing', 'attempted', 'not-started'];

export const formatMs = (ms: number | null) => {
  if (ms === null) return '—';
  if (ms < 0.001) return '< 0.001 ms';
  if (ms < 1) return `${ms.toFixed(3)} ms`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};
