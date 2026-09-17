'use client';

import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { relativeTime } from '@/lib/meta';
import type { SolutionSnapshot } from '@/lib/types';

const DiffEditor = dynamic(() => import('@monaco-editor/react').then((module) => module.DiffEditor), {
  ssr: false,
  loading: () => <p className="p-6 text-xs text-muted-foreground">loading diff…</p>,
});

interface SolutionDiffProps {
  open: boolean;
  title: string;
  current: string;
  snapshots: SolutionSnapshot[];
  onOpenChange: (open: boolean) => void;
}

const readableStamp = (stamp: string) => stamp.replace(/-(\d{2})-(\d{2})-(\d{3})Z$/, ':$1:$2Z').replace('T', ' ');

export function SolutionDiff({ open, title, current, snapshots, onOpenChange }: SolutionDiffProps) {
  const latest = snapshots[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title} — your last solve vs now</DialogTitle>
          <DialogDescription>
            {latest
              ? `Snapshot taken ${relativeTime(readableStamp(latest.at))}. Left is what passed then, right is the editor now.`
              : 'No passing solve has been recorded for this problem yet.'}
          </DialogDescription>
        </DialogHeader>

        {latest && (
          <div className="h-[60vh] overflow-hidden rounded-xl border border-line">
            <DiffEditor
              original={latest.source}
              modified={current}
              language="typescript"
              theme="neetcode-night"
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
