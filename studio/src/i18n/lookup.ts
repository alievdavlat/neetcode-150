/** The extension is explicit so `tests/` can load this through type stripping. */
import { DEFAULT_LOCALE, type Locale } from './config.ts';

export type Values = Record<string, string | number>;

const read = (dictionary: unknown, key: string): unknown =>
  key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
      dictionary,
    );

/**
 * One string out of a nested dictionary, by dotted key. A key that is missing
 * comes back as itself: a screen with an untranslated label still works and
 * still says which key needs writing, which is better than a blank.
 *
 * `values` fills `{{name}}` placeholders. A `count` also picks the plural form,
 * by the same `_one`/`_few`/`_many`/`_other` convention i18next uses on the
 * client, so a server component and a client component render a count the same
 * way. Russian needs three forms, and getting them from Intl rather than by
 * hand is the whole reason this is not a plain string lookup.
 */
export function lookup(dictionary: unknown, key: string, values?: Values, locale: Locale = DEFAULT_LOCALE): string {
  const count = values?.count;
  const found =
    typeof count === 'number'
      ? (read(dictionary, `${key}_${new Intl.PluralRules(locale).select(count)}`) ??
        read(dictionary, `${key}_other`) ??
        read(dictionary, key))
      : read(dictionary, key);

  if (typeof found !== 'string') return key;
  if (!values) return found;

  return found.replace(/\{\{(\w+)\}\}/g, (whole, name: string) =>
    name in values ? String(values[name]) : whole,
  );
}

/** The same lookup bound to one dictionary, for a server component. */
export const translator =
  (dictionary: unknown, locale: Locale = DEFAULT_LOCALE) =>
  (key: string, values?: Values) =>
    lookup(dictionary, key, values, locale);
