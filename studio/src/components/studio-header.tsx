'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Maximize2, Minimize2, Play, RefreshCw, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brand } from './brand';
import { STATE_META } from '@/lib/meta';
import type { Collection, ProblemState } from '@/lib/types';

interface StudioHeaderProps {
  collections: Collection[];
  boardId: string;
  counts: Record<ProblemState, number>;
  total: number;
  pending: number;
  syncing: boolean;
  focus: boolean;
  runningBoard: boolean;
  onRunBoard: () => void;
  onCollectionChange: (id: string) => void;
  onFocusChange: (focus: boolean) => void;
  onSync: () => void;
}

const TRACKED: ProblemState[] = ['solved', 'failing', 'attempted'];

export function StudioHeader({
  collections,
  boardId,
  counts,
  total,
  pending,
  syncing,
  focus,
  runningBoard,
  onRunBoard,
  onCollectionChange,
  onFocusChange,
  onSync,
}: StudioHeaderProps) {
  const percent = total === 0 ? 0 : Math.round((counts.solved / total) * 100);

  /** The three counts are one sentence, not three badges competing with the bar. */
  const summary = TRACKED.map((state) => `${counts[state]} ${STATE_META[state].label.toLowerCase()}`).join(' · ');

  const renderBoards = () => (
    <Select value={boardId} onValueChange={onCollectionChange}>
      <SelectTrigger aria-label="Switch list" className="h-8 w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {collections.map((entry) => (
          <SelectItem key={entry.id} value={entry.id}>
            {entry.name} · {entry.numbers.length}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderFocus = () => (
    <button
      type="button"
      onClick={() => onFocusChange(!focus)}
      aria-pressed={focus}
      aria-label={focus ? 'Show the list and the brief' : 'Hide the list and the brief'}
      title={`${focus ? 'Show the list and the brief' : 'Focus mode: editor only'} (Ctrl+\)`}
      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      {focus ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
    </button>
  );

  const renderSettings = () => (
    <Link
      href="/settings"
      aria-label="Settings"
      title="Review, strict mode and how many problems a day"
      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      <Settings2 className="size-4" />
    </Link>
  );

  const renderRunBoard = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onRunBoard}
      disabled={runningBoard}
      title="Run every started problem on this board, including the ones already passing"
      aria-label="Run every started problem on this board, including the ones already passing"
    >
      {runningBoard ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
      {runningBoard ? 'Running' : 'Run board'}
    </Button>
  );

  const renderSync = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onSync}
      disabled={syncing}
      title="Run only the problems whose verdict is missing or out of date"
      aria-label="Run only the problems whose verdict is missing or out of date"
    >
      {syncing ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
      {syncing ? 'Checking' : 'Recheck'}
      {!syncing && pending > 0 && (
        <span className="ml-1 rounded-full bg-medium/15 px-1.5 font-mono text-[10px] text-medium">{pending}</span>
      )}
    </Button>
  );

  return (
    <header className="surface flex items-center gap-4 border-b border-line px-5 py-3">
      <Link
        href="/"
        aria-label="Back to all collections"
        title="Back to all collections"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
      </Link>

      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden sm:block"
      >
        <Brand subtitle={`${total} problems`} />
      </motion.div>

      {renderBoards()}

      <div className="ml-auto flex items-center gap-2">
        {renderRunBoard()}
        {renderSync()}
        {renderFocus()}
        {renderSettings()}

        <div className="ml-2 flex items-center gap-3" title={summary}>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-cool"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            />
          </div>
          <span className="font-mono text-xs tabular-nums">
            <span className="text-primary">{counts.solved}</span>
            <span className="text-muted-foreground">/{total}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
