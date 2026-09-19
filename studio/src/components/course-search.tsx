'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CourseCard } from './course-card';
import { accentFor, duration, stamp } from '@/lib/meta';
import type { Course } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CourseSearchProps {
  courses: Course[];
  /** Which lesson start times have been marked watched, per course. */
  watched: Record<string, number[]>;
}

const LIMIT = 40;

/**
 * Search and the catalogue live together because they are two views of one
 * list: the tracks narrow it, a query replaces it, and only one of them can be
 * on screen at a time.
 */
export function CourseSearch({ courses, watched }: CourseSearchProps) {
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState<string | null>(null);
  const needle = query.trim().toLowerCase();

  const tracks = useMemo(() => {
    const counts = new Map<string, number>();
    for (const course of courses) counts.set(course.track, (counts.get(course.track) ?? 0) + 1);

    return [...counts].sort((left, right) => left[0].localeCompare(right[0]));
  }, [courses]);

  const shown = track === null ? courses : courses.filter((course) => course.track === track);

  const hits = useMemo(() => {
    if (needle === '') return [];

    return courses
      .flatMap((course) =>
        course.lessons
          .filter((lesson) => lesson.title.toLowerCase().includes(needle))
          .map((lesson) => ({ course, lesson })),
      )
      .slice(0, LIMIT);
  }, [courses, needle]);

  const matching = courses.filter((course) =>
    `${course.name} ${course.title} ${course.channel} ${course.track}`.toLowerCase().includes(needle),
  );

  const renderHit = ({ course, lesson }: { course: Course; lesson: Course['lessons'][number] }) => (
    <li key={`${course.id}-${lesson.at}`}>
      <Link
        href={`/courses/${course.id}?at=${lesson.at}`}
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04]"
      >
        <span className="min-w-0 flex-1 truncate text-[13px]">{lesson.title}</span>
        <span className="hidden truncate text-[11px] text-muted-foreground sm:inline">{course.name}</span>
        <span className="w-16 shrink-0 text-right font-mono text-[10px] text-muted-foreground tabular-nums">
          {stamp(lesson.at)}
        </span>
        <span className="w-12 shrink-0 text-right font-mono text-[10px] text-muted-foreground tabular-nums">
          {duration(lesson.seconds)}
        </span>
      </Link>
    </li>
  );

  const renderTrackChip = (label: string, value: string | null, count: number) => (
    <button
      key={label}
      type="button"
      aria-pressed={track === value}
      onClick={() => setTrack(value)}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors',
        track === value
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-line text-muted-foreground hover:border-primary/30 hover:text-foreground',
      )}
    >
      {label}
      <span className="font-mono text-[10px] tabular-nums opacity-70">{count}</span>
    </button>
  );

  const renderCatalogue = () => (
    <div className="space-y-8">
      {[...new Set(shown.map((course) => course.track))].map((name) => (
        <section key={name} className="space-y-3">
          <header className="flex items-center gap-4">
            <h2 className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">{name}</h2>
            <span className="h-px flex-1 bg-line" />
          </header>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown
              .filter((course) => course.track === name)
              .map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  watched={watched[course.id] ?? []}
                  accent={accentFor(course.id)}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search lessons and courses"
          aria-label="Search lessons and courses"
          className="h-10 pl-10 text-sm"
        />
        {query !== '' && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear the search"
            className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-fail"
          >
            <X className="size-3" />
            Clear
          </button>
        )}
      </div>

      {needle === '' && (
        <div className="flex flex-wrap items-center gap-1.5">
          {renderTrackChip('All', null, courses.length)}
          {tracks.map(([name, count]) => renderTrackChip(name, name, count))}
        </div>
      )}

      {needle === '' && renderCatalogue()}

      {needle !== '' && (
        <div className="space-y-6">
          {matching.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Courses</h2>
              <ul className="rounded-2xl border border-line bg-panel/60 p-2">
                {matching.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04]"
                    >
                      <span className="min-w-0 flex-1 truncate text-[13px]">{course.name}</span>
                      <span className="truncate text-[11px] text-muted-foreground">{course.channel}</span>
                      <span className="w-16 shrink-0 text-right font-mono text-[10px] text-muted-foreground tabular-nums">
                        {duration(course.seconds)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="space-y-2">
            <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Lessons
              <span className="ml-2 font-mono text-[10px] tracking-normal normal-case">{hits.length}</span>
            </h2>

            {hits.length === 0 ? (
              <p className="rounded-2xl border border-line bg-panel/60 p-4 text-sm text-muted-foreground">
                Nothing matches “{query}”.
              </p>
            ) : (
              <ul className="rounded-2xl border border-line bg-panel/60 p-2">{hits.map(renderHit)}</ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
