import Link from 'next/link';
import type { Metadata } from 'next';
import { FlaskConical, Hammer } from 'lucide-react';
import { translator } from '@/i18n/lookup';
import { getDictionary, getLocale } from '@/i18n/server';
import { getPlayground } from '@/server/playground';
import type { PlaygroundItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/** Every tab said "Problems" otherwise, which is no help with six of them open. */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return { title: translator(await getDictionary(locale), locale)('play.title') };
}

const STATE_STYLE: Record<PlaygroundItem['machine']['state'], string> = {
  ready: 'border-pass/40 text-pass',
  heavy: 'border-amber-500/40 text-amber-400',
  unavailable: 'border-fail/40 text-fail',
};

export default async function PlayPage() {
  const locale = await getLocale();
  /** The page says what it could not read rather than becoming an error page. */
  const [playground, dictionary] = await Promise.all([
    getPlayground().then(
      (payload) => ({ ...payload, error: null as string | null }),
      (error: unknown) => ({
        machine: null,
        items: [],
        error: error instanceof Error ? error.message : String(error),
      }),
    ),
    getDictionary(locale),
  ]);

  const { machine, items } = playground;
  const t = translator(dictionary, locale);

  const renderItem = (item: PlaygroundItem) => (
    <li key={`${item.kind}-${item.slug}`}>
      <Link
        href={`/play/${item.slug}`}
        className="block rounded-2xl border border-line bg-panel/60 p-4 transition-colors hover:border-primary/40"
      >
        <div className="flex flex-wrap items-center gap-2">
          {item.kind === 'challenge' ? (
            <Hammer className="size-3.5 text-primary" />
          ) : (
            <FlaskConical className="size-3.5 text-primary" />
          )}
          <span className="text-[13px] font-medium">{item.title}</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {t(item.kind === 'challenge' ? 'play.stages' : 'play.checks', { count: item.steps.length })}
          </span>
          <span
            className={cn(
              'ml-auto rounded-full border px-2 py-0.5 text-[10px] tracking-wide uppercase',
              STATE_STYLE[item.machine.state],
            )}
          >
            {t(`play.state.${item.machine.state}`)}
          </span>
        </div>

        {item.blurb && <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{item.blurb}</p>}

        {item.machine.reason && (
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">{item.machine.reason}</p>
        )}
      </Link>
    </li>
  );

  return (
    <main className="mx-auto w-full max-w-4xl space-y-5 px-5 py-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">{t('play.title')}</h1>
        <p className="text-[13px] text-muted-foreground">{t('play.blurb')}</p>
        {machine && (
          <p className="font-mono text-[11px] text-muted-foreground">
            {t('play.machine', {
              cores: machine.cores,
              free: machine.freeMb,
              docker: machine.docker.available ? `${machine.docker.memoryMb} MB` : t('play.noDocker'),
            })}
          </p>
        )}
      </header>

      {playground.error && (
        <p className="rounded-2xl border border-fail/40 bg-fail/[0.06] p-4 font-mono text-[11px] text-fail">
          {playground.error}
        </p>
      )}

      {items.length === 0 && !playground.error ? (
        <p className="text-[13px] text-muted-foreground">{t('play.empty')}</p>
      ) : (
        <ul className="space-y-3">{items.map(renderItem)}</ul>
      )}
    </main>
  );
}
