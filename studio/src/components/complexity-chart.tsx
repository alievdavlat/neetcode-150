'use client';

import { formatMs } from '@/lib/meta';
import type { RunComplexity } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ComplexityChartProps {
  complexity: RunComplexity;
  variantName: string;
}

interface Curve {
  name: string;
  values: number[];
  fitted: boolean;
  labelY: number;
}

const VIEW = { width: 560, height: 200 };
const PAD = { top: 16, right: 86, bottom: 28, left: 46 };
const LABEL_GAP = 12;

const REFERENCES: { name: string; of: (n: number) => number }[] = [
  { name: 'O(1)', of: () => 1 },
  { name: 'O(log n)', of: (n) => Math.log2(n) },
  { name: 'O(n)', of: (n) => n },
  { name: 'O(n log n)', of: (n) => n * Math.log2(n) },
  { name: 'O(n²)', of: (n) => n ** 2 },
];

const RELATION_NOTE: Record<RunComplexity['relation'], string> = {
  match: 'matches the target',
  differs: 'does not match the target',
  unknown: 'not comparable to the target',
};

const compactN = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));

export function ComplexityChart({ complexity, variantName }: ComplexityChartProps) {
  const points = complexity.points;

  if (points.length < 2) {
    return (
      <p className="rounded-xl border border-line bg-black/20 p-3 text-[11px] text-muted-foreground">
        {complexity.reason ?? 'Not enough sizes were measured to fit a curve.'}
      </p>
    );
  }

  const innerWidth = VIEW.width - PAD.left - PAD.right;
  const innerHeight = VIEW.height - PAD.top - PAD.bottom;
  const peak = Math.max(...points.map((point) => point.ms)) || 1;
  const ceiling = peak * 1.3;

  const x = (index: number) => PAD.left + (index * innerWidth) / (points.length - 1);
  const y = (ms: number) => PAD.top + innerHeight - Math.min(ms / ceiling, 1) * innerHeight;

  const line = (values: number[]) =>
    values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${x(index).toFixed(1)} ${y(value).toFixed(1)}`).join(' ');

  const first = points[0];
  const curves: Curve[] = REFERENCES.map((reference) => {
    const scale = first.ms / reference.of(first.n);
    const values = points.map((point) => scale * reference.of(point.n));

    return {
      name: reference.name,
      values,
      fitted: complexity.members.includes(reference.name),
      labelY: y(values[values.length - 1]),
    };
  });

  const stacked = [...curves].sort((left, right) => left.labelY - right.labelY);
  stacked.reduce((previous, curve) => {
    curve.labelY = Math.max(curve.labelY, previous + LABEL_GAP);
    return curve.labelY;
  }, -Infinity);

  const summary = points.map((point) => `${compactN(point.n)}: ${formatMs(point.ms)}`).join(', ');

  const renderCurve = (curve: Curve) => (
    <g key={curve.name}>
      <path
        d={line(curve.values)}
        fill="none"
        strokeWidth={curve.fitted ? 1.8 : 1}
        strokeDasharray={curve.fitted ? '5 4' : '2 5'}
        stroke={curve.fitted ? 'var(--hot)' : 'rgba(255,255,255,0.16)'}
      />
      <text
        x={VIEW.width - PAD.right + 8}
        y={curve.labelY + 3}
        fontSize="10"
        fontFamily="var(--font-code)"
        fill={curve.fitted ? 'var(--hot)' : 'rgba(255,255,255,0.35)'}
      >
        {curve.name}
      </text>
    </g>
  );

  const renderVerdict = () => {
    if (!complexity.verdict) {
      return <span className="text-muted-foreground">no curve fits — {complexity.reason ?? 'unclear'}</span>;
    }

    return (
      <>
        <span className="rounded-md border border-hot/30 bg-hot/10 px-1.5 py-0.5 font-mono text-hot">
          {complexity.verdict}
        </span>
        {complexity.deviation !== null && (
          <span className="text-muted-foreground">spread {(complexity.deviation * 100).toFixed(1)}%</span>
        )}
        {complexity.target && (
          <span
            className={cn(
              complexity.relation === 'match' && 'text-pass',
              complexity.relation === 'differs' && 'text-fail',
              complexity.relation === 'unknown' && 'text-muted-foreground',
            )}
          >
            target {complexity.target} · {RELATION_NOTE[complexity.relation]}
          </span>
        )}
      </>
    );
  };

  return (
    <div className="rounded-xl border border-line bg-black/20 p-3">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Measured time for ${variantName} at growing input sizes: ${summary}. Fitted ${complexity.verdict ?? 'nothing'}.`}
      >
        <line
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={PAD.top + innerHeight}
          stroke="rgba(255,255,255,0.18)"
        />
        <line
          x1={PAD.left}
          y1={PAD.top + innerHeight}
          x2={PAD.left + innerWidth}
          y2={PAD.top + innerHeight}
          stroke="rgba(255,255,255,0.18)"
        />

        {curves.map(renderCurve)}

        <path d={line(points.map((point) => point.ms))} fill="none" stroke="var(--pass)" strokeWidth="2.4" />

        {points.map((point, index) => (
          <circle key={point.n} cx={x(index)} cy={y(point.ms)} r="3.2" fill="var(--pass)">
            <title>
              n = {point.n} · {formatMs(point.ms)}
            </title>
          </circle>
        ))}

        {points.map((point, index) => (
          <text
            key={point.n}
            x={x(index)}
            y={VIEW.height - 10}
            fontSize="9"
            textAnchor="middle"
            fontFamily="var(--font-code)"
            fill="rgba(255,255,255,0.4)"
          >
            {compactN(point.n)}
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

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-0.5 w-4 rounded-full bg-pass" />
          measured
        </span>
        {renderVerdict()}
      </div>

      {complexity.band && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Timing cannot separate these two at sizes this small — the log factor moves less than the noise.
        </p>
      )}

      {!complexity.band && complexity.verdict && !complexity.confident && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Low confidence: {complexity.runnerUp?.name ?? 'another curve'} fits almost as well.
        </p>
      )}
    </div>
  );
}
