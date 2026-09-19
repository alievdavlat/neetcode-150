import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Brand } from '@/components/brand';
import { SettingsForm } from '@/components/settings-form';
import { LanguagePicker } from '@/components/language-picker';
import { getDictionary, getLocale } from '@/i18n/server';
import { translator } from '@/i18n/lookup';
import { SHORTCUTS } from '@/lib/meta';
import { getStatuses } from '@/server/problems';
import { getSettings } from '@/server/settings';

export const dynamic = 'force-dynamic';

const SCOPES: { scope: 'board' | 'replay'; title: string; note: string }[] = [
  { scope: 'board', title: 'settings.keyboard.board', note: 'settings.keyboard.boardNote' },
  { scope: 'replay', title: 'settings.keyboard.replay', note: 'settings.keyboard.replayNote' },
];

export default async function SettingsPage() {
  const locale = await getLocale();
  const [settings, statuses, dictionary] = await Promise.all([
    getSettings(),
    getStatuses(),
    getDictionary(locale),
  ]);
  const due = statuses.filter((status) => status.history.due && !status.history.leech).length;
  const t = translator(dictionary);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-5 py-10">
      <header className="flex items-center gap-4">
        <Link
          href="/"
          aria-label={t('settings.back')}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <Brand subtitle={t('settings.title')} />
      </header>

      <div>
        <h2 className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">
          {t('settings.review.heading')}
        </h2>
        <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
          {t('settings.review.blurb')}
        </p>
        <SettingsForm settings={settings} due={due} />
      </div>

      <div>
        <h2 className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">
          {t('settings.keyboard.heading')}
        </h2>
        <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
          {t('settings.keyboard.blurb')}
        </p>

        {SCOPES.map(({ scope, title, note }) => {
          const rows = SHORTCUTS.filter((shortcut) => shortcut.scope === scope);
          if (rows.length === 0) return null;

          return (
            <section key={scope} className="mb-5">
              <header className="mb-2 flex items-baseline gap-2">
                <h3 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  {t(title)}
                </h3>
                <p className="text-[11px] text-muted-foreground/70">{t(note)}</p>
              </header>

              <dl className="overflow-hidden rounded-2xl border border-line bg-panel/60">
                {rows.map((shortcut, index) => (
                  <div
                    key={shortcut.id}
                    className={cn(
                      'flex items-baseline gap-3 px-3 py-2',
                      index > 0 && 'border-t border-line',
                    )}
                  >
                    <dt className="w-32 shrink-0">
                      <kbd className="rounded-md border border-line bg-white/[0.03] px-1.5 py-0.5 font-mono text-[11px] text-foreground/90">
                        {shortcut.keys}
                      </kbd>
                    </dt>
                    <dd className="text-[13px] leading-relaxed text-muted-foreground">
                      {t(`shortcut.${shortcut.id}`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>

      <div>
        <h2 className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">
          {t('settings.language.heading')}
        </h2>
        <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
          {t('settings.language.blurb')}
        </p>
        <LanguagePicker
          locale={locale}
          label={t('settings.language.label')}
          saving={t('settings.language.saving')}
        />
      </div>
    </main>
  );
}
