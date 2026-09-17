import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { WORKSPACE_ROOT } from './workspace';

const LINK = /\]\(\.\/(\d{3})-/;
const MARKS = { done: '☑', open: '☐' };

/**
 * Tick the Done column of a category README from real verdicts. The table is
 * generated, so only the mark inside an existing cell is touched — a row that
 * does not carry a checkbox is left exactly as it is.
 */
export async function syncCategoryReadme(dir: string, solved: Set<string>): Promise<boolean> {
  const file = path.join(WORKSPACE_ROOT, dir, 'README.md');
  const source = await readFile(file, 'utf8').catch(() => null);
  if (source === null) return false;

  const updated = source
    .split('\n')
    .map((line) => {
      if (!line.startsWith('|')) return line;

      const cells = line.split('|');
      const number = cells[3]?.match(LINK)?.[1];
      if (!number || !/^\s*[☐☑]\s*$/.test(cells[2] ?? '')) return line;

      cells[2] = cells[2].replace(/[☐☑]/, solved.has(number) ? MARKS.done : MARKS.open);
      return cells.join('|');
    })
    .join('\n');

  if (updated === source) return false;

  await writeFile(file, updated, 'utf8');
  return true;
}
