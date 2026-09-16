# Test runner

Runs your solutions against real cases, times them, measures heap growth, and
fits a Big-O curve to the measured timings. Nothing here contains a solution —
only inputs, expected outputs and input generators.

## Commands

```bash
npm test                    # every problem you have started
npm test -- 01              # one category
npm test -- two-sum         # one problem, by slug, number or title
npm run test:bigo           # add the complexity probe and the measured curve
npm run test:mem            # add a heap column
npm test -- --all           # also list the problems not started yet
npm test -- 006 --quiet     # verdicts only, no per-case output
npm test -- --help
```

Exit code is 1 when anything fails, so it works in a pre-commit hook.

With a filter, each passing case prints what your function returned:

```
  006  Product of Array Except Self  · Medium
     productExceptSelf        PASS 2/2       0.006 ms
       ok example 1        [1,2,3,4] -> [24,12,8,6]
       ok example 2        [-1,1,0,-3,3] -> [0,0,9,0,0]
```

A full run stays quiet; `--output` forces it on, `--quiet` off. Failures always
print their input, the expected value and what came back.

## Coverage

All 150 problems have runnable cases.

| source | problems |
| --- | --: |
| covered by the doc-block examples alone | 131 |
| carrying a case file in `tests/cases/` | 19 |
| — of those, had no usable example at all | 13 |
| — of those, need a property check, not an expected value | 2 |
| — of those, just add edge cases to a solved problem | 4 |
| a size generator for `--big-o` | 141 of 141 function problems |
| design problems, run as a call sequence | 9 |

The doc blocks in `_gen/data/*.mjs` already carry worked examples, and 330 of
them convert straight into cases. The rest are prose (`a board whose first row
is …`) or describe state a literal cannot express, so those problems carry a
hand-written case file instead.

## Where the cases come from

`tests/cases/<category>/<number>-<slug>.cases.mjs` **adds to** the automatic
cases — it does not replace them. Most problems need no file at all, which is
why the folder is nearly empty.

```js
export default {
  compare: 'exact',        // 'unordered' ignores order, 'groups' ignores it at both levels
  cases: [
    { label: 'duplicate at the far end', args: [[5, 1, 2, 3, 4, 5]], expect: true },
    { label: 'several valid answers', args: [[1, 2]], check: (result) => result.length === 2 },
  ],
  gen: (n) => [Array.from({ length: n }, (_, i) => i * 2)],
  probe: { base: 2000, budgetMs: 200 },
};
```

- `args` is the argument list, spread into your function.
- `expect` is compared under `compare`; use `check(result, args, module)` instead
  when several answers are valid. Return `true`, or a string explaining the
  failure. `module` is your whole solution file, which is how Encode and Decode
  Strings tests one export against the other.
- `gen(n)` builds an input of size n for the complexity probe.
- `rawArgs` / `rawResult` switch off shape conversion for a problem that has to
  build its own input — Linked List Cycle needs real nodes, because a cycle
  cannot be written as an array.
- Arguments are structurally cloned before every call, so a solution that mutates
  its input cannot poison the next case.

## Node problems convert automatically

The linked-list, tree and graph problems take `ListNode`, `TreeNode`,
`GraphNode` or `RandomListNode`, but their examples are written as arrays. The
runner reads the types out of the generated stub and converts both ways: the
argument is built into real nodes before the call, and the returned node is
encoded back into the array form the example uses.

| declared type | written as |
| --- | --- |
| `ListNode \| null` | `[1, 2, 3]`, or `1 -> 2 -> 3` in the doc blocks |
| `TreeNode \| null` | level order with holes: `[1, null, 2, null, 3]` |
| `GraphNode \| null` | adjacency list, 1-indexed: `[[2, 4], [1, 3], …]` |
| `RandomListNode \| null` | `[[value, randomIndex], …]` |
| `Array<ListNode \| null>` | `[[1, 4, 5], [1, 3, 4], [2, 6]]` |

An empty result is `[]` whether the example writes `[]` or `null`.

## Design problems

Nine problems are a class plus a sequence of calls rather than one function.
Their cases list the calls, and a third element asserts what that call returns:

```js
{
  label: 'min survives a pop',
  construct: [],
  ops: [
    ['push', [-2]],
    ['push', [-3]],
    ['getMin', [], -3],
    ['pop', []],
    ['getMin', [], -2],
  ],
}
```

When one fails, the report names the exact call and shows the calls that led to it.

## Every variant is tested

The runner picks up **every exported function** in a solution file, so
`twoSum` and `twoSum2` both get the full case list. A variant still throwing the
generated `Not implemented` counts as not started, not as a failure — so a
half-finished file reports only on the parts you actually wrote.

Scratch `console.log` calls at the bottom of a solution file are swallowed during
import so they do not break up the report.

## Guarding against a false failure

A test that fails a correct answer is worse than no test, so four things that
would cause one are handled explicitly.

**Order that does not matter.** Around a third of the problems return a
collection whose order is unspecified — Subsets, Permutations, 3Sum, N-Queens.
Comparing those exactly would fail a correct answer. Every problem returning a
collection was read against its own statement and classified in
[`runner/compare-modes.mjs`](./runner/compare-modes.mjs): `unordered` frees the
outer list, `groups` also frees the order inside each entry. The distinction is
real — Permutations is `unordered`, because `[1,2,3]` and `[3,2,1]` are
different answers, while 3Sum is `groups`, because its statement says the values
inside a triplet may come in any order. Problems with a required order, like
Spiral Matrix and Daily Temperatures, stay exact.

**In-place problems.** Five problems return `void` and mutate their argument:
Reorder List, Rotate Image, Set Matrix Zeroes, Surrounded Regions, Walls and
Gates. For these the runner compares the mutated first argument, not the
`undefined` that came back.

**Answers with no single right form.** Serialize and Deserialize Binary Tree
picks its own string format, and Course Schedule II accepts any valid
topological order. Comparing either to one expected value would fail a correct
solution, so their case files check the property instead — that the tree
survives a round trip, and that no course is taken before its prerequisite.

**Floating point.** Whole numbers are compared exactly. When either side is not
an integer, they match within a relative 1e-6, the way an online judge accepts a
median that differs in the last bits.

If you hit a failure you believe is wrong, that is a bug in the cases, not in
your solution — the fix goes in `tests/cases/`, and `compare` there overrides
the table.

## A solution that never finishes

Each run happens in a worker thread. If a solution does not return within ten
seconds — an unending `while`, a pointer that never advances, a traversal with no
base case — the worker is killed and the problem is reported:

```
  010  Valid Palindrome  · Easy
     TIMED OUT    no answer after 10s
       a loop is not ending - check the condition that should stop it
```

The run then continues with the next problem instead of freezing the terminal.
The limit rises to 90 seconds under `--big-o`, which deliberately runs your code
at growing input sizes.

A list that points back at itself is printed as `3 -> 2 -> 0 -> -4 -> (cycles
back)` rather than crashing the report, so a failing Linked List Cycle case is
readable.

## What the Big-O column means, and what it does not

`--big-o` times your function at doubling input sizes, then ranks the standard
curves by how constant `t(n) / f(n)` stays. `--curve` prints the points behind
the verdict.

It is a **measurement, not a proof**, and it has three honest limits:

- **`O(n)` and `O(n log n)` are not separable.** Across the sizes that run in
  reasonable time the log factor only moves about 1.4x, which is inside the
  measurement noise. When both fit, the runner reports the band
  `O(n) / O(n log n)` rather than picking one and sounding certain. Telling
  linear from quadratic — the mistake that actually costs you — is reliable:
  `twoSum` fits `O(n²)` with 0.4% spread, `O(n log n)` a distant second at 80%.
- **It measures the machine, not the algorithm.** Cache behaviour, GC and JIT
  warmup all land in the numbers.
- **The default generator does not know a problem's preconditions.** It builds
  an input from the declared parameter types — ascending numbers, a grid for
  anything named `grid` or `board`, a small value for `k`. That is valid input
  for most problems and the right shape for all of them, but where the problem
  needs something specific (a sorted pair, a solvable board, a k that relates to
  n) write a `gen` in the case file. Overriding it also lets you generate the
  **worst** case — an array with no duplicate, an answer at the far end —
  instead of accidentally measuring an early exit.

The marker before the shape compares it to the `Target:` line in the doc block:

| marker | meaning |
| --- | --- |
| `ok` | measured shape matches the target |
| `!!` | measured shape is worse than the target |
| `~~` | not comparable — the target is written over more than one variable (`O(n * k)`), or the fit was not confident |
| `?` after the shape | one curve won, but not clearly |

A failing variant is never profiled. There is no point measuring the speed of a
wrong answer.

## What the memory column means

`--memory` forces a collection, reads `heapUsed`, runs the call once, and reads
it again. That makes the space trade-off visible — `twoSum` at 320 B against
`twoSum2` at 44.7 KB is the hash map you paid for — but it is approximate: a
single sample, and the collector is free to do work in the middle of it. Compare
variants of the same problem; do not read it as an absolute.

## Layout

```
tests/
  runner/
    cli.mjs            orchestration and output
    derive-cases.mjs   examples in _gen/data -> cases
    signature.mjs      reads the stub's types
    shapes.mjs         arrays <-> ListNode / TreeNode / GraphNode
    generators.mjs     default gen(n) per parameter type
    execute.mjs        runs cases against a function or a class
    compare.mjs        equality, float tolerance, order-insensitive modes
    compare-modes.mjs  which problems allow which kind of reordering
    run-problem.mjs    one problem end to end, as plain data
    worker.mjs         runs that off the main thread
    schedule.mjs       watches for a stall and restarts past it
    measure.mjs        timing and heap
    complexity.mjs     curve fitting
    report.mjs         terminal rendering
  cases/               per-problem additions, only where needed
```
