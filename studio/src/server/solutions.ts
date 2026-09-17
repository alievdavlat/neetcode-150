import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SolutionSnapshot } from '@/lib/types';
import { STUDIO_ROOT } from './workspace';

const SOLUTIONS_DIR = path.join(STUDIO_ROOT, '.studio', 'solutions');
const KEEP = 5;

const dirFor = (number: string) => {
  if (!/^\d{3}$/.test(number)) throw new Error(`not a problem number: ${number}`);
  return path.join(SOLUTIONS_DIR, number);
};

const stamp = (iso: string) => iso.replace(/[:.]/g, '-');

/** Keep the file as it stood when it passed, so a later practice run has something to diff against. */
export async function snapshotSolution(number: string, source: string): Promise<void> {
  const dir = dirFor(number);
  await mkdir(dir, { recursive: true });

  const existing = (await readdir(dir).catch(() => [])).filter((name) => name.endsWith('.ts')).sort();
  const newest = existing.at(-1);
  if (newest && (await readFile(path.join(dir, newest), 'utf8').catch(() => null)) === source) return;

  await writeFile(path.join(dir, `${stamp(new Date().toISOString())}.ts`), source, 'utf8');

  const stale = [...existing, 'placeholder'].slice(0, Math.max(0, existing.length + 1 - KEEP));
  await Promise.all(stale.filter((name) => name.endsWith('.ts')).map((name) => rm(path.join(dir, name), { force: true })));
}

export async function listSolutions(number: string): Promise<SolutionSnapshot[]> {
  const dir = dirFor(number);
  const names = (await readdir(dir).catch(() => [])).filter((name) => name.endsWith('.ts')).sort().reverse();

  return Promise.all(
    names.map(async (name) => ({
      at: name.replace('.ts', ''),
      source: await readFile(path.join(dir, name), 'utf8'),
    })),
  );
}
