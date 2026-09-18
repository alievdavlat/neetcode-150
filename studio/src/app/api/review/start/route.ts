import { fail, ok } from '@/server/http';
import { getProblems, resetScratch } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { number?: string } | null;
  if (!body?.number || !/^\d{3,4}$/.test(body.number)) return fail('a problem number is required');

  try {
    const problem = (await getProblems()).find((entry) => entry.number === body.number);
    if (!problem) return fail(`no problem numbered ${body.number}`);

    return ok({ source: await resetScratch(problem.file) });
  } catch (error) {
    return fail(error);
  }
}
