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

Node 22 executes TypeScript directly, so nothing has to be installed to run a file:

```bash
npm run file -- 01-arrays-hashing/001-contains-duplicate.ts
```

That is `node --experimental-strip-types <file>` with the experimental warning silenced.
Plain `node some-file.ts` fails with `ERR_UNKNOWN_FILE_EXTENSION` on Node 22.14 because
the flag is missing; Node 22.18+ and 23.6+ no longer need it.

**A problem file only exports its function, so running it prints nothing by itself.** Call
it at the bottom of the file and log the result:

```ts
console.log(containsDuplicate([1, 2, 3, 1])); // true
console.log(containsDuplicate([1, 2, 3, 4])); // false
```

Those lines are scratch work — delete them, or leave them as a record of what you checked.

## Testing a solution

`console.log` at the bottom of a file shows you *an* answer; it does not tell you
whether the answer is right for every case. The runner in [`tests/`](./tests/) does:

```bash
npm test                  # every problem you have started
npm test -- two-sum       # one problem, by slug, number or title
npm run test:bigo         # time it at doubling sizes and fit a Big-O curve
npm run test:mem          # heap growth per call
```

Cases come out of the examples already written in each problem's doc block, so
most problems are covered with no setup. Every exported variant in a file is run
against the same cases. See [`tests/README.md`](./tests/README.md) for adding your
own cases and for what the complexity numbers can and cannot tell you.

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
