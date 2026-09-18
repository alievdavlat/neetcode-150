/**
 * 3045. Line Up   ·   Easy   ·   Exercism
 *
 * Given a name and a number, your task is to produce a sentence using that
 * name and that number as an [ordinal numeral][ordinal-numeral]. Yaʻqūb
 * expects to use numbers from 1 up to 999.
 *
 * Rules:
 *
 * - Numbers ending in 1 (unless ending in 11) → "st"
 * - Numbers ending in 2 (unless ending in 12) → "nd"
 * - Numbers ending in 3 (unless ending in 13) → "rd"
 * - All other numbers → "th"
 *
 * Examples:
 *
 * - "Mary", 1 → "Mary, you are the 1st customer we serve today. Thank you!"
 * - "John", 12 → "John, you are the 12th customer we serve today. Thank you!"
 * - "Dahir", 162 → "Dahir, you are the 162nd customer we serve today. Thank
 *   you!"
 *
 * [ordinal-numeral]: https://en.wikipedia.org/wiki/Ordinalnumeral
 *
 * Example 1:
 *   Input:  name = "Gianna", number = 4
 *   Output: "Gianna, you are the 4th customer we serve today. Thank you!"
 *
 * Example 2:
 *   Input:  name = "Maarten", number = 9
 *   Output: "Maarten, you are the 9th customer we serve today. Thank you!"
 *
 * Example 3:
 *   Input:  name = "Petronila", number = 5
 *   Output: "Petronila, you are the 5th customer we serve today. Thank you!"
 *
 * Example 4:
 *   Input:  name = "Attakullakulla", number = 6
 *   Output: "Attakullakulla, you are the 6th customer we serve today. Thank you!"
 *
 * Example 5:
 *   Input:  name = "Kate", number = 7
 *   Output: "Kate, you are the 7th customer we serve today. Thank you!"
 *
 * Example 6:
 *   Input:  name = "Maximiliano", number = 8
 *   Output: "Maximiliano, you are the 8th customer we serve today. Thank you!"
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function format(name: string, number: number): string {
  throw new Error('Not implemented');
}
