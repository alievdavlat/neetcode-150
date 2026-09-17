import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Collection } from '@/lib/types';
import { STUDIO_ROOT } from './workspace';

const COLLECTIONS_DIR = path.join(STUDIO_ROOT, 'collections');

/**
 * Named problem lists on top of the generated set. A file holds the numbers it
 * covers, so a list can never invent a problem this workspace does not have.
 */
export async function getCollections(): Promise<Collection[]> {
  const files = await readdir(COLLECTIONS_DIR).catch(() => []);
  const custom = await Promise.all(
    files
      .filter((name) => name.endsWith('.json'))
      .sort()
      .map(async (name) => {
        const raw = await readFile(path.join(COLLECTIONS_DIR, name), 'utf8').catch(() => null);
        if (raw === null) return null;

        try {
          const parsed = JSON.parse(raw) as Collection;
          return parsed.id && Array.isArray(parsed.numbers) ? parsed : null;
        } catch {
          return null;
        }
      }),
  );

  return custom.filter((entry) => entry !== null);
}
