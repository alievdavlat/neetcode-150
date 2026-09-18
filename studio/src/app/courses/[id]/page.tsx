import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CoursePlayer } from '@/components/course-player';
import { StrictGate } from '@/components/strict-gate';
import { getCourse, getCourseNotes, getWatched } from '@/server/courses';
import { getProblems, getStatuses } from '@/server/problems';
import { dueQueue } from '@/server/review';
import { getSettings } from '@/server/settings';
import { duration, tagsOf } from '@/lib/meta';
import type { PracticeProblem } from '@/lib/practice';

export const dynamic = 'force-dynamic';

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const asked = typeof query.at === 'string' ? Number(query.at) : Number.NaN;
  const [course, watched, notes, statuses, settings] = await Promise.all([
    getCourse(id),
    getWatched(),
    getCourseNotes(),
    getStatuses(),
    getSettings(),
  ]);

  const waiting = settings.reviewEnabled ? dueQueue(statuses) : [];
  if (settings.strictMode && waiting.length > 0) {
    const locked = (await getProblems()).find((problem) => problem.number === waiting[0].number);
    if (locked) return <StrictGate problem={locked} status={waiting[0]} waiting={waiting.length} />;
  }

  if (!course) notFound();

  /** Only what a lesson needs to name a problem, so this page stays small. */
  const practice: PracticeProblem[] = (await getProblems()).flatMap((problem) => {
    const tags = tagsOf(problem);
    return [{ number: problem.number, title: problem.title, difficulty: problem.difficulty, tags }];
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 px-5 py-8">
      <header className="flex flex-wrap items-center gap-3">
        <Link
          href="/courses"
          aria-label="Back to courses"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div className="min-w-0">
          <h1 className="truncate font-heading text-xl font-semibold tracking-tight">{course.name}</h1>
          <p className="truncate text-xs text-muted-foreground">
            {course.channel} · {duration(course.seconds)} · {course.lessons.length} lessons · chapters from the{' '}
            {course.from}
          </p>
        </div>
      </header>

      <CoursePlayer
        course={course}
        watched={watched[course.id] ?? []}
        notes={notes[course.id] ?? {}}
        practice={practice}
        start={Number.isInteger(asked) ? asked : undefined}
      />
    </main>
  );
}
