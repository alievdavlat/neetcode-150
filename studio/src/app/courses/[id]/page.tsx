import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CoursePlayer } from '@/components/course-player';
import { StrictGate } from '@/components/strict-gate';
import { getCourse, getWatched } from '@/server/courses';
import { getProblems, getStatuses } from '@/server/problems';
import { dueQueue } from '@/server/review';
import { getSettings } from '@/server/settings';
import { duration } from '@/lib/meta';

export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [course, watched, statuses, settings] = await Promise.all([
    getCourse(id),
    getWatched(),
    getStatuses(),
    getSettings(),
  ]);

  const waiting = settings.reviewEnabled ? dueQueue(statuses) : [];
  if (settings.strictMode && waiting.length > 0) {
    const locked = (await getProblems()).find((problem) => problem.number === waiting[0].number);
    if (locked) return <StrictGate problem={locked} status={waiting[0]} waiting={waiting.length} />;
  }

  if (!course) notFound();

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

      <CoursePlayer course={course} watched={watched[course.id] ?? []} />
    </main>
  );
}
