'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  ChevronRight,
  ExternalLink,
  Eye,
  Gauge,
  History,
  NotebookPen,
  PlayCircle,
  RotateCw,
  Route,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { DIFFICULTY_META, relativeTime, STATE_META } from '@/lib/meta';
import { RepeatDialog } from './repeat-dialog';
import type { Problem, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProblemBriefProps {
  problem: Problem;
  status: ProblemStatus;
  leetcode: string | null;
  video: string | null;
  /** The same walkthrough, as a lesson this studio already has. */
  lesson: { href: string; label: string } | null;
  note: string;
  reviewing: boolean;
  repeating: boolean;
  onStartReview: () => void;
  onHint: (level: number) => void;
  onNoteSave: (note: string) => void;
  /** A repeat plan the learner asks for by hand, outside the measured schedule. */
  planSaving: boolean;
  onPlanStart: (target: number, note: string) => void;
  onPlanStop: () => void;
}

const SECTION = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

/** Tallest a re-solve bar gets; the label above it fills the rest of the row. */
const BAR_HEIGHT = 44;

/** Sections that are reference rather than reading: folded away until asked for. */
const FOLD_KEY = 'neetcode-studio:fold';
const FOLDS = ['constraints', 'follow-up', 'trend', 'note'] as const;

type Fold = (typeof FOLDS)[number];

/** Dictionary keys, looked up where the locked hint is drawn. */
const HINT_LABEL: Record<number, string> = {
  1: 'brief.hintPattern',
  2: 'brief.hintComplexity',
  3: 'brief.hintWalkthrough',
};

export function ProblemBrief({
  problem,
  status,
  leetcode,
  video,
  lesson,
  note,
  reviewing,
  repeating,
  onStartReview,
  planSaving,
  onPlanStart,
  onPlanStop,
  onHint,
  onNoteSave,
}: ProblemBriefProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(note);
  const [open, setOpen] = useState<Record<Fold, boolean>>({
    constraints: false,
    'follow-up': false,
    trend: false,
    note: false,
  });

  useEffect(() => {
    setOpen(
      Object.fromEntries(
        FOLDS.map((key) => [key, window.localStorage.getItem(`${FOLD_KEY}:${key}`) === 'open']),
      ) as Record<Fold, boolean>,
    );
  }, []);

  const handleFold = (key: Fold) => {
    const next = !open[key];
    window.localStorage.setItem(`${FOLD_KEY}:${key}`, next ? 'open' : 'closed');
    setOpen({ ...open, [key]: next });
  };

  /**
   * What the review log is for: is writing this again getting faster, or not?
   * Two points are a sentence, not a chart, so they are read out instead.
   */
  const renderTrend = () => {
    const times = history.reviewMinutes;
    if (times.length === 0) return null;

    const peak = Math.max(...times, 1);

    return (
      <div className="rounded-xl border border-line bg-white/[0.02] p-3">
          {times.length < 3 ? (
            <p className="text-[13px] text-foreground/85">
              {times.length === 1
                ? t('brief.resolvedOnce', { minutes: times[0] })
                : t('brief.resolvedTwice', { first: times[0], second: times[1] })}
            </p>
          ) : (
            <div className="flex h-16 items-end gap-1">
              {times.map((minutes, index) => (
                <span key={index} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{minutes}</span>
                  <span
                    title={t('brief.minutes', { value: minutes })}
                    style={{ height: `${Math.max(3, Math.round((minutes / peak) * BAR_HEIGHT))}px` }}
                    className="w-full rounded-sm bg-cool/50"
                  />
                </span>
              ))}
            </div>
          )}
        <p className="mt-2 text-[11px] text-muted-foreground">
          {t('brief.reviews', { count: history.reviews })}
          {times.length > 2 && ` · ${t('brief.minutesPerResolve')}`}
          {history.solveMinutes !== null && ` · ${t('brief.firstSolveTook', { value: history.solveMinutes })}`}
          {history.ease !== null && ` · ${t('brief.ease', { value: history.ease })}`}
        </p>
      </div>
    );
  };

  useEffect(() => {
    setDraft(note);
  }, [note, problem.number]);

  const difficulty = DIFFICULTY_META[problem.difficulty];
  const state = STATE_META[status.state];
  const { history } = status;

  const paragraphs = problem.statement
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

  const renderHeading = (text: string) => (
    <h3 className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{text}</h3>
  );

  /** Reference material stays one click away instead of pushing the problem off screen. */
  const renderFold = (key: Fold, title: string, body: React.ReactNode, hint?: string) => (
    <motion.section variants={SECTION}>
      <button
        type="button"
        onClick={() => handleFold(key)}
        aria-expanded={open[key]}
        className="flex w-full items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ChevronRight className={cn('size-3 transition-transform', open[key] && 'rotate-90')} />
        {title}
        {hint && <span className="ml-auto font-sans tracking-normal normal-case opacity-60">{hint}</span>}
      </button>
      {open[key] && <div className="mt-2">{body}</div>}
    </motion.section>
  );

  const renderLink = (href: string, label: string, icon: React.ReactNode) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.02] px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      {icon}
      {label}
    </a>
  );

  const renderLocked = (level: number) => (
    <button
      type="button"
      onClick={() => onHint(level)}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-line px-2 py-2 text-[11px] text-muted-foreground transition-colors hover:border-medium/40 hover:text-medium"
    >
      <Eye className="size-3.5" />
      {t(HINT_LABEL[level])}
    </button>
  );

  const renderExamples = () => (
    <motion.section variants={SECTION}>
      {renderHeading(t('brief.examples'))}
      <div className="space-y-2">
        {problem.examples.map((example, index) => (
          <pre
            key={index}
            className="overflow-x-auto rounded-xl border border-line bg-black/30 p-3 font-mono text-[12px] leading-relaxed text-foreground/85"
          >
            {example}
          </pre>
        ))}
      </div>
    </motion.section>
  );

  const renderConstraints = () => (
    <ul className="space-y-1.5">
      {problem.constraints.map((entry) => (
        <li key={entry} className="flex gap-2 font-mono text-[12px] text-muted-foreground">
          <span className="text-primary/60">·</span>
          {entry}
        </li>
      ))}
    </ul>
  );

  const renderHistory = () => (
    <motion.section
      variants={SECTION}
      className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-line bg-white/[0.02] px-3 py-2 text-[11px] text-muted-foreground"
    >
      <History className="size-3.5" />
      <span>
        <span className="font-mono text-foreground/80">{history.runs}</span>{' '}
        {t('brief.runs', { count: history.runs })}
      </span>
      {history.runsToFirstPass !== null && (
        <span>
          {t('brief.firstPassOnRun')} <span className="font-mono text-pass">{history.runsToFirstPass}</span>
        </span>
      )}
      {history.solveMinutes !== null && (
        <span>
          {t('brief.solvedIn')}{' '}
          <span className="font-mono text-foreground/80">
            {t('brief.minutesShort', { value: history.solveMinutes })}
          </span>
        </span>
      )}
      {/* Relative to now, so the server's minute and the client's need not agree. */}
      <span suppressHydrationWarning>
        {t('brief.lastRun')} {relativeTime(t, history.lastRunAt)}
      </span>
      {history.dueInDays !== null && !history.due && (
        <span>{t('brief.reviewIn', { count: history.dueInDays })}</span>
      )}
      {history.hintLevel > 0 && (
        <span className="text-medium">{t('brief.hints', { count: history.hintLevel })}</span>
      )}
    </motion.section>
  );

  return (
    <ScrollArea className="h-full">
      <motion.article
        key={problem.number}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="space-y-6 p-6"
      >
        <motion.header variants={SECTION} className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground/70">#{problem.number}</span>
            <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-medium', difficulty.chip)}>
              {t(difficulty.label)}
            </span>
            <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-medium', state.chip)}>
              {t(state.label)}
              {status.stale && ` · ${t('brief.stale')}`}
            </span>
            {history.due && repeating && (
              <span className="rounded-full border border-medium/30 bg-medium/10 px-2 py-0.5 text-[10px] text-medium">
                {t('brief.dueForReview')}
              </span>
            )}
            {history.leech && repeating && (
              <span className="rounded-full border border-fail/30 bg-fail/10 px-2 py-0.5 text-[10px] text-fail">
                {t('brief.stuck', { count: history.lapses })}
              </span>
            )}
            {history.firstPassAt !== null && !reviewing && repeating && (
              <Button
                size="xs"
                variant={history.due ? 'default' : 'ghost'}
                onClick={onStartReview}
                className="ml-auto gap-1.5"
              >
                <RotateCw />
                {t('brief.review')}
              </Button>
            )}
          </div>

          {/* Also offered before a first solve: a problem you cannot do yet is
              the one most worth being made to come back to. */}
          {repeating && !reviewing && (
            <RepeatDialog plan={history.plan} saving={planSaving} onStart={onPlanStart} onStop={onPlanStop} />
          )}
          <h1 className="text-balance font-heading text-[26px] leading-tight font-semibold tracking-tight">
            {problem.title}
          </h1>
          <p className="text-xs text-muted-foreground">{problem.category}</p>
        </motion.header>

        {history.runs > 0 && renderHistory()}

        <motion.section variants={SECTION} className="space-y-3 text-[13.5px] leading-relaxed text-foreground/85">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </motion.section>

        {problem.examples.length > 0 && renderExamples()}

        {problem.constraints.length > 0 &&
          renderFold(
            'constraints',
            t('brief.constraints'),
            renderConstraints(),
            `${problem.constraints.length}`,
          )}

        {problem.followUp &&
          renderFold(
            'follow-up',
            t('brief.followUp'),
            <p className="rounded-xl border border-cool/20 bg-cool/[0.06] p-3 text-[13px] text-foreground/85">
              {problem.followUp}
            </p>,
          )}

        <motion.section variants={SECTION} className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-white/[0.02] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              <Route className="size-3" />
              {t('brief.pattern')}
            </div>
            {history.hintLevel >= 1 ? (
              <p className="text-[13px] text-foreground/85">{problem.pattern}</p>
            ) : (
              renderLocked(1)
            )}
          </div>
          <div className="rounded-xl border border-line bg-white/[0.02] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              <Gauge className="size-3" />
              {t('brief.target')}
            </div>
            {history.hintLevel >= 2 ? (
              <p className="font-mono text-[13px] text-foreground/85">{problem.complexity}</p>
            ) : (
              renderLocked(2)
            )}
          </div>
        </motion.section>

        {history.reviewMinutes.length > 0 && renderFold('trend', t('brief.resolveTime'), renderTrend())}

        {reviewing
          ? renderFold(
              'note',
              t('brief.yourNote'),
              <p className="rounded-xl border border-line bg-white/[0.02] p-3 text-xs text-muted-foreground">
                {t('brief.noteHidden')}
              </p>,
              t('brief.foldHidden'),
            )
          : renderFold(
              'note',
              t('brief.yourNote'),
              <>
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={t('brief.notePlaceholder')}
                  aria-label={t('brief.noteLabel')}
                  className="min-h-20 bg-white/[0.02] text-[13px]"
                />
                {draft !== note && (
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => onNoteSave(draft)}>
                    <NotebookPen className="size-3.5" />
                    {t('brief.saveNote')}
                  </Button>
                )}
              </>,
              note ? t('brief.foldWritten') : t('brief.foldEmpty'),
            )}

        <motion.section variants={SECTION} className="flex flex-wrap gap-2 pb-4">
          {leetcode && renderLink(leetcode, 'LeetCode', <ExternalLink className="size-3.5" />)}
          {video &&
            (history.hintLevel >= 3 ? (
              lesson ? (
                <Link
                  href={lesson.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.02] px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <PlayCircle className="size-3.5" />
                  {lesson.label}
                </Link>
              ) : (
                renderLink(video, t('brief.walkthrough'), <PlayCircle className="size-3.5" />)
              )
            ) : (
              <button
                type="button"
                onClick={() => onHint(3)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-medium/40 hover:text-medium"
              >
                <Eye className="size-3.5" />
                {t(HINT_LABEL[3])}
              </button>
            ))}
        </motion.section>
      </motion.article>
    </ScrollArea>
  );
}
