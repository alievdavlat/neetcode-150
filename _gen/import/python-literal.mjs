/**
 * Just enough of Python's literal syntax to read the arguments and expected
 * value out of a dataset assertion. Anything outside literals - a call, a
 * comprehension, a set - is refused rather than guessed at, because a wrong
 * case is worse than a missing problem.
 */

const WORDS = { True: true, False: false, None: null };

export class NotALiteral extends Error {}

export function parsePythonLiteral(source) {
  const reader = { text: source, at: 0 };
  const value = readValue(reader);
  skipSpace(reader);
  if (reader.at !== reader.text.length) throw new NotALiteral(`trailing input: ${source.slice(reader.at)}`);
  return value;
}

/** Split a call's argument list on the commas that sit outside brackets and strings. */
export function splitPythonArgs(source) {
  const parts = [];
  let current = '';
  let depth = 0;
  let quote = '';

  for (let at = 0; at < source.length; at += 1) {
    const char = source[at];

    if (quote) {
      if (char === '\\') {
        current += char + (source[at + 1] ?? '');
        at += 1;
        continue;
      }
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if ('[{('.includes(char)) {
      depth += 1;
    } else if (']})'.includes(char)) {
      depth -= 1;
    } else if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim() !== '') parts.push(current);
  if (depth !== 0 || quote) throw new NotALiteral('unbalanced argument list');
  return parts.map((part) => part.trim());
}

const skipSpace = (reader) => {
  while (/\s/.test(reader.text[reader.at] ?? '')) reader.at += 1;
};

function readValue(reader) {
  skipSpace(reader);
  const char = reader.text[reader.at];
  if (char === undefined) throw new NotALiteral('unexpected end');

  if (char === '[' || char === '(') return readSequence(reader, char === '[' ? ']' : ')');
  if (char === '{') return readMapping(reader);
  if (char === '"' || char === "'") return readString(reader);
  if (char === '-' || char === '+' || /[0-9.]/.test(char)) return readNumber(reader);
  return readWord(reader);
}

function readSequence(reader, closer) {
  reader.at += 1;
  const out = [];

  for (;;) {
    skipSpace(reader);
    if (reader.text[reader.at] === closer) {
      reader.at += 1;
      return out;
    }
    out.push(readValue(reader));
    skipSpace(reader);
    if (reader.text[reader.at] === ',') reader.at += 1;
    else if (reader.text[reader.at] !== closer) throw new NotALiteral('bad sequence');
  }
}

/** `{}` is a dict here. A set literal has no JSON shape, so it is refused. */
function readMapping(reader) {
  reader.at += 1;
  const out = {};

  for (;;) {
    skipSpace(reader);
    if (reader.text[reader.at] === '}') {
      reader.at += 1;
      return out;
    }

    const key = readValue(reader);
    skipSpace(reader);
    if (reader.text[reader.at] !== ':') throw new NotALiteral('set literals are not supported');
    reader.at += 1;

    if (typeof key !== 'string' && typeof key !== 'number') throw new NotALiteral('unusable dict key');
    out[String(key)] = readValue(reader);

    skipSpace(reader);
    if (reader.text[reader.at] === ',') reader.at += 1;
    else if (reader.text[reader.at] !== '}') throw new NotALiteral('bad dict');
  }
}

function readString(reader) {
  const quote = reader.text[reader.at];
  reader.at += 1;
  let out = '';

  while (reader.at < reader.text.length) {
    const char = reader.text[reader.at];
    if (char === '\\') {
      const next = reader.text[reader.at + 1];
      out += next === 'n' ? '\n' : next === 't' ? '\t' : next;
      reader.at += 2;
      continue;
    }
    if (char === quote) {
      reader.at += 1;
      return out;
    }
    out += char;
    reader.at += 1;
  }

  throw new NotALiteral('unterminated string');
}

function readNumber(reader) {
  const match = /^[-+]?(?:\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+)/.exec(reader.text.slice(reader.at));
  if (!match) throw new NotALiteral('bad number');
  reader.at += match[0].length;
  return Number(match[0]);
}

function readWord(reader) {
  const match = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(reader.text.slice(reader.at));
  if (!match || !(match[0] in WORDS)) throw new NotALiteral(`not a literal: ${match?.[0] ?? '?'}`);
  reader.at += match[0].length;
  return WORDS[match[0]];
}
