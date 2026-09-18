import Link from 'next/link';
import { NotebookPen } from 'lucide-react';
import { readNotes } from '@/server/notes';
import { getProblems } from '@/server/problems';
import { ALL_BOARD, DIFFICULTY_META, relativeTime } from '@/lib/meta';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const [notes, problems] = await Promise.all([readNotes(), getProblems()]);
  const byNumber = new Map(problems.map((problem) => [problem.number, problem]));

  const renderNote = (entry: { number: string; note: string; at: string }) => {
    const problem = byNumber.get(entry.number);

    return (
      <li key={entry.number}>
        <Link
          href={`/c/${ALL_BOARD}?p=${entry.number}`}
          className="block rounded-2xl border border-line bg-panel/60 p-4 transition-colors hover:border-primary/40"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">#{entry.number}</span>
            <span className="text-[13px] font-medium">{problem?.title ?? 'unknown problem'}</span>
            {problem && (
              <span className={cn('rounded-full border px-2 py-0.5 text-[10px]', DIFFICULTY_META[problem.difficulty].chip)}>
                {problem.difficulty}
              </span>
            )}
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {relativeTime(entry.at || null)}
            </span>
          </div>

          <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-wrap text-foreground/85">{entry.note}</p>
        </Link>
      </li>
    );
  };

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-5 py-10">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Notes</h1>
        <p className="text-sm text-muted-foreground">
          The one idea you wrote down for each problem, newest first. Click one to open the problem.
        </p>
      </header>

      {notes.length === 0 ? (
        <p className="flex items-center gap-2 rounded-2xl border border-line bg-panel/60 p-6 text-sm text-muted-foreground">
          <NotebookPen className="size-4" />
          No notes yet — they live under &ldquo;Your note&rdquo; on each problem.
        </p>
      ) : (
        <ul className="space-y-3">{notes.map(renderNote)}</ul>
      )}
    </main>
  );
}
