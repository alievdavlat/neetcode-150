'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowRight, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Brand } from './brand';
import { BoardCard } from './board-card';
import { ActivityGrid } from './activity-grid';
import { CommandPalette } from './command-palette';
import { ContinueCard } from './continue-card';
import { DueSoon } from './due-soon';
import { ReviewQueue } from './review-queue';
import { TagStrip, type Tag } from './tag-strip';
import { accentFor, ALL_BOARD, DIFFICULTY_META, STATE_META, tagsOf } from '@/lib/meta';
import type { ActivityDay } from '@/server/history';
import type { Board, Company, Course, Problem, ProblemStatus, Settings } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HomeProps {
  problems: Problem[];
  statuses: ProblemStatus[];
  boards: Board[];
  companies: Company[];
  courses: Course[];
  activity: { days: ActivityDay[]; total: number; streak: number };
  settings: Settings;
}

type Source = 'topics' | 'companies';

/** The key of the line under the strip, which explains where the counts come from. */
const HINT: Record<Source, string> = {
  topics: 'home.hintTopics',
  companies: 'home.hintCompanies',
};

const RESULT_LIMIT = 60;

export function Home({ problems, statuses, boards, companies, courses, activity, settings }: HomeProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [source, setSource] = useState<Source>('topics');
  const [picked, setPicked] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const byNumber = useMemo(
    () => Object.fromEntries(statuses.map((status) => [status.number, status])),
    [statuses],
  );

  /** The same jump the board has, so it is one shortcut everywhere. */
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;

      event.preventDefault();
      setPaletteOpen((open) => !open);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const state = useMemo(
    () => Object.fromEntries(statuses.map((status) => [status.number, status.state])),
    [statuses],
  );

  const tagged = useMemo(
    () => problems.map((problem) => ({ problem, tags: tagsOf(problem) })),
    [problems],
  );

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of tagged) for (const tag of entry.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);

    return [...counts]
      .map(([name, count]): Tag => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [tagged]);

  const tags: Tag[] =
    source === 'topics'
      ? topics
      : companies.map((entry) => ({ name: entry.name, count: entry.numbers.length }));

  const results = useMemo(() => {
    if (!picked) return [];

    if (source === 'topics') {
      return tagged.filter((entry) => entry.tags.includes(picked)).map((entry) => entry.problem);
    }

    const wanted = new Set(companies.find((entry) => entry.name === picked)?.numbers ?? []);
    return problems.filter((problem) => wanted.has(problem.number));
  }, [picked, source, tagged, companies, problems]);

  const handleSource = (next: Source) => {
    setSource(next);
    setPicked(null);
  };

  const solved = statuses.filter((status) => status.state === 'solved').length;
  const sections = [...new Set(boards.map((board) => board.group))];

  const renderHero = () => (
    <header className="flex flex-wrap items-end gap-6">
      <Brand subtitle={t('home.subtitle', { count: problems.length })} large />

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/settings"
          aria-label={t('nav.settings')}
          title={t('home.settingsHint')}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Settings2 className="size-4" />
        </Link>

        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-cool"
            style={{ width: `${problems.length === 0 ? 0 : (solved / problems.length) * 100}%` }}
          />
        </div>
        <span className="font-mono text-xs tabular-nums">
          <span className="text-primary">{solved}</span>
          <span className="text-muted-foreground">/{problems.length}</span>
        </span>
      </div>
    </header>
  );

  const renderSources = () => (
    <div role="group" aria-label={t('home.tagSource')} className="flex items-center gap-1">
      {(['topics', 'companies'] as Source[]).map((entry) => (
        <button
          key={entry}
          type="button"
          aria-pressed={source === entry}
          disabled={entry === 'companies' && companies.length === 0}
          onClick={() => handleSource(entry)}
          className={cn(
            'rounded-md px-1.5 py-0.5 text-[13px] font-semibold capitalize transition-colors disabled:opacity-40',
            source === entry ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t(`home.source.${entry}`)}
        </button>
      ))}
    </div>
  );

  const renderResult = (problem: Problem, index: number) => (
    <motion.li
      key={problem.number}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.015, 0.25) }}
    >
      <Link
        href={`/c/${ALL_BOARD}?p=${problem.number}`}
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04]"
      >
        <span className={cn('size-1.5 shrink-0 rounded-full', STATE_META[state[problem.number] ?? 'not-started'].dot)} />
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{problem.number}</span>
        <span className="min-w-0 flex-1 truncate text-[13px]">{problem.title}</span>
        <span className="hidden text-[11px] text-muted-foreground sm:inline">{problem.category}</span>
        <span className={cn('w-12 text-right text-[11px]', DIFFICULTY_META[problem.difficulty].text)}>
          {t(DIFFICULTY_META[problem.difficulty].label)}
        </span>
      </Link>
    </motion.li>
  );

  const renderResults = () => (
    <section className="rounded-2xl border border-line bg-panel/60 p-3">
      <header className="mb-2 flex items-center gap-2 px-2">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {picked}
        </p>
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {t('home.problemCount', { count: results.length })}
        </p>

        <button
          type="button"
          onClick={() => setPicked(null)}
          className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('home.allCollections')}
          <ArrowRight className="size-3" />
        </button>
      </header>

      <ul className="space-y-px">{results.slice(0, RESULT_LIMIT).map(renderResult)}</ul>

      {results.length > RESULT_LIMIT && (
        <p className="px-3 pt-2 text-[11px] text-muted-foreground">
          {t('home.andMore', { more: results.length - RESULT_LIMIT })}{' '}
          {source === 'topics' ? (
            <Link
              href={`/c/${ALL_BOARD}?tag=${encodeURIComponent(picked ?? '')}`}
              className="text-foreground underline decoration-line underline-offset-2 transition-colors hover:decoration-primary"
            >
              {t('home.openFiltered', { tag: picked ?? '' })}
            </Link>
          ) : (
            t('home.openBoardAll')
          )}
        </p>
      )}
    </section>
  );

  const renderSection = (group: string) => {
    const members = boards.filter((board) => board.group === group);

    return (
      <section key={group} className="space-y-3">
        <header className="flex items-center gap-4">
          <h2 className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">{group}</h2>
          <span className="h-px flex-1 bg-line" />
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((board) => (
            <BoardCard key={board.id} board={board} accent={accentFor(board.id)} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-5 py-10">
      <CommandPalette
        open={paletteOpen}
        problems={problems}
        statuses={byNumber}
        courses={courses}
        onOpenChange={setPaletteOpen}
        onSelect={(number) => router.push(`/c/${ALL_BOARD}?p=${number}`)}
        onCourse={(id) => router.push(`/courses/${id}`)}
      />

      {renderHero()}

      <ContinueCard problems={problems} courses={courses} />

      <ActivityGrid days={activity.days} total={activity.total} streak={activity.streak} />

      {settings.reviewEnabled && <DueSoon problems={problems} statuses={statuses} />}

      {settings.reviewEnabled && (
        <ReviewQueue
          problems={problems}
          statuses={statuses}
          tags={topics.map((tag) => tag.name)}
          dailyCap={settings.dailyCap}
        />
      )}

      <TagStrip
        title={renderSources()}
        hint={t(HINT[source])}
        placeholder={source === 'topics' ? t('home.searchTopics') : t('home.searchCompanies')}
        tags={tags}
        picked={picked}
        onPick={setPicked}
      />

      {picked ? renderResults() : sections.map(renderSection)}
    </main>
  );
}
