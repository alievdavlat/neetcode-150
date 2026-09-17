import { loadProblems } from '../../tests/runner/derive-cases.mjs';

/**
 * Print every problem as JSON for the studio UI. Reads only `_gen/data`, never a
 * solution file, so it stays fast and cannot be tripped by a loop in an attempt.
 */
const problems = await loadProblems();

const payload = problems.map((problem) => ({
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
}));

process.stdout.write(JSON.stringify(payload));
