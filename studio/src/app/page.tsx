import { Studio } from '@/components/studio';
import { getProblems, getStatuses } from '@/server/problems';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [problems, statuses] = await Promise.all([getProblems(), getStatuses()]);

  return <Studio problems={problems} statuses={statuses} />;
}
