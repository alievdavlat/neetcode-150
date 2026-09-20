import { fail, ok } from '@/server/http';
import { startPlan, stopPlan } from '@/server/history';
import { getStatus } from '@/server/problems';
import { MAX_PLAN_TARGET, MIN_PLAN_TARGET } from '@/server/schedule';

export const dynamic = 'force-dynamic';

interface RepeatBody {
  number?: string;
  action?: 'start' | 'stop';
  target?: number;
  note?: string | null;
}

const whole = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RepeatBody | null;

  if (!body?.number || !/^\d{3,4}$/.test(body.number)) return fail('a problem number is required');

  try {
    if (body.action === 'stop') {
      await stopPlan(body.number);
      return ok({ status: await getStatus(body.number) });
    }

    if (body.action !== 'start') return fail('action must be start or stop');

    const target = whole(body.target, 3);

    if (target < MIN_PLAN_TARGET || target > MAX_PLAN_TARGET) {
      return fail(`target must be between ${MIN_PLAN_TARGET} and ${MAX_PLAN_TARGET}`);
    }

    await startPlan({
      number: body.number,
      target,
      note: typeof body.note === 'string' ? body.note : null,
    });

    return ok({ status: await getStatus(body.number) });
  } catch (error) {
    return fail(error);
  }
}
