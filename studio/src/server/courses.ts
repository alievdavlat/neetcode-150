import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Course } from '@/lib/types';
import { STUDIO_ROOT } from './workspace';

const COURSE_DIR = path.join(STUDIO_ROOT, 'courses');
const WATCHED_FILE = path.join(STUDIO_ROOT, '.studio', 'courses.json');

type Watched = Record<string, number[]>;

/**
 * Courses are whole files written by `npm run courses`, never by the app: the
 * title, the channel, the length and the chapter list all come from the video
 * itself. Nothing here invents a lesson.
 */
export async function getCourses(): Promise<Course[]> {
  const names = await readdir(COURSE_DIR).catch(() => []);
  const files = names.filter((name) => name.endsWith('.json'));

  const courses = await Promise.all(
    files.map(async (name) => {
      const raw = await readFile(path.join(COURSE_DIR, name), 'utf8').catch(() => null);
      if (raw === null) return null;

      try {
        return JSON.parse(raw) as Course;
      } catch {
        return null;
      }
    }),
  );

  return courses
    .filter((course): course is Course => course !== null && Array.isArray(course.lessons))
    .sort((left, right) => left.track.localeCompare(right.track) || left.name.localeCompare(right.name));
}

export async function getCourse(id: string): Promise<Course | null> {
  return (await getCourses()).find((course) => course.id === id) ?? null;
}

export async function getWatched(): Promise<Watched> {
  const raw = await readFile(WATCHED_FILE, 'utf8').catch(() => null);
  if (raw === null) return {};

  try {
    const parsed = JSON.parse(raw) as Watched;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/** Marking a lesson watched is the student's own claim, so it is stored as one. */
export async function setWatched(course: string, at: number, watched: boolean): Promise<number[]> {
  const all = await getWatched();
  const current = new Set(all[course] ?? []);

  if (watched) current.add(at);
  else current.delete(at);

  all[course] = [...current].sort((left, right) => left - right);

  const temp = `${WATCHED_FILE}.tmp`;
  await mkdir(path.dirname(WATCHED_FILE), { recursive: true });
  await writeFile(temp, `${JSON.stringify(all, null, 2)}\n`);
  await rename(temp, WATCHED_FILE);

  return all[course];
}
