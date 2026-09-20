'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Loader2, PanelLeftClose, PanelLeftOpen, Play, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusDot } from './status-dot';
import { DIFFICULTIES, DIFFICULTY_META, STATES, STATE_META, tagsOf, UNKNOWN_STATUS, untilTime } from '@/lib/meta';
import type { Difficulty, Problem, ProblemState, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProblemRailProps {
  problems: Problem[];
  statuses: Record<string, ProblemStatus>;
  activeNumber: string;
  /** Strict mode: the open problem is the only one that opens. */
  locked: boolean;
  /** A topic the board was opened on, so a pick made on the home page survives. */
  initialTag?: string | null;
  /** Folded away to a strip, so the editor can have the width. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  runningCategory: string | null;
  onSelect: (number: string) => void;
  onRunCategory: (dir: string) => void;
}

interface Group {
  dir: string;
  category: string;
  items: Problem[];
}

/**
 * How many rows are put on screen before the rest wait for a scroll. The whole
 * workspace is 1,104 problems; hydrating that many rows costs more than anyone
 * can read, and the ones past the fold are not being looked at yet.
 */
const PAGE = 300;

export function ProblemRail({
  problems,
  statuses,
  activeNumber,
  locked,
  initialTag = null,
  collapsed = false,
  onCollapsedChange,
  runningCategory,
  onSelect,
  onRunCategory,
}: ProblemRailProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [state, setState] = useState<ProblemState | null>(null);
  const [dueOnly, setDueOnly] = useState(false);
  const [tag, setTag] = useState<string | null>(initialTag);
  const [shown, setShown] = useState(PAGE);

  const filtering = Boolean(query || difficulty || state || dueOnly || tag);
  const picked = [difficulty, state, dueOnly || null, tag].filter(Boolean).length;

  /** A new filter is a new list, so the rows loaded for the old one are no longer owed. */
  const narrow = (change: () => void) => {
    change();
    setShown(PAGE);
  };

  const clearFilters = () =>
    narrow(() => {
      setQuery('');
      setDifficulty(null);
      setState(null);
      setDueOnly(false);
      setTag(null);
    });

  const statusOf = (problem: Problem) => statuses[problem.number] ?? UNKNOWN_STATUS;
  const needle = query.trim().toLowerCase();
  const solvedCount = problems.filter((problem) => statusOf(problem).state === 'solved').length;

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

  const matching = problems.filter(matches);

  /** The open problem is always rendered, wherever it sits, or the rail cannot scroll to it. */
  const reach = Math.max(shown, matching.findIndex((problem) => problem.number === activeNumber) + 40);
  const visible = matching.slice(0, reach);
  const waiting = matching.length - visible.length;

  const groups = visible.reduce<Group[]>((acc, problem) => {
    const last = acc.at(-1);
    if (last?.dir === problem.dir) last.items.push(problem);
    else acc.push({ dir: problem.dir, category: problem.category, items: [problem] });

    return acc;
  }, []);

  const more = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = more.current;
    if (!sentinel) return;

    const watcher = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setShown((count) => count + PAGE);
    });

    watcher.observe(sentinel);
    return () => watcher.disconnect();
  }, [waiting]);

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

  const renderLabel = (text: string) => (
    <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{text}</h2>
  );

  /** Four filter families behind one control: the list is what the rail is for. */
  const renderFilters = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 shrink-0 gap-1.5" aria-label={t('rail.filter')}>
          <SlidersHorizontal className="size-3.5" />
          {t('rail.filters')}
          {picked > 0 && (
            <span className="rounded-full bg-primary/15 px-1.5 font-mono text-[10px] text-primary">{picked}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {renderLabel(t('rail.difficulty'))}
          {filtering && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-fail"
            >
              <X className="size-3" />
              {t('rail.clearAll')}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DIFFICULTIES.map((entry) =>
            renderChip(entry, difficulty === entry, DIFFICULTY_META[entry].dot, () =>
              narrow(() => setDifficulty(difficulty === entry ? null : entry)),
            ),
          )}
        </div>

        {renderLabel(t('rail.status'))}
        <div className="flex flex-wrap gap-1.5">
          {STATES.map((entry) =>
            renderChip(t(STATE_META[entry].label), state === entry, STATE_META[entry].dot, () =>
              narrow(() => setState(state === entry ? null : entry)),
            ),
          )}
          {renderChip(t('rail.due'), dueOnly, 'bg-medium', () => narrow(() => setDueOnly(!dueOnly)))}
        </div>

        {tags.length > 0 && renderLabel(t('rail.topics'))}
        <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
          {tags.map(([entry, count]) => (
            <button
              key={entry}
              type="button"
              onClick={() => narrow(() => setTag(tag === entry ? null : entry))}
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
      </PopoverContent>
    </Popover>
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
        disabled={locked && !active}
        title={locked && !active ? t('rail.locked') : undefined}
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
        {status.history.plan && (
          <span
            title={t('rail.planProgress', { done: status.history.plan.done, total: status.history.plan.target })}
            className="relative shrink-0 rounded-full border border-primary/30 bg-primary/10 px-1 font-mono text-[9px] text-primary"
          >
            {status.history.plan.done}/{status.history.plan.target}
          </span>
        )}
        {status.history.due ? (
          <RotateCcw className="relative size-3 shrink-0 text-medium" aria-label={t('rail.dueForReview')} />
        ) : (
          status.history.dueAt !== null && (
            <span
              title={t('rail.comesBack')}
              className="relative shrink-0 font-mono text-[9px] text-muted-foreground/60 tabular-nums"
            >
              {untilTime(t, status.history.dueAt)}
            </span>
          )
        )}
        <span
          className={cn('relative size-1.5 shrink-0 rounded-full', DIFFICULTY_META[problem.difficulty].dot)}
          title={t(DIFFICULTY_META[problem.difficulty].label)}
        >
          <span className="sr-only">{t(DIFFICULTY_META[problem.difficulty].label)}</span>
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
              title={t('rail.runCategory', { category: group.category })}
              aria-label={t('rail.runCategory', { category: group.category })}
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

  /**
   * Folded, the list is a strip with the way back out and the score, because a
   * panel with no handle of its own is a panel you cannot reopen.
   */
  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center gap-3 border-r border-line bg-sidebar/60 py-3">
        <button
          type="button"
          onClick={() => onCollapsedChange?.(false)}
          aria-label={t('rail.expand')}
          title={t('rail.expand')}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
        >
          <PanelLeftOpen className="size-4" />
        </button>

        <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
          <span className="text-pass">{solvedCount}</span>
        </p>
        <p className="font-mono text-[10px] text-muted-foreground tabular-nums">{problems.length}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-sidebar/60">
      <div className="flex items-center gap-2 border-b border-line p-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => narrow(() => setQuery(event.target.value))}
            placeholder={t('rail.search', { count: problems.length })}
            aria-label={t('rail.searchLabel')}
            className="h-8 pl-8 text-[13px]"
          />
        </div>

        {renderFilters()}

        <button
          type="button"
          onClick={() => onCollapsedChange?.(true)}
          aria-label={t('rail.collapse')}
          title={t('rail.collapse')}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="py-2">
          {groups.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">{t('rail.empty')}</p>
              {filtering && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-2 text-[11px] text-primary transition-colors hover:underline"
                >
                  {t('rail.clearFilters')}
                </button>
              )}
            </div>
          ) : (
            <>
              {groups.map(renderGroup)}

              {waiting > 0 && (
                <div ref={more} className="px-4 py-3 text-center text-[11px] text-muted-foreground">
                  {t('rail.more', { count: waiting })}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
