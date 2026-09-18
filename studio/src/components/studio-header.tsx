'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Brand } from './brand';
import { STATE_META } from '@/lib/meta';
import type { ProblemState } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StudioHeaderProps {
  boardName: string;
  counts: Record<ProblemState, number>;
  total: number;
  pending: number;
  syncing: boolean;
  onSync: () => void;
}

const TRACKED: ProblemState[] = ['solved', 'failing', 'attempted'];

export function StudioHeader({ boardName, counts, total, pending, syncing, onSync }: StudioHeaderProps) {
  const percent = total === 0 ? 0 : Math.round((counts.solved / total) * 100);

  const renderCount = (state: ProblemState) => (
    <div key={state} className="flex items-center gap-1.5">
      <span className={cn('size-1.5 rounded-full', STATE_META[state].dot)} />
      <span className="font-mono text-xs tabular-nums">{counts[state]}</span>
      <span className="text-[11px] text-muted-foreground">{STATE_META[state].label.toLowerCase()}</span>
    </div>
  );

  const renderSync = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onSync}
      disabled={syncing}
      title="Run every started problem and refresh the statuses"
      aria-label="Refresh statuses by running every started problem"
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
      >
        <Brand subtitle={`${boardName} · ${total} problems`} />
      </motion.div>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden items-center gap-4 md:flex">{TRACKED.map(renderCount)}</div>

        {renderSync()}

        <div className="flex items-center gap-3">
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
