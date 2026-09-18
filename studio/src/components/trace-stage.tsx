'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye } from 'lucide-react';
import type { TraceStep, TraceValue } from '@/lib/types';
import { shortIndex, UNCHANGED, type StepChanges, type VarChange } from '@/lib/trace-view';
import { cn } from '@/lib/utils';

interface TraceStageProps {
  step: TraceStep;
  changes: StepChanges;
  watching: string | null;
  onWatch: (name: string | null) => void;
}

/** Past this many entries a value is folded away unless this step is using it. */
const LONG = 24;

const sizeOf = (value: TraceValue) =>
  value.t === 'array' ? value.items.length : value.t === 'map' ? value.entries.length : 0;

const preview = (value: TraceValue) =>
  value.t === 'array'
    ? value.items.slice(0, 12).join(', ')
    : value.t === 'map'
      ? value.entries.slice(0, 6).map(([key, item]) => `${key} → ${item}`).join(', ')
      : '';

export function TraceStage({ step, changes, watching, onWatch }: TraceStageProps) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const names = Object.keys(step.vars);

  if (names.length === 0) {
    return (
      <section className="rounded-2xl border border-line bg-panel/60 p-3">
        <p className="text-[11px] text-muted-foreground">Nothing is in scope at this point.</p>
      </section>
    );
  }

  const touchOf = (name: string, key: string | number) =>
    step.touched.find((touch) => touch.name === name && String(touch.key) === String(key));

  /** Which of a value's cells an index the student named is pointing at. */
  const pointersOf = (name: string) => {
    const out = new Map<string, string[]>();

    for (const touch of step.touched) {
      if (touch.name !== name) continue;
      const label = shortIndex(touch.from);
      if (!label) continue;

      const key = String(touch.key);
      out.set(key, [...new Set([...(out.get(key) ?? []), label])]);
    }

    return out;
  };

  const toneOf = (touch: ReturnType<typeof touchOf>, moved: boolean) => {
    if (moved) return 'border-primary/60 bg-primary/10 text-primary';
    if (touch?.write) return 'border-medium/60 bg-medium/15 text-medium';
    if (touch) return 'border-cool/60 bg-cool/15 text-cool';
    return 'border-line text-foreground/90';
  };

  const renderArray = (name: string, value: Extract<TraceValue, { t: 'array' }>, change: VarChange) => {
    const pointers = pointersOf(name);
    const moved = new Set(change.cells);
    const was = change.before?.t === 'array' ? change.before.items : null;

    if (value.items.length === 0) {
      return <p className="font-mono text-[11px] text-muted-foreground">empty</p>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {value.items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="h-3 font-mono text-[9px] text-muted-foreground/70 line-through">
              {moved.has(index) ? (was?.[index] ?? '') : ''}
            </span>

            <div
              title={item}
              className={cn(
                'flex min-w-10 max-w-28 flex-col items-center rounded-md border px-1.5 py-1 font-mono text-[11px] transition-colors',
                toneOf(touchOf(name, index), moved.has(index)),
              )}
            >
              <span className="w-full truncate text-center">{item}</span>
              <span className="text-[9px] text-muted-foreground tabular-nums">{index}</span>
            </div>

            <span className="h-3.5 font-mono text-[9px] text-cool">
              {pointers.get(String(index))?.join(' ') ?? ''}
            </span>
          </div>
        ))}

        {value.truncated && <span className="self-center text-[11px] text-muted-foreground">&hellip;</span>}
      </div>
    );
  };

  const renderMap = (name: string, value: Extract<TraceValue, { t: 'map' }>, change: VarChange) => {
    if (value.entries.length === 0) {
      return <p className="font-mono text-[11px] text-muted-foreground">empty</p>;
    }

    const moved = new Set(change.keys);
    const was = change.before?.t === 'map' ? new Map(change.before.entries) : null;

    return (
      <div className="space-y-0.5">
        {value.entries.map(([key, item]) => (
          <div
            key={key}
            className={cn(
              'flex items-center gap-2 rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors',
              toneOf(touchOf(name, key), moved.has(key)),
              !moved.has(key) && !touchOf(name, key) && 'border-transparent',
            )}
          >
            <span className="text-foreground/90">{key}</span>
            <span aria-hidden className="text-muted-foreground/60">
              &rarr;
            </span>
            {moved.has(key) && was?.get(key) !== undefined && (
              <span className="text-[10px] text-muted-foreground/70 line-through">{was.get(key)}</span>
            )}
            <span className="break-all text-foreground/70">{item}</span>
          </div>
        ))}
        {value.truncated && <span className="text-[11px] text-muted-foreground">&hellip;</span>}
      </div>
    );
  };

  const renderSummary = (value: TraceValue, change: VarChange) => {
    if (value.t !== 'scalar') {
      return <span className="font-mono text-[10px] text-muted-foreground">{sizeOf(value)} items</span>;
    }

    return (
      <span className="font-mono text-[11px]">
        {change.before?.t === 'scalar' && (
          <>
            <span className="text-muted-foreground/70">{change.before.text}</span>
            <span aria-hidden className="px-1 text-muted-foreground/50">
              &rarr;
            </span>
          </>
        )}
        <span className={change.changed ? 'text-primary' : 'text-foreground/80'}>{value.text}</span>
      </span>
    );
  };

  const renderValue = (name: string, value: TraceValue, change: VarChange, folded: boolean) => {
    if (value.t === 'scalar') return null;

    if (folded) {
      return (
        <p className="truncate font-mono text-[11px] text-muted-foreground/70">
          {preview(value)} &hellip;
        </p>
      );
    }

    return value.t === 'array' ? renderArray(name, value, change) : renderMap(name, value, change);
  };

  const renderLegend = () => {
    if (step.touched.length === 0) return null;

    return (
      <p className="ml-auto flex items-center gap-2 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-sm border border-cool/60 bg-cool/15" />
          read
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-sm border border-medium/60 bg-medium/15" />
          written
        </span>
      </p>
    );
  };

  const renderRow = (name: string) => {
    const value = step.vars[name];
    const change = changes[name] ?? UNCHANGED;
    const busy = change.changed || step.touched.some((touch) => touch.name === name);
    const long = sizeOf(value) > LONG;
    const open = opened[name] ?? false;
    const folded = long && !busy && !open;

    return (
      <div
        key={name}
        className={cn(
          'rounded-lg border px-2 py-1.5 transition-colors',
          change.changed ? 'border-primary/30 bg-primary/[0.06]' : 'border-transparent',
        )}
      >
        <dt className="mb-1 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onWatch(watching === name ? null : name)}
            title={watching === name ? `Stop watching ${name}` : `Step only where ${name} changes`}
            className={cn(
              'flex items-center gap-1 rounded font-mono text-[10px] tracking-wide transition-colors',
              watching === name ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {watching === name && <Eye className="size-2.5" />}
            {name}
          </button>

          {long && (
            <button
              type="button"
              aria-label={folded ? `expand ${name}` : `collapse ${name}`}
              onClick={() => setOpened((current) => ({ ...current, [name]: folded }))}
              className="text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {folded ? <ChevronRight className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
          )}

          <span className="ml-auto">{renderSummary(value, change)}</span>
        </dt>

        <dd>{renderValue(name, value, change, folded)}</dd>
      </div>
    );
  };

  return (
    <section className="rounded-2xl border border-line bg-panel/60 p-3">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">in scope here</p>
        {renderLegend()}
      </div>

      <dl className="space-y-1">{names.map(renderRow)}</dl>
    </section>
  );
}
