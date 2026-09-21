'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Loader2, Play, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Markdown } from '@/components/markdown';
import { request } from '@/lib/api';
import type { PlaygroundItem, StageReport, StageResult } from '@/lib/types';
import { cn } from '@/lib/utils';

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

interface PlaygroundRunnerProps {
  item: PlaygroundItem;
}

/**
 * Run a challenge's stages and show what each one said.
 *
 * A lab is not run from here: it takes a minute and a half, brings up
 * containers and is worth watching in a terminal, so this shows the command.
 */
export function PlaygroundRunner({ item }: PlaygroundRunnerProps) {
  const { t } = useTranslation();
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<StageReport | null>(null);

  const byStep = new Map((report?.results ?? []).map((result) => [result.slug, result]));

  const handleRun = () => {
    setRunning(true);
    setReport(null);

    request<{ report: StageReport }>('/api/playground/run', {
      method: 'POST',
      body: JSON.stringify({ slug: item.slug }),
    })
      .then((payload) => setReport(payload.report))
      .catch((error: unknown) => toast.error(messageOf(error)))
      .finally(() => setRunning(false));
  };

  const renderVerdict = (result: StageResult | undefined) => {
    if (!result) return null;

    return (
      <div className="mt-2 space-y-1">
        {result.log.map((line, index) => (
          <p key={index} className="font-mono text-[11px] text-muted-foreground">
            {line}
          </p>
        ))}
        {result.message && <p className="font-mono text-[11px] text-fail">{result.message}</p>}
        {result.output && (
          <pre className="mt-1 overflow-x-auto rounded-md bg-black/30 p-2 font-mono text-[10px] text-muted-foreground">
            {result.output.split('\n').slice(0, 8).join('\n')}
          </pre>
        )}
      </div>
    );
  };

  const renderStep = (step: PlaygroundItem['steps'][number], index: number) => {
    const result = byStep.get(step.slug);
    const state = result === undefined ? 'idle' : result.passed ? 'passed' : 'failed';

    return (
      <li
        key={step.slug}
        className={cn(
          'rounded-2xl border p-4 transition-colors',
          state === 'passed' && 'border-pass/40 bg-pass/[0.06]',
          state === 'failed' && 'border-fail/40 bg-fail/[0.06]',
          state === 'idle' && 'border-line bg-panel/60',
        )}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{index + 1}</span>
          {state === 'passed' && <Check className="size-3.5 text-pass" />}
          {state === 'failed' && <X className="size-3.5 text-fail" />}
          <h3 className="text-[13px] font-medium">{step.title}</h3>
          {result && <span className="ml-auto font-mono text-[10px] text-muted-foreground">{result.ms} ms</span>}
        </div>

        <Markdown text={step.description} className="mt-2 text-[12px] leading-relaxed text-muted-foreground" />

        {renderVerdict(result)}
      </li>
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {item.kind === 'challenge' ? (
          <Button size="sm" onClick={handleRun} disabled={running || item.machine.state === 'unavailable'} className="gap-1.5">
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
            {running ? t('play.running') : t('play.run')}
          </Button>
        ) : null}

        <code className="rounded-md border border-line bg-black/20 px-2 py-1 font-mono text-[11px] text-muted-foreground">
          {item.command}
        </code>

        {report && (
          <span className="text-[12px] text-muted-foreground">
            {t('play.passedOf', { passed: report.results.filter((result) => result.passed).length, total: report.total })}
          </span>
        )}
      </div>

      <ol className="space-y-3">{item.steps.map(renderStep)}</ol>
    </section>
  );
}
