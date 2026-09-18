import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import type { Board } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BoardCardProps {
  board: Board;
  accent: string;
}

const SPLIT = [
  { key: 'easy', label: 'Easy', tone: 'text-easy', bar: 'bg-easy' },
  { key: 'medium', label: 'Med.', tone: 'text-medium', bar: 'bg-medium' },
  { key: 'hard', label: 'Hard', tone: 'text-hard', bar: 'bg-hard' },
] as const;

export function BoardCard({ board, accent }: BoardCardProps) {
  const percent = board.total === 0 ? 0 : Math.round((board.solved / board.total) * 100);

  const renderSplit = () => (
    <div className="flex items-center gap-3">
      {SPLIT.map((entry) => (
        <span key={entry.key} className="flex items-center gap-1 font-mono text-[10px]">
          <span className={cn('size-1.5 rounded-full', entry.bar)} />
          <span className={entry.tone}>{board[entry.key]}</span>
          <span className="text-muted-foreground">{entry.label}</span>
        </span>
      ))}
    </div>
  );

  return (
    <Link
      href={`/c/${board.id}`}
      className="group/card flex flex-col overflow-hidden rounded-2xl border border-line bg-panel/60 transition-colors hover:border-primary/40"
    >
      <div className={cn('relative h-28 overflow-hidden bg-linear-to-br p-4', accent)}>
        <span aria-hidden className="grid-floor absolute inset-0 opacity-50" />
        <p className="relative font-heading text-lg leading-tight font-bold text-white drop-shadow-md">
          {board.name}
        </p>
        <p className="absolute right-4 bottom-3 font-mono text-[11px] text-white/85 tabular-nums">
          {board.total} problems
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">{board.description}</p>

        <div className="mt-auto space-y-2">
          {renderSplit()}

          <div className="flex items-center gap-2">
            <Progress value={percent} className="h-1.5 flex-1" />
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              {board.solved}/{board.total}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
