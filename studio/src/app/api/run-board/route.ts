import { fail, ok } from '@/server/http';
import { runBoard } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { numbers?: unknown } | null;
  const numbers = Array.isArray(body?.numbers) ? body.numbers : null;

  if (!numbers || numbers.length === 0) return fail('a list of problem numbers is required');
  if (numbers.length > 5000) return fail('that is more problems than this workspace has');
  if (!numbers.every((number) => typeof number === 'string' && /^\d{3,4}$/.test(number))) {
    return fail('those are not problem numbers');
  }

  try {
    return ok({ statuses: await runBoard(numbers as string[]) });
  } catch (error) {
    return fail(error, 500);
  }
}
