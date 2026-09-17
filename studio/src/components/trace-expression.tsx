'use client';

import type { TraceKind, TraceStep } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TraceExpressionProps {
  step: TraceStep;
}

const LABEL: Record<TraceKind, string> = {
  stmt: 'statement',
  'loop-init': 'loop start',
  'loop-cond': 'loop test',
  'loop-update': 'loop step',
  cond: 'test',
  return: 'return',
};

const TONE: Record<TraceKind, string> = {
  stmt: 'border-cool/40 text-cool',
  'loop-init': 'border-medium/40 text-medium',
  'loop-cond': 'border-medium/40 text-medium',
  'loop-update': 'border-medium/40 text-medium',
  cond: 'border-primary/40 text-primary',
  return: 'border-pass/40 text-pass',
};

export function TraceExpression({ step }: TraceExpressionProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={cn('rounded border px-1.5 py-0.5 font-mono text-[10px]', TONE[step.kind])}>
          {LABEL[step.kind]}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">line {step.line}</span>
      </div>

      <div className="space-y-1">
        {step.chain.map((entry, index) => (
          <div key={index} className="flex items-start gap-2 font-mono text-[12px]">
            <span className="w-3 shrink-0 text-muted-foreground">{index > 0 ? '→' : ''}</span>
            <span
              className={cn(
                'break-all',
                index === step.chain.length - 1 ? 'text-foreground' : 'text-foreground/60',
              )}
            >
              {entry}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
