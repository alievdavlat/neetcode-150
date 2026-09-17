import { fail, modeOf, ok } from '@/server/http';
import { traceProblem } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    number?: string;
    variant?: string;
    caseIndex?: number;
    mode?: string;
  } | null;

  if (!body?.number || !/^\d{3}$/.test(body.number)) return fail('a three digit problem number is required');
  if (!body.variant || !/^[A-Za-z_$][\w$]*$/.test(body.variant)) return fail('a variant name is required');

  const index = Number.isInteger(body.caseIndex) && body.caseIndex! >= 0 ? body.caseIndex! : 0;

  try {
    return ok({ trace: await traceProblem(body.number, body.variant, index, modeOf(body.mode)) });
  } catch (error) {
    return fail(error, 500);
  }
}
