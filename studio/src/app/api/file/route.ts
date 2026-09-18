import { fail, modeOf, ok } from '@/server/http';
import { getStatus, numberOfFile, readProblemSource, writeProblemSource } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const file = params.get('file');
  if (!file) return fail('file is required');

  try {
    return ok(await readProblemSource(file, modeOf(params.get('source'))));
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { file?: string; source?: string; mode?: string } | null;
  if (!body?.file || typeof body.source !== 'string') return fail('file and source are required');

  try {
    await writeProblemSource(body.file, body.source, modeOf(body.mode));
    return ok({ status: await getStatus(numberOfFile(body.file)) });
  } catch (error) {
    return fail(error);
  }
}
