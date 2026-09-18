import { fail, ok } from '@/server/http';
import { forgetProblems, syncStatuses } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    forgetProblems();
    return ok({ statuses: await syncStatuses() });
  } catch (error) {
    return fail(error, 500);
  }
}
