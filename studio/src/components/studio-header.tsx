'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  RefreshCw,
  Settings2,
  SkipForward,
} from 'lucide-react';
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
  /** Where the open problem sits in this list, counted from one. */
  place: { index: number; total: number };
  onStep: (delta: number) => void;
  onNextUnsolved: () => void;
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
  place,
  onStep,
  onNextUnsolved,
  onCollectionChange,
  onFocusChange,
  onSync,
}: StudioHeaderProps) {
  const { t } = useTranslation();
  const percent = total === 0 ? 0 : Math.round((counts.solved / total) * 100);

  /** The three counts are one sentence, not three badges competing with the bar. */
  const summary = TRACKED.map((state) => `${counts[state]} ${t(STATE_META[state].label).toLowerCase()}`).join(' · ');

  /**
   * Moving through the list without the list. Folding the rail away should not
   * cost the one thing it was open for, and these are the same three moves the
   * Ctrl+arrow shortcuts make.
   */
  const renderWalk = () => (
    <div role="group" aria-label={t('studio.walk')} className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={t('studio.previousProblem')}
        title={`${t('studio.previousProblem')} (Ctrl+Up)`}
        disabled={place.index <= 1}
        onClick={() => onStep(-1)}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <span className="min-w-14 text-center font-mono text-[11px] text-muted-foreground tabular-nums">
        {place.index}/{place.total}
      </span>

      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={t('studio.nextProblem')}
        title={`${t('studio.nextProblem')} (Ctrl+Down)`}
        disabled={place.index >= place.total}
        onClick={() => onStep(1)}
      >
        <ChevronRight className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={t('studio.nextUnsolved')}
        title={`${t('studio.nextUnsolvedTitle')} (Ctrl+Right)`}
        onClick={onNextUnsolved}
      >
        <SkipForward className="size-3.5" />
      </Button>
    </div>
  );

  const renderBoards = () => (
    <Select value={boardId} onValueChange={onCollectionChange}>
      <SelectTrigger aria-label={t('studio.switchList')} className="h-8 w-44">
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
      aria-label={focus ? t('studio.showPanels') : t('studio.hidePanels')}
      title={`${focus ? t('studio.showPanels') : t('studio.focusMode')} (Ctrl+\)`}
      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      {focus ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
    </button>
  );

  const renderSettings = () => (
    <Link
      href="/settings"
      aria-label={t('nav.settings')}
      title={t('studio.settingsHint')}
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
      title={t('studio.runBoardHint')}
      aria-label={t('studio.runBoardHint')}
    >
      {runningBoard ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
      {runningBoard ? t('studio.running') : t('studio.runBoard')}
    </Button>
  );

  const renderSync = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onSync}
      disabled={syncing}
      title={t('studio.recheckHint')}
      aria-label={t('studio.recheckHint')}
    >
      {syncing ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
      {syncing ? t('studio.checking') : t('studio.recheck')}
      {!syncing && pending > 0 && (
        <span className="ml-1 rounded-full bg-medium/15 px-1.5 font-mono text-[10px] text-medium">{pending}</span>
      )}
    </Button>
  );

  return (
    <header className="surface flex items-center gap-4 border-b border-line px-5 py-3">
      <Link
        href="/"
        aria-label={t('studio.backToCollections')}
        title={t('studio.backToCollections')}
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
        <Brand subtitle={t('studio.problemCount', { count: total })} />
      </motion.div>

      {renderBoards()}

      {renderWalk()}

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
