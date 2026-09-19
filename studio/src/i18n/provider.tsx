'use client';

import { useMemo, type ReactNode } from 'react';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, type Locale } from './config';

interface I18nProviderProps {
  locale: Locale;
  /** The active language only, loaded on the server and handed over once. */
  dictionary: Record<string, unknown>;
  children: ReactNode;
}

/**
 * i18next rather than a plain lookup because of counting. Russian has three
 * plural forms - 1 запуск, 2 запуска, 5 запусков - and this app is full of
 * counts. A hand-rolled dictionary gets those wrong in a way readers notice.
 *
 * Only the active language is passed in, so the other two never become bytes
 * the browser has to download.
 */
export function I18nProvider({ locale, dictionary, children }: I18nProviderProps) {
  const instance = useMemo(() => {
    const created = createInstance();

    created.use(initReactI18next).init({
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      resources: { [locale]: { translation: dictionary } },
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });

    return created;
  }, [locale, dictionary]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
