import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Studio } from '@/components/studio';
import { getBoards, getCollections } from '@/server/collections';
import { getProblems, getStatuses } from '@/server/problems';

export const dynamic = 'force-dynamic';

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [problems, statuses, collections] = await Promise.all([
    getProblems(),
    getStatuses(),
    getCollections(),
  ]);

  const boards = await getBoards(problems, statuses);
  if (!boards.some((board) => board.id === id)) notFound();

  return (
    <Suspense>
      <Studio problems={problems} statuses={statuses} collections={collections} boardId={id} />
    </Suspense>
  );
}
