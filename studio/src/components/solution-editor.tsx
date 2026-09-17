'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { FileCode2, Loader2, Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
  source: string | null;
  dirty: boolean;
  saving: boolean;
  running: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onRun: () => void;
}

export function SolutionEditor({
  file,
  source,
  dirty,
  saving,
  running,
  onChange,
  onSave,
  onRun,
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

  return (
    <div className="flex h-full flex-col bg-panel/70">
      <header className="flex items-center gap-3 border-b border-line px-4 py-2">
        <FileCode2 className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate font-mono text-[11px] text-muted-foreground">{file}</span>

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
          <MonacoSurface path={file} value={source} onChange={onChange} onSave={onSave} onRun={onRun} />
        )}
      </div>
    </div>
  );
}
