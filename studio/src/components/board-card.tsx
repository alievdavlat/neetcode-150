'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import type { Board } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BoardCardProps {
  board: Board;
  accent: string;
}

const SPLIT = [
  { key: 'easy', label: 'board.easy', tone: 'text-easy', bar: 'bg-easy' },
  { key: 'medium', label: 'board.medium', tone: 'text-medium', bar: 'bg-medium' },
  { key: 'hard', label: 'board.hard', tone: 'text-hard', bar: 'bg-hard' },
] as const;

export function BoardCard({ board, accent }: BoardCardProps) {
  const { t } = useTranslation();
  const percent = board.total === 0 ? 0 : Math.round((board.solved / board.total) * 100);

  const renderSplit = () => (
    <div className="flex items-center gap-3">
      {SPLIT.map((entry) => (
        <span key={entry.key} className="flex items-center gap-1 font-mono text-[10px]">
          <span className={cn('size-1.5 rounded-full', entry.bar)} />
          <span className={entry.tone}>{board[entry.key]}</span>
          <span className="text-muted-foreground">{t(entry.label)}</span>
        </span>
      ))}
    </div>
  );

  return (
    <Link
      href={`/c/${board.id}`}
      className="group/card flex flex-col overflow-hidden rounded-2xl border border-line bg-panel/60 transition-colors hover:border-primary/40"
    >
      <div className={cn('relative flex h-16 items-end overflow-hidden bg-linear-to-br p-3', accent)}>
        <span aria-hidden className="grid-floor absolute inset-0 opacity-50" />
        <p className="relative font-heading text-base leading-tight font-bold text-white drop-shadow-md">
          {board.name}
        </p>
        <p className="absolute top-3 right-3 font-mono text-[11px] text-white/85 tabular-nums">
          {board.total}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{board.description}</p>

        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-2">
            {renderSplit()}
            <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums">
              {board.solved}/{board.total}
            </span>
          </div>

          <Progress value={percent} className="h-1" />
        </div>
      </div>
    </Link>
  );
}
