'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Lock, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Brand } from './brand';
import { ALL_BOARD, DIFFICULTY_META } from '@/lib/meta';
import type { Problem, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StrictGateProps {
  problem: Problem;
  status: ProblemStatus;
  waiting: number;
}

/**
 * Strict mode closed. Nothing else in the workspace opens until this problem
 * passes again, and there is no "tomorrow" button: a deadline you can push is
 * not a deadline, and pushing it was quietly costing a lapse anyway. The way
 * out is to solve it, or to turn strict mode off in Settings - which stays
 * reachable, because a tool that can lock you out of itself with no exit is
 * broken rather than strict.
 */
export function StrictGate({ problem, status, waiting }: StrictGateProps) {
  const { t } = useTranslation();
  const late = -(status.history.dueInDays ?? 0);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-8 px-5 py-10">
      <Brand subtitle={t('studio.strict.mode')} />

      <section className="space-y-5 rounded-2xl border border-medium/30 bg-medium/[0.05] p-6">
        <header className="flex items-center gap-3">
          <Lock className="size-5 text-medium" />
          <h1 className="font-heading text-sm font-semibold tracking-[0.14em] text-medium uppercase">
            {t('studio.strict.waiting')}
          </h1>
        </header>

        <p className="text-sm leading-relaxed text-foreground/85">{t('studio.strict.blurb')}</p>

        <div className="rounded-xl border border-line bg-black/25 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">#{problem.number}</span>
            <span className={cn('rounded-full border px-2 py-0.5 text-[10px]', DIFFICULTY_META[problem.difficulty].chip)}>
              {t(DIFFICULTY_META[problem.difficulty].label)}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {late <= 0 ? t('studio.strict.dueNow') : t('studio.strict.late', { count: late })}
            </span>
          </div>
          <p className="mt-2 font-heading text-lg font-semibold">{problem.title}</p>
          <p className="text-xs text-muted-foreground">{problem.category}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href={`/c/${ALL_BOARD}?p=${problem.number}&review=1`}>{t('studio.strict.writeAgain')}</Link>
          </Button>

        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">{t('studio.strict.noDefer')}</p>

        {waiting > 1 && (
          <p className="text-xs text-muted-foreground">
            {t('studio.strict.moreAfter', { count: waiting - 1 })}
          </p>
        )}
      </section>

      <Link
        href="/settings"
        className="flex items-center justify-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <Settings2 className="size-3.5" />
        {t('studio.strict.turnOff')}
      </Link>
    </main>
  );
}
