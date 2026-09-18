/**
 * 3008. Baffling Birthdays   ·   Easy   ·   Exercism
 *
 * Your task is to estimate the birthday paradox's probabilities.
 *
 * To do this, you need to:
 *
 * - Generate random birthdates.
 * - Check if a collection of randomly generated birthdates contains at least
 *   two with the same birthday.
 * - Estimate the probability that at least two people in a group share the
 *   same birthday for different group sizes.
 *
 * exercism/note A birthdate includes the full date of birth (year, month, and
 * day), whereas a birthday refers only to the month and day, which repeat each
 * year. Two birthdates with the same month and day correspond to the same
 * birthday.
 *
 * exercism/caution The birthday paradox assumes that:
 *
 * - There are 365 possible birthdays (no leap years).
 * - Each birthday is equally likely (uniform distribution).
 *
 * Your implementation must follow these assumptions.
 *
 * Example 1:
 *   Input:  birthdates = ["2000-01-01"]
 *   Output: false
 *
 * Example 2:
 *   Input:  birthdates = ["2000-01-01","2000-01-01"]
 *   Output: true
 *
 * Example 3:
 *   Input:  birthdates = ["2012-05-09","2012-05-17"]
 *   Output: false
 *
 * Example 4:
 *   Input:  birthdates = ["1999-10-23","1988-10-23"]
 *   Output: true
 *
 * Example 5:
 *   Input:  birthdates = ["2007-12-19","2007-04-27"]
 *   Output: false
 *
 * Example 6:
 *   Input:  birthdates = ["1997-08-04","1963-11-23"]
 *   Output: false
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function sharedBirthday(birthdates: string[]): boolean {
  throw new Error('Not implemented');
}
