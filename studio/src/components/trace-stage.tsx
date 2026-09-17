'use client';

import type { TraceStep, TraceValue } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TraceStageProps {
  step: TraceStep;
}

const touchedKey = (step: TraceStep, name: string, key: string | number) =>
  step.touched.find((entry) => entry.name === name && String(entry.key) === String(key));

function renderValue(name: string, value: TraceValue, step: TraceStep, changed: boolean) {
  if (value.t === 'array') {
    return (
      <div className="flex flex-wrap gap-1">
        {value.items.map((item, index) => {
          const hit = touchedKey(step, name, index);
          return (
            <div
              key={index}
              className={cn(
                'flex w-11 flex-col items-center rounded-md border px-1 py-1 font-mono text-[11px]',
                hit?.write
                  ? 'border-medium/60 bg-medium/10'
                  : hit
                    ? 'border-cool/60 bg-cool/10'
                    : 'border-line',
              )}
            >
              <span className="text-foreground/90">{item}</span>
              <span className="text-[10px] text-muted-foreground">{index}</span>
            </div>
          );
        })}
        {value.truncated && <span className="self-center text-[11px] text-muted-foreground">&hellip;</span>}
      </div>
    );
  }

  if (value.t === 'map') {
    if (value.entries.length === 0) {
      return <p className="font-mono text-[11px] text-muted-foreground">empty</p>;
    }
    return (
      <div className="space-y-0.5">
        {value.entries.map(([key, item]) => (
          <div
            key={key}
            className={cn(
              'flex gap-2 rounded px-1.5 py-0.5 font-mono text-[11px]',
              touchedKey(step, name, key) && 'bg-cool/10',
            )}
          >
            <span className="text-foreground/90">{key}</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="text-foreground/70">{item}</span>
          </div>
        ))}
        {value.truncated && <span className="text-[11px] text-muted-foreground">&hellip;</span>}
      </div>
    );
  }

  return (
    <span className={cn('font-mono text-[11px]', changed ? 'text-foreground' : 'text-foreground/70')}>
      {value.text}
    </span>
  );
}

export function TraceStage({ step }: TraceStageProps) {
  const names = Object.keys(step.vars);

  if (names.length === 0) {
    return <p className="text-[11px] text-muted-foreground">no variables in scope here</p>;
  }

  return (
    <dl className="space-y-2">
      {names.map((name) => (
        <div key={name} className={cn('rounded-lg px-2 py-1.5', step.changed === name && 'bg-medium/[0.07]')}>
          <dt className="mb-1 font-mono text-[10px] tracking-wide text-muted-foreground">{name}</dt>
          <dd>{renderValue(name, step.vars[name], step, step.changed === name)}</dd>
        </div>
      ))}
    </dl>
  );
}
