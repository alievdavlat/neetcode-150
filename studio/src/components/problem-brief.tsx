'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Eye, Gauge, History, NotebookPen, PlayCircle, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { DIFFICULTY_META, relativeTime, STATE_META } from '@/lib/meta';
import type { Problem, ProblemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProblemBriefProps {
  problem: Problem;
  status: ProblemStatus;
  leetcode: string | null;
  video: string | null;
  note: string;
  onHint: (level: number) => void;
  onNoteSave: (note: string) => void;
}

const SECTION = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const HINT_LABEL: Record<number, string> = {
  1: 'Show the pattern',
  2: 'Show the target complexity',
  3: 'Open the walkthrough',
};

export function ProblemBrief({ problem, status, leetcode, video, note, onHint, onNoteSave }: ProblemBriefProps) {
  const [draft, setDraft] = useState(note);

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
      {HINT_LABEL[level]}
    </button>
  );

  const renderExamples = () => (
    <motion.section variants={SECTION}>
      {renderHeading('Examples')}
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
    <motion.section variants={SECTION}>
      {renderHeading('Constraints')}
      <ul className="space-y-1.5">
        {problem.constraints.map((entry) => (
          <li key={entry} className="flex gap-2 font-mono text-[12px] text-muted-foreground">
            <span className="text-primary/60">·</span>
            {entry}
          </li>
        ))}
      </ul>
    </motion.section>
  );

  const renderHistory = () => (
    <motion.section
      variants={SECTION}
      className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-line bg-white/[0.02] px-3 py-2 text-[11px] text-muted-foreground"
    >
      <History className="size-3.5" />
      <span>
        <span className="font-mono text-foreground/80">{history.runs}</span> {history.runs === 1 ? 'run' : 'runs'}
      </span>
      {history.runsToFirstPass !== null && (
        <span>
          first pass on run <span className="font-mono text-pass">{history.runsToFirstPass}</span>
        </span>
      )}
      {history.solveMinutes !== null && (
        <span>
          solved in <span className="font-mono text-foreground/80">{history.solveMinutes}m</span>
        </span>
      )}
      <span>last run {relativeTime(history.lastRunAt)}</span>
      {history.dueInDays !== null && !history.due && (
        <span>review in {history.dueInDays === 1 ? 'a day' : `${history.dueInDays} days`}</span>
      )}
      {history.hintLevel > 0 && (
        <span className="text-medium">
          {history.hintLevel} {history.hintLevel === 1 ? 'hint' : 'hints'} used
        </span>
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
              {difficulty.label}
            </span>
            <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-medium', state.chip)}>
              {state.label}
              {status.stale && ' · stale'}
            </span>
            {history.due && (
              <span className="rounded-full border border-medium/30 bg-medium/10 px-2 py-0.5 text-[10px] text-medium">
                due for review
              </span>
            )}
          </div>
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
        {problem.constraints.length > 0 && renderConstraints()}

        {problem.followUp && (
          <motion.section variants={SECTION}>
            {renderHeading('Follow-up')}
            <p className="rounded-xl border border-cool/20 bg-cool/[0.06] p-3 text-[13px] text-foreground/85">
              {problem.followUp}
            </p>
          </motion.section>
        )}

        <motion.section variants={SECTION} className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-white/[0.02] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              <Route className="size-3" />
              Pattern
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
              Target
            </div>
            {history.hintLevel >= 2 ? (
              <p className="font-mono text-[13px] text-foreground/85">{problem.complexity}</p>
            ) : (
              renderLocked(2)
            )}
          </div>
        </motion.section>

        <motion.section variants={SECTION}>
          {renderHeading('Your note')}
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What tripped you up? What is the one idea to remember?"
            aria-label="Note for this problem"
            className="min-h-20 bg-white/[0.02] text-[13px]"
          />
          {draft !== note && (
            <Button size="sm" variant="outline" className="mt-2" onClick={() => onNoteSave(draft)}>
              <NotebookPen className="size-3.5" />
              Save note
            </Button>
          )}
        </motion.section>

        <motion.section variants={SECTION} className="flex flex-wrap gap-2 pb-4">
          {leetcode && renderLink(leetcode, 'LeetCode', <ExternalLink className="size-3.5" />)}
          {video &&
            (history.hintLevel >= 3 ? (
              renderLink(video, 'Walkthrough', <PlayCircle className="size-3.5" />)
            ) : (
              <button
                type="button"
                onClick={() => onHint(3)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-medium/40 hover:text-medium"
              >
                <Eye className="size-3.5" />
                {HINT_LABEL[3]}
              </button>
            ))}
        </motion.section>
      </motion.article>
    </ScrollArea>
  );
}
