import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { chapterFor, VIDEO_URL } from '../../_gen/chapters.mjs';
import { localize } from '../../_gen/i18n/index.mjs';

/**
 * Print every problem as JSON for the studio UI. Reads only `_gen/data`, never a
 * solution file, so it stays fast and cannot be tripped by a loop in an attempt.
 */
/** The language is asked for here so the studio only ever holds one. */
const [locale = 'en'] = process.argv.slice(2);
const problems = await localize(await loadProblems(), locale);

const payload = problems.map((problem) => {
  /** The lesson that teaches it, so the studio can line the two up. */
  const chapter = chapterFor.get(Number(problem.number));

  return {
  number: problem.number,
  title: problem.title,
  slug: problem.slug,
  difficulty: problem.difficulty,
  category: problem.category,
  dir: problem.dir,
  file: problem.file,
  pattern: problem.pattern,
  complexity: problem.complexity,
  statement: problem.statement.trim(),
  examples: (problem.examples ?? []).map((example) => example.trim()),
  constraints: problem.constraints ?? [],
  followUp: problem.followUp?.trim() ?? null,
  leetcode: `https://leetcode.com/problems/${problem.leetcode}/`,
  imports: problem.imports?.trim() ?? null,
  stub: problem.stub.trim(),
  kind: problem.signature.kind,
  caseCount: problem.cases.cases.length,
  video: chapter ? `${VIDEO_URL}&t=${chapter.offset}s` : null,
  lessonAt: chapter ? chapter.offset : null,
  };
});

process.stdout.write(JSON.stringify(payload));
