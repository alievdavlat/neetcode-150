/**
 * One string out of a nested dictionary, by dotted key. A key that is missing
 * comes back as itself: a screen with an untranslated label still works and
 * still says which key needs writing, which is better than a blank.
 */
export function lookup(dictionary: unknown, key: string): string {
  const found = key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
      dictionary,
    );

  return typeof found === 'string' ? found : key;
}

/** The same lookup bound to one dictionary, for a server component. */
export const translator = (dictionary: unknown) => (key: string) => lookup(dictionary, key);
