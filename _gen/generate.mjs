import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const GEN_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(GEN_DIR, '..');
const DATA_DIR = join(GEN_DIR, 'data');
const VIDEO_URL = 'https://www.youtube.com/watch?v=T0u5nwSA0w0';
const WIDTH = 76;

/** Chapter markers from the video description: [timestamp, first problem of the pair]. */
const CHAPTERS = [
  ['00:02:09', 1], ['00:18:30', 3], ['00:41:05', 5], ['01:08:33', 7],
  ['01:35:31', 9], ['02:08:13', 11], ['02:40:58', 13], ['03:22:29', 15],
  ['03:43:04', 17], ['04:17:11', 19], ['04:59:44', 21], ['05:20:33', 23],
  ['05:45:54', 25], ['06:19:22', 27], ['06:46:23', 29], ['07:11:21', 31],
  ['07:37:45', 33], ['08:22:13', 35], ['08:41:04', 37], ['09:07:21', 39],
  ['09:33:40', 41], ['09:59:00', 43], ['10:33:35', 45], ['10:58:05', 47],
  ['11:12:42', 49], ['11:28:36', 51], ['11:47:38', 53], ['12:09:32', 55],
  ['12:30:28', 57], ['12:53:46', 59], ['13:20:24', 61], ['14:01:28', 63],
  ['14:30:37', 65], ['14:50:44', 67], ['15:19:56', 69], ['16:15:43', 71],
  ['16:15:43', 73], ['16:49:54', 75], ['17:16:03', 77], ['17:44:08', 79],
  ['18:12:44', 81], ['18:54:05', 83], ['19:21:28', 85], ['19:55:23', 87],
  ['20:24:16', 89], ['21:11:23', 91], ['21:42:50', 93], ['22:34:37', 95],
  ['23:14:40', 97], ['23:46:50', 99], ['24:50:25', 101], ['25:11:04', 103],
  ['25:39:56', 105], ['26:10:23', 107], ['27:07:00', 109], ['28:45:52', 111],
  ['29:14:46', 113], ['29:50:06', 115], ['30:33:26', 117], ['31:11:49', 119],
  ['31:54:37', 121], ['32:31:46', 123], ['33:07:02', 125], ['33:34:15', 127],
  ['33:55:28', 129], ['34:27:14', 131], ['35:00:49', 133], ['35:26:18', 135],
  ['36:00:31', 137], ['36:37:33', 139], ['36:52:25', 141], ['37:11:53', 143],
  ['37:41:02', 145], ['38:07:23', 147], ['38:35:03', 149],
];

const chapterFor = new Map();
for (const [stamp, first] of CHAPTERS) {
  const [hours, minutes, seconds] = stamp.split(':').map(Number);
  const offset = hours * 3600 + minutes * 60 + seconds;
  chapterFor.set(first, { stamp, offset });
  chapterFor.set(first + 1, { stamp, offset });
}

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

const docBlock = (lines) =>
  ['/**', ...lines.map((line) => (line === '' ? ' *' : ' * ' + line)), ' */'].join('\n');

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
  lines.push(`LeetCode:  https://leetcode.com/problems/${problem.leetcode}/`);
  lines.push(`Video:     ${VIDEO_URL}&t=${chapter.offset}s  (${chapter.stamp})`);
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
    const links = `[LC](https://leetcode.com/problems/${problem.leetcode}/) · [▶ ${chapter.stamp}](${VIDEO_URL}&t=${chapter.offset}s)`;
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
    'Node 22 executes TypeScript directly — nothing needs to be installed to run or test:',
    '',
    '```bash',
    'npm run file -- 01-arrays-hashing/001-contains-duplicate.ts',
    '```',
    '',
    'That is `node --experimental-strip-types <file>` with the experimental warning silenced.',
    'Plain `node some-file.ts` fails with `ERR_UNKNOWN_FILE_EXTENSION` on Node 22.14 because',
    'the flag is missing; Node 22.18+ and 23.6+ no longer need it.',
    '',
    '**A problem file only exports its function, so running it prints nothing by itself.** Add',
    'a log at the bottom while you experiment:',
    '',
    '```ts',
    'console.log(containsDuplicate([1, 2, 3, 1]));',
    '```',
    '',
    'For scratch work across several files, edit [`playground.ts`](./playground.ts) and run',
    '`npm run play`.',
    '',
    '## Tests',
    '',
    '```bash',
    'npm test          # every *.test.ts in the repo',
    'npm run test:watch',
    '```',
    '',
    'Tests use the built-in `node:test` runner and sit next to the problem as',
    '`NNN-slug.test.ts`. Five are included as templates, one per shape you will meet:',
    '',
    '- plain values — `01-arrays-hashing/001-contains-duplicate.test.ts`',
    '- order-insensitive output — `01-arrays-hashing/004-group-anagrams.test.ts`',
    '- linked lists — `06-linked-list/035-reverse-linked-list.test.ts`',
    '- trees — `07-trees/046-invert-binary-tree.test.ts`',
    '- a design/class problem — `04-stack/022-min-stack.test.ts`',
    '',
    '[`shared/testing.ts`](./shared/testing.ts) carries `buildList` / `listToArray`,',
    '`buildTree` / `treeToArray` and `normalizeGroups` so a test never has to wire nodes by',
    'hand. A red suite is the normal starting state: an unsolved stub throws.',
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
