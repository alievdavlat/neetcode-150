import { fail, ok } from '@/server/http';
import { recordHint } from '@/server/history';
import { getStatus } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { number?: string; level?: number } | null;
  if (!body?.number || !/^\d{3,4}$/.test(body.number)) return fail('a problem number is required');
  if (typeof body.level !== 'number' || body.level < 1 || body.level > 3) return fail('level must be 1, 2 or 3');

  try {
    await recordHint(body.number, body.level);
    return ok({ status: await getStatus(body.number) });
  } catch (error) {
    return fail(error);
  }
}
