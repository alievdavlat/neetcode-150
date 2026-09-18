import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { STUDIO_ROOT } from './workspace';

const NOTES_DIR = path.join(STUDIO_ROOT, '.studio', 'notes');
const MAX_NOTE_BYTES = 64 * 1024;

const fileFor = (number: string) => {
  if (!/^\d{3,4}$/.test(number)) throw new Error(`not a problem number: ${number}`);
  return path.join(NOTES_DIR, `${number}.md`);
};

export async function readNote(number: string): Promise<string> {
  return (await readFile(fileFor(number), 'utf8').catch(() => '')) as string;
}

export async function writeNote(number: string, text: string): Promise<void> {
  if (Buffer.byteLength(text) > MAX_NOTE_BYTES) throw new Error('that note is too long');

  const target = fileFor(number);
  const temp = `${target}.tmp`;

  await mkdir(NOTES_DIR, { recursive: true });
  await writeFile(temp, text, 'utf8');
  await rename(temp, target);
}
