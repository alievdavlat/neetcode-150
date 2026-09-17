import { fail, ok } from '@/server/http';
import { readNote, writeNote } from '@/server/notes';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const number = new URL(request.url).searchParams.get('number');
  if (!number) return fail('number is required');

  try {
    return ok({ note: await readNote(number) });
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { number?: string; note?: string } | null;
  if (!body?.number || typeof body.note !== 'string') return fail('number and note are required');

  try {
    await writeNote(body.number, body.note);
    return ok({ saved: true });
  } catch (error) {
    return fail(error);
  }
}
