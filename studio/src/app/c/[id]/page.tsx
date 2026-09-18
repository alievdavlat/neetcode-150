import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { StrictGate } from '@/components/strict-gate';
import { Studio } from '@/components/studio';
import { getBoards, getCollections } from '@/server/collections';
import { getProblems, getStatuses } from '@/server/problems';
import { dueQueue } from '@/server/review';
import { getSettings } from '@/server/settings';

export const dynamic = 'force-dynamic';

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [problems, statuses, collections, settings] = await Promise.all([
    getProblems(),
    getStatuses(),
    getCollections(),
    getSettings(),
  ]);

  const waiting = settings.reviewEnabled ? dueQueue(statuses) : [];
  const asked = typeof query.p === 'string' ? query.p : null;

  /** Strict mode lets exactly one problem through: the one that is waiting. */
  if (settings.strictMode && waiting.length > 0 && asked !== waiting[0].number) {
    const locked = problems.find((problem) => problem.number === waiting[0].number);
    if (locked) return <StrictGate problem={locked} status={waiting[0]} waiting={waiting.length} />;
  }

  const boards = await getBoards(problems, statuses);
  if (!boards.some((board) => board.id === id)) notFound();

  return (
    <Suspense>
      <Studio
        problems={problems}
        statuses={statuses}
        collections={collections}
        boardId={id}
        settings={settings}
      />
    </Suspense>
  );
}
