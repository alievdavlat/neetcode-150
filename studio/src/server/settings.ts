import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Settings } from '@/lib/types';
import { STUDIO_ROOT } from './workspace';

const SETTINGS_FILE = path.join(STUDIO_ROOT, '.studio', 'settings.json');

export const DEFAULT_SETTINGS: Settings = {
  reviewEnabled: true,
  strictMode: false,
  dailyCap: 8,
};

const clampCap = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(40, Math.max(1, Math.round(value)))
    : DEFAULT_SETTINGS.dailyCap;

export async function getSettings(): Promise<Settings> {
  const raw = await readFile(SETTINGS_FILE, 'utf8').catch(() => null);
  if (raw === null) return { ...DEFAULT_SETTINGS };

  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      reviewEnabled: parsed.reviewEnabled !== false,
      strictMode: parsed.strictMode === true,
      dailyCap: clampCap(parsed.dailyCap),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** Written through a temp file, like the history log, so a crash cannot empty it. */
export async function saveSettings(next: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const merged: Settings = {
    reviewEnabled: next.reviewEnabled ?? current.reviewEnabled,
    strictMode: next.strictMode ?? current.strictMode,
    dailyCap: next.dailyCap === undefined ? current.dailyCap : clampCap(next.dailyCap),
  };

  const temp = `${SETTINGS_FILE}.tmp`;
  await mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  await writeFile(temp, `${JSON.stringify(merged, null, 2)}\n`);
  await rename(temp, SETTINGS_FILE);

  return merged;
}
