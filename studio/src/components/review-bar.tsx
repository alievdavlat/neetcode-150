'use client';

import { useEffect, useState } from 'react';
import { Eye, Flag, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ReviewSession {
  number: string;
  kind: 'solve';
  startedAt: number;
  runs: number;
  revealed: boolean;
  baseline: number | null;
}

interface ReviewBarProps {
  session: ReviewSession;
  title: string;
  onReveal: () => void;
  onGiveUp: () => void;
}

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/**
 * The header of a retrieval session. It shows only what was measured - time,
 * attempts, whether the answer was looked at - because those are what the grade
 * is made of.
 */
export function ReviewBar({ session, title, onReveal, onGiveUp }: ReviewBarProps) {
  const [confirming, setConfirming] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = Math.max(0, (now - session.startedAt) / 1000);
  const overBaseline = session.baseline !== null && seconds / 60 > session.baseline;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-primary/25 bg-primary/[0.05] px-5 py-2">
      <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary">
        REVIEW
      </span>

      <span className="text-[13px] font-medium">{title}</span>

      <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
        <Timer className="size-3.5" />
        <span className={cn('tabular-nums', overBaseline ? 'text-medium' : 'text-foreground/80')}>
          {clock(seconds)}
        </span>
        {session.baseline !== null && <span>of {session.baseline}m</span>}
      </span>

      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
        {session.runs} {session.runs === 1 ? 'run' : 'runs'}
      </span>

      {session.revealed && (
        <span className="rounded-full border border-fail/40 bg-fail/10 px-2 py-0.5 text-[10px] text-fail">
          answer revealed
        </span>
      )}

      <span className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="xs" onClick={onReveal} disabled={session.revealed} className="gap-1.5">
          <Eye />
          Reveal
        </Button>
        {confirming ? (
          <Button variant="destructive" size="xs" onClick={onGiveUp} className="gap-1.5">
            <Flag />
            Yes, take the lapse
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setConfirming(true)}
            className="gap-1.5 text-muted-foreground"
          >
            <Flag />
            Give up
          </Button>
        )}
      </span>
    </div>
  );
}
