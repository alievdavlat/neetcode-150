'use client';

import { useEffect, useState } from 'react';
import { Check, ExternalLink, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { request } from '@/lib/api';
import { duration, stamp } from '@/lib/meta';
import type { Course } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CoursePlayerProps {
  course: Course;
  watched: number[];
  /** A link can name the lesson: `/courses/<id>?at=<seconds>`. */
  start?: number;
}

const LESSON_KEY = 'neetcode-studio:lesson';
const LAST_COURSE_KEY = 'neetcode-studio:last-course';

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

export function CoursePlayer({ course, watched, start }: CoursePlayerProps) {
  const [seen, setSeen] = useState<number[]>(watched);
  const [current, setCurrent] = useState(() => {
    const asked = course.lessons.findIndex((entry) => entry.at === start);
    return asked === -1 ? 0 : asked;
  });
  const [saving, setSaving] = useState<number | null>(null);

  /** Without a lesson in the link, carry on from wherever this course was left. */
  useEffect(() => {
    if (start !== undefined) return;

    const stored = Number(window.localStorage.getItem(`${LESSON_KEY}:${course.id}`));
    if (Number.isInteger(stored) && stored > 0 && stored < course.lessons.length) setCurrent(stored);
  }, [course.id, course.lessons.length, start]);

  const handlePick = (index: number) => {
    window.localStorage.setItem(`${LESSON_KEY}:${course.id}`, String(index));
    window.localStorage.setItem(LAST_COURSE_KEY, course.id);
    setCurrent(index);
  };

  const lesson = course.lessons[current];
  const done = new Set(seen);
  const percent = course.lessons.length === 0 ? 0 : Math.round((seen.length / course.lessons.length) * 100);

  const handleWatched = (at: number) => {
    setSaving(at);
    request<{ watched: number[] }>('/api/courses', {
      method: 'PUT',
      body: JSON.stringify({ course: course.id, at, watched: !done.has(at) }),
    })
      .then((payload) => setSeen(payload.watched))
      .catch((error: unknown) => toast.error(messageOf(error)))
      .finally(() => setSaving(null));
  };

  const renderLesson = (entry: Course['lessons'][number], index: number) => {
    const playing = index === current;

    return (
      <li key={entry.at} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleWatched(entry.at)}
          disabled={saving === entry.at}
          aria-pressed={done.has(entry.at)}
          aria-label={done.has(entry.at) ? `Mark ${entry.title} unwatched` : `Mark ${entry.title} watched`}
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
            done.has(entry.at)
              ? 'border-pass/50 bg-pass/15 text-pass'
              : 'border-line text-transparent hover:border-pass/40',
          )}
        >
          <Check className="size-3" />
        </button>

        <button
          type="button"
          onClick={() => handlePick(index)}
          aria-current={playing ? 'true' : undefined}
          className={cn(
            'flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors',
            playing ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-white/[0.03] hover:text-foreground',
          )}
        >
          <span className="w-6 shrink-0 font-mono text-[10px] tabular-nums opacity-60">{index + 1}</span>
          <span className="min-w-0 flex-1 truncate text-[13px]">{entry.title}</span>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums">{stamp(entry.at)}</span>
          <span className="w-12 shrink-0 text-right font-mono text-[10px] text-muted-foreground tabular-nums">
            {duration(entry.seconds)}
          </span>
        </button>
      </li>
    );
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-3">
        <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-black">
          <iframe
            key={lesson?.at ?? 0}
            src={`https://www.youtube-nocookie.com/embed/${course.video}?start=${lesson?.at ?? 0}&rel=0`}
            title={course.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-heading text-sm font-semibold">
            {current + 1}. {lesson?.title}
          </h2>
          <span className="font-mono text-[11px] text-muted-foreground">
            {stamp(lesson?.at ?? 0)} · {duration(lesson?.seconds ?? 0)}
          </span>

          <button
            type="button"
            onClick={() => handleWatched(lesson.at)}
            className={cn(
              'ml-auto flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] transition-colors',
              done.has(lesson?.at ?? -1)
                ? 'border-pass/40 bg-pass/10 text-pass'
                : 'border-line text-muted-foreground hover:border-pass/40 hover:text-pass',
            )}
          >
            <Check className="size-3.5" />
            {done.has(lesson?.at ?? -1) ? 'Watched' : 'Mark watched'}
          </button>

          {current + 1 < course.lessons.length && (
            <button
              type="button"
              onClick={() => handlePick(current + 1)}
              className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Play className="size-3.5" />
              Next lesson
            </button>
          )}
        </div>
      </div>

      <aside className="flex min-h-0 flex-col rounded-2xl border border-line bg-panel/60">
        <header className="space-y-2 border-b border-line p-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Lessons</h2>
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {seen.length}/{course.lessons.length}
            </span>

            <a
              href={course.url}
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              YouTube
              <ExternalLink className="size-3" />
            </a>
          </div>

          <Progress value={percent} className="h-1" />
        </header>

        <ScrollArea className="min-h-0 flex-1">
          <ul className="space-y-px p-2">{course.lessons.map(renderLesson)}</ul>
        </ScrollArea>
      </aside>
    </div>
  );
}
