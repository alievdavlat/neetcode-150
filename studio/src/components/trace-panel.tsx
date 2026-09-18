'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleSlash,
  Clock,
  Eye,
  Pause,
  Play,
  Radar,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PanelNotice } from './panel-notice';
import { TraceExpression } from './trace-expression';
import { TraceStage } from './trace-stage';
import type { TraceKind, TraceResult } from '@/lib/types';
import { changesOf, passesOf, stepsChanging } from '@/lib/trace-view';
import { cn } from '@/lib/utils';

interface TraceCase {
  label: string;
  passed: boolean;
}

interface TracePanelProps {
  trace: TraceResult | null;
  tracing: boolean;
  variants: string[];
  cases: TraceCase[];
  variant: string | null;
  caseIndex: number;
  jumpLine: { line: number; at: number } | null;
  onPick: (variant: string, caseIndex: number) => void;
  onTrace: () => void;
  onStep: (line: number | null) => void;
}

const PLAY_MS = 700;
const SPEEDS = [1, 2, 4, 0.5];
const COLUMNS = 240;

const CHIP = 'rounded-full border px-2 py-0.5 font-mono text-[10px] transition-colors';

const PICKED = 'border-primary/40 bg-primary/10 text-primary';
const UNPICKED = 'border-line text-muted-foreground hover:border-primary/30 hover:text-foreground';

const TICK: Record<TraceKind, string> = {
  stmt: 'bg-cool/60',
  'loop-init': 'bg-medium/50',
  'loop-cond': 'bg-medium/70',
  'loop-update': 'bg-medium/40',
  cond: 'bg-primary/60',
  return: 'bg-pass/80',
};

export function TracePanel({
  trace,
  tracing,
  variants,
  cases,
  variant,
  caseIndex,
  jumpLine,
  onPick,
  onTrace,
  onStep,
}: TracePanelProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [watching, setWatching] = useState<string | null>(null);

  const steps = useMemo(() => trace?.steps ?? [], [trace]);
  const current = steps[index] ?? null;
  const last = steps.length - 1;

  const at = useRef(0);
  useEffect(() => {
    at.current = index;
  }, [index]);

  const passes = useMemo(() => passesOf(steps), [steps]);
  const marks = useMemo(() => (watching ? stepsChanging(steps, watching) : null), [steps, watching]);
  const changes = useMemo(
    () => (current ? changesOf(current, steps[index - 1] ?? null) : {}),
    [current, index, steps],
  );

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
    setWatching(null);
  }, [trace]);

  useEffect(() => {
    onStep(current?.line ?? null);
  }, [current, onStep]);

  /** Leaving the tab must not leave a line lit up in the editor. */
  useEffect(() => () => onStep(null), [onStep]);

  const seek = useCallback(
    (from: number, direction: 1 | -1) => {
      if (!marks) return Math.min(Math.max(from + direction, 0), Math.max(last, 0));

      for (let cursor = from + direction; cursor >= 0 && cursor <= last; cursor += direction) {
        if (marks[cursor]) return cursor;
      }
      return from;
    },
    [marks, last],
  );

  useEffect(() => {
    if (!playing) return;

    const next = seek(index, 1);
    if (next === index) {
      setPlaying(false);
      return;
    }

    const timer = setTimeout(() => setIndex(next), PLAY_MS / speed);
    return () => clearTimeout(timer);
  }, [playing, index, speed, seek]);

  const move = (to: number) => setIndex(Math.min(Math.max(to, 0), Math.max(last, 0)));

  const jumpTo = useCallback(
    (line: number) => {
      const later = steps.findIndex((step, position) => position > at.current && step.line === line);
      const target = later === -1 ? steps.findIndex((step) => step.line === line) : later;
      if (target !== -1) setIndex(target);
    },
    [steps],
  );

  useEffect(() => {
    if (jumpLine) jumpTo(jumpLine.line);
  }, [jumpLine, jumpTo]);

  const handleKeys = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') setIndex(seek(index, -1));
    else if (event.key === 'ArrowRight') setIndex(seek(index, 1));
    else if (event.key === ' ') setPlaying((on) => !on);
    else return;

    event.preventDefault();
  };

  const ticks = useMemo(() => {
    if (steps.length === 0) return [];

    const columns = Math.min(steps.length, COLUMNS);
    return Array.from({ length: columns }, (_, column) => {
      const position = Math.floor((column * steps.length) / columns);
      return { position, kind: steps[position].kind, hit: marks ? marks[position] : true };
    });
  }, [steps, marks]);

  const renderPickers = () => (
    <div className="space-y-1.5 border-b border-line px-3 py-2">
      <div className="flex items-center gap-2">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          simulation
        </p>

        <Button size="xs" onClick={onTrace} disabled={tracing || !variant} className="ml-auto gap-1.5">
          <Radar className={cn(tracing && 'animate-pulse')} />
          {tracing ? 'Recording' : 'Simulate'}
        </Button>
      </div>

      {variants.length > 1 && (
        <div role="group" aria-label="variant" className="flex flex-wrap gap-1">
          {variants.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={name === variant}
              onClick={() => onPick(name, caseIndex)}
              className={cn(CHIP, name === variant ? PICKED : UNPICKED)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {cases.length > 1 && variant && (
        <Select value={String(caseIndex)} onValueChange={(next) => onPick(variant, Number(next))}>
          <SelectTrigger
            aria-label="case"
            className={cn(cases[caseIndex]?.passed === false && 'border-fail/40 text-fail')}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cases.map((item, position) => (
              <SelectItem key={`${item.label}-${position}`} value={String(position)}>
                {item.passed ? item.label : `failing · ${item.label}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );

  const renderShell = (body: React.ReactNode) => (
    <div className="@container/panel flex h-full min-h-0 flex-col">
      {renderPickers()}
      {body}
    </div>
  );

  const renderNotice = (icon: React.ReactNode, title: string, body: string, tone: string) =>
    renderShell(<PanelNotice icon={icon} title={title} body={body} tone={tone} />);

  const renderTimeline = () => (
    <div className="relative border-b border-line px-3 pt-2 pb-1">
      <div aria-hidden className="flex h-4 items-end gap-px">
        {ticks.map((tick) => (
          <span
            key={tick.position}
            className={cn('h-full flex-1 rounded-[1px]', TICK[tick.kind], tick.hit ? 'opacity-100' : 'opacity-20')}
          />
        ))}
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(last, 0)}
        value={index}
        aria-label="step"
        aria-valuetext={`step ${index + 1} of ${steps.length}`}
        onChange={(event) => move(Number(event.target.value))}
        className="trace-timeline absolute inset-x-3 top-2 h-4"
      />
    </div>
  );

  const renderTransport = () => (
    <div
      role="group"
      aria-label="playback"
      onKeyDown={handleKeys}
      className="flex items-center gap-1 border-b border-line px-3 py-1.5"
    >
      <Button variant="ghost" size="icon-xs" aria-label="first step" disabled={index === 0} onClick={() => move(0)}>
        <SkipBack />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="previous step"
        disabled={index === 0}
        onClick={() => setIndex(seek(index, -1))}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={playing ? 'pause' : 'play'}
        onClick={() => setPlaying((on) => !on)}
      >
        {playing ? <Pause /> : <Play />}
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="next step"
        disabled={index === last}
        onClick={() => setIndex(seek(index, 1))}
      >
        <ChevronRight />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="last step"
        disabled={index === last}
        onClick={() => move(last)}
      >
        <SkipForward />
      </Button>

      <Button
        variant="ghost"
        size="xs"
        aria-label={`playback speed ${speed} times`}
        onClick={() => setSpeed((now) => SPEEDS[(SPEEDS.indexOf(now) + 1) % SPEEDS.length])}
        className="font-mono text-[10px] text-muted-foreground"
      >
        {speed}&times;
      </Button>

      {watching && (
        <button
          type="button"
          onClick={() => setWatching(null)}
          title={`Stop watching ${watching}`}
          className={cn(CHIP, 'flex items-center gap-1 border-primary/40 bg-primary/10 text-primary')}
        >
          <Eye className="size-2.5" />
          {watching}
          <X className="size-2.5" />
        </button>
      )}

      <span className="ml-auto hidden font-mono text-[10px] text-muted-foreground/60 @min-[30rem]/panel:inline">
        &larr;/&rarr; step &middot; space play
      </span>

      <span className="shrink-0 pl-2 font-mono text-[11px] tabular-nums text-muted-foreground">
        {index + 1} / {steps.length}
      </span>
    </div>
  );

  const renderCall = (report: TraceResult) => {
    const green = cases[report.caseIndex]?.passed ?? true;
    const returns = report.result !== null && report.result !== 'undefined';

    return (
      <section
        className={cn(
          'flex items-start gap-3 rounded-2xl border p-3',
          green ? 'border-line bg-panel/60' : 'border-fail/30 bg-fail/[0.05]',
        )}
      >
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-lg',
            green ? 'bg-pass/15 text-pass' : 'bg-fail/15 text-fail',
          )}
        >
          {green ? <Check className="size-3.5" /> : <X className="size-3.5" />}
        </span>

        <div className="min-w-0 flex-1 space-y-0.5 font-mono text-[11px]">
          <p className="break-all text-foreground/90">
            {report.variant}({report.args.join(', ')})
            {returns && (
              <>
                <span aria-hidden className="px-1.5 text-muted-foreground/60">
                  &rarr;
                </span>
                <span className={green ? 'text-foreground' : 'text-fail'}>{report.result}</span>
              </>
            )}
          </p>
          {!green && report.expect !== null && (
            <p className="break-all text-muted-foreground">
              should be <span className="text-pass">{report.expect}</span>
            </p>
          )}
          {!returns && <p className="text-muted-foreground">returns nothing; watch the arguments change</p>}
        </div>
      </section>
    );
  };

  if (tracing) {
    return renderNotice(
      <Radar className="size-6 animate-pulse text-primary" />,
      'Recording',
      'Running your solution one step at a time, on a single worked example.',
      'border-primary/25 bg-primary/[0.04]',
    );
  }

  if (!trace) {
    return renderNotice(
      <Radar className="size-6 text-muted-foreground" />,
      variants.length === 0 ? 'No run yet' : 'Ready when you are',
      variants.length === 0
        ? 'Run it once first, so the tracer knows which export to follow.'
        : 'Press Simulate to watch every line run, with every variable as it was at that moment.',
      'border-line bg-panel/60',
    );
  }

  if (trace.status === 'unsupported') {
    return renderNotice(
      <CircleSlash className="size-6 text-muted-foreground" />,
      'Not traceable yet',
      trace.message ?? '',
      'border-line bg-panel/60',
    );
  }

  if (trace.status === 'uninstrumentable') {
    return renderNotice(
      <AlertTriangle className="size-6 text-fail" />,
      'Could not read your file',
      trace.message ?? '',
      'border-fail/30 bg-fail/[0.05]',
    );
  }

  if (trace.status === 'stalled') {
    return renderNotice(
      <Clock className="size-6 text-fail" />,
      'Timed out',
      trace.message ?? 'A loop is not ending - check the condition that should stop it.',
      'border-fail/30 bg-fail/[0.05]',
    );
  }

  if (trace.status === 'crashed') {
    return renderNotice(
      <AlertTriangle className="size-6 text-fail" />,
      'The tracer crashed',
      trace.message ?? '',
      'border-fail/30 bg-fail/[0.05]',
    );
  }

  if (steps.length === 0) {
    return renderNotice(
      <CircleSlash className="size-6 text-muted-foreground" />,
      'Nothing to show',
      trace.message ?? 'This solution hands its work to built-ins, so it has no steps of its own to replay.',
      'border-line bg-panel/60',
    );
  }

  return renderShell(
    <>
      {renderTimeline()}
      {renderTransport()}

      <ScrollArea className="min-h-0 flex-1">
        <div className="@container/body space-y-2.5 p-3">
          {renderCall(trace)}

          <div className="grid items-start gap-2.5 @min-[44rem]/body:grid-cols-2">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.12 }}
              className="sticky top-0 z-10"
            >
              {current && <TraceExpression step={current} pass={passes[index] ?? null} onJumpLine={jumpTo} />}
            </motion.div>

            {current && <TraceStage step={current} changes={changes} watching={watching} onWatch={setWatching} />}
          </div>

          {trace.status === 'threw' && (
            <p className="rounded-xl border border-fail/30 bg-fail/[0.05] p-3 text-[11px] text-fail">
              It threw after the last step: {trace.message}
            </p>
          )}
          {trace.truncated && (
            <p className="rounded-xl border border-medium/25 bg-medium/[0.05] p-3 text-[11px] text-medium">
              The trace hit its step budget, so the rest was cut.
            </p>
          )}
        </div>
      </ScrollArea>
    </>,
  );
}
