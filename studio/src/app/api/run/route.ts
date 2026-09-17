import { fail, ok } from '@/server/http';
import { getStatus, runProblem } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { number?: string } | null;
  if (!body?.number || !/^\d{3}$/.test(body.number)) return fail('a three digit problem number is required');

  try {
    const report = await runProblem(body.number);
    return ok({ report, status: await getStatus(body.number) });
  } catch (error) {
    return fail(error, 500);
  }
}
