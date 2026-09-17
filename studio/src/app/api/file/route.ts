import { fail, ok } from '@/server/http';
import { getStatus, readProblemSource, writeProblemSource } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const file = new URL(request.url).searchParams.get('file');
  if (!file) return fail('file is required');

  try {
    return ok(await readProblemSource(file));
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { file?: string; source?: string } | null;
  if (!body?.file || typeof body.source !== 'string') return fail('file and source are required');

  try {
    await writeProblemSource(body.file, body.source);
    return ok({ status: await getStatus(body.file.split('/')[1].slice(0, 3)) });
  } catch (error) {
    return fail(error);
  }
}
