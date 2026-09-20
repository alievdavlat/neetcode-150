'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Trans, useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  ActivitySquare,
  ArrowUpToLine,
  FileCode2,
  GitCompareArrows,
  Loader2,
  MoreHorizontal,
  Play,
  RotateCcw,
  Save,
  WandSparkles,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import type { EditorActions } from './monaco-surface';
import type { SourceMode, TypeMarker } from '@/lib/types';
import { cn } from '@/lib/utils';

const MonacoSurface = dynamic(() => import('./monaco-surface').then((module) => module.MonacoSurface), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 p-6">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  ),
});

interface SolutionEditorProps {
  file: string;
  mode: SourceMode;
  reviewing: boolean;
  source: string | null;
  dirty: boolean;
  saving: boolean;
  running: boolean;
  promoting: boolean;
  bigO: boolean;
  markers: TypeMarker[];
  activeLine: number | null;
  onLineClick: (line: number) => void;
  checkingTypes: boolean;
  snapshots: number;
  onChange: (value: string) => void;
  onModeChange: (mode: SourceMode) => void;
  onCompare: () => void;
  onBigOChange: (bigO: boolean) => void;
  onSave: () => void;
  onRun: () => void;
  onPromote: () => void;
  onReset: () => void;
}

/** Dictionary keys, looked up where they are drawn. */
const MODES: { value: SourceMode; label: string; hint: string }[] = [
  { value: 'file', label: 'editor.modeFile', hint: 'editor.modeFileHint' },
  { value: 'scratch', label: 'editor.modeScratch', hint: 'editor.modeScratchHint' },
];

export function SolutionEditor({
  file,
  mode,
  reviewing,
  source,
  dirty,
  saving,
  running,
  promoting,
  bigO,
  markers,
  activeLine,
  onLineClick,
  checkingTypes,
  snapshots,
  onChange,
  onModeChange,
  onCompare,
  onBigOChange,
  onSave,
  onRun,
  onPromote,
  onReset,
}: SolutionEditorProps) {
  const { t } = useTranslation();
  const [modifier, setModifier] = useState('Ctrl');
  const actions = useRef<EditorActions | null>(null);

  useEffect(() => {
    if (navigator.userAgent.includes('Mac')) setModifier('⌘');
  }, []);

  const renderShortcut = (key: string) => (
    <kbd className="ml-1 rounded border border-white/15 bg-black/20 px-1 font-mono text-[10px] text-current opacity-70">
      {modifier} {key}
    </kbd>
  );

  const renderModeToggle = () => (
    <div role="group" aria-label={t('editor.sourceGroup')} className="flex items-center rounded-lg border border-line bg-black/20 p-0.5">
      {MODES.map((entry) => (
        <button
          key={entry.value}
          type="button"
          title={t(entry.hint)}
          aria-pressed={mode === entry.value}
          onClick={() => onModeChange(entry.value)}
          className={cn(
            'rounded-md px-2 py-1 text-[11px] transition-colors',
            mode === entry.value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t(entry.label)}
        </button>
      ))}
    </div>
  );

  const renderBigO = () => (
    <button
      type="button"
      onClick={() => onBigOChange(!bigO)}
      aria-pressed={bigO}
      title={t('editor.bigOHint')}
      className={cn(
        'flex w-full items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] transition-colors',
        bigO
          ? 'border-hot/40 bg-hot/10 text-hot'
          : 'border-line text-muted-foreground hover:border-white/15 hover:text-foreground',
      )}
    >
      <ActivitySquare className="size-3.5" />
      Big-O
    </button>
  );

  const renderCompare = () => (
    <button
      type="button"
      onClick={onCompare}
      title={t('editor.compareHint')}
      aria-label={t('editor.compareLabel')}
      className="flex w-full items-center gap-1.5 rounded-lg border border-line px-2 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-cool/40 hover:text-cool"
    >
      <GitCompareArrows className="size-3.5" />
      {t('editor.compare')}
    </button>
  );

  /** Save and Run are the work; everything else lives one click away. */
  const renderMore = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t('editor.more')} title={t('editor.more')}>
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 space-y-3">
        {!reviewing && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {t('editor.source')}
            </p>
            {renderModeToggle()}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t('editor.measure')}
          </p>
          {renderBigO()}
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t('editor.code')}
          </p>
          {renderFormat()}
          {renderReset()}
        </div>

        {snapshots > 0 && !reviewing && renderCompare()}
      </PopoverContent>
    </Popover>
  );

  const renderFormat = () => (
    <button
      type="button"
      onClick={() => actions.current?.format()}
      title={t('editor.formatHint')}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
    >
      <WandSparkles className="size-3" />
      {t('editor.format')}
    </button>
  );

  /**
   * Reset keeps the header and the signature and clears the body, which is the
   * only part worth writing twice. It is behind a confirmation because it
   * throws away work that is not in git.
   */
  const renderReset = () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          title={t('editor.resetHint')}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:bg-white/5 hover:text-fail"
        >
          <RotateCcw className="size-3" />
          {t('editor.reset')}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('editor.resetTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{t('editor.resetBody')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('editor.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onReset}>{t('editor.resetConfirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const renderPromote = () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={promoting} aria-label={t('editor.promoteLabel')}>
          {promoting ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowUpToLine className="size-3.5" />}
          {t('editor.promote')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('editor.overwriteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            <Trans
              i18nKey="editor.overwriteBody"
              values={{ file }}
              components={{ mono: <span className="font-mono" /> }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('editor.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onPromote}>{t('editor.overwriteConfirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="flex h-full flex-col bg-panel/70">
      <header className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
        <FileCode2 className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate font-mono text-[11px] text-muted-foreground">{file}</span>

        {mode === 'scratch' && (
          <span className="rounded-full border border-cool/30 bg-cool/10 px-2 py-0.5 text-[10px] text-cool">
            {t('editor.practiceCopy')}
          </span>
        )}

        {checkingTypes ? (
          <span className="flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[10px] text-muted-foreground">
            <Loader2 className="size-2.5 animate-spin" />
            {t('editor.types')}
          </span>
        ) : (
          markers.length > 0 && (
            <span
              title={markers
                .map((marker) => t('editor.typeErrorLine', { line: marker.line, message: marker.message }))
                .join('\n')}
              className="rounded-full border border-fail/30 bg-fail/10 px-2 py-0.5 text-[10px] text-fail"
            >
              {t('editor.typeErrors', { count: markers.length })}
            </span>
          )
        )}

        {dirty && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 rounded-full border border-medium/30 bg-medium/10 px-2 py-0.5 text-[10px] text-medium"
          >
            <span className="size-1.5 rounded-full bg-medium" />
            {t('editor.unsaved')}
          </motion.span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {mode === 'scratch' && !reviewing && renderPromote()}
          {renderMore()}

          <Button variant="ghost" size="sm" onClick={onSave} disabled={!dirty || saving} aria-label={t('editor.saveLabel')}>
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            {t('editor.save')}
            {renderShortcut('S')}
          </Button>

          <Button
            size="sm"
            onClick={onRun}
            disabled={running || source === null}
            aria-label={t('editor.runLabel')}
            className={cn('relative overflow-hidden', running && 'pointer-events-none')}
          >
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
            {running ? t('editor.running') : t('editor.run')}
            {!running && renderShortcut('Enter')}
            {running && <span className="sweep absolute inset-0" />}
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        {source === null ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <MonacoSurface
            path={mode === 'scratch' ? `scratch/${file}` : file}
            value={source}
            markers={markers}
            activeLine={activeLine}
            onLineClick={onLineClick}
            onChange={onChange}
            onSave={onSave}
            onRun={onRun}
            actions={actions}
          />
        )}
      </div>
    </div>
  );
}
