import { tagsOfText } from './meta.ts';
import type { Difficulty } from './types.ts';

/** All a lesson needs to know about a problem, so a course page ships kilobytes. */
export interface PracticeProblem {
  number: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  /** Where in the walkthrough this problem is taught, when it is. */
  lessonAt?: number | null;
}

export interface Practice {
  named: PracticeProblem[];
  related: PracticeProblem[];
  tags: string[];
}

const SHORTEST_TITLE = 8;

const norm = (text: string) => ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;

/**
 * What to solve after a lesson, derived rather than curated.
 *
 * `at` is where the lesson starts, and the problem files carry the same
 * timestamp, so for the walkthrough the pairing is a fact rather than a read of
 * the title. Titles still carry the rest: they are how every other course finds
 * its problems, and how a short title - under {@link SHORTEST_TITLE} - is
 * matched at all. Then come problems that share the technique the title is
 * about. A lesson about nothing in the tag list simply has no practice, which
 * is the honest answer.
 */
export function practiceFor(
  title: string,
  problems: PracticeProblem[],
  at: number | null = null,
  limit = 8,
): Practice {
  const haystack = norm(title);
  const taught = at === null ? [] : problems.filter((problem) => problem.lessonAt === at);
  const already = new Set(taught.map((problem) => problem.number));

  const named = [
    ...taught,
    ...problems.filter(
      (problem) =>
        !already.has(problem.number) &&
        problem.title.length >= SHORTEST_TITLE &&
        haystack.includes(norm(problem.title)),
    ),
  ];

  const tags = tagsOfText(title);
  const seen = new Set(named.map((problem) => problem.number));
  const related =
    tags.length === 0
      ? []
      : problems
          .filter((problem) => !seen.has(problem.number) && problem.tags.some((tag) => tags.includes(tag)))
          .slice(0, limit);

  return { named, related, tags };
}
