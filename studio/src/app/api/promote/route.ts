import { fail, ok } from '@/server/http';
import { getStatus, numberOfFile, promoteScratch } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { file?: string } | null;
  if (!body?.file) return fail('file is required');

  try {
    await promoteScratch(body.file);
    return ok({ status: await getStatus(numberOfFile(body.file)) });
  } catch (error) {
    return fail(error);
  }
}
