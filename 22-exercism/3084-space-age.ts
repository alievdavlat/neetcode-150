/**
 * 3084. Space Age   ·   Easy   ·   Exercism
 *
 * Given an age in seconds, calculate how old someone would be on a planet in
 * our Solar System.
 *
 * One Earth year equals 365.25 Earth days, or 31,557,600 seconds. If you were
 * told someone was 1,000,000,000 seconds old, their age would be 31.69
 * Earth-years.
 *
 * For the other planets, you have to account for their orbital period in Earth
 * Years:
 *
 * | Planet | Orbital period in Earth Years | | ------- |
 * ----------------------------- | | Mercury | 0.2408467 | | Venus | 0.61519726
 * | | Earth | 1.0 | | Mars | 1.8808158 | | Jupiter | 11.862615 | | Saturn |
 * 29.447498 | | Uranus | 84.016846 | | Neptune | 164.79132 |
 *
 * exercism/note The actual length of one complete orbit of the Earth around
 * the sun is closer to 365.256 days (1 sidereal year). The Gregorian calendar
 * has, on average, 365.2425 days. While not entirely accurate, 365.25 is the
 * value used in this exercise. See [Year on Wikipedia][year] for more ways to
 * measure a year.
 *
 * [year]: https://en.wikipedia.org/wiki/Year#Summary
 *
 * Example 1:
 *   Input:  planet = "Earth", seconds = 1000000000
 *   Output: 31.69
 *
 * Example 2:
 *   Input:  planet = "Mercury", seconds = 2134835688
 *   Output: 280.88
 *
 * Example 3:
 *   Input:  planet = "Venus", seconds = 189839836
 *   Output: 9.78
 *
 * Example 4:
 *   Input:  planet = "Mars", seconds = 2129871239
 *   Output: 35.88
 *
 * Example 5:
 *   Input:  planet = "Jupiter", seconds = 901876382
 *   Output: 2.41
 *
 * Example 6:
 *   Input:  planet = "Saturn", seconds = 2000000000
 *   Output: 2.15
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function age(planet: string, seconds: number): number {
  throw new Error('Not implemented');
}
