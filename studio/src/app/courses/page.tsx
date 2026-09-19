import { CourseSearch } from '@/components/course-search';
import { StrictGate } from '@/components/strict-gate';
import { getCourses, getWatched } from '@/server/courses';
import { getProblems, getStatuses } from '@/server/problems';
import { dueQueue } from '@/server/review';
import { getSettings } from '@/server/settings';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const [courses, watched, statuses, settings] = await Promise.all([
    getCourses(),
    getWatched(),
    getStatuses(),
    getSettings(),
  ]);

  /** Strict mode means nothing else opens, and a course is something else. */
  const waiting = settings.reviewEnabled ? dueQueue(statuses) : [];
  if (settings.strictMode && waiting.length > 0) {
    const locked = (await getProblems()).find((problem) => problem.number === waiting[0].number);
    if (locked) return <StrictGate problem={locked} status={waiting[0]} waiting={waiting.length} />;
  }

  const lessons = courses.reduce((total, course) => total + course.lessons.length, 0);
  const seen = courses.reduce((total, course) => total + (watched[course.id]?.length ?? 0), 0);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-5 py-10">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Full-length courses that are free to watch, kept as their own chapter lists. Nothing here is
          summarised or rewritten: the titles, the lengths and the lessons are read from the videos
          themselves by <span className="font-mono text-foreground/80">npm run courses</span>.
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">
          {courses.length} courses · {lessons} lessons · {seen} marked watched
        </p>
      </header>

      {courses.length === 0 ? (
        <p className="rounded-2xl border border-line bg-panel/60 p-6 text-sm text-muted-foreground">
          No courses yet. Add one to <span className="font-mono">studio/data/courses.source.json</span> and run{' '}
          <span className="font-mono">npm run courses</span>.
        </p>
      ) : (
        <CourseSearch courses={courses} watched={watched} />
      )}
    </main>
  );
}
