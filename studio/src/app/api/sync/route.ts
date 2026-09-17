import { fail, ok } from '@/server/http';
import { syncStatuses } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    return ok({ statuses: await syncStatuses() });
  } catch (error) {
    return fail(error, 500);
  }
}
