'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ActivitySquare, AlertTriangle, Check, CircleSlash, Clock, SquareTerminal, Terminal, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComplexityChart, type ChartSeries } from './complexity-chart';
import { formatBytes, formatMs } from '@/lib/meta';
import type { RunCase, RunFailure, RunReport, RunVariant } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VerdictPanelProps {
  report: RunReport | null;
  running: boolean;
  bigO: boolean;
  problemTitle: string;
  onMeasure: () => void;
  onSnippet: (line: string) => void;
}

const FAILURE_LIMIT = 6;
const PASSED_LIMIT = 12;

const CARD = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function VerdictPanel({ report, running, bigO, problemTitle, onMeasure, onSnippet }: VerdictPanelProps) {
  const renderNotice = (icon: React.ReactNode, title: string, body: string, tone: string) => (
    <div className="flex h-full items-center justify-center p-8">
      <div className={cn('max-w-sm rounded-2xl border p-6 text-center', tone)}>
        <div className="mb-3 flex justify-center">{icon}</div>
        <p className="mb-1 font-heading text-sm font-semibold">{title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );

  const renderCase = (item: RunCase, index: number) => (
    <motion.li
      key={`${item.label}-${index}`}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3) }}
      className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]"
    >
      {item.passed ? (
        <Check className="mt-0.5 size-3 shrink-0 text-pass" aria-label="passed" />
      ) : (
        <X className="mt-0.5 size-3 shrink-0 text-fail" aria-label="failed" />
      )}
      <span className="w-40 shrink-0 truncate text-[11px] text-muted-foreground">{item.label}</span>
      {item.trace ? (
        <span className="flex-1 font-mono text-[11px] break-all text-foreground/70">{item.trace.join('  ')}</span>
      ) : (
        <span className="flex-1 font-mono text-[11px] break-all text-foreground/70">
          {item.input}
          <span className="px-1.5 text-muted-foreground/60">&rarr;</span>
          <span className="text-foreground/90">{item.output}</span>
        </span>
      )}
    </motion.li>
  );

  const renderFailure = (variantName: string) => (failure: RunFailure, index: number) => (
    <div key={`${failure.label}-${index}`} className="rounded-xl border border-fail/25 bg-fail/[0.05] p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-fail">
          <X className="size-3" />
          {failure.label}
        </p>
        <button
          type="button"
          onClick={() =>
            onSnippet(
              `console.log(${variantName}(${failure.input}));${failure.expected ? ` // should be ${failure.expected}` : ''}`,
            )
          }
          className="ml-auto rounded-md border border-line px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          add console.log
        </button>
      </div>

      <dl className="space-y-1.5 font-mono text-[11px]">
        <div className="flex gap-2">
          <dt className="w-28 shrink-0 text-muted-foreground">Input</dt>
          <dd className="break-all text-foreground/80">{failure.input}</dd>
        </div>
        {failure.thrown ? (
          <div className="flex gap-2">
            <dt className="w-28 shrink-0 text-muted-foreground">It threw</dt>
            <dd className="break-all text-fail">{failure.thrown}</dd>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-fail/80">Your output</dt>
              <dd className="break-all font-medium text-fail">{failure.got}</dd>
            </div>
            {failure.expected !== null && (
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 text-pass/80">Output should be</dt>
                <dd className="break-all font-medium text-pass">{failure.expected}</dd>
              </div>
            )}
          </>
        )}
        {failure.detail && (
          <div className="flex gap-2">
            <dt className="w-28 shrink-0 text-muted-foreground">Note</dt>
            <dd className="break-all text-muted-foreground">{failure.detail}</dd>
          </div>
        )}
      </dl>
    </div>
  );

  const renderMeasurePrompt = (green: boolean) => {
    if (!green) {
      return (
        <p className="rounded-xl border border-line bg-black/20 px-3 py-2 text-[11px] text-muted-foreground">
          Big-O is measured only once every case passes.
        </p>
      );
    }

    return (
      <button
        type="button"
        onClick={onMeasure}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line px-3 py-2 text-[11px] text-muted-foreground transition-colors hover:border-hot/40 hover:text-hot"
      >
        <ActivitySquare className="size-3.5" />
        Measure Big-O — time it at doubling input sizes and draw the curve
      </button>
    );
  };

  const renderVariant = (variant: RunVariant, index: number, fastest: string | null) => {
    const green = variant.passed === variant.total;
    const passing = variant.cases.filter((item) => item.passed);

    return (
      <motion.section
        key={variant.name}
        variants={CARD}
        transition={{ delay: index * 0.06 }}
        className={cn('rounded-2xl border bg-panel/60 p-4', green ? 'border-pass/25' : 'border-fail/30')}
      >
        <header className="mb-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[13px] font-medium">{variant.name}</span>
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide',
              green ? 'border-pass/30 bg-pass/10 text-pass' : 'border-fail/30 bg-fail/10 text-fail',
            )}
          >
            {green ? 'PASS' : 'FAIL'} {variant.passed}/{variant.total}
          </span>
          {fastest === variant.name && (
            <span className="rounded-full border border-cool/30 bg-cool/10 px-2 py-0.5 text-[10px] text-cool">
              fastest
            </span>
          )}
          <span className="ml-auto flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span title="time for one call">{formatMs(variant.ms)}</span>
            <span title="heap growth across one call">{formatBytes(variant.heap)}</span>
            {variant.target && <span className="text-muted-foreground/70">target {variant.target}</span>}
          </span>
        </header>

        {variant.failures.length > 0 && (
          <div className="mb-3 space-y-2">
            {variant.failures.slice(0, FAILURE_LIMIT).map(renderFailure(variant.name))}
            {variant.failures.length > FAILURE_LIMIT && (
              <p className="px-1 text-[11px] text-muted-foreground">
                and {variant.failures.length - FAILURE_LIMIT} more failing cases
              </p>
            )}
          </div>
        )}

        <ul className="space-y-0.5">{passing.slice(0, PASSED_LIMIT).map(renderCase)}</ul>
        {passing.length > PASSED_LIMIT && (
          <p className="px-2 pt-1.5 text-[11px] text-muted-foreground">
            and {passing.length - PASSED_LIMIT} more cases passed
          </p>
        )}
      </motion.section>
    );
  };

  const renderReport = (current: RunReport) => {
    if (current.status === 'not-started') {
      return renderNotice(
        <CircleSlash className="size-6 text-muted-foreground" />,
        'Still a stub',
        'Every export throws "Not implemented". Write an attempt, save, then run.',
        'border-line bg-panel/60',
      );
    }

    if (current.status === 'no-cases') {
      return renderNotice(
        <AlertTriangle className="size-6 text-medium" />,
        'No runnable cases',
        `Add tests/cases/${current.dir}/${current.number}-${current.slug}.cases.mjs to test this one.`,
        'border-medium/25 bg-medium/[0.05]',
      );
    }

    if (current.status === 'missing') {
      return renderNotice(
        <CircleSlash className="size-6 text-muted-foreground" />,
        'Nothing to run',
        'The file the runner was pointed at does not exist yet. Save once, then run.',
        'border-line bg-panel/60',
      );
    }

    if (current.status === 'stalled') {
      return renderNotice(
        <Clock className="size-6 text-fail" />,
        'Timed out',
        `No answer after ${Math.round((current.timeoutMs ?? 0) / 1000)}s. A loop is not ending - check the condition that should stop it.`,
        'border-fail/30 bg-fail/[0.05]',
      );
    }

    if (current.status !== 'attempted') {
      return renderNotice(
        <AlertTriangle className="size-6 text-fail" />,
        'The run crashed',
        current.message ?? 'The runner died before it could report.',
        'border-fail/30 bg-fail/[0.05]',
      );
    }

    const passed = current.variants.reduce((sum, variant) => sum + variant.passed, 0);
    const total = current.variants.reduce((sum, variant) => sum + variant.total, 0);
    const green = passed === total;
    const allPass = current.variants.every((variant) => variant.passed === variant.total);

    const timed = current.variants.filter((variant) => variant.ms !== null && variant.passed === variant.total);
    const fastest =
      timed.length > 1 ? timed.reduce((best, variant) => ((variant.ms ?? 0) < (best.ms ?? 0) ? variant : best)).name : null;

    const series: ChartSeries[] = current.variants.flatMap((variant) =>
      variant.complexity ? [{ name: variant.name, complexity: variant.complexity }] : [],
    );

    return (
      <ScrollArea className="h-full">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="space-y-3 p-4"
        >
          <motion.div
            variants={CARD}
            className={cn(
              'flex items-center gap-3 rounded-2xl border p-4',
              green ? 'border-pass/30 glow-pass' : 'border-fail/30 glow-fail',
            )}
          >
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-xl',
                green ? 'bg-pass/15 text-pass' : 'bg-fail/15 text-fail',
              )}
            >
              {green ? <Check className="size-5" /> : <X className="size-5" />}
            </span>
            <div>
              <p className="font-heading text-sm font-semibold">
                {green ? 'All cases pass' : `${total - passed} of ${total} cases fail`}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {current.variants.length} variant{current.variants.length === 1 ? '' : 's'} &middot; {problemTitle}
              </p>
            </div>
          </motion.div>

          <motion.div variants={CARD}>
            {series.length > 0 ? <ComplexityChart series={series} /> : renderMeasurePrompt(allPass)}
          </motion.div>

          {current.scratch && (
            <motion.section variants={CARD} className="rounded-2xl border border-line bg-black/30 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                <SquareTerminal className="size-3" />
                your console output
              </p>
              <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-foreground/80">
                {current.scratch}
              </pre>
            </motion.section>
          )}

          {current.variants.map((variant, index) => renderVariant(variant, index, fastest))}
        </motion.div>
      </ScrollArea>
    );
  };

  if (running) {
    return renderNotice(
      <Terminal className="size-6 animate-pulse text-primary" />,
      bigO ? 'Measuring your solution' : 'Running your solution',
      bigO
        ? 'Each export is tested, then timed at doubling input sizes to fit a curve. This takes a few seconds.'
        : 'Each export is tested against the worked examples and any hand-written cases.',
      'border-primary/25 bg-primary/[0.04]',
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={report ? `${report.number}-${report.status}` : 'idle'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-full"
      >
        {report
          ? renderReport(report)
          : renderNotice(
              <Terminal className="size-6 text-muted-foreground" />,
              'No run yet',
              'Save your attempt and run it. Cases come from the worked examples plus anything in tests/cases.',
              'border-line bg-panel/60',
            )}
      </motion.div>
    </AnimatePresence>
  );
}
