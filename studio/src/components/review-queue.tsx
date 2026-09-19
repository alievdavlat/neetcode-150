'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlarmClock, Check, Flame, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RecallDrill } from './recall-drill';
import { ALL_BOARD, DIFFICULTY_META } from '@/lib/meta';
import type { Problem, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ReviewQueueProps {
  problems: Problem[];
  statuses: ProblemStatus[];
  tags: string[];
  /** One sitting. More than this on screen reads as a debt rather than a plan. */
  dailyCap: number;
}

/**
 * Consecutive problems from the same category feel easier and teach less, so the
 * queue alternates between them while keeping the most overdue near the front.
 */
function interleave(entries: { problem: Problem; overdue: number }[]) {
  const byCategory = new Map<string, typeof entries>();
  for (const entry of entries) {
    const bucket = byCategory.get(entry.problem.category) ?? [];
    bucket.push(entry);
    byCategory.set(entry.problem.category, bucket);
  }

  const buckets = [...byCategory.values()].sort((a, b) => b[0].overdue - a[0].overdue);
  const out: typeof entries = [];

  while (out.length < entries.length) {
    for (const bucket of buckets) {
      const next = bucket.shift();
      if (next) out.push(next);
    }
  }

  return out;
}

export function ReviewQueue({ problems, statuses, tags, dailyCap }: ReviewQueueProps) {
  const { t } = useTranslation();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [drilling, setDrilling] = useState<string | null>(null);

  const byNumber = useMemo(() => new Map(problems.map((problem) => [problem.number, problem])), [problems]);

  const queue = useMemo(() => {
    const due = statuses
      .filter((status) => status.history.due && !status.history.leech)
      .flatMap((status) => {
        const problem = byNumber.get(status.number);
        if (!problem) return [];
        return [{ problem, overdue: -(status.history.dueInDays ?? 0) }];
      })
      .sort((a, b) => b.overdue - a.overdue);

    return interleave(due).slice(0, dailyCap);
  }, [statuses, byNumber, dailyCap]);

  const stuck = useMemo(
    () =>
      statuses
        .filter((status) => status.history.leech)
        .flatMap((status) => {
          const problem = byNumber.get(status.number);
          return problem ? [{ problem, lapses: status.history.lapses }] : [];
        }),
    [statuses, byNumber],
  );

  const waiting = statuses.filter((status) => status.history.due && !status.history.leech).length;
  const left = queue.filter((entry) => !done[entry.problem.number]);

  if (waiting === 0 && stuck.length === 0) return null;

  const active = drilling ? byNumber.get(drilling) : null;

  const renderRow = ({ problem, overdue }: { problem: Problem; overdue: number }) => {
    const finished = done[problem.number] === true;

    return (
      <li
        key={problem.number}
        className={cn(
          'flex flex-wrap items-center gap-3 rounded-lg px-3 py-2 transition-colors',
          finished ? 'opacity-40' : 'hover:bg-white/[0.04]',
        )}
      >
        {finished ? (
          <Check className="size-3.5 shrink-0 text-pass" />
        ) : (
          <span className="size-1.5 shrink-0 rounded-full bg-medium" />
        )}

        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{problem.number}</span>
        <span className="min-w-0 flex-1 truncate text-[13px]">{problem.title}</span>

        <span className={cn('hidden w-12 text-right text-[11px] sm:inline', DIFFICULTY_META[problem.difficulty].text)}>
          {t(DIFFICULTY_META[problem.difficulty].label)}
        </span>
        <span className="w-20 text-right font-mono text-[10px] text-muted-foreground">
          {overdue <= 0 ? t('review.dueNow') : t('review.daysLate', { days: overdue })}
        </span>

        {!finished && (
          <span className="flex items-center gap-1.5">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setDrilling(problem.number)}
              title={t('review.drillHint')}
              className="gap-1"
            >
              <Zap />
              {t('review.drill')}
            </Button>
            <Button size="xs" variant="outline" asChild>
              <Link href={`/c/${ALL_BOARD}?p=${problem.number}&review=1`}>{t('review.resolve')}</Link>
            </Button>
          </span>
        )}
      </li>
    );
  };

  return (
    <section className="space-y-3 rounded-2xl border border-medium/25 bg-medium/[0.04] p-4">
      <header className="flex flex-wrap items-center gap-3">
        <AlarmClock className="size-4 text-medium" />
        <h2 className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">
          {t('review.dueToday')}
        </h2>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {t('review.progress', { left: left.length, total: waiting })}
        </span>
        {waiting > dailyCap && (
          <span className="text-[11px] text-muted-foreground">
            {t('review.moreWaiting', { more: waiting - dailyCap })}
          </span>
        )}
      </header>

      {active ? (
        <RecallDrill
          problem={active}
          tags={tags}
          onDone={() => {
            setDone((now) => ({ ...now, [active.number]: true }));
            setDrilling(null);
          }}
          onSkip={() => setDrilling(null)}
        />
      ) : (
        <ul className="space-y-px">{queue.map(renderRow)}</ul>
      )}

      {left.length === 0 && queue.length > 0 && (
        <p className="px-3 text-[11px] text-pass">{t('review.cleared')}</p>
      )}

      {stuck.length > 0 && (
        <div className="border-t border-line pt-3">
          <p className="mb-2 flex items-center gap-1.5 px-3 text-[10px] font-semibold tracking-[0.18em] text-fail uppercase">
            <Flame className="size-3" />
            {t('review.stuck')}
          </p>
          <ul className="space-y-px">
            {stuck.map(({ problem, lapses }) => (
              <li key={problem.number} className="flex items-center gap-3 rounded-lg px-3 py-1.5">
                <span className="font-mono text-[11px] text-muted-foreground">{problem.number}</span>
                <Link
                  href={`/c/${ALL_BOARD}?p=${problem.number}`}
                  className="min-w-0 flex-1 truncate text-[13px] hover:text-primary"
                >
                  {problem.title}
                </Link>
                <span className="text-[11px] text-fail">{t('review.lapses', { count: lapses })}</span>
              </li>
            ))}
          </ul>
          <p className="px-3 pt-2 text-[11px] text-muted-foreground">{t('review.stuckNote')}</p>
        </div>
      )}
    </section>
  );
}
