import { fail, ok } from '@/server/http';
import { listSolutions } from '@/server/solutions';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const number = new URL(request.url).searchParams.get('number');
  if (!number) return fail('number is required');

  try {
    return ok({ snapshots: await listSolutions(number) });
  } catch (error) {
    return fail(error);
  }
}
