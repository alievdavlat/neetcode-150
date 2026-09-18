'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Brand } from './brand';
import { ALL_BOARD, DIFFICULTY_META } from '@/lib/meta';
import { request } from '@/lib/api';
import type { Problem, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StrictGateProps {
  problem: Problem;
  status: ProblemStatus;
  waiting: number;
}

/**
 * Strict mode closed. Nothing else in the workspace opens until this problem
 * passes again. Two ways past it, both deliberate: solve it, or defer it and
 * take the lapse. Settings stays reachable, because a tool that can lock you out
 * of itself with no exit is broken rather than strict.
 */
export function StrictGate({ problem, status, waiting }: StrictGateProps) {
  const [deferring, setDeferring] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const defer = async () => {
    setDeferring(true);
    try {
      await request('/api/review', {
        method: 'POST',
        body: JSON.stringify({
          number: problem.number,
          kind: 'solve',
          passed: false,
          revealed: false,
          runs: 0,
          hints: 0,
          minutes: null,
        }),
      });
      window.location.reload();
    } finally {
      setDeferring(false);
    }
  };

  const late = -(status.history.dueInDays ?? 0);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-8 px-5 py-10">
      <Brand subtitle="Strict mode" />

      <section className="space-y-5 rounded-2xl border border-medium/30 bg-medium/[0.05] p-6">
        <header className="flex items-center gap-3">
          <Lock className="size-5 text-medium" />
          <h1 className="font-heading text-sm font-semibold tracking-[0.14em] text-medium uppercase">
            One problem is waiting
          </h1>
        </header>

        <p className="text-sm leading-relaxed text-foreground/85">
          The rest of the workspace is closed until you write this one again. Not read it — write
          it, from the stub, until the tests pass.
        </p>

        <div className="rounded-xl border border-line bg-black/25 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">#{problem.number}</span>
            <span className={cn('rounded-full border px-2 py-0.5 text-[10px]', DIFFICULTY_META[problem.difficulty].chip)}>
              {problem.difficulty}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {late <= 0 ? 'due now' : `${late} days late`}
            </span>
          </div>
          <p className="mt-2 font-heading text-lg font-semibold">{problem.title}</p>
          <p className="text-xs text-muted-foreground">{problem.category}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href={`/c/${ALL_BOARD}?p=${problem.number}&review=1`}>Write it again</Link>
          </Button>

          {confirming ? (
            <Button variant="destructive" size="sm" onClick={defer} disabled={deferring}>
              {deferring ? 'Deferring…' : 'Yes, defer and take the lapse'}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
              Defer to tomorrow
            </Button>
          )}
        </div>

        {confirming && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Deferring counts as a failed review: the interval drops to a day and the ease goes
            down, so it comes back tomorrow and sooner after that.
          </p>
        )}

        {waiting > 1 && (
          <p className="text-xs text-muted-foreground">
            {waiting - 1} more after this one.
          </p>
        )}
      </section>

      <Link
        href="/settings"
        className="flex items-center justify-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <Settings2 className="size-3.5" />
        Strict mode is on — turn it off in settings
      </Link>
    </main>
  );
}
