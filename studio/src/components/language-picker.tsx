'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LanguagePickerProps {
  locale: Locale;
  label: string;
  saving: string;
}

const A_YEAR = 60 * 60 * 24 * 365;

/**
 * The choice is a cookie rather than a path, so every link already written -
 * `/c/all?p=001` and the rest - keeps working and no bookmark breaks. The
 * refresh is what re-renders the server components with the other dictionary.
 */
export function LanguagePicker({ locale, label, saving }: LanguagePickerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const pick = (next: Locale) => {
    if (next === locale) return;

    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${A_YEAR}; samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div className="rounded-2xl border border-line bg-panel/60 p-3">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{label}</p>
        {pending && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            {saving}
          </span>
        )}
      </div>

      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {LOCALES.map((one) => (
          <button
            key={one}
            type="button"
            lang={one}
            aria-pressed={one === locale}
            disabled={pending}
            onClick={() => pick(one)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] transition-colors disabled:opacity-60',
              one === locale
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-line text-muted-foreground hover:border-primary/30 hover:text-foreground',
            )}
          >
            <Check className={cn('size-3 shrink-0', one === locale ? 'opacity-100' : 'opacity-0')} />
            {LOCALE_NAMES[one]}
          </button>
        ))}
      </div>
    </div>
  );
}
