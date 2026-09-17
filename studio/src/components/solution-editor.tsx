'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { ActivitySquare, ArrowUpToLine, FileCode2, GitCompareArrows, Loader2, Play, Save } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
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
  source: string | null;
  dirty: boolean;
  saving: boolean;
  running: boolean;
  promoting: boolean;
  bigO: boolean;
  markers: TypeMarker[];
  activeLine: number | null;
  checkingTypes: boolean;
  snapshots: number;
  onChange: (value: string) => void;
  onModeChange: (mode: SourceMode) => void;
  onCompare: () => void;
  onBigOChange: (bigO: boolean) => void;
  onSave: () => void;
  onRun: () => void;
  onPromote: () => void;
}

const MODES: { value: SourceMode; label: string; hint: string }[] = [
  { value: 'file', label: 'My file', hint: 'Edit the solution saved in the workspace' },
  { value: 'scratch', label: 'Fresh', hint: 'Start from the stub in a practice copy; your solution is not read or written' },
];

export function SolutionEditor({
  file,
  mode,
  source,
  dirty,
  saving,
  running,
  promoting,
  bigO,
  markers,
  activeLine,
  checkingTypes,
  snapshots,
  onChange,
  onModeChange,
  onCompare,
  onBigOChange,
  onSave,
  onRun,
  onPromote,
}: SolutionEditorProps) {
  const [modifier, setModifier] = useState('Ctrl');

  useEffect(() => {
    if (navigator.userAgent.includes('Mac')) setModifier('⌘');
  }, []);

  const renderShortcut = (key: string) => (
    <kbd className="ml-1 rounded border border-white/15 bg-black/20 px-1 font-mono text-[10px] text-current opacity-70">
      {modifier} {key}
    </kbd>
  );

  const renderModeToggle = () => (
    <div role="group" aria-label="Editor source" className="flex items-center rounded-lg border border-line bg-black/20 p-0.5">
      {MODES.map((entry) => (
        <button
          key={entry.value}
          type="button"
          title={entry.hint}
          aria-pressed={mode === entry.value}
          onClick={() => onModeChange(entry.value)}
          className={cn(
            'rounded-md px-2 py-1 text-[11px] transition-colors',
            mode === entry.value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {entry.label}
        </button>
      ))}
    </div>
  );

  const renderBigO = () => (
    <button
      type="button"
      onClick={() => onBigOChange(!bigO)}
      aria-pressed={bigO}
      title="Measure the curve whenever every case passes. A failing solution is never timed, so this costs nothing while you are still debugging."
      className={cn(
        'flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] transition-colors',
        bigO
          ? 'border-hot/40 bg-hot/10 text-hot'
          : 'border-line text-muted-foreground hover:border-white/15 hover:text-foreground',
      )}
    >
      <ActivitySquare className="size-3.5" />
      Big-O
    </button>
  );

  const renderPromote = () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={promoting} aria-label="Copy the practice copy into your file">
          {promoting ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowUpToLine className="size-3.5" />}
          Copy to my file
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Replace your saved solution?</AlertDialogTitle>
          <AlertDialogDescription>
            The practice copy is written over <span className="font-mono">{file}</span>. Whatever is in that file now is
            gone unless it is already committed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onPromote}>Overwrite my file</AlertDialogAction>
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
            practice copy
          </span>
        )}

        {checkingTypes ? (
          <span className="flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[10px] text-muted-foreground">
            <Loader2 className="size-2.5 animate-spin" />
            types
          </span>
        ) : (
          markers.length > 0 && (
            <span
              title={markers.map((marker) => `line ${marker.line}: ${marker.message}`).join('\n')}
              className="rounded-full border border-fail/30 bg-fail/10 px-2 py-0.5 text-[10px] text-fail"
            >
              {markers.length} type {markers.length === 1 ? 'error' : 'errors'}
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
            unsaved
          </motion.span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {renderModeToggle()}
          {renderBigO()}

          {snapshots > 0 && (
            <button
              type="button"
              onClick={onCompare}
              title="Compare what is in the editor with your last passing solve"
              aria-label="Compare with your last passing solve"
              className="flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-cool/40 hover:text-cool"
            >
              <GitCompareArrows className="size-3.5" />
              Compare
            </button>
          )}
          {mode === 'scratch' && renderPromote()}

          <Button variant="ghost" size="sm" onClick={onSave} disabled={!dirty || saving} aria-label="Save file">
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Save
            {renderShortcut('S')}
          </Button>

          <Button
            size="sm"
            onClick={onRun}
            disabled={running || source === null}
            aria-label="Run tests for this problem"
            className={cn('relative overflow-hidden', running && 'pointer-events-none')}
          >
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
            {running ? 'Running' : 'Run'}
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
            onChange={onChange}
            onSave={onSave}
            onRun={onRun}
          />
        )}
      </div>
    </div>
  );
}
