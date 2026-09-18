/**
 * 3012. Bob   ·   Easy   ·   Exercism
 *
 * Your task is to determine what Bob will reply to someone when they say
 * something to him or ask him a question.
 *
 * Bob only ever answers one of five things:
 *
 * - "Sure."
 * This is his response if you ask him a question, such as "How are you?" The
 * convention used for questions is that it ends with a question mark.
 * - "Whoa, chill out!"
 * This is his answer if you YELL AT HIM. The convention used for yelling is
 * ALL CAPITAL LETTERS.
 * - "Calm down, I know what I'm doing!"
 * This is what he says if you yell a question at him.
 * - "Fine. Be that way!"
 * This is how he responds to silence. The convention used for silence is
 * nothing, or various combinations of whitespace characters.
 * - "Whatever."
 * This is what he answers to anything else.
 *
 * Example 1:
 *   Input:  heyBob = "Does this cryogenic chamber make me look fat?"
 *   Output: "Sure."
 *
 * Example 2:
 *   Input:  heyBob = "WATCH OUT!"
 *   Output: "Whoa, chill out!"
 *
 * Example 3:
 *   Input:  heyBob = "WHAT'S GOING ON?"
 *   Output: "Calm down, I know what I'm doing!"
 *
 * Example 4:
 *   Input:  heyBob = ""
 *   Output: "Fine. Be that way!"
 *
 * Example 5:
 *   Input:  heyBob = "Tom-ay-to, tom-aaaah-to."
 *   Output: "Whatever."
 *
 * Example 6:
 *   Input:  heyBob = "You are, what, like 15?"
 *   Output: "Sure."
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function response(heyBob: string): string {
  throw new Error('Not implemented');
}
