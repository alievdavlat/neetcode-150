'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarClock, Repeat2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { RepeatPlanState } from '@/lib/types';
import { cn } from '@/lib/utils';

const DAYS = [1, 3, 5, 7, 14];
const PER_DAY = [1, 2, 3, 4];

interface RepeatDialogProps {
  plan: RepeatPlanState | null;
  saving: boolean;
  onStart: (days: number, perDay: number, note: string) => void;
  onStop: () => void;
}

/**
 * Spaced repetition only reacts to what it measured, so it cannot help with a
 * problem the learner already knows they have not learned. This is them saying
 * so directly: how many days, how many times a day, and why it was hard.
 */
export function RepeatDialog({ plan, saving, onStart, onStop }: RepeatDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(3);
  const [perDay, setPerDay] = useState(2);
  const [note, setNote] = useState('');

  const start = () => {
    onStart(days, perDay, note);
    setOpen(false);
    setNote('');
  };

  const renderChoice = (values: number[], value: number, onPick: (next: number) => void, label: string) => (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{label}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1">
        {values.map((entry) => (
          <button
            key={entry}
            type="button"
            aria-pressed={value === entry}
            onClick={() => onPick(entry)}
            className={cn(
              'min-w-9 rounded-md border px-2 py-1 font-mono text-[11px] transition-colors',
              value === entry
                ? 'border-primary/40 bg-primary/15 text-primary'
                : 'border-line text-muted-foreground hover:text-foreground',
            )}
          >
            {entry}
          </button>
        ))}
      </div>
    </div>
  );

  if (plan) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/[0.07] px-2.5 py-1.5">
        <Repeat2 className="size-3 shrink-0 text-primary" />
        <span className="text-[11px] text-primary">
          {t('repeat.progress', { done: plan.done, total: plan.total })}
        </span>
        <button
          type="button"
          onClick={onStop}
          disabled={saving}
          title={t('repeat.stop')}
          aria-label={t('repeat.stop')}
          className="ml-auto text-muted-foreground transition-colors hover:text-fail"
        >
          <X className="size-3" />
        </button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Repeat2 className="size-3" />
          {t('repeat.open')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" />
            {t('repeat.title')}
          </DialogTitle>
          <DialogDescription>{t('repeat.body')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {renderChoice(DAYS, days, setDays, t('repeat.days'))}
          {renderChoice(PER_DAY, perDay, setPerDay, t('repeat.perDay'))}

          <div className="space-y-1.5">
            <label
              htmlFor="repeat-note"
              className="block text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase"
            >
              {t('repeat.note')}
            </label>
            <textarea
              id="repeat-note"
              rows={2}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t('repeat.notePlaceholder')}
              className="w-full resize-none rounded-md border border-line bg-black/20 px-2 py-1.5 text-[12px] outline-none placeholder:text-muted-foreground/60 focus:border-primary/40"
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            {t('repeat.summary', { count: days * perDay, days, perDay })}
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            {t('repeat.cancel')}
          </Button>
          <Button size="sm" onClick={start} disabled={saving}>
            {t('repeat.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
