'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TraceExpression } from './trace-expression';
import { TraceStage } from './trace-stage';
import type { TraceResult } from '@/lib/types';

interface TracePanelProps {
  trace: TraceResult | null;
  tracing: boolean;
  variants: string[];
  cases: { label: string; passed: boolean }[];
  variant: string | null;
  caseIndex: number;
  onPick: (variant: string, caseIndex: number) => void;
  onTrace: () => void;
  onStep: (line: number | null) => void;
}

const PLAY_MS = 800;

export function TracePanel({
  trace,
  tracing,
  variants,
  cases,
  variant,
  caseIndex,
  onPick,
  onTrace,
  onStep,
}: TracePanelProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = trace?.steps ?? [];
  const current = steps[index] ?? null;

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [trace]);

  useEffect(() => {
    onStep(current?.line ?? null);
  }, [current, onStep]);

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setIndex((at) => {
        if (at >= steps.length - 1) {
          setPlaying(false);
          return at;
        }
        return at + 1;
      });
    }, PLAY_MS);

    return () => clearInterval(timer);
  }, [playing, steps.length]);

  const pickers = (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
      {variants.length > 1 && (
        <select
          aria-label="variant"
          value={variant ?? ''}
          onChange={(event) => onPick(event.target.value, caseIndex)}
          className="rounded-md border border-line bg-transparent px-2 py-1 font-mono text-[11px]"
        >
          {variants.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}

      {cases.length > 0 && variant && (
        <select
          aria-label="case"
          value={caseIndex}
          onChange={(event) => onPick(variant, Number(event.target.value))}
          className="min-w-0 flex-1 rounded-md border border-line bg-transparent px-2 py-1 font-mono text-[11px]"
        >
          {cases.map((item, position) => (
            <option key={`${item.label}-${position}`} value={position}>
              {item.passed ? '' : 'failing - '}
              {item.label}
            </option>
          ))}
        </select>
      )}

      <button
        type="button"
        onClick={onTrace}
        className="rounded-md border border-line px-2 py-1 text-[11px] transition-colors hover:border-primary/40"
      >
        Simulate
      </button>
    </div>
  );

  const notice = (title: string, body: string) => (
    <div className="flex h-full flex-col">
      {pickers}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-sm rounded-2xl border border-line bg-panel/60 p-6 text-center">
          <div className="mb-3 flex justify-center">
            <AlertTriangle className="size-6 text-medium" />
          </div>
          <p className="mb-1 font-heading text-sm font-semibold">{title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );

  if (tracing) return notice('Recording', 'Running your solution one step at a time.');

  if (!trace) {
    return (
      <div className="flex h-full flex-col">
        {pickers}
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="max-w-xs text-center text-xs text-muted-foreground">
            {variants.length === 0
              ? 'Run it once first, so the tracer knows which export to follow.'
              : 'Pick a case and press Simulate to watch this solution run one step at a time.'}
          </p>
        </div>
      </div>
    );
  }

  if (trace.status === 'unsupported') return notice('Not traceable yet', trace.message ?? '');
  if (trace.status === 'uninstrumentable') return notice('Could not read your file', trace.message ?? '');
  if (trace.status === 'stalled') return notice('Timed out', trace.message ?? '');
  if (trace.status === 'crashed') return notice('The tracer crashed', trace.message ?? '');
  if (steps.length === 0) return notice('Nothing to show', 'The run produced no steps.');

  return (
    <div className="flex h-full flex-col">
      {pickers}

      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <button
          type="button"
          aria-label="previous step"
          onClick={() => setIndex((at) => Math.max(0, at - 1))}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="play"
          onClick={() => setPlaying((on) => !on)}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button
          type="button"
          aria-label="next step"
          onClick={() => setIndex((at) => Math.min(steps.length - 1, at + 1))}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={index}
          aria-label="step"
          onChange={(event) => setIndex(Number(event.target.value))}
          className="flex-1 accent-primary"
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          {index + 1} / {steps.length}
        </span>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <p className="font-mono text-[10px] text-muted-foreground">
            {trace.variant}({trace.args.join(', ')})
            {trace.result !== null && <> &rarr; {trace.result}</>}
          </p>

          {current && <TraceExpression step={current} />}
          {current && <TraceStage step={current} />}

          {trace.status === 'threw' && (
            <p className="rounded-lg border border-fail/30 bg-fail/[0.05] p-3 text-[11px] text-fail">
              It threw after this point: {trace.message}
            </p>
          )}
          {trace.truncated && (
            <p className="text-[11px] text-muted-foreground">
              The trace hit its step budget; the rest was cut.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
