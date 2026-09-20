import { fail, ok } from '@/server/http';
import { startPlan, stopPlan, tickPlan } from '@/server/history';
import { getStatus } from '@/server/problems';
import { MAX_PLAN_DAYS, MAX_PLAN_PER_DAY } from '@/server/schedule';

export const dynamic = 'force-dynamic';

interface RepeatBody {
  number?: string;
  action?: 'start' | 'tick' | 'stop';
  days?: number;
  perDay?: number;
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

    if (body.action === 'tick') {
      await tickPlan(body.number);
      return ok({ status: await getStatus(body.number) });
    }

    if (body.action !== 'start') return fail('action must be start, tick or stop');

    const days = whole(body.days, 3);
    const perDay = whole(body.perDay, 2);

    if (days < 1 || days > MAX_PLAN_DAYS) return fail(`days must be between 1 and ${MAX_PLAN_DAYS}`);
    if (perDay < 1 || perDay > MAX_PLAN_PER_DAY) return fail(`perDay must be between 1 and ${MAX_PLAN_PER_DAY}`);

    await startPlan({
      number: body.number,
      days,
      perDay,
      note: typeof body.note === 'string' ? body.note : null,
    });

    return ok({ status: await getStatus(body.number) });
  } catch (error) {
    return fail(error);
  }
}
