import { fail, ok } from '@/server/http';
import { getSettings, saveSettings } from '@/server/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return ok({ settings: await getSettings() });
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return fail('a settings body is required');

  const next = {
    reviewEnabled: typeof body.reviewEnabled === 'boolean' ? body.reviewEnabled : undefined,
    strictMode: typeof body.strictMode === 'boolean' ? body.strictMode : undefined,
    dailyCap: typeof body.dailyCap === 'number' ? body.dailyCap : undefined,
  };

  try {
    return ok({ settings: await saveSettings(next) });
  } catch (error) {
    return fail(error);
  }
}
