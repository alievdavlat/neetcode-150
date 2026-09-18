/**
 * 3051. Meetup   ·   Easy   ·   Exercism
 *
 * Your task is to find the exact date of a meetup, given a month, year,
 * weekday and week.
 *
 * There are six week values to consider: first, second, third, fourth, last,
 * teenth.
 *
 * For example, you might be asked to find the date for the meetup on the first
 * Monday in January 2018 (January 1, 2018).
 *
 * Similarly, you might be asked to find:
 *
 * - the third Tuesday of August 2019 (August 20, 2019)
 * - the teenth Wednesday of May 2020 (May 13, 2020)
 * - the fourth Sunday of July 2021 (July 25, 2021)
 * - the last Thursday of November 2022 (November 24, 2022)
 * - the teenth Saturday of August 1953 (August 15, 1953)
 *
 * The teenth week refers to the seven days in a month that end in '-teenth'
 * (13th, 14th, 15th, 16th, 17th, 18th and 19th).
 *
 * If asked to find the teenth Saturday of August, 1953, we check its calendar:
 *
 * From this we find that the teenth Saturday is August 15, 1953.
 *
 * Example 1:
 *   Input:  year = 2013, month = 5, week = "teenth", dayofweek = "Monday"
 *   Output: "2013-05-13"
 *
 * Example 2:
 *   Input:  year = 2013, month = 8, week = "teenth", dayofweek = "Monday"
 *   Output: "2013-08-19"
 *
 * Example 3:
 *   Input:  year = 2013, month = 9, week = "teenth", dayofweek = "Monday"
 *   Output: "2013-09-16"
 *
 * Example 4:
 *   Input:  year = 2013, month = 3, week = "teenth", dayofweek = "Tuesday"
 *   Output: "2013-03-19"
 *
 * Example 5:
 *   Input:  year = 2013, month = 4, week = "teenth", dayofweek = "Tuesday"
 *   Output: "2013-04-16"
 *
 * Example 6:
 *   Input:  year = 2013, month = 8, week = "teenth", dayofweek = "Tuesday"
 *   Output: "2013-08-13"
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function meetup(year: number, month: number, week: string, dayofweek: string): string {
  throw new Error('Not implemented');
}
