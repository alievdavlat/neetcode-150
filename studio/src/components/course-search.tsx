'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { duration, stamp } from '@/lib/meta';
import type { Course } from '@/lib/types';

interface CourseSearchProps {
  courses: Course[];
  /** The normal catalogue, shown whenever nothing is being searched for. */
  children: ReactNode;
}

const LIMIT = 40;

export function CourseSearch({ courses, children }: CourseSearchProps) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();

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

      {needle === '' && children}

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
