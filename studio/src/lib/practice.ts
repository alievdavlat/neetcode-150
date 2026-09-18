import { tagsOfText } from './meta.ts';
import type { Difficulty } from './types.ts';

/** All a lesson needs to know about a problem, so a course page ships kilobytes. */
export interface PracticeProblem {
  number: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface Practice {
  named: PracticeProblem[];
  related: PracticeProblem[];
  tags: string[];
}

const SHORTEST_TITLE = 8;

const norm = (text: string) => ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;

/**
 * What to solve after a lesson, derived rather than curated: problems the lesson
 * names outright — a walkthrough's chapters are problem titles — and then
 * problems that share the technique its title is about. A lesson about nothing
 * in the tag list simply has no practice, which is the honest answer.
 */
export function practiceFor(title: string, problems: PracticeProblem[], limit = 8): Practice {
  const haystack = norm(title);
  const named = problems.filter(
    (problem) => problem.title.length >= SHORTEST_TITLE && haystack.includes(norm(problem.title)),
  );

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
