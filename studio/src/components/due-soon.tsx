'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { CalendarClock, Repeat2 } from 'lucide-react';

import { ALL_BOARD, DIFFICULTY_META, untilTime } from '@/lib/meta';
import type { Problem, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DueSoonProps {
  problems: Problem[];
  statuses: ProblemStatus[];
  /** How many rows to draw. Beyond this it reads as a backlog, not a plan. */
  limit?: number;
}

/**
 * A clock that only ticks as often as the coarsest thing on screen changes.
 * Countdowns here are rounded to the minute, so a minute is enough.
 */
function useMinute() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

/**
 * What is coming back, and when. The review queue answers "what can I do right
 * now"; this answers "what is on its way", which is the part that was invisible
 * while every interval was still counting down.
 */
export function DueSoon({ problems, statuses, limit = 6 }: DueSoonProps) {
  const { t } = useTranslation();
  const now = useMinute();

  const byNumber = useMemo(
    () => new Map(problems.map((problem) => [problem.number, problem])),
    [problems],
  );

  const rows = useMemo(
    () =>
      statuses
        .flatMap((status) => {
          const { dueAt, leech } = status.history;
          const problem = byNumber.get(status.number);
          if (dueAt === null || leech || !problem) return [];

          return [{ status, problem, at: Date.parse(dueAt) }];
        })
        .sort((left, right) => left.at - right.at)
        .slice(0, limit),
    [statuses, byNumber, limit],
  );

  if (rows.length === 0) return null;

  const ready = rows.filter((row) => row.at <= now).length;

  return (
    <section className="space-y-3 rounded-2xl border border-line bg-panel/60 p-4">
      <header className="flex items-center gap-2">
        <CalendarClock className="size-3.5 text-primary" />
        <h2 className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {t('home.comingUp')}
        </h2>
        {ready > 0 && (
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
            {t('home.readyNow', { count: ready })}
          </span>
        )}
      </header>

      <ul className="space-y-1">
        {rows.map(({ status, problem, at }) => {
          const due = at <= now;
          const plan = status.history.plan;

          return (
            <li key={status.number}>
              <Link
                href={`/c/${ALL_BOARD}?p=${status.number}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
              >
                <span className="w-8 shrink-0 font-mono text-[10px] text-muted-foreground/70">
                  {status.number}
                </span>

                <span className="min-w-0 flex-1 truncate text-[12px]">{problem?.title}</span>

                {plan && (
                  <span
                    title={plan.note ?? undefined}
                    className="flex shrink-0 items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary"
                  >
                    <Repeat2 className="size-2.5" />
                    {plan.done}/{plan.target}
                  </span>
                )}

                <span
                  className={cn(
                    'w-28 shrink-0 text-right font-mono text-[10px]',
                    due ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {untilTime(t, status.history.dueAt)}
                </span>

                <span
                  className={cn(
                    'hidden w-12 shrink-0 text-right text-[10px] sm:inline',
                    problem ? DIFFICULTY_META[problem.difficulty].text : '',
                  )}
                >
                  {problem ? t(DIFFICULTY_META[problem.difficulty].label) : ''}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
