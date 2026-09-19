export const LOCALES = ['en', 'ru', 'uz'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Read on the server and written by the switcher; no locale in the URL. */
export const LOCALE_COOKIE = 'neetcode-studio-locale';

/** Each language named in itself, which is the only name its reader will scan for. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  uz: 'Oʻzbekcha',
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
