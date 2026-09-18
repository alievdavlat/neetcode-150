'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PanelNoticeProps {
  icon: ReactNode;
  title: string;
  body: string;
  tone: string;
}

/** The one empty-state card both bottom panels use, so they never drift apart. */
export function PanelNotice({ icon, title, body, tone }: PanelNoticeProps) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className={cn('max-w-sm rounded-2xl border p-6 text-center', tone)}>
        <div className="mb-3 flex justify-center">{icon}</div>
        <p className="mb-1 font-heading text-sm font-semibold">{title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
