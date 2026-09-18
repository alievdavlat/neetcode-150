import { Home } from '@/components/home';
import { getBoards, getCompanies } from '@/server/collections';
import { getProblems, getStatuses } from '@/server/problems';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [problems, statuses, companies] = await Promise.all([
    getProblems(),
    getStatuses(),
    getCompanies(),
  ]);
  const boards = await getBoards(problems, statuses);

  return <Home problems={problems} statuses={statuses} boards={boards} companies={companies} />;
}
