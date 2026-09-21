# Challenges

Build your own HTTP server, your own Git, your own shell. A challenge is a
sequence of stages; each stage starts **your** program and talks to it, and the
verdict is what it observed rather than a test you wrote yourself.

```bash
npm run stage                      # what this machine can run
npm run stage -- http-server       # every stage, stopping at the first failure
npm run stage -- http-server 3     # stages 1 to 3
```

Stages one to *n* run every time, so passing stage five by breaking stage two
is caught the moment it happens.

## What a challenge is made of

```
challenges/<slug>/
  challenge.json            what it is, which lesson it belongs to, how to start it
  solution/main.ts          what you write; travels in git
  stages/01-<slug>/
    description.md          what this stage asks for
    tester.mjs              how it is checked
```

`challenge.json` declares the run command, so a challenge in C is a different
`command` and nothing else:

```json
{
  "port": 4221,
  "needs": { "memoryMb": 120, "docker": false },
  "run": { "command": "node", "flags": ["--experimental-strip-types"], "entry": "solution/main.ts" }
}
```

`needs` is what the machine profile checks before offering it. A laptop with no
room is told what is missing and by how much, rather than being asked to try.

## Writing a tester

```js
export default {
  title: 'Answer GET / with 200 OK',

  /** Optional: extra argv for the program, before it starts. */
  async prepare({ tmp, log }) {
    return { args: ['--directory', tmp] };
  },

  async run({ port, request, connect, parseResponse, tmp, log }) {
    const response = await request(port, { target: '/' });
    if (response.status !== 200) throw new Error(`answered ${response.status}, expected 200`);
  },
};
```

Rules that keep a tester useful:

- **Fail by throwing, and say what you wanted.** The message is the whole
  feedback: `Content-Length was 24, expected 26 - that file is 24 characters
  but 26 bytes` teaches; `assertion failed` does not.
- **Vary the input.** A stage answered by a constant is a stage that taught
  nothing, so the word, the header and the filename change every run.
- **`log()` what you did.** Those lines print under a failure, so the learner
  sees the request that produced it.
- **Every read has a deadline.** `readUntil`, `readBytes` and `readAny` all
  take one and say what they were waiting for when it passes.

The program is started fresh for every stage and killed afterwards whatever
happened, and the port is confirmed free before the next one starts.

## Proving a tester before committing it

Write a correct implementation in a scratch file, point the runner at it, and
delete it afterwards — the same rule as the test cases in `tests/cases`:

```bash
npm run stage -- http-server --solution /some/scratch/reference.ts
```

Then break it on purpose and check the stage that should fail does. A tester
nobody has watched fail is a tester that might never fail.
