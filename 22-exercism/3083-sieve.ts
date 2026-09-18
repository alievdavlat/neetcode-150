/**
 * 3083. Sieve   ·   Easy   ·   Exercism
 *
 * Your task is to create a program that implements the Sieve of Eratosthenes
 * algorithm to find all prime numbers less than or equal to a given number.
 *
 * A prime number is a number larger than 1 that is only divisible by 1 and
 * itself. For example, 2, 3, 5, 7, 11, and 13 are prime numbers. By contrast,
 * 6 is not a prime number as it not only divisible by 1 and itself, but also
 * by 2 and 3.
 *
 * To use the Sieve of Eratosthenes, first, write out all the numbers from 2 up
 * to and including your given number. Then, follow these steps:
 *
 * 1. Find the next unmarked number (skipping over marked numbers).
 * This is a prime number.
 * 2. Mark all the multiples of that prime number as not prime.
 *
 * Repeat the steps until you've gone through every number. At the end, all the
 * unmarked numbers are prime.
 *
 * exercism/note The Sieve of Eratosthenes marks off multiples of each prime
 * using addition (repeatedly adding the prime) or multiplication (directly
 * computing its multiples), rather than checking each number for divisibility.
 *
 * The tests don't check that you've implemented the algorithm, only that
 * you've come up with the correct primes.
 *
 * Let's say you're finding the primes less than or equal to 10.
 *
 * - Write out 2, 3, 4, 5, 6, 7, 8, 9, 10, leaving them all unmarked.
 *
 * - 2 is unmarked and is therefore a prime.
 * Mark 4, 6, 8 and 10 as "not prime".
 *
 * - 3 is unmarked and is therefore a prime.
 * Mark 6 and 9 as not prime (
 *
 * Example 1:
 *   Input:  limit = 1
 *   Output: []
 *
 * Example 2:
 *   Input:  limit = 2
 *   Output: [2]
 *
 * Example 3:
 *   Input:  limit = 10
 *   Output: [2,3,5,7]
 *
 * Example 4:
 *   Input:  limit = 13
 *   Output: [2,3,5,7,11,13]
 *
 * Example 5:
 *   Input:  limit = 1000
 *   Output: [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997]
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function primes(limit: number): number[] {
  throw new Error('Not implemented');
}
