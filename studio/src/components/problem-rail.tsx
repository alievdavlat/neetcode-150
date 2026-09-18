'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Play, RotateCcw, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusDot } from './status-dot';
import { DIFFICULTIES, DIFFICULTY_META, STATES, STATE_META, tagsOf, UNKNOWN_STATUS } from '@/lib/meta';
import type { Collection, Difficulty, Problem, ProblemState, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProblemRailProps {
  problems: Problem[];
  statuses: Record<string, ProblemStatus>;
  collections: Collection[];
  collectionId: string;
  activeNumber: string;
  runningCategory: string | null;
  onSelect: (number: string) => void;
  onRunCategory: (dir: string) => void;
  onCollectionChange: (id: string) => void;
}

interface Group {
  dir: string;
  category: string;
  items: Problem[];
}

export function ProblemRail({
  problems,
  statuses,
  collections,
  collectionId,
  activeNumber,
  runningCategory,
  onSelect,
  onRunCategory,
  onCollectionChange,
}: ProblemRailProps) {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [state, setState] = useState<ProblemState | null>(null);
  const [dueOnly, setDueOnly] = useState(false);
  const [tag, setTag] = useState<string | null>(null);

  const filtering = Boolean(query || difficulty || state || dueOnly || tag);

  const clearFilters = () => {
    setQuery('');
    setDifficulty(null);
    setState(null);
    setDueOnly(false);
    setTag(null);
  };

  const statusOf = (problem: Problem) => statuses[problem.number] ?? UNKNOWN_STATUS;
  const needle = query.trim().toLowerCase();

  const counts = new Map<string, number>();
  for (const problem of problems) {
    for (const entry of tagsOf(problem)) counts.set(entry, (counts.get(entry) ?? 0) + 1);
  }
  const tags = [...counts].sort((left, right) => right[1] - left[1]);

  const matches = (problem: Problem) => {
    if (tag && !tagsOf(problem).includes(tag)) return false;
    if (difficulty && problem.difficulty !== difficulty) return false;
    if (state && statusOf(problem).state !== state) return false;
    if (dueOnly && !statusOf(problem).history.due) return false;
    if (needle === '') return true;

    return `${problem.number} ${problem.title} ${problem.category} ${problem.pattern}`.toLowerCase().includes(needle);
  };

  const groups = problems.filter(matches).reduce<Group[]>((acc, problem) => {
    const last = acc.at(-1);
    if (last?.dir === problem.dir) last.items.push(problem);
    else acc.push({ dir: problem.dir, category: problem.category, items: [problem] });

    return acc;
  }, []);

  const renderChip = (label: string, selected: boolean, dot: string, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all',
        selected
          ? 'border-primary/40 bg-primary/10 text-foreground'
          : 'border-line text-muted-foreground hover:border-white/15 hover:text-foreground',
      )}
    >
      <span className={cn('size-1.5 rounded-full', dot)} />
      {label}
    </button>
  );

  const activeRow = useRef<HTMLButtonElement | null>(null);

  /**
   * Only the list scrolls. `scrollIntoView` walks every scrollable ancestor,
   * including ones with `overflow: hidden`, which slides the filters off screen
   * with no scrollbar to bring them back.
   */
  useEffect(() => {
    const row = activeRow.current;
    const viewport = row?.closest<HTMLElement>('[data-radix-scroll-area-viewport]');
    if (!row || !viewport) return;

    const seat = row.getBoundingClientRect();
    const frame = viewport.getBoundingClientRect();

    if (seat.top < frame.top) viewport.scrollTop -= frame.top - seat.top + 8;
    else if (seat.bottom > frame.bottom) viewport.scrollTop += seat.bottom - frame.bottom + 8;
  }, [activeNumber]);

  const renderRow = (problem: Problem) => {
    const status = statusOf(problem);
    const active = problem.number === activeNumber;

    return (
      <button
        key={problem.number}
        ref={active ? activeRow : undefined}
        type="button"
        onClick={() => onSelect(problem.number)}
        aria-current={active ? 'true' : undefined}
        className={cn(
          'relative flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left transition-colors',
          active ? 'text-foreground' : 'text-muted-foreground hover:bg-white/[0.03] hover:text-foreground',
        )}
      >
        {active && (
          <motion.span
            layoutId="rail-active"
            transition={{ type: 'spring', stiffness: 440, damping: 36 }}
            className="absolute inset-0 rounded-lg bg-primary/10 ring-1 ring-primary/30"
          />
        )}
        <StatusDot state={status.state} stale={status.stale} className="relative shrink-0" />
        <span className="relative font-mono text-[11px] tabular-nums opacity-50">{problem.number}</span>
        <span className="relative flex-1 truncate text-[13px]">{problem.title}</span>
        {status.history.due && (
          <RotateCcw className="relative size-3 shrink-0 text-medium" aria-label="due for review" />
        )}
        <span
          className={cn('relative size-1.5 shrink-0 rounded-full', DIFFICULTY_META[problem.difficulty].dot)}
          title={problem.difficulty}
        >
          <span className="sr-only">{problem.difficulty}</span>
        </span>
      </button>
    );
  };

  const renderGroup = (group: Group) => {
    const solved = group.items.filter((problem) => statusOf(problem).state === 'solved').length;
    const busy = runningCategory === group.dir;

    return (
      <section key={group.dir} className="mb-3">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-sidebar/85 px-3 py-2 backdrop-blur">
          <h2 className="truncate text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {group.category}
          </h2>
          <span className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted-foreground/70">
              {solved}/{group.items.length}
            </span>
            <button
              type="button"
              onClick={() => onRunCategory(group.dir)}
              disabled={runningCategory !== null}
              title={`Run every started problem in ${group.category}`}
              aria-label={`Run every started problem in ${group.category}`}
              className="rounded p-0.5 text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
            >
              {busy ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
            </button>
          </span>
        </header>
        <div className="space-y-px px-1.5">{group.items.map(renderRow)}</div>
      </section>
    );
  };

  return (
    <div className="flex h-full flex-col bg-sidebar/60">
      <div className="space-y-3 border-b border-line p-3">
        {collections.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {collections.map((entry) =>
              renderChip(
                `${entry.name} · ${entry.numbers.length}`,
                collectionId === entry.id,
                'bg-cool',
                () => onCollectionChange(entry.id),
              ),
            )}
          </div>
        )}

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search 150 problems"
            aria-label="Search problems"
            className="h-8 pl-8 text-[13px]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DIFFICULTIES.map((entry) =>
            renderChip(entry, difficulty === entry, DIFFICULTY_META[entry].dot, () =>
              setDifficulty(difficulty === entry ? null : entry),
            ),
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {STATES.map((entry) =>
            renderChip(STATE_META[entry].label, state === entry, STATE_META[entry].dot, () =>
              setState(state === entry ? null : entry),
            ),
          )}
          {renderChip('Due', dueOnly, 'bg-medium', () => setDueOnly(!dueOnly))}

          {filtering && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-fail/40 hover:text-fail"
            >
              <X className="size-3" />
              Clear
            </button>
          )}
        </div>

        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {tags.map(([entry, count]) => (
            <button
              key={entry}
              type="button"
              onClick={() => setTag(tag === entry ? null : entry)}
              aria-pressed={tag === entry}
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-[10px] whitespace-nowrap transition-colors',
                tag === entry
                  ? 'border-hot/40 bg-hot/10 text-hot'
                  : 'border-line text-muted-foreground hover:border-white/15 hover:text-foreground',
              )}
            >
              {entry} <span className="opacity-50">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="py-2">
          {groups.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">Nothing matches that filter.</p>
              {filtering && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-2 text-[11px] text-primary transition-colors hover:underline"
                >
                  Clear the filters
                </button>
              )}
            </div>
          ) : (
            groups.map(renderGroup)
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
