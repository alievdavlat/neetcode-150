import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chapterFor, VIDEO_URL } from './chapters.mjs';

const GEN_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(GEN_DIR, '..');
const DATA_DIR = join(GEN_DIR, 'data');
const WIDTH = 76;


const pad = (value) => String(value).padStart(3, '0');

const stripBlankEdges = (text) => text.replace(/^(?:[ \t]*\n)+/, '').replace(/\s+$/, '');

const isBlockLine = (line) => /^\s*(?:[-*]\s|\d+\.\s)/.test(line) || /^\s{2,}\S/.test(line);

/** Authored statements are hard-wrapped for readability; rejoin them into real paragraphs. */
const reflow = (text) => {
  const blocks = [];
  let paragraph = [];
  const flush = () => {
    if (paragraph.length) blocks.push(paragraph.join(' '));
    paragraph = [];
  };
  for (const raw of stripBlankEdges(text).split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (line.trim() === '') {
      flush();
      blocks.push('');
      continue;
    }
    if (isBlockLine(line)) {
      flush();
      blocks.push(line);
      continue;
    }
    paragraph.push(line.trim());
  }
  flush();
  return blocks.join('\n');
};

const wrap = (text) => {
  const out = [];
  for (const raw of stripBlankEdges(text).split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (line.trim() === '') {
      out.push('');
      continue;
    }
    const lead = line.match(/^(\s*(?:[-*]\s+)?)/)[1];
    const hanging = ' '.repeat(lead.length);
    let current = lead;
    let empty = true;
    for (const word of line.slice(lead.length).split(/\s+/)) {
      if (!empty && current.length + 1 + word.length > WIDTH) {
        out.push(current);
        current = hanging + word;
        empty = false;
        continue;
      }
      current = empty ? current + word : current + ' ' + word;
      empty = false;
    }
    out.push(current);
  }
  return out;
};

/** Imported text can contain a comment terminator, which would end the block early. */
const escapeComment = (line) => line.replaceAll('*/', '*\\/');

const docBlock = (lines) =>
  ['/**', ...lines.map((line) => (line === '' ? ' *' : ' * ' + escapeComment(line))), ' */'].join('\n');

const problemDoc = (problem, category) => {
  const chapter = chapterFor.get(problem.n);
  const lines = [`${problem.n}. ${problem.title}   ·   ${problem.difficulty}   ·   ${category}`, ''];
  lines.push(...wrap(reflow(problem.statement)));

  (problem.examples ?? []).forEach((example, index) => {
    lines.push('', `Example ${index + 1}:`);
    lines.push(...example.trim().split('\n').map((line) => '  ' + line));
  });

  if (problem.constraints?.length) {
    lines.push('', 'Constraints:');
    lines.push(...problem.constraints.flatMap((entry) => wrap('  - ' + entry)));
  }

  if (problem.followUp) {
    lines.push('', ...wrap(reflow('Follow-up: ' + problem.followUp)));
  }

  lines.push('');
  lines.push(`Pattern:   ${problem.pattern}`);
  lines.push(`Target:    ${problem.complexity}`);
  if (problem.leetcode) lines.push(`LeetCode:  https://leetcode.com/problems/${problem.leetcode}/`);
  if (problem.source) lines.push(`Source:    ${problem.source}`);
  if (chapter) lines.push(`Video:     ${VIDEO_URL}&t=${chapter.offset}s  (${chapter.stamp})`);
  return docBlock(lines);
};

const problemFile = (problem, category) => {
  const parts = [];
  if (problem.imports) parts.push(problem.imports.trim(), '');
  parts.push(problemDoc(problem, category), problem.stub.trim(), '');
  return parts.join('\n');
};

const DIFFICULTY_ICON = { Easy: '🟢', Medium: '🟡', Hard: '🔴' };

const categoryReadme = (module) => {
  const rows = module.problems.map((problem) => {
    const chapter = chapterFor.get(problem.n);
    const file = `${pad(problem.n)}-${problem.slug}.ts`;
    const links = [
      problem.leetcode && `[LC](https://leetcode.com/problems/${problem.leetcode}/)`,
      chapter && `[▶ ${chapter.stamp}](${VIDEO_URL}&t=${chapter.offset}s)`,
      !problem.leetcode && !chapter && problem.source,
    ]
      .filter(Boolean)
      .join(' · ');
    return `| ${problem.n} | ☐ | [${problem.title}](./${file}) | ${DIFFICULTY_ICON[problem.difficulty]} ${problem.difficulty} | ${problem.pattern} | ${links} |`;
  });
  return [
    `# ${module.category}`,
    '',
    module.intro.trim(),
    '',
    `**${module.problems.length} problems.**`,
    '',
    '| # | Done | Problem | Difficulty | Pattern | Links |',
    '| --: | :--: | --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
};

const rootReadme = (modules) => {
  const total = modules.reduce((sum, module) => sum + module.problems.length, 0);
  const overall = { Easy: 0, Medium: 0, Hard: 0 };
  const rows = modules.map((module) => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    for (const problem of module.problems) {
      counts[problem.difficulty] += 1;
      overall[problem.difficulty] += 1;
    }
    return `| [${module.category}](./${module.dir}/) | ${module.problems.length} | ${counts.Easy} | ${counts.Medium} | ${counts.Hard} |`;
  });
  return [
    '# NeetCode 150 — practice workspace',
    '',
    'Every problem from the freeCodeCamp course',
    `[Neetcode 150 Course — All Coding Interview Questions Solved](${VIDEO_URL}),`,
    'split into one TypeScript file per problem and grouped by pattern.',
    '',
    'Each file holds the restated problem, worked examples, constraints, the pattern it',
    'teaches, a target complexity and a typed stub that throws until you fill it in.',
    '**Nothing is solved** — that part is yours.',
    '',
    '## How to work through it',
    '',
    '1. Open a file, read the doc block, ignore the video link.',
    '2. Replace the `throw new Error(...)` with your attempt.',
    '3. Run it (below) until it behaves.',
    '4. Stuck past ~25 minutes? Open the `Video:` timestamp printed in the same doc block.',
    '5. Tick the box in the category README.',
    '',
    'Shared `ListNode`, `TreeNode`, `RandomListNode` and `GraphNode` classes live in',
    '[`shared/types.ts`](./shared/types.ts); the linked-list, tree and graph files import them.',
    '',
    '## Running one file',
    '',
    'Node 22 executes TypeScript directly, so nothing has to be installed to run a file:',
    '',
    '```bash',
    'npm run file -- 01-arrays-hashing/001-contains-duplicate.ts',
    '```',
    '',
    'That is `node --experimental-strip-types <file>` with the experimental warning silenced.',
    'Plain `node some-file.ts` fails with `ERR_UNKNOWN_FILE_EXTENSION` on Node 22.14 because',
    'the flag is missing; Node 22.18+ and 23.6+ no longer need it.',
    '',
    '**A problem file only exports its function, so running it prints nothing by itself.** Call',
    'it at the bottom of the file and log the result:',
    '',
    '```ts',
    'console.log(containsDuplicate([1, 2, 3, 1])); // true',
    'console.log(containsDuplicate([1, 2, 3, 4])); // false',
    '```',
    '',
    'Those lines are scratch work — delete them, or leave them as a record of what you checked.',
    '',
    '## Type-checking',
    '',
    '```bash',
    'npm install       # once, for typescript + @types/node',
    'npm run check     # tsc --noEmit',
    '```',
    '',
    '## Categories',
    '',
    '| Category | Problems | 🟢 Easy | 🟡 Medium | 🔴 Hard |',
    '| --- | --: | --: | --: | --: |',
    ...rows,
    `| **Total** | **${total}** | **${overall.Easy}** | **${overall.Medium}** | **${overall.Hard}** |`,
    '',
    '## Suggested order',
    '',
    'Top to bottom. Arrays & Hashing through Binary Search build the reflexes every later',
    'section assumes, Backtracking is the gateway to Graphs, and both DP sections land far',
    'better once Backtracking feels routine.',
    '',
    '## Regenerating',
    '',
    'Files are generated from `_gen/data/*.mjs`:',
    '',
    '```bash',
    'node _gen/generate.mjs',
    '```',
    '',
    'Existing files are never overwritten, so your solutions survive a regenerate. Pass',
    '`--force` only if you want the stubs back.',
    '',
  ].join('\n');
};

const main = async () => {
  const force = process.argv.includes('--force');
  const entries = (await readdir(DATA_DIR)).filter((name) => name.endsWith('.mjs')).sort();
  const modules = [];
  let written = 0;
  let kept = 0;

  for (const entry of entries) {
    const module = (await import(pathToFileURL(join(DATA_DIR, entry)).href)).default;
    modules.push(module);
    const dir = join(ROOT, module.dir);
    await mkdir(dir, { recursive: true });

    for (const problem of module.problems) {
      const target = join(dir, `${pad(problem.n)}-${problem.slug}.ts`);
      const content = problemFile(problem, module.category);
      const error = await writeFile(target, content, { flag: force ? 'w' : 'wx' }).catch((cause) => cause);
      if (!error) {
        written += 1;
        continue;
      }
      if (error.code !== 'EEXIST') throw error;
      kept += 1;
    }

    await writeFile(join(dir, 'README.md'), categoryReadme(module));
  }

  await writeFile(join(ROOT, 'README.md'), rootReadme(modules));

  const total = modules.reduce((sum, module) => sum + module.problems.length, 0);
  console.log(`categories: ${modules.length}  problems: ${total}  written: ${written}  kept: ${kept}`);
};

await main();
