'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          {duration(t, lesson.seconds)}
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

  /**
   * A track with an order is a path, so it is read in that order and the first
   * one says so. A track without one keeps the order it came in, because an
   * invented sequence would be a claim nobody made.
   */
  const inTrack = (name: string) => {
    const members = shown.filter((course) => course.track === name);
    const ordered = members.some((course) => typeof course.order === 'number');
    if (!ordered) return { members, ordered };

    return {
      ordered,
      members: [...members].sort(
        (left, right) => (left.order ?? Infinity) - (right.order ?? Infinity) || left.name.localeCompare(right.name),
      ),
    };
  };

  const renderCatalogue = () => (
    <div className="space-y-8">
      {[...new Set(shown.map((course) => course.track))].map((name) => {
        const { members, ordered } = inTrack(name);

        return (
          <section key={name} className="space-y-3">
            <header className="flex items-center gap-4">
              <h2 className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">{name}</h2>
              {ordered && (
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {t('courses.inOrder')}
                </span>
              )}
              <span className="h-px flex-1 bg-line" />
            </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  watched={watched[course.id] ?? []}
                  accent={accentFor(course.id)}
                  start={ordered && index === 0}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('courses.searchPlaceholder')}
          aria-label={t('courses.searchPlaceholder')}
          className="h-10 pl-10 text-sm"
        />
        {query !== '' && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label={t('courses.clearSearch')}
            className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-fail"
          >
            <X className="size-3" />
            {t('common.clear')}
          </button>
        )}
      </div>

      {needle === '' && (
        <div className="flex flex-wrap items-center gap-1.5">
          {renderTrackChip(t('common.all'), null, courses.length)}
          {tracks.map(([name, count]) => renderTrackChip(name, name, count))}
        </div>
      )}

      {needle === '' && renderCatalogue()}

      {needle !== '' && (
        <div className="space-y-6">
          {matching.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {t('nav.courses')}
              </h2>
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
                        {duration(t, course.seconds)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="space-y-2">
            <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {t('courses.lessons')}
              <span className="ml-2 font-mono text-[10px] tracking-normal normal-case">{hits.length}</span>
            </h2>

            {hits.length === 0 ? (
              <p className="rounded-2xl border border-line bg-panel/60 p-4 text-sm text-muted-foreground">
                {t('courses.noMatches', { query })}
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
