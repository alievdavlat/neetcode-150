/**
 * Deterministic randomness for generated cases. Every case file seeds its own
 * generator, so a run is reproducible: a failure you see is a failure you can
 * see again. Nothing here knows how to solve anything — these helpers only build
 * inputs whose answer is already known by the way the input was built.
 */

/** mulberry32: small, fast, and good enough for building test inputs. */
export function makeRng(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const intBetween = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));

export const pick = (rng, values) => values[Math.floor(rng() * values.length)];

/** Fisher-Yates on a copy. */
export function shuffle(rng, values) {
  const copy = [...values];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }

  return copy;
}

/** `count` different integers in [min, max]. */
export function distinctInts(rng, count, min, max) {
  const seen = new Set();

  while (seen.size < count) seen.add(intBetween(rng, min, max));
  return [...seen];
}

export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';

export const word = (rng, length, alphabet = LOWERCASE) =>
  Array.from({ length }, () => pick(rng, alphabet.split(''))).join('');

/** Build `count` cases from a factory, labelled `<name> 1`, `<name> 2`, … */
export const series = (count, name, build) =>
  Array.from({ length: count }, (_, index) => ({ label: `${name} ${index + 1}`, ...build(index) }));
