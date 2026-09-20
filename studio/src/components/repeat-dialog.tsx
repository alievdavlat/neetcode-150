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

/** Clean passes to ask for. Past six it is not a repeat plan, it is a rewrite. */
const TARGETS = [2, 3, 4, 5, 6];

/** The bottom of the ladder, so the dialog can show what it is committing to. */
const FIRST_INTERVALS = [1, 3, 7, 16, 35, 90];

interface RepeatDialogProps {
  plan: RepeatPlanState | null;
  saving: boolean;
  onStart: (target: number, note: string) => void;
  onStop: () => void;
}

/**
 * Spaced repetition only reacts to what it measured, so it cannot help with a
 * problem the learner already knows they have not learned. This is them saying
 * so directly.
 *
 * It asks for clean passes rather than a number of days, because what fixes a
 * hard problem is having to rebuild it after a gap - not seeing it three more
 * times this afternoon while the answer is still in mind.
 */
export function RepeatDialog({ plan, saving, onStart, onStop }: RepeatDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(3);
  const [note, setNote] = useState('');

  const start = () => {
    onStart(target, note);
    setOpen(false);
    setNote('');
  };

  /** The gaps this plan commits to, so the choice is not made blind. */
  const schedule = FIRST_INTERVALS.slice(0, target).join(' · ');

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
          {t('repeat.progress', { done: plan.done, total: plan.target })}
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
          {renderChoice(TARGETS, target, setTarget, t('repeat.target'))}

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

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {t('repeat.summary', { count: target })}{' '}
            <span className="font-mono text-primary/80">{schedule}</span> {t('repeat.summaryDays')}
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
