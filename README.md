# NeetCode 150 — practice workspace

Every problem from the freeCodeCamp course
[Neetcode 150 Course — All Coding Interview Questions Solved](https://www.youtube.com/watch?v=T0u5nwSA0w0),
split into one TypeScript file per problem and grouped by pattern.

Each file holds the restated problem, worked examples, constraints, the pattern it
teaches, a target complexity and a typed stub that throws until you fill it in.
**Nothing is solved** — that part is yours.

## How to work through it

1. Open a file, read the doc block, ignore the video link.
2. Replace the `throw new Error(...)` with your attempt.
3. Run it (below) until it behaves.
4. Stuck past ~25 minutes? Open the `Video:` timestamp printed in the same doc block.
5. Tick the box in the category README.

Shared `ListNode`, `TreeNode`, `RandomListNode` and `GraphNode` classes live in
[`shared/types.ts`](./shared/types.ts); the linked-list, tree and graph files import them.

## Running one file

Node 22 executes TypeScript directly — nothing needs to be installed to run or test:

```bash
npm run file -- 01-arrays-hashing/001-contains-duplicate.ts
```

That is `node --experimental-strip-types <file>` with the experimental warning silenced.
Plain `node some-file.ts` fails with `ERR_UNKNOWN_FILE_EXTENSION` on Node 22.14 because
the flag is missing; Node 22.18+ and 23.6+ no longer need it.

**A problem file only exports its function, so running it prints nothing by itself.** Add
a log at the bottom while you experiment:

```ts
console.log(containsDuplicate([1, 2, 3, 1]));
```

For scratch work across several files, edit [`playground.ts`](./playground.ts) and run
`npm run play`.

## Tests

```bash
npm test          # every *.test.ts in the repo
npm run test:watch
```

Tests use the built-in `node:test` runner and sit next to the problem as
`NNN-slug.test.ts`. Five are included as templates, one per shape you will meet:

- plain values — `01-arrays-hashing/001-contains-duplicate.test.ts`
- order-insensitive output — `01-arrays-hashing/004-group-anagrams.test.ts`
- linked lists — `06-linked-list/035-reverse-linked-list.test.ts`
- trees — `07-trees/046-invert-binary-tree.test.ts`
- a design/class problem — `04-stack/022-min-stack.test.ts`

[`shared/testing.ts`](./shared/testing.ts) carries `buildList` / `listToArray`,
`buildTree` / `treeToArray` and `normalizeGroups` so a test never has to wire nodes by
hand. A red suite is the normal starting state: an unsolved stub throws.

## Type-checking

```bash
npm install       # once, for typescript + @types/node
npm run check     # tsc --noEmit
```

## Categories

| Category | Problems | 🟢 Easy | 🟡 Medium | 🔴 Hard |
| --- | --: | --: | --: | --: |
| [Arrays & Hashing](./01-arrays-hashing/) | 9 | 3 | 6 | 0 |
| [Two Pointers](./02-two-pointers/) | 5 | 1 | 3 | 1 |
| [Sliding Window](./03-sliding-window/) | 6 | 1 | 3 | 2 |
| [Stack](./04-stack/) | 7 | 1 | 5 | 1 |
| [Binary Search](./05-binary-search/) | 7 | 1 | 5 | 1 |
| [Linked List](./06-linked-list/) | 11 | 3 | 6 | 2 |
| [Trees](./07-trees/) | 15 | 6 | 7 | 2 |
| [Tries](./08-tries/) | 3 | 0 | 2 | 1 |
| [Heap / Priority Queue](./09-heap-priority-queue/) | 7 | 2 | 4 | 1 |
| [Backtracking](./10-backtracking/) | 9 | 0 | 8 | 1 |
| [Graphs](./11-graphs/) | 13 | 0 | 12 | 1 |
| [Advanced Graphs](./12-advanced-graphs/) | 6 | 0 | 3 | 3 |
| [1-D Dynamic Programming](./13-dp-1d/) | 12 | 2 | 10 | 0 |
| [2-D Dynamic Programming](./14-dp-2d/) | 11 | 0 | 7 | 4 |
| [Greedy](./15-greedy/) | 8 | 0 | 8 | 0 |
| [Intervals](./16-intervals/) | 6 | 1 | 4 | 1 |
| [Math & Geometry](./17-math-geometry/) | 8 | 2 | 6 | 0 |
| [Bit Manipulation](./18-bit-manipulation/) | 7 | 5 | 2 | 0 |
| **Total** | **150** | **28** | **101** | **21** |

## Suggested order

Top to bottom. Arrays & Hashing through Binary Search build the reflexes every later
section assumes, Backtracking is the gateway to Graphs, and both DP sections land far
better once Backtracking feels routine.

## Regenerating

Files are generated from `_gen/data/*.mjs`:

```bash
node _gen/generate.mjs
```

Existing files are never overwritten, so your solutions survive a regenerate. Pass
`--force` only if you want the stubs back.
