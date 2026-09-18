# Collections

One JSON file per board. The home page draws a card for each, and `/c/<id>` opens it.

```json
{
  "id": "top-interview-50",
  "name": "Top Interview 50",
  "description": "One or two lines, shown on the card.",
  "group": "Curated lists",
  "numbers": ["001", "002", "003"]
}
```

- `id` becomes the URL, so keep it lowercase and hyphenated.
- `group` is the home page heading this card sits under. Leave it out and the card
  lands under `Curated lists`.
- `numbers` are the three-digit numbers this workspace already has. A number with no
  problem behind it is simply not counted, so a board can never invent a problem.

`neetcode-150` is built in and has no file: it is every problem in the workspace.

## Adding a board from somewhere else

The numbers are this workspace's, not LeetCode's. A list taken from a GitHub repo has
to be mapped onto them first — match on the LeetCode slug, which each problem carries
in `_gen/data/*.mjs`. Anything in the source list that this workspace does not have
needs a stub generated before it can appear on a board.

## Company tags

`studio/data/companies.json` is a separate shape, read by `getCompanies()` and shown on the
home page behind the Companies tab:

```json
[{ "name": "Microsoft", "numbers": ["001", "005"] }]
```

Same rule as a collection: only numbers this workspace has. It was imported from a
published "asked by company" sheet, and the spellings in such sheets need canonicalising
(`Linked In`, `LinkedIn`, `Tik tok`, `Amaozn` all appeared in the source).

## Imported sets

`_gen/import/` converts openly licensed problem sets into `_gen/data/*.mjs`, which
`node _gen/generate.mjs` then turns into problem files. Re-run with:

```bash
node _gen/import/run.mjs && node _gen/generate.mjs
```

The generator never overwrites an existing file, so a re-import cannot touch a solution.

| Set | Count | Licence | Numbers |
| --- | --: | --- | --- |
| MBPP (Google Research) | 848 of 974 | Apache 2.0 | 1000+ |
| Exercism problem specifications | 97 of 151 | MIT | 3000+ |

Records are skipped rather than guessed at: an assertion that is not a plain literal call,
argument types that disagree across the examples, a Python set literal, an error-expectation.
The skip reasons are printed by the importer.

**LeetCode and Codewars statements are not imported.** They are copyrighted, and a GitHub
mirror of them does not change that. For those sources this workspace holds metadata only -
see `studio/data/companies.json` - plus problems restated in our own words.
