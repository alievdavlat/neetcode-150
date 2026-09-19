import { CourseSearch } from '@/components/course-search';
import { StrictGate } from '@/components/strict-gate';
import { translator } from '@/i18n/lookup';
import { getDictionary, getLocale } from '@/i18n/server';
import { getCourses, getWatched } from '@/server/courses';
import { getProblems, getStatuses } from '@/server/problems';
import { dueQueue } from '@/server/review';
import { getSettings } from '@/server/settings';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const locale = await getLocale();
  const [courses, watched, statuses, settings, dictionary] = await Promise.all([
    getCourses(),
    getWatched(),
    getStatuses(),
    getSettings(),
    getDictionary(locale),
  ]);

  /** Strict mode means nothing else opens, and a course is something else. */
  const waiting = settings.reviewEnabled ? dueQueue(statuses) : [];
  if (settings.strictMode && waiting.length > 0) {
    const locked = (await getProblems()).find((problem) => problem.number === waiting[0].number);
    if (locked) return <StrictGate problem={locked} status={waiting[0]} waiting={waiting.length} />;
  }

  const lessons = courses.reduce((total, course) => total + course.lessons.length, 0);
  const seen = courses.reduce((total, course) => total + (watched[course.id]?.length ?? 0), 0);
  const t = translator(dictionary, locale);

  /** The server dictionary is a plain lookup, so a count is put in place here. */

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-5 py-10">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{t('nav.courses')}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t('courses.blurb')} <span className="font-mono text-foreground/80">npm run courses</span>.
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">
          {t('courses.countCourses', { count: courses.length })} ·{' '}
          {t('courses.countLessons', { count: lessons })} · {t('courses.countWatched', { count: seen })}
        </p>
      </header>

      {courses.length === 0 ? (
        <p className="rounded-2xl border border-line bg-panel/60 p-6 text-sm text-muted-foreground">
          {t('courses.emptyLead')} <span className="font-mono">studio/data/courses.source.json</span>{' '}
          {t('courses.emptyRun')} <span className="font-mono">npm run courses</span>.
        </p>
      ) : (
        <CourseSearch courses={courses} watched={watched} />
      )}
    </main>
  );
}
