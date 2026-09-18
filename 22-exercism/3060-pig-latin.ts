/**
 * 3060. Pig Latin   ·   Easy   ·   Exercism
 *
 * Your task is to translate text from English to Pig Latin. The translation is
 * defined using four rules, which look at the pattern of vowels and consonants
 * at the beginning of a word. These rules look at each word's use of vowels
 * and consonants:
 *
 * - vowels: the letters a, e, i, o, and u
 * - consonants: the other 21 letters of the English alphabet
 *
 * If a word begins with a vowel, or starts with "xr" or "yt", add an "ay"
 * sound to the end of the word.
 *
 * For example:
 *
 * - "apple" -> "appleay" (starts with vowel)
 * - "xray" -> "xrayay" (starts with "xr")
 * - "yttria" -> "yttriaay" (starts with "yt")
 *
 * If a word begins with one or more consonants, first move those consonants to
 * the end of the word and then add an "ay" sound to the end of the word.
 *
 * For example:
 *
 * - "pig" -> "igp" -> "igpay" (starts with single consonant)
 * - "chair" -> "airch" -> "airchay" (starts with multiple consonants)
 * - "thrush" -> "ushthr" -> "ushthray" (starts with multiple consonants)
 *
 * If a word starts with zero or more consonants followed by "qu", first move
 * those consonants (if any) and the "qu" part to the end of the word, and then
 * add an "ay" sound to the end of the word.
 *
 * For example:
 *
 * - "quick" -> "ickqu" -> "ickquay" (starts with "qu", no preceding
 *   consonants)
 * - "square" -> "aresqu" -> "aresquay" (starts with one consonant followed by
 *   "qu")
 *
 * If a word starts with one or more consonants followed by "y", first move the
 * c
 *
 * Example 1:
 *   Input:  phrase = "apple"
 *   Output: "appleay"
 *
 * Example 2:
 *   Input:  phrase = "ear"
 *   Output: "earay"
 *
 * Example 3:
 *   Input:  phrase = "igloo"
 *   Output: "iglooay"
 *
 * Example 4:
 *   Input:  phrase = "object"
 *   Output: "objectay"
 *
 * Example 5:
 *   Input:  phrase = "under"
 *   Output: "underay"
 *
 * Example 6:
 *   Input:  phrase = "equal"
 *   Output: "equalay"
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function translate(phrase: string): string {
  throw new Error('Not implemented');
}
