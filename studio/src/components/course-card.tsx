import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { duration } from '@/lib/meta';
import type { Course } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  watched: number[];
  accent: string;
  /** First in a track that has an order, so a newcomer knows where to begin. */
  start?: boolean;
}

export function CourseCard({ course, watched, accent, start = false }: CourseCardProps) {
  const seen = new Set(watched);
  const percent = course.lessons.length === 0 ? 0 : Math.round((seen.size / course.lessons.length) * 100);

  /** What is left to watch is the number that decides whether to start today. */
  const left = course.lessons
    .filter((lesson) => !seen.has(lesson.at))
    .reduce((total, lesson) => total + lesson.seconds, 0);

  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel/60 transition-colors hover:border-primary/40"
    >
      <div className={cn('relative flex h-16 items-end overflow-hidden bg-linear-to-br p-3', accent)}>
        <span aria-hidden className="grid-floor absolute inset-0 opacity-50" />
        <div className="relative min-w-0">
          <p className="font-heading text-base leading-tight font-bold text-white drop-shadow-md">
            {course.name}
          </p>
          {start && (
            <p className="mt-0.5 font-mono text-[10px] tracking-wide text-white/80 uppercase">Start here</p>
          )}
        </div>
        <p className="absolute top-3 right-3 font-mono text-[11px] text-white/85 tabular-nums">
          {left === 0 ? duration(course.seconds) : `${duration(left)} left`}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{course.blurb}</p>

        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <PlayCircle className="size-3 text-cool" />
            <span>{course.channel}</span>
            <span className="ml-auto tabular-nums">
              {seen.size}/{course.lessons.length}
            </span>
          </div>

          <Progress value={percent} className="h-1" />
        </div>
      </div>
    </Link>
  );
}
