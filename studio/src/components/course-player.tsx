'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, ExternalLink, FlaskConical, Hammer, NotebookPen, Play } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { request } from '@/lib/api';
import { ALL_BOARD, DIFFICULTY_META, duration, stamp } from '@/lib/meta';
import { practiceFor, type PracticeProblem } from '@/lib/practice';
import type { Course, PlaygroundItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CoursePlayerProps {
  course: Course;
  watched: number[];
  /** The workspace's problems, trimmed to what a lesson needs to link to one. */
  practice: PracticeProblem[];
  /** Challenges and labs, matched to a lesson by the course and timestamp they declare. */
  playground: PlaygroundItem[];
  /** What you wrote against each lesson, keyed by where it starts. */
  notes: Record<string, string>;
  /** A link can name the lesson: `/courses/<id>?at=<seconds>`. */
  start?: number;
}

const LESSON_KEY = 'neetcode-studio:lesson';
const LAST_COURSE_KEY = 'neetcode-studio:last-course';

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

export function CoursePlayer({ course, watched, practice, playground, notes, start }: CoursePlayerProps) {
  const { t } = useTranslation();
  const [seen, setSeen] = useState<number[]>(watched);
  const [current, setCurrent] = useState(() => {
    const asked = course.lessons.findIndex((entry) => entry.at === start);
    return asked === -1 ? 0 : asked;
  });
  const [saving, setSaving] = useState<number | null>(null);
  const [written, setWritten] = useState<Record<string, string>>(notes);
  const [draft, setDraft] = useState('');

  /** The box follows the lesson: switching lessons loads that lesson's note. */
  useEffect(() => {
    setDraft(written[course.lessons[current]?.at ?? -1] ?? '');
  }, [current, course.lessons, written]);

  /** Without a lesson in the link, carry on from wherever this course was left. */
  useEffect(() => {
    if (start !== undefined) return;

    const stored = Number(window.localStorage.getItem(`${LESSON_KEY}:${course.id}`));
    if (Number.isInteger(stored) && stored > 0 && stored < course.lessons.length) setCurrent(stored);
  }, [course.id, course.lessons.length, start]);

  const handleNote = () => {
    if (!lesson) return;

    const at = lesson.at;
    request<{ note: string }>('/api/courses/note', {
      method: 'PUT',
      body: JSON.stringify({ course: course.id, at, note: draft }),
    })
      .then((payload) => {
        setWritten((current) => ({ ...current, [at]: payload.note }));
        toast.success(t('courses.noteSaved'));
      })
      .catch((error: unknown) => toast.error(messageOf(error)));
  };

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

  /** A note belongs to the lesson, so it follows the lesson rather than the course. */
  const renderNote = () => {
    if (!lesson) return null;

    const stored = written[lesson.at] ?? '';

    return (
      <section className="space-y-2 rounded-2xl border border-line bg-panel/60 p-3">
        <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {t('courses.lessonNote')}
        </h2>

        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t('courses.notePlaceholder')}
          aria-label={t('courses.lessonNote')}
          className="min-h-16 bg-white/[0.02] text-[13px]"
        />

        {draft !== stored && (
          <Button size="sm" variant="outline" onClick={handleNote} className="gap-1.5">
            <NotebookPen className="size-3.5" />
            {t('courses.saveNote')}
          </Button>
        )}
      </section>
    );
  };

  /**
   * A challenge or a lab says which lesson it belongs to, so this is a lookup
   * rather than the guess the problem list has to make from titles and tags.
   */
  const renderBuild = () => {
    if (!lesson) return null;

    const here = playground.filter((item) => item.course === course.id && item.lessonAt === lesson.at);
    if (here.length === 0) return null;

    return (
      <section className="space-y-2 rounded-2xl border border-primary/25 bg-primary/[0.05] p-3">
        <h2 className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">{t('courses.build')}</h2>

        <ul className="space-y-px">
          {here.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/play/${item.slug}`}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
              >
                {item.kind === 'challenge' ? (
                  <Hammer className="size-3 shrink-0 text-primary" />
                ) : (
                  <FlaskConical className="size-3 shrink-0 text-primary" />
                )}
                <span className="min-w-0 flex-1 truncate text-[13px]">{item.title}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {t(item.kind === 'challenge' ? 'play.stages' : 'play.checks', { count: item.steps.length })}
                </span>
                <ArrowUpRight className="size-3 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  /** Watching is not solving: what this lesson is about, in the workspace. */
  const renderPractice = () => {
    if (!lesson) return null;

    const { named, related, tags } = practiceFor(lesson.title, practice, lesson.at);
    const shown = [...named, ...related];
    if (shown.length === 0) return null;

    return (
      <section className="space-y-2 rounded-2xl border border-line bg-panel/60 p-3">
        <header className="flex flex-wrap items-center gap-2">
          <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t('courses.practice')}
          </h2>
          {named.length > 0 && (
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
              {t('courses.namedInLesson')}
            </span>
          )}
          {tags.map((tag) => (
            <span key={tag} className="font-mono text-[10px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </header>

        <ul className="space-y-px">
          {shown.map((problem) => (
            <li key={problem.number}>
              <Link
                href={`/c/${ALL_BOARD}?p=${problem.number}`}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
              >
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{problem.number}</span>
                <span className="min-w-0 flex-1 truncate text-[13px]">{problem.title}</span>
                <span className={cn('text-[10px]', DIFFICULTY_META[problem.difficulty].text)}>
                  {t(DIFFICULTY_META[problem.difficulty].label)}
                </span>
                <ArrowUpRight className="size-3 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
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
          aria-label={
            done.has(entry.at)
              ? t('courses.markTitleUnwatched', { title: entry.title })
              : t('courses.markTitleWatched', { title: entry.title })
          }
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
            {duration(t, entry.seconds)}
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
            {stamp(lesson?.at ?? 0)} · {duration(t, lesson?.seconds ?? 0)}
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
            {done.has(lesson?.at ?? -1) ? t('courses.watched') : t('courses.markWatched')}
          </button>

          {current + 1 < course.lessons.length && (
            <button
              type="button"
              onClick={() => handlePick(current + 1)}
              className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Play className="size-3.5" />
              {t('courses.nextLesson')}
            </button>
          )}
        </div>

        {renderBuild()}
        {renderPractice()}
        {renderNote()}
      </div>

      <aside className="flex min-h-0 flex-col rounded-2xl border border-line bg-panel/60">
        <header className="space-y-2 border-b border-line p-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {t('courses.lessons')}
            </h2>
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
