'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ChevronsRight } from 'lucide-react';
import type { TraceKind, TraceStep } from '@/lib/types';
import { consequenceOf, type LoopPass } from '@/lib/trace-view';
import { cn } from '@/lib/utils';

interface TraceExpressionProps {
  step: TraceStep;
  pass: LoopPass | null;
  onJumpLine: (line: number) => void;
}

/** Dictionary keys, looked up where they are drawn. */
const LABEL: Record<TraceKind, string> = {
  call: 'trace.kindCall',
  stmt: 'trace.kindStmt',
  'loop-init': 'trace.kindLoopInit',
  'loop-cond': 'trace.kindLoopCond',
  'loop-update': 'trace.kindLoopUpdate',
  cond: 'trace.kindCond',
  return: 'trace.kindReturn',
};

const TONE: Record<TraceKind, string> = {
  call: 'border-hot/30 bg-hot/10 text-hot',
  stmt: 'border-cool/30 bg-cool/10 text-cool',
  'loop-init': 'border-medium/30 bg-medium/10 text-medium',
  'loop-cond': 'border-medium/30 bg-medium/10 text-medium',
  'loop-update': 'border-medium/30 bg-medium/10 text-medium',
  cond: 'border-primary/30 bg-primary/10 text-primary',
  return: 'border-pass/30 bg-pass/10 text-pass',
};

export function TraceExpression({ step, pass, onJumpLine }: TraceExpressionProps) {
  const { t } = useTranslation();
  const consequence = consequenceOf(step);

  const renderRow = (entry: string, index: number) => {
    const last = index === step.chain.length - 1;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04, duration: 0.14 }}
        className={cn(
          'flex items-start gap-2 rounded-lg px-2 py-1 font-mono text-[12px]',
          last && 'bg-white/[0.04]',
        )}
      >
        <span aria-hidden className="w-3 shrink-0 text-muted-foreground/70">
          {index > 0 ? '→' : ''}
        </span>
        <span className={cn('break-all', last ? 'font-medium text-foreground' : 'text-foreground/55')}>
          {entry}
        </span>
      </motion.div>
    );
  };

  const renderPass = () => {
    if (!pass) return null;

    return (
      <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
        {pass.ending ? t('trace.loopEnds') : t('trace.loopPass', { pass: pass.pass, total: pass.total })}
      </span>
    );
  };

  return (
    <section className="surface rounded-2xl border border-line p-3">
      <header className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide',
            TONE[step.kind],
          )}
        >
          {t(LABEL[step.kind])}
        </span>

        {step.fn && (
          <span className="font-mono text-[10px] text-muted-foreground/70">{step.fn}()</span>
        )}

        {step.depth > 1 && (
          <span
            title={t('trace.depthHint')}
            className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {t('trace.depth', { depth: step.depth })}
          </span>
        )}

        <button
          type="button"
          onClick={() => onJumpLine(step.line)}
          title={t('trace.jumpLine', { line: step.line })}
          className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground transition-colors hover:text-primary"
        >
          {t('trace.line', { line: step.line })}
          <ChevronsRight className="size-3" />
        </button>

        {renderPass()}

        {step.changed && (
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            {t('trace.sets')} <span className="text-foreground/80">{step.changed}</span>
          </span>
        )}
      </header>

      <div className="space-y-0.5">{step.chain.map(renderRow)}</div>

      {consequence && (
        <p className="mt-2 border-t border-line pt-2 text-[11px] text-muted-foreground">{consequence}</p>
      )}
    </section>
  );
}
