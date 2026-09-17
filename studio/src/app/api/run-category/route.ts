import { fail, ok } from '@/server/http';
import { runCategory } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { dir?: string } | null;
  if (!body?.dir || !/^\d{2}-[a-z0-9-]+$/.test(body.dir)) return fail('a category folder is required');

  try {
    return ok({ statuses: await runCategory(body.dir) });
  } catch (error) {
    return fail(error, 500);
  }
}
