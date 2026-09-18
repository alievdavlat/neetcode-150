'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { request } from '@/lib/api';
import { tagsOf } from '@/lib/meta';
import type { Problem, ProblemStatus, ReviewGrade } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RecallDrillProps {
  problem: Problem;
  tags: string[];
  onDone: (status: ProblemStatus) => void;
  onSkip: () => void;
}

const VERDICTS: { grade: ReviewGrade; label: string; tone: string }[] = [
  { grade: 2, label: 'I had it', tone: 'border-pass/40 text-pass hover:bg-pass/10' },
  { grade: 1, label: 'Close', tone: 'border-medium/40 text-medium hover:bg-medium/10' },
  { grade: 0, label: 'No idea', tone: 'border-fail/40 text-fail hover:bg-fail/10' },
];

/**
 * The sixty-second review. What decays is not the syntax, it is the jump from
 * "sorted array, find a pair" to "two pointers". This asks for that jump and
 * nothing else, so a due queue can be cleared on a day with no hour to spare.
 */
export function RecallDrill({ problem, tags, onDone, onSkip }: RecallDrillProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const [idea, setIdea] = useState('');
  const [shown, setShown] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPicked(null);
    setIdea('');
    setShown(false);
    setNote(null);
  }, [problem.number]);

  const reveal = () => {
    setShown(true);
    request<{ note: string }>(`/api/notes?number=${problem.number}`)
      .then((answer) => setNote(answer.note))
      .catch(() => setNote(''));
  };

  const grade = async (value: ReviewGrade) => {
    setSaving(true);
    try {
      const answer = await request<{ status: ProblemStatus }>('/api/review', {
        method: 'POST',
        body: JSON.stringify({
          number: problem.number,
          kind: 'drill',
          passed: value > 0,
          revealed: false,
          runs: 0,
          hints: 0,
          minutes: null,
          grade: value,
        }),
      });
      onDone(answer.status);
    } finally {
      setSaving(false);
    }
  };

  const answer = tagsOf(problem);

  const renderTag = (tag: string) => (
    <button
      key={tag}
      type="button"
      aria-pressed={picked === tag}
      onClick={() => setPicked(picked === tag ? null : tag)}
      className={cn(
        'rounded-full border px-2.5 py-1 text-[11px] transition-colors',
        picked === tag
          ? 'border-primary/50 bg-primary/10 text-primary'
          : 'border-line text-muted-foreground hover:border-primary/30 hover:text-foreground',
      )}
    >
      {tag}
    </button>
  );

  return (
    <section className="space-y-4 rounded-2xl border border-line bg-panel/60 p-4">
      <header className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">#{problem.number}</span>
        <h3 className="font-heading text-sm font-semibold">{problem.title}</h3>
        <Button variant="ghost" size="xs" onClick={onSkip} className="ml-auto text-muted-foreground">
          Skip
        </Button>
      </header>

      <p className="text-[13px] leading-relaxed text-foreground/85">{problem.statement}</p>

      {problem.examples[0] && (
        <pre className="overflow-x-auto rounded-lg border border-line bg-black/25 p-3 font-mono text-[11px] text-foreground/75">
          {problem.examples[0]}
        </pre>
      )}

      {!shown ? (
        <>
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              which pattern
            </p>
            <div className="flex flex-wrap gap-1.5">{tags.map(renderTag)}</div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              the one idea
            </p>
            <Textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="In one sentence, what makes it work?"
              aria-label="The one idea"
              className="min-h-16 bg-white/[0.02] text-[13px]"
            />
          </div>

          <Button size="sm" onClick={reveal} disabled={!picked && idea.trim() === ''}>
            Show the answer
          </Button>
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-white/[0.02] p-3">
              <p className="mb-1 text-[10px] tracking-[0.18em] text-muted-foreground uppercase">you said</p>
              <p className="font-mono text-[11px] text-foreground/80">{picked ?? '—'}</p>
              <p className="mt-1 text-[12px] text-foreground/70">{idea.trim() || '—'}</p>
            </div>

            <div className="rounded-xl border border-primary/25 bg-primary/[0.05] p-3">
              <p className="mb-1 text-[10px] tracking-[0.18em] text-muted-foreground uppercase">it was</p>
              <p className="flex flex-wrap gap-1 font-mono text-[11px] text-primary">
                {answer.length > 0 ? answer.join(', ') : problem.pattern}
              </p>
              <p className="mt-1 text-[12px] text-foreground/75">{problem.pattern}</p>
              {note === null ? (
                <Loader2 className="mt-2 size-3 animate-spin text-muted-foreground" />
              ) : (
                note.trim() !== '' && (
                  <p className="mt-2 border-t border-line pt-2 text-[12px] text-foreground/70">{note.trim()}</p>
                )
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {VERDICTS.map((verdict) => (
              <button
                key={verdict.grade}
                type="button"
                disabled={saving}
                onClick={() => grade(verdict.grade)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] transition-colors disabled:opacity-50',
                  verdict.tone,
                )}
              >
                {verdict.grade === 0 ? <X className="size-3.5" /> : <Check className="size-3.5" />}
                {verdict.label}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
