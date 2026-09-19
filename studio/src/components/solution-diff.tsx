'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import type { DiffOnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { relativeTime } from '@/lib/meta';
import type { SolutionSnapshot } from '@/lib/types';

function DiffLoading() {
  const { t } = useTranslation();

  return <p className="p-6 text-xs text-muted-foreground">{t('editor.loadingDiff')}</p>;
}

const DiffEditor = dynamic(() => import('@monaco-editor/react').then((module) => module.DiffEditor), {
  ssr: false,
  loading: () => <DiffLoading />,
});

interface SolutionDiffProps {
  open: boolean;
  title: string;
  current: string;
  snapshots: SolutionSnapshot[];
  onOpenChange: (open: boolean) => void;
}

interface DiffSurfaceProps {
  original: string;
  modified: string;
}

const readableStamp = (stamp: string) => stamp.replace(/-(\d{2})-(\d{2})-(\d{3})Z$/, ':$1:$2Z').replace('T', ' ');

/**
 * Closing the dialog unmounts the diff editor, and @monaco-editor/react disposes
 * both text models before the widget that still holds them — which throws
 * "TextModel got disposed before DiffEditorWidget model got reset". The models
 * are kept here instead and dropped in a microtask, once the widget is gone.
 */
function DiffSurface({ original, modified }: DiffSurfaceProps) {
  const models = useRef<editor.IDiffEditorModel | null>(null);

  const handleMount: DiffOnMount = (instance) => {
    models.current = instance.getModel();
  };

  useEffect(
    () => () => {
      const held = models.current;
      models.current = null;
      if (!held) return;

      queueMicrotask(() => {
        held.original.dispose();
        held.modified.dispose();
      });
    },
    [],
  );

  return (
    <DiffEditor
      original={original}
      modified={modified}
      language="typescript"
      theme="neetcode-night"
      keepCurrentOriginalModel
      keepCurrentModifiedModel
      onMount={handleMount}
      options={{
        readOnly: true,
        renderSideBySide: true,
        fontFamily: 'var(--font-code), ui-monospace, monospace',
        fontSize: 12.5,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}

export function SolutionDiff({ open, title, current, snapshots, onOpenChange }: SolutionDiffProps) {
  const { t } = useTranslation();
  const [pick, setPick] = useState(0);

  /** Reopening for another problem must not keep the last one's chosen snapshot. */
  useEffect(() => {
    if (open) setPick(0);
  }, [open]);

  const chosen = snapshots[Math.min(pick, snapshots.length - 1)];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>{t('editor.diffTitle', { title })}</DialogTitle>
          <DialogDescription>
            {chosen
              ? t('editor.diffTaken', { when: relativeTime(t, readableStamp(chosen.at)) })
              : t('editor.diffNone')}
          </DialogDescription>
        </DialogHeader>

        {snapshots.length > 1 && (
          <Select value={String(pick)} onValueChange={(next) => setPick(Number(next))}>
            <SelectTrigger aria-label={t('editor.diffPick')} className="h-8 w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {snapshots.map((entry, index) => (
                <SelectItem key={entry.at} value={String(index)}>
                  {index === 0 ? t('editor.diffLatest') : t('editor.diffAgo', { count: index + 1 })} ·{' '}
                  {relativeTime(t, readableStamp(entry.at))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {chosen && (
          <div className="h-[60vh] overflow-hidden rounded-xl border border-line">
            <DiffSurface original={chosen.source} modified={current} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
