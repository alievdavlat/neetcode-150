import { fail, ok } from '@/server/http';
import { typecheckFile } from '@/server/typecheck';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { file?: string } | null;
  if (!body?.file) return fail('file is required');

  try {
    return ok({ markers: await typecheckFile(body.file) });
  } catch (error) {
    return fail(error, 500);
  }
}
