import { Studio } from '@/components/studio';
import { getCollections } from '@/server/collections';
import { getProblems, getStatuses } from '@/server/problems';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [problems, statuses, collections] = await Promise.all([getProblems(), getStatuses(), getCollections()]);

  return <Studio problems={problems} statuses={statuses} collections={collections} />;
}
