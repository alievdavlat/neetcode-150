'use client';

import { useTranslation } from 'react-i18next';
import { formatMs } from '@/lib/meta';
import type { RunComplexity } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface ChartSeries {
  name: string;
  complexity: RunComplexity;
}

interface ComplexityChartProps {
  series: ChartSeries[];
}

interface Reference {
  name: string;
  values: { n: number; value: number }[];
  fitted: boolean;
  labelY: number;
}

const VIEW = { width: 560, height: 210 };
const PAD = { top: 16, right: 92, bottom: 30, left: 48 };
const LABEL_GAP = 12;

const SERIES_COLORS = ['var(--pass)', 'var(--cool)', 'var(--medium)', 'var(--hot)'];

const CURVES: { name: string; of: (n: number) => number }[] = [
  { name: 'O(1)', of: () => 1 },
  { name: 'O(log n)', of: (n) => Math.log2(n) },
  { name: 'O(n)', of: (n) => n },
  { name: 'O(n log n)', of: (n) => n * Math.log2(n) },
  { name: 'O(n²)', of: (n) => n ** 2 },
];

/** Dictionary keys, looked up where they are drawn. */
const RELATION_NOTE: Record<RunComplexity['relation'], string> = {
  match: 'verdict.chartMatch',
  differs: 'verdict.chartDiffers',
  unknown: 'verdict.chartUnknown',
};

const compactN = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));

export function ComplexityChart({ series }: ComplexityChartProps) {
  const { t } = useTranslation();
  const usable = series.filter((entry) => entry.complexity.points.length >= 2);

  if (usable.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-black/20 p-3 text-[11px] text-muted-foreground">
        {series[0]?.complexity.reason ?? t('verdict.chartThin')}
      </p>
    );
  }

  const every = usable.flatMap((entry) => entry.complexity.points);
  const sizes = every.map((point) => point.n);
  const lowN = Math.log2(Math.min(...sizes));
  const highN = Math.log2(Math.max(...sizes));
  const span = highN - lowN || 1;
  const ceiling = Math.max(...every.map((point) => point.ms)) * 1.3 || 1;

  const innerWidth = VIEW.width - PAD.left - PAD.right;
  const innerHeight = VIEW.height - PAD.top - PAD.bottom;

  const x = (n: number) => PAD.left + ((Math.log2(n) - lowN) / span) * innerWidth;
  const y = (ms: number) => PAD.top + innerHeight - Math.min(ms / ceiling, 1) * innerHeight;

  const line = (points: { n: number; value: number }[]) =>
    points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.n).toFixed(1)} ${y(point.value).toFixed(1)}`).join(' ');

  const anchor = usable[0].complexity.points[0];
  const fitted = new Set(usable.flatMap((entry) => entry.complexity.members));

  const references: Reference[] = CURVES.map((curve) => {
    const scale = anchor.ms / curve.of(anchor.n);
    const values = [...new Set(sizes)]
      .sort((left, right) => left - right)
      .map((n) => ({ n, value: scale * curve.of(n) }));

    return {
      name: curve.name,
      values,
      fitted: fitted.has(curve.name),
      labelY: y(values[values.length - 1].value),
    };
  });

  [...references]
    .sort((left, right) => left.labelY - right.labelY)
    .reduce((previous, reference) => {
      reference.labelY = Math.max(reference.labelY, previous + LABEL_GAP);
      return reference.labelY;
    }, -Infinity);

  const ticks = [...new Set(sizes)].sort((left, right) => left - right);
  const summary = usable
    .map((entry) =>
      t('verdict.chartFits', { name: entry.name, verdict: entry.complexity.verdict ?? t('verdict.chartNothing') }),
    )
    .join('; ');

  const renderReference = (reference: Reference) => (
    <g key={reference.name}>
      <path
        d={line(reference.values)}
        fill="none"
        strokeWidth={reference.fitted ? 1.6 : 1}
        strokeDasharray={reference.fitted ? '5 4' : '2 5'}
        stroke={reference.fitted ? 'var(--hot)' : 'rgba(255,255,255,0.16)'}
      />
      <text
        x={VIEW.width - PAD.right + 8}
        y={reference.labelY + 3}
        fontSize="10"
        fontFamily="var(--font-code)"
        fill={reference.fitted ? 'var(--hot)' : 'rgba(255,255,255,0.35)'}
      >
        {reference.name}
      </text>
    </g>
  );

  const renderSeries = (entry: ChartSeries, index: number) => {
    const color = SERIES_COLORS[index % SERIES_COLORS.length];
    const points = entry.complexity.points.map((point) => ({ n: point.n, value: point.ms }));

    return (
      <g key={entry.name}>
        <path d={line(points)} fill="none" stroke={color} strokeWidth="2.4" />
        {entry.complexity.points.map((point) => (
          <circle key={point.n} cx={x(point.n)} cy={y(point.ms)} r="3.2" fill={color}>
            <title>
              {entry.name} · n = {point.n} · {formatMs(point.ms)}
            </title>
          </circle>
        ))}
      </g>
    );
  };

  const renderLegend = (entry: ChartSeries, index: number) => (
    <div key={entry.name} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
      <span className="h-0.5 w-4 rounded-full" style={{ background: SERIES_COLORS[index % SERIES_COLORS.length] }} />
      <span className="font-mono">{entry.name}</span>
      <span className="rounded-md border border-hot/30 bg-hot/10 px-1.5 py-0.5 font-mono text-hot">
        {entry.complexity.verdict ?? t('verdict.chartNoFit')}
      </span>
      {entry.complexity.deviation !== null && (
        <span className="text-muted-foreground">
          {t('verdict.chartSpread', { percent: (entry.complexity.deviation * 100).toFixed(1) })}
        </span>
      )}
      {entry.complexity.target && (
        <span
          className={cn(
            entry.complexity.relation === 'match' && 'text-pass',
            entry.complexity.relation === 'differs' && 'text-fail',
            entry.complexity.relation === 'unknown' && 'text-muted-foreground',
          )}
        >
          {t(RELATION_NOTE[entry.complexity.relation])}
        </span>
      )}
      {entry.complexity.band && <span className="text-muted-foreground/70">· {t('verdict.chartBand')}</span>}
    </div>
  );

  return (
    <div className="rounded-xl border border-line bg-black/20 p-3">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="h-auto w-full"
        role="img"
        aria-label={t('verdict.chartLabel', { summary })}
      >
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + innerHeight} stroke="rgba(255,255,255,0.18)" />
        <line
          x1={PAD.left}
          y1={PAD.top + innerHeight}
          x2={PAD.left + innerWidth}
          y2={PAD.top + innerHeight}
          stroke="rgba(255,255,255,0.18)"
        />

        {references.map(renderReference)}
        {usable.map(renderSeries)}

        {ticks.map((n) => (
          <text
            key={n}
            x={x(n)}
            y={VIEW.height - 10}
            fontSize="9"
            textAnchor="middle"
            fontFamily="var(--font-code)"
            fill="rgba(255,255,255,0.4)"
          >
            {compactN(n)}
          </text>
        ))}

        <text x={PAD.left - 6} y={PAD.top + 4} fontSize="9" textAnchor="end" fontFamily="var(--font-code)" fill="rgba(255,255,255,0.4)">
          {formatMs(ceiling)}
        </text>
        <text
          x={PAD.left - 6}
          y={PAD.top + innerHeight}
          fontSize="9"
          textAnchor="end"
          fontFamily="var(--font-code)"
          fill="rgba(255,255,255,0.4)"
        >
          0
        </text>
      </svg>

      <div className="mt-2 space-y-1">{usable.map(renderLegend)}</div>
    </div>
  );
}
