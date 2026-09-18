import { fail, modeOf, ok } from '@/server/http';
import { traceProblem } from '@/server/problems';

export const dynamic = 'force-dynamic';

const MAX_INPUT = 32 * 1024;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    number?: string;
    variant?: string;
    caseIndex?: number;
    mode?: string;
    input?: unknown;
  } | null;

  if (!body?.number || !/^\d{3,4}$/.test(body.number)) return fail('a problem number is required');
  if (!body.variant || !/^[A-Za-z_$][\w$]*$/.test(body.variant)) return fail('a variant name is required');

  const index = Number.isInteger(body.caseIndex) && body.caseIndex! >= 0 ? body.caseIndex! : 0;

  const input = Array.isArray(body.input) ? body.input : null;
  if (input !== null && JSON.stringify(input).length > MAX_INPUT) return fail('that input is too long');

  try {
    return ok({ trace: await traceProblem(body.number, body.variant, index, modeOf(body.mode), input) });
  } catch (error) {
    return fail(error, 500);
  }
}
