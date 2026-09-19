'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, ListChecks } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ALL_BOARD, stamp } from '@/lib/meta';
import type { Course, Problem } from '@/lib/types';

interface ContinueCardProps {
  problems: Problem[];
  courses: Course[];
}

const LAST_PROBLEM = 'neetcode-studio:last-problem';
const LAST_COURSE = 'neetcode-studio:last-course';
const LESSON = 'neetcode-studio:lesson';

/** Where you were, read from this browser: the app never guesses it on the server. */
export function ContinueCard({ problems, courses }: ContinueCardProps) {
  const { t } = useTranslation();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState(0);

  useEffect(() => {
    const number = window.localStorage.getItem(LAST_PROBLEM);
    setProblem(problems.find((entry) => entry.number === number) ?? null);

    const id = window.localStorage.getItem(LAST_COURSE);
    const found = courses.find((entry) => entry.id === id) ?? null;
    setCourse(found);

    if (!found) return;
    const index = Number(window.localStorage.getItem(`${LESSON}:${found.id}`));
    setLesson(Number.isInteger(index) && index > 0 && index < found.lessons.length ? index : 0);
  }, [problems, courses]);

  if (!problem && !course) return null;

  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {problem && (
        <Link
          href={`/c/${ALL_BOARD}?p=${problem.number}`}
          className="flex items-center gap-3 rounded-2xl border border-line bg-panel/60 p-4 transition-colors hover:border-primary/40"
        >
          <ListChecks className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              {t('home.carryOn')}
            </span>
            <span className="block truncate text-[13px]">
              {problem.number} · {problem.title}
            </span>
          </span>
        </Link>
      )}

      {course && (
        <Link
          href={`/courses/${course.id}?at=${course.lessons[lesson]?.at ?? 0}`}
          className="flex items-center gap-3 rounded-2xl border border-line bg-panel/60 p-4 transition-colors hover:border-cool/40"
        >
          <GraduationCap className="size-4 shrink-0 text-cool" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              {course.name} · {stamp(course.lessons[lesson]?.at ?? 0)}
            </span>
            <span className="block truncate text-[13px]">
              {lesson + 1}. {course.lessons[lesson]?.title}
            </span>
          </span>
        </Link>
      )}
    </section>
  );
}
