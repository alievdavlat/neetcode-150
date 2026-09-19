import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Brand } from '@/components/brand';
import { SettingsForm } from '@/components/settings-form';
import { SHORTCUTS } from '@/lib/meta';
import { getStatuses } from '@/server/problems';
import { getSettings } from '@/server/settings';

export const dynamic = 'force-dynamic';

const SCOPES: { scope: 'board' | 'replay'; title: string; note: string }[] = [
  { scope: 'board', title: 'Anywhere on a board', note: 'while the editor or the list has focus' },
  { scope: 'replay', title: 'The replay', note: 'while the transport has focus' },
];

export default async function SettingsPage() {
  const [settings, statuses] = await Promise.all([getSettings(), getStatuses()]);
  const due = statuses.filter((status) => status.history.due && !status.history.leech).length;

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-5 py-10">
      <header className="flex items-center gap-4">
        <Link
          href="/"
          aria-label="Back"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <Brand subtitle="Settings" />
      </header>

      <div>
        <h2 className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">Review</h2>
        <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
          Solving a problem once does not keep it. These decide how hard the workspace pushes you
          to write it again.
        </p>
        <SettingsForm settings={settings} due={due} />
      </div>

      <div>
        <h2 className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">Keyboard</h2>
        <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
          Every shortcut the studio binds. The list is the one the handler reads, so it cannot
          drift from what actually fires.
        </p>

        {SCOPES.map(({ scope, title, note }) => {
          const rows = SHORTCUTS.filter((shortcut) => shortcut.scope === scope);
          if (rows.length === 0) return null;

          return (
            <section key={scope} className="mb-5">
              <header className="mb-2 flex items-baseline gap-2">
                <h3 className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  {title}
                </h3>
                <p className="text-[11px] text-muted-foreground/70">{note}</p>
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
                    <dd className="text-[13px] leading-relaxed text-muted-foreground">{shortcut.what}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
    </main>
  );
}
