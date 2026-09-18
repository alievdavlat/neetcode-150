export function groupWords(words: string[]): string[] {
  const out: string[] = [];
  for (const word of words) {
    out.push(word + '!');
  }
  return out;
}
