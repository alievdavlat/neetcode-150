import { fail, modeOf, ok } from '@/server/http';
import { countOperations } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    number?: string;
    variant?: string;
    mode?: string;
  } | null;

  if (!body?.number || !/^\d{3,4}$/.test(body.number)) return fail('a problem number is required');
  if (!body.variant || !/^[A-Za-z_$][\w$]*$/.test(body.variant)) return fail('a variant name is required');

  try {
    return ok({ ops: await countOperations(body.number, body.variant, modeOf(body.mode)) });
  } catch (error) {
    return fail(error, 500);
  }
}
