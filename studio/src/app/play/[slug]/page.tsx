import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PlaygroundRunner } from '@/components/playground-runner';
import { translator } from '@/i18n/lookup';
import { getDictionary, getLocale } from '@/i18n/server';
import { getPlaygroundItem } from '@/server/playground';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPlaygroundItem(slug);

  return { title: item?.title ?? slug };
}

export default async function PlayItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const [item, dictionary] = await Promise.all([getPlaygroundItem(slug), getDictionary(locale)]);

  if (!item) notFound();

  const t = translator(dictionary, locale);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-5 px-5 py-8">
      <header className="space-y-2">
        <Link
          href="/play"
          aria-label={t('play.back')}
          className="inline-flex size-8 items-center justify-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <h1 className="text-xl font-semibold">{item.title}</h1>
        {item.blurb && <p className="text-[13px] leading-relaxed text-muted-foreground">{item.blurb}</p>}

        <p className="font-mono text-[11px] text-muted-foreground">
          {t('play.youEdit')} {item.file}
        </p>

        {item.machine.reason && (
          <p className="font-mono text-[11px] text-muted-foreground">{item.machine.reason}</p>
        )}
      </header>

      <PlaygroundRunner item={item} />
    </main>
  );
}
