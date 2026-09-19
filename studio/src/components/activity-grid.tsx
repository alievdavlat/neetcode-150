'use client';

import { useTranslation } from 'react-i18next';
import type { ActivityDay } from '@/server/history';
import { cn } from '@/lib/utils';

interface ActivityGridProps {
  days: ActivityDay[];
  total: number;
  streak: number;
}

const WEEK = 7;

/** Four steps is enough to read a week at a glance; more is decoration. */
const toneOf = (count: number) => {
  if (count === 0) return 'bg-white/[0.04]';
  if (count < 3) return 'bg-primary/25';
  if (count < 8) return 'bg-primary/50';
  return 'bg-primary/80';
};

export function ActivityGrid({ days, total, streak }: ActivityGridProps) {
  const { t } = useTranslation();
  const weeks: ActivityDay[][] = [];
  for (let start = 0; start < days.length; start += WEEK) weeks.push(days.slice(start, start + WEEK));

  return (
    <section className="space-y-2 rounded-2xl border border-line bg-panel/60 p-4">
      <header className="flex flex-wrap items-center gap-3">
        <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {t('studio.activity.title')}
        </h2>
        <p className="font-mono text-[11px] text-muted-foreground">
          {t('studio.activity.summary', { count: total, weeks: Math.round(days.length / WEEK) })}
          {streak > 0 && (
            <span className="ml-2 text-primary">{t('studio.activity.streak', { count: streak })}</span>
          )}
        </p>
      </header>

      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week) => (
          <div key={week[0].day} className="flex flex-col gap-1">
            {week.map((entry) => (
              <span
                key={entry.day}
                title={t('studio.activity.day', {
                  day: entry.day,
                  runs: entry.runs,
                  reviews: entry.reviews,
                })}
                className={cn('size-2.5 rounded-[3px]', toneOf(entry.runs + entry.reviews))}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
