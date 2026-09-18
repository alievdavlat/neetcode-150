import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Brand } from '@/components/brand';
import { SettingsForm } from '@/components/settings-form';
import { getStatuses } from '@/server/problems';
import { getSettings } from '@/server/settings';

export const dynamic = 'force-dynamic';

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
    </main>
  );
}
