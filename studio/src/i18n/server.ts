import 'server-only';
import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from './config';

/**
 * One dictionary per language, imported on demand. Only the active one is ever
 * read, and because this runs on the server the other two never become bytes the
 * browser has to fetch.
 */
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ru: () => import('./dictionaries/ru.json').then((module) => module.default),
  uz: () => import('./dictionaries/uz.json').then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>;

export async function getLocale(): Promise<Locale> {
  const asked = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(asked) ? asked : DEFAULT_LOCALE;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]() as Promise<Dictionary>;
}
