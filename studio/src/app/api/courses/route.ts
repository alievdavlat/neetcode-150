import { fail, ok } from '@/server/http';
import { getCourse, setWatched } from '@/server/courses';

export const dynamic = 'force-dynamic';

interface WatchBody {
  course?: string;
  at?: number;
  watched?: boolean;
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as WatchBody | null;

  if (!body?.course || !/^[a-z0-9-]{1,64}$/.test(body.course)) return fail('a course id is required');
  if (!Number.isInteger(body.at) || body.at! < 0) return fail('a lesson start is required');

  try {
    const course = await getCourse(body.course);
    if (!course) return fail(`no course called ${body.course}`);
    if (!course.lessons.some((lesson) => lesson.at === body.at)) return fail('that lesson is not in this course');

    return ok({ watched: await setWatched(body.course, body.at!, body.watched === true) });
  } catch (error) {
    return fail(error);
  }
}
