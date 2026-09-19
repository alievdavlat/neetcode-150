# Problem translations

One file per language per category, keyed by problem number:

```json
{
  "006": {
    "title": "Произведение массива, кроме себя",
    "statement": "...",
    "pattern": "...",
    "followUp": "...",
    "constraints": ["...", "..."]
  }
}
```

Only these five fields are translated. Everything else is left alone, and two of
them are load-bearing:

- **`examples`** are parsed. `tests/runner/derive-cases.mjs` reads the literal
  words `Input:` and `Output:` out of them and evaluates the text between as a
  JavaScript value, so a translated example is a deleted test case.
- **`stub`** is code, and **`complexity`** is notation (`O(n) time, O(1) space`).

A missing file, a missing problem or a missing field all fall back to English, so
a language can be filled in a category at a time without anything breaking.
