'use client';

import { useTranslation } from 'react-i18next';

import { STATE_META } from '@/lib/meta';
import type { ProblemState } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusDotProps {
  state: ProblemState;
  stale?: boolean;
  className?: string;
}

export function StatusDot({ state, stale = false, className }: StatusDotProps) {
  const { t } = useTranslation();
  const meta = STATE_META[state];
  const label = t(meta.label);

  return (
    <span
      className={cn('relative inline-flex size-2 rounded-full', meta.dot, className)}
      title={stale ? `${label} · ${t('meta.staleNote')}` : label}
    >
      <span className="sr-only">{label}</span>
      {stale && <span className="absolute -inset-1 rounded-full border border-dashed border-current opacity-60" />}
    </span>
  );
}
