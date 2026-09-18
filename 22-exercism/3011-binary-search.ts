/**
 * 3011. Binary Search   ·   Easy   ·   Exercism
 *
 * Your task is to implement a binary search algorithm.
 *
 * A binary search algorithm finds an item in a list by repeatedly splitting it
 * in half, only keeping the half which contains the item we're looking for. It
 * allows us to quickly narrow down the possible locations of our item until we
 * find it, or until we've eliminated all possible locations.
 *
 * exercism/caution Binary search only works when a list has been sorted.
 *
 * The algorithm looks like this:
 *
 * - Find the middle element of a sorted list and compare it with the item
 *   we're looking for.
 * - If the middle element is our item, then we're done!
 * - If the middle element is greater than our item, we can eliminate that
 *   element and all the elements after it.
 * - If the middle element is less than our item, we can eliminate that element
 *   and all the elements before it.
 * - If every element of the list has been eliminated then the item is not in
 *   the list.
 * - Otherwise, repeat the process on the part of the list that has not been
 *   eliminated.
 *
 * Here's an example:
 *
 * Let's say we're looking for the number 23 in the following sorted list: [4,
 * 8, 12, 16, 23, 28, 32].
 *
 * - We start by comparing 23 with the middle element, 16.
 * - Since 23 is greater than 16, we can eliminate the left half of the list,
 *   leaving us with [23, 28, 32].
 * - We then compare 23 with the new middle element, 28.
 * - Since 23 is less than 28, we can eliminate the right half of the list:
 *   [23].
 *
 * Example 1:
 *   Input:  array = [6], value = 6
 *   Output: 0
 *
 * Example 2:
 *   Input:  array = [1,3,4,6,8,9,11], value = 6
 *   Output: 3
 *
 * Example 3:
 *   Input:  array = [1,3,4,6,8,9,11], value = 1
 *   Output: 0
 *
 * Example 4:
 *   Input:  array = [1,3,4,6,8,9,11], value = 11
 *   Output: 6
 *
 * Example 5:
 *   Input:  array = [1,3,5,8,13,21,34,55,89,144,233,377,634], value = 144
 *   Output: 9
 *
 * Example 6:
 *   Input:  array = [1,3,5,8,13,21,34,55,89,144,233,377], value = 21
 *   Output: 5
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function find(array: number[], value: number): number {
  throw new Error('Not implemented');
}
