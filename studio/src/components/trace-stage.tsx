'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye } from 'lucide-react';
import type { TraceStep, TraceValue } from '@/lib/types';
import { canMiss, reachedIn, shortIndex, UNCHANGED, type StepChanges, type VarChange } from '@/lib/trace-view';
import type { Watched } from './trace-panel';
import { cn } from '@/lib/utils';

interface TraceStageProps {
  step: TraceStep;
  changes: StepChanges;
  /** How many times the run has reached each cell so far, by name and key. */
  covered: Record<string, Record<string, number>>;
  /** The same reaches in order, misses included, by name. */
  asked: Record<string, { key: string; write: boolean }[]>;
  watching: Watched | null;
  onWatch: (watched: Watched | null) => void;
}

/** Past this many entries a value is folded away unless this step is using it. */
const LONG = 24;

const sizeOf = (value: TraceValue) => {
  if (value.t === 'array' || value.t === 'list') return value.items.length;
  if (value.t === 'map') return value.entries.length;
  if (value.t === 'tree') return value.rows.flat().filter(Boolean).length;

  return 0;
};

const preview = (value: TraceValue) => {
  if (value.t === 'array') return value.items.slice(0, 12).join(', ');
  if (value.t === 'list') return value.items.slice(0, 12).join(' → ');
  if (value.t === 'map') return value.entries.slice(0, 6).map(([key, item]) => `${key} → ${item}`).join(', ');
  if (value.t === 'tree') return value.rows[0]?.filter(Boolean).join(', ') ?? '';

  return '';
};

export function TraceStage({ step, changes, covered, asked, watching, onWatch }: TraceStageProps) {
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

  const coverOf = (name: string, key: string | number) => covered[name]?.[String(key)] ?? 0;

  /**
   * A Set is reached by value and an array by position, so a cell's key is not
   * always its index. `show` quotes a string, and the key that reached it did
   * not, so the quotes come back off before the two are compared.
   */
  const cellKey = (isSet: boolean | undefined, index: number, item: string) =>
    isSet ? item.replace(/^'([\s\S]*)'$/, '$1') : String(index);

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

  /**
   * This step first, then the trail. A cell the run has already reached keeps a
   * faint mark, so the ground covered so far is visible without stepping back
   * through it - which is the whole shape of a two-pass or a walk-once solution.
   */
  const toneOf = (touch: ReturnType<typeof touchOf>, moved: boolean, seen = 0) => {
    if (moved) return 'border-primary/60 bg-primary/10 text-primary';
    if (touch?.write) return 'border-medium/60 bg-medium/15 text-medium';
    if (touch) return 'border-cool/60 bg-cool/15 text-cool';
    if (seen > 0) return 'border-line bg-foreground/[0.06] text-foreground/90';
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
        {value.items.map((item, index) => {
          const key = cellKey(value.set, index, item);
          const seen = coverOf(name, key);

          return (
          <div key={index} className="flex flex-col items-center">
            <span className="h-3 font-mono text-[9px] text-muted-foreground/70 line-through">
              {moved.has(index) ? (was?.[index] ?? '') : ''}
            </span>

            <button
              type="button"
              aria-pressed={watching?.name === name && watching.key === key}
              onClick={() =>
                onWatch(watching?.name === name && watching.key === key ? null : { name, key })
              }
              title={
                seen > 0
                  ? `${item} — reached ${seen} ${seen === 1 ? 'time' : 'times'}. Click to follow only those steps.`
                  : `${item} — click to follow only the steps that reach it`
              }
              className={cn(
                'flex min-w-10 max-w-28 flex-col items-center rounded-md border px-1.5 py-1 font-mono text-[11px] transition-colors',
                toneOf(touchOf(name, key), moved.has(index), seen),
                watching?.name === name && watching.key === key && 'ring-1 ring-primary/70',
              )}
            >
              <span className="w-full truncate text-center">{item}</span>
              <span className="text-[9px] text-muted-foreground tabular-nums">{index}</span>
            </button>

            <span className="h-3.5 font-mono text-[9px] text-cool">
              {pointers.get(String(index))?.join(' ') ?? ''}
            </span>
          </div>
          );
        })}

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
        {value.entries.map(([key, item]) => {
          const seen = coverOf(name, key);
          const quiet = !moved.has(key) && !touchOf(name, key) && seen === 0;

          return (
          <button
            key={key}
            type="button"
            aria-pressed={watching?.name === name && watching.key === key}
            onClick={() => onWatch(watching?.name === name && watching.key === key ? null : { name, key })}
            title={
              seen > 0
                ? `reached ${seen} ${seen === 1 ? 'time' : 'times'}. Click to follow only those steps.`
                : 'Click to follow only the steps that reach it'
            }
            className={cn(
              'flex w-full items-center gap-2 rounded-md border px-2 py-0.5 text-left font-mono text-[11px] transition-colors',
              toneOf(touchOf(name, key), moved.has(key), seen),
              quiet && 'border-transparent',
              watching?.name === name && watching.key === key && 'ring-1 ring-primary/70',
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
          </button>
          );
        })}
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

  /** A chain, drawn as one: the arrows are the point, and a cycle is worth saying out loud. */
  const renderList = (value: Extract<TraceValue, { t: 'list' }>) => {
    if (value.items.length === 0) {
      return <p className="font-mono text-[11px] text-muted-foreground">null</p>;
    }

    return (
      <div className="flex flex-wrap items-center gap-1">
        {value.items.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <span
              title={item}
              className="flex min-w-10 items-center justify-center rounded-md border border-line px-2 py-1 font-mono text-[11px] text-foreground/90"
            >
              {item}
            </span>
            {(index < value.items.length - 1 || value.truncated || value.cyclic) && (
              <span aria-hidden className="text-[11px] text-muted-foreground">
                &rarr;
              </span>
            )}
          </div>
        ))}

        {value.truncated && <span className="text-[11px] text-muted-foreground">&hellip;</span>}
        {value.cyclic && (
          <span className="rounded-full border border-medium/40 bg-medium/10 px-2 py-0.5 text-[10px] text-medium">
            cycle
          </span>
        )}
      </div>
    );
  };

  /** Level order, holes kept, so a lopsided tree looks lopsided. */
  const renderTree = (value: Extract<TraceValue, { t: 'tree' }>) => {
    if (value.rows.length === 0) {
      return <p className="font-mono text-[11px] text-muted-foreground">null</p>;
    }

    return (
      <div className="space-y-1">
        {value.rows.map((row, level) => (
          <div key={level} className="flex justify-center gap-1">
            {row.map((item, index) => (
              <span
                key={index}
                title={item ?? 'empty'}
                className={cn(
                  'flex min-w-8 items-center justify-center rounded-md border px-1.5 py-0.5 font-mono text-[11px]',
                  item === null
                    ? 'border-dashed border-line/60 text-muted-foreground/40'
                    : 'border-line text-foreground/90',
                )}
              >
                {item ?? '·'}
              </span>
            ))}
          </div>
        ))}

        {value.truncated && <p className="text-center text-[10px] text-muted-foreground">deeper levels not drawn</p>}
      </div>
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

    if (value.t === 'list') return renderList(value);
    if (value.t === 'tree') return renderTree(value);

    return value.t === 'array' ? renderArray(name, value, change) : renderMap(name, value, change);
  };

  const STRIP = 28;

  /**
   * What was asked for, in order, hit or miss. Read left to right this is the
   * decision the loop keeps making - for a run walk it reads miss, hit, hit,
   * hit, miss, and that shape is the algorithm.
   */
  const renderAsked = (name: string, value: TraceValue) => {
    const order = asked[name];
    if (!order || order.length === 0) return null;

    const reached = reachedIn(value);
    const missable = canMiss(value);
    const shown = order.slice(-STRIP);

    return (
      <div className="mt-1 flex flex-wrap items-center gap-1">
        <span className="font-mono text-[9px] tracking-wide text-muted-foreground/70 uppercase">
          asked for
        </span>

        {order.length > STRIP && <span className="text-[9px] text-muted-foreground/60">&hellip;</span>}

        {shown.map((one, position) => {
          const hit = reached(one.key);

          return (
            <span
              key={`${one.key}-${position}`}
              title={hit ? `${one.key} — found` : `${one.key} — not there`}
              className={cn(
                'rounded border px-1 font-mono text-[9px] tabular-nums',
                one.write
                  ? 'border-medium/50 bg-medium/10 text-medium'
                  : hit || !missable
                    ? 'border-cool/50 bg-cool/10 text-cool'
                    : 'border-line text-muted-foreground/70 line-through',
              )}
            >
              {one.key}
            </span>
          );
        })}
      </div>
    );
  };

  const renderLegend = () => {
    const trail = Object.keys(covered).length > 0;
    if (step.touched.length === 0 && !trail) return null;

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
        {trail && (
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm border border-line bg-foreground/[0.06]" />
            reached already
          </span>
        )}
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
            onClick={() => onWatch(watching?.name === name && watching.key === null ? null : { name, key: null })}
            title={watching?.name === name && watching.key === null ? `Stop watching ${name}` : `Step only where ${name} changes`}
            className={cn(
              'flex items-center gap-1 rounded font-mono text-[10px] tracking-wide transition-colors',
              watching?.name === name && watching.key === null ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {watching?.name === name && watching.key === null && <Eye className="size-2.5" />}
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

        <dd>
          {renderValue(name, value, change, folded)}
          {!folded && renderAsked(name, value)}
        </dd>
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
