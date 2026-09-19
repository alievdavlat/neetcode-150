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
  Pencil,
  Radar,
  Sigma,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PanelNotice } from './panel-notice';
import { TraceExpression } from './trace-expression';
import { TraceStage } from './trace-stage';
import type { OperationProbe, TraceKind, TraceResult } from '@/lib/types';
import { changesOf, passesOf, stepsChanging, stepsTouching } from '@/lib/trace-view';
import { cn } from '@/lib/utils';

interface TraceCase {
  label: string;
  passed: boolean;
}

interface TracePanelProps {
  trace: TraceResult | null;
  tracing: boolean;
  ops: OperationProbe | null;
  counting: boolean;
  variants: string[];
  cases: TraceCase[];
  variant: string | null;
  caseIndex: number;
  jumpLine: { line: number; at: number } | null;
  onPick: (variant: string, caseIndex: number) => void;
  onTrace: (input?: unknown[]) => void;
  onCount: () => void;
  onStep: (line: number | null) => void;
}

const PLAY_MS = 700;
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4];
const SPEED_KEY = 'neetcode-studio:play-speed';
const COLUMNS = 240;

/** `1` is the speed the replay was written at, so it reads as a word, not a number. */
const speedLabel = (value: number) => (value === 1 ? 'Normal' : `${value}×`);

/** A name on its own, or one cell of it. */
export interface Watched {
  name: string;
  key: string | null;
}

const labelOf = (watched: Watched) => (watched.key === null ? watched.name : `${watched.name}[${watched.key}]`);

const CHIP = 'rounded-full border px-2 py-0.5 font-mono text-[10px] transition-colors';

const PICKED = 'border-primary/40 bg-primary/10 text-primary';
const UNPICKED = 'border-line text-muted-foreground hover:border-primary/30 hover:text-foreground';

const TICK: Record<TraceKind, string> = {
  call: 'bg-hot/70',
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
  ops,
  counting,
  variants,
  cases,
  variant,
  caseIndex,
  jumpLine,
  onPick,
  onTrace,
  onCount,
  onStep,
}: TracePanelProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [watching, setWatching] = useState<Watched | null>(null);
  const [only, setOnly] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [badInput, setBadInput] = useState<string | null>(null);

  const steps = useMemo(() => trace?.steps ?? [], [trace]);
  const current = steps[index] ?? null;
  const last = steps.length - 1;

  const at = useRef(0);
  useEffect(() => {
    at.current = index;
  }, [index]);

  const passes = useMemo(() => passesOf(steps), [steps]);

  /** The functions this replay walked through; a case may run more than one. */
  const walked = useMemo(
    () => [...new Set(steps.map((step) => step.fn).filter((name): name is string => Boolean(name)))],
    [steps],
  );

  /**
   * Which steps the transport is allowed to land on: the ones that change the
   * watched variable, inside the function being followed, or both.
   */
  const marks = useMemo(() => {
    const changing = watching
      ? watching.key === null
        ? stepsChanging(steps, watching.name)
        : stepsTouching(steps, watching.name, watching.key)
      : null;
    if (!only) return changing;

    return steps.map((step, position) => step.fn === only && (changing === null || changing[position]));
  }, [steps, watching, only]);
  const changes = useMemo(
    () => (current ? changesOf(current, steps[index - 1] ?? null) : {}),
    [current, index, steps],
  );

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
    setWatching(null);
    setOnly(null);
  }, [trace]);

  /** The box starts as whatever was just run, so an edit is a change to that. */
  useEffect(() => {
    if (trace?.input) setInput(trace.input);
  }, [trace?.input]);

  /** Following one function should land on it rather than wait for the next step. */
  useEffect(() => {
    if (!only) return;

    setIndex((position) => {
      if (steps[position]?.fn === only) return position;

      const found = steps.findIndex((step) => step.fn === only);
      return found === -1 ? position : found;
    });
  }, [only, steps]);

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

  /**
   * How fast a replay reads is a preference, not a property of one trace, so it
   * is remembered the way the Big-O toggle is. Read after mount rather than in
   * the initial state, which the server has no way to match.
   */
  useEffect(() => {
    const stored = Number(window.localStorage.getItem(SPEED_KEY));
    if (SPEEDS.includes(stored)) setSpeed(stored);
  }, []);

  const pickSpeed = (next: number) => {
    window.localStorage.setItem(SPEED_KEY, String(next));
    setSpeed(next);
    setSpeedOpen(false);
  };

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

  /**
   * The speed menu is portalled, but a portal still bubbles through the React
   * tree, so its own space and arrow keys would reach the transport and step the
   * replay behind the open menu.
   */
  const handleKeys = (event: React.KeyboardEvent) => {
    if (speedOpen) return;

    if (event.key === 'ArrowLeft') setIndex(seek(index, -1));
    else if (event.key === 'ArrowRight') setIndex(seek(index, 1));
    else if (event.key === ' ') setPlaying((on) => !on);
    else return;

    event.preventDefault();
  };

  /**
   * Every cell the run has reached up to this step, and how often. The step says
   * what is happening now; the trail says what has been covered, and that is
   * where the shape of a solution shows - two passes filling an array from
   * opposite ends, or a set whose every member is asked about exactly once.
   */
  const covered = useMemo(() => {
    const seen: Record<string, Record<string, number>> = {};

    for (const step of steps.slice(0, index + 1)) {
      for (const touch of step.touched) {
        const keys = (seen[touch.name] ??= {});
        const key = String(touch.key);
        keys[key] = (keys[key] ?? 0) + 1;
      }
    }

    return seen;
  }, [steps, index]);

  /**
   * The same reaches, in order and including the ones that found nothing. A
   * miss leaves no cell to shade, and for a hash solution the misses are the
   * decisions: `set.has(num - 1)` coming back empty is what makes num the start
   * of a run. Marking only the hits would hide the half that matters.
   */
  const asked = useMemo(() => {
    const order: Record<string, { key: string; write: boolean }[]> = {};

    for (const step of steps.slice(0, index + 1)) {
      for (const touch of step.touched) {
        (order[touch.name] ??= []).push({ key: String(touch.key), write: touch.write });
      }
    }

    return order;
  }, [steps, index]);

  const ticks = useMemo(() => {
    if (steps.length === 0) return [];

    const columns = Math.min(steps.length, COLUMNS);
    return Array.from({ length: columns }, (_, column) => {
      const position = Math.floor((column * steps.length) / columns);
      return { position, kind: steps[position].kind, hit: marks ? marks[position] : true };
    });
  }, [steps, marks]);

  const handleCustom = () => {
    try {
      const parsed = JSON.parse(input) as unknown;
      if (!Array.isArray(parsed)) throw new Error('the input is the argument list, so it must be an array');

      setBadInput(null);
      onTrace(parsed);
    } catch (error) {
      setBadInput(error instanceof Error ? error.message : String(error));
    }
  };

  /**
   * Your own example, run through the same recorder. It has no expected answer,
   * so the panel shows what happened and judges nothing.
   */
  const renderInput = () => (
    <div className="space-y-1.5 rounded-lg border border-line bg-black/20 p-2">
      <Textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        spellCheck={false}
        aria-label="Arguments as JSON"
        className="min-h-14 bg-transparent font-mono text-[11px]"
      />

      {badInput && <p className="text-[11px] text-fail">{badInput}</p>}

      <div className="flex items-center gap-2">
        <Button size="xs" onClick={handleCustom} disabled={tracing || !variant} className="gap-1.5">
          <Radar className={cn(tracing && 'animate-pulse')} />
          Simulate this
        </Button>

        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setBadInput(null);
            if (trace?.custom) onTrace();
          }}
          className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          back to the case
        </button>

        <span className="ml-auto font-mono text-[10px] text-muted-foreground">the argument list, as JSON</span>
      </div>
    </div>
  );

  /**
   * Counting is exact where the clock is not: the run probe cannot separate
   * O(n) from O(n log n), and this can. It only sees the student's own
   * statements, so work handed to a built-in is reported as exactly that.
   */
  const renderOps = () => {
    if (!ops) return null;

    const rows = ops.points.map((point) => `${point.n}: ${point.ops.toLocaleString()}`).join('  ·  ');

    return (
      <div className="space-y-1 rounded-lg border border-line bg-black/20 p-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            operations
          </span>

          {ops.verdict && (
            <span className="rounded-full border border-hot/40 bg-hot/10 px-2 py-0.5 font-mono text-[10px] text-hot">
              {ops.verdict}
            </span>
          )}

          {ops.target && (
            <span className="font-mono text-[10px] text-muted-foreground">
              target {ops.target}
              {ops.comparison === 'match' && <span className="ml-1 text-pass">matches</span>}
              {ops.comparison === 'differs' && <span className="ml-1 text-fail">differs</span>}
            </span>
          )}
        </div>

        {ops.points.length > 0 && <p className="font-mono text-[10px] text-muted-foreground">{rows}</p>}
        {ops.message && <p className="text-[11px] text-muted-foreground">{ops.message}</p>}
      </div>
    );
  };

  const renderPickers = () => (
    <div className="space-y-1.5 border-b border-line px-3 py-2">
      <div className="flex items-center gap-2">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          simulation
        </p>

        {trace?.custom && (
          <span className="rounded-full border border-cool/40 bg-cool/10 px-2 py-0.5 text-[10px] text-cool">
            your input · not judged
          </span>
        )}

        {trace && (
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            aria-pressed={editing}
            title="Run this variant on an input you type"
            className={cn('ml-auto flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] transition-colors', editing ? 'border-cool/40 bg-cool/10 text-cool' : 'border-line text-muted-foreground hover:border-cool/40 hover:text-foreground')}
          >
            <Pencil className="size-3" />
            Input
          </button>
        )}

        <Button
          variant="outline"
          size="xs"
          onClick={onCount}
          disabled={counting || !variant}
          title="Count the statements this variant runs as the input doubles"
          className="gap-1.5"
        >
          <Sigma className={cn(counting && 'animate-pulse')} />
          {counting ? 'Counting' : 'Ops'}
        </Button>

        <Button
          size="xs"
          onClick={() => onTrace()}
          disabled={tracing || !variant}
          className={cn('gap-1.5', !trace && 'ml-auto')}
        >
          <Radar className={cn(tracing && 'animate-pulse')} />
          {tracing ? 'Recording' : 'Simulate'}
        </Button>
      </div>

      {editing && renderInput()}
      {renderOps()}

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

      {walked.length > 1 && (
        <span role="group" aria-label="follow one function" className="ml-2 flex items-center gap-1">
          {walked.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={only === name}
              onClick={() => setOnly(only === name ? null : name)}
              title={only === name ? `Step through every function again` : `Step only through ${name}`}
              className={cn(
                'rounded-full border px-2 py-0.5 font-mono text-[10px] transition-colors',
                only === name
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-line text-muted-foreground hover:border-white/20 hover:text-foreground',
              )}
            >
              {name}
            </button>
          ))}
        </span>
      )}

      <Popover open={speedOpen} onOpenChange={setSpeedOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="xs"
            aria-label={`playback speed, ${speedLabel(speed)}`}
            title="Playback speed"
            className="font-mono text-[10px] text-muted-foreground"
          >
            {speed}&times;
          </Button>
        </PopoverTrigger>

        <PopoverContent side="top" align="end" className="w-28 p-1">
          <p className="px-2 pb-1 pt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">Speed</p>

          {SPEEDS.map((value) => (
            <button
              key={value}
              type="button"
              aria-current={value === speed}
              onClick={() => pickSpeed(value)}
              className={cn(
                'flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left font-mono text-[11px] transition-colors',
                value === speed
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-line/50 hover:text-foreground',
              )}
            >
              <Check className={cn('size-3 shrink-0', value === speed ? 'opacity-100' : 'opacity-0')} />
              {speedLabel(value)}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {watching && (
        <button
          type="button"
          onClick={() => setWatching(null)}
          title={`Stop following ${labelOf(watching)}`}
          className={cn(CHIP, 'flex items-center gap-1 border-primary/40 bg-primary/10 text-primary')}
        >
          <Eye className="size-2.5" />
          {labelOf(watching)}
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
    const green = report.passed ?? cases[report.caseIndex]?.passed ?? true;
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
          {!green && report.detail !== null && (
            <p className="break-all text-fail/90">{report.detail}</p>
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

            {current && <TraceStage
              step={current}
              changes={changes}
              covered={covered}
              asked={asked}
              watching={watching}
              onWatch={setWatching}
            />}
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
