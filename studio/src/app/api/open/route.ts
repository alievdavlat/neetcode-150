import { fail, ok } from '@/server/http';
import { recordOpen } from '@/server/history';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { number?: string } | null;
  if (!body?.number || !/^\d{3}$/.test(body.number)) return fail('a three digit problem number is required');

  try {
    await recordOpen(body.number);
    return ok({ recorded: true });
  } catch (error) {
    return fail(error);
  }
}
