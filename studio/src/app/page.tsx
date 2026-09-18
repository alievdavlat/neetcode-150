import { Home } from '@/components/home';
import { StrictGate } from '@/components/strict-gate';
import { getBoards, getCompanies } from '@/server/collections';
import { getCourses } from '@/server/courses';
import { getActivity } from '@/server/history';
import { getProblems, getStatuses } from '@/server/problems';
import { dueQueue } from '@/server/review';
import { getSettings } from '@/server/settings';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [problems, statuses, companies, courses, activity, settings] = await Promise.all([
    getProblems(),
    getStatuses(),
    getCompanies(),
    getCourses(),
    getActivity(),
    getSettings(),
  ]);

  const waiting = settings.reviewEnabled ? dueQueue(statuses) : [];

  if (settings.strictMode && waiting.length > 0) {
    const locked = problems.find((problem) => problem.number === waiting[0].number);
    if (locked) return <StrictGate problem={locked} status={waiting[0]} waiting={waiting.length} />;
  }

  const boards = await getBoards(problems, statuses);

  return (
    <Home
      problems={problems}
      statuses={statuses}
      boards={boards}
      companies={companies}
      courses={courses}
      activity={activity}
      settings={settings}
    />
  );
}
