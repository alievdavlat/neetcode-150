import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Board, Collection, Company, Problem, ProblemStatus } from '@/lib/types';
import { ALL_BOARD } from '@/lib/meta';
import { STUDIO_ROOT } from './workspace';

const COLLECTIONS_DIR = path.join(STUDIO_ROOT, 'collections');
const DATA_DIR = path.join(STUDIO_ROOT, 'data');

/**
 * Which companies asked which problems. The file is imported, not computed, so
 * a problem this workspace does not have simply never appears in it.
 */
export async function getCompanies(): Promise<Company[]> {
  const raw = await readFile(path.join(DATA_DIR, 'companies.json'), 'utf8').catch(() => null);
  if (raw === null) return [];

  try {
    const parsed = JSON.parse(raw) as Company[];
    return Array.isArray(parsed) ? parsed.filter((entry) => entry.name && Array.isArray(entry.numbers)) : [];
  } catch {
    return [];
  }
}

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

/**
 * The collections as the home page needs them: counted, grouped, and with the
 * built-in board for everything in the workspace at the front. A file only ever
 * names numbers, so the counting has to happen against the real problem set.
 */
export async function getBoards(problems: Problem[], statuses: ProblemStatus[]): Promise<Board[]> {
  const solved = new Set(statuses.filter((status) => status.state === 'solved').map((status) => status.number));
  const collections = await getCollections();

  const builtIn: Collection = {
    id: ALL_BOARD,
    name: 'All Problems',
    description: 'Everything in this workspace, grouped by the pattern it teaches.',
    numbers: problems.map((problem) => problem.number),
    group: 'Curated lists',
  };

  return [builtIn, ...collections].map((entry) => {
    const wanted = new Set(entry.numbers);
    const members = problems.filter((problem) => wanted.has(problem.number));

    return {
      id: entry.id,
      name: entry.name,
      description: entry.description,
      group: entry.group ?? 'Curated lists',
      numbers: entry.numbers,
      total: members.length,
      easy: members.filter((problem) => problem.difficulty === 'Easy').length,
      medium: members.filter((problem) => problem.difficulty === 'Medium').length,
      hard: members.filter((problem) => problem.difficulty === 'Hard').length,
      solved: members.filter((problem) => solved.has(problem.number)).length,
    };
  });
}
