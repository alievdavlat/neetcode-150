import { fail, ok } from '@/server/http';
import { getCourse, setCourseNote } from '@/server/courses';

export const dynamic = 'force-dynamic';

interface NoteBody {
  course?: string;
  at?: number;
  note?: string;
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as NoteBody | null;

  if (!body?.course || !/^[a-z0-9-]{1,64}$/.test(body.course)) return fail('a course id is required');
  if (!Number.isInteger(body.at) || body.at! < 0) return fail('a lesson start is required');
  if (typeof body.note !== 'string') return fail('a note is required');

  try {
    const course = await getCourse(body.course);
    if (!course) return fail(`no course called ${body.course}`);
    if (!course.lessons.some((lesson) => lesson.at === body.at)) return fail('that lesson is not in this course');

    return ok({ note: await setCourseNote(body.course, body.at!, body.note) });
  } catch (error) {
    return fail(error);
  }
}
