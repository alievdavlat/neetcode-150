import { fail, ok } from '@/server/http';
import { recordReview } from '@/server/history';
import { gradeReview } from '@/server/schedule';
import { getStatus } from '@/server/problems';
import type { ReviewGrade, ReviewKind } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface ReviewBody {
  number?: string;
  kind?: ReviewKind;
  passed?: boolean;
  revealed?: boolean;
  runs?: number;
  hints?: number;
  minutes?: number | null;
  baseline?: number | null;
  grade?: ReviewGrade;
}

const whole = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : fallback;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ReviewBody | null;

  if (!body?.number || !/^\d{3,4}$/.test(body.number)) return fail('a problem number is required');
  if (body.kind !== 'solve' && body.kind !== 'drill') return fail('kind must be solve or drill');

  const runs = whole(body.runs);
  const hints = whole(body.hints);
  const minutes = body.minutes === null || body.minutes === undefined ? null : whole(body.minutes, 1);

  const measured = gradeReview({
    passed: body.passed === true,
    revealed: body.revealed === true,
    runs,
    hints,
    minutes,
    baseline: body.baseline ?? null,
  });

  /** A review may be marked down but never up: only the flattering lie costs anything. */
  const grade = body.grade !== undefined && body.grade < measured ? body.grade : measured;

  try {
    await recordReview({
      number: body.number,
      kind: body.kind,
      grade,
      minutes,
      runs,
      hints,
      revealed: body.revealed === true,
    });

    return ok({ grade, measured, status: await getStatus(body.number) });
  } catch (error) {
    return fail(error);
  }
}
