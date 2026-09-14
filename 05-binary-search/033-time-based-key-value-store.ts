/**
 * 33. Time Based Key-Value Store   ·   Medium   ·   Binary Search
 *
 * Design a key-value store that keeps every version of a value along with its
 * timestamp. set(key, value, timestamp) stores a value. get(key, timestamp)
 * returns the value whose stored timestamp is the largest one that is <= the
 * requested timestamp, or "" when no such version exists. Calls to set for a
 * given key arrive with strictly increasing timestamps.
 *
 * Example 1:
 *   Input:  set("foo", "bar", 1), get("foo", 1), get("foo", 3),
 *           set("foo", "bar2", 4), get("foo", 4), get("foo", 5)
 *   Output: "bar", "bar", "bar2", "bar2"
 *
 * Constraints:
 *   - 1 <= key.length, value.length <= 100
 *   - key and value consist of lowercase letters and digits
 *   - 1 <= timestamp <= 10^7
 *   - Timestamps passed to set are strictly increasing per key
 *   - At most 2 * 10^5 calls in total
 *
 * Pattern:   Per-key append-only list + binary search on timestamp
 * Target:    O(1) set, O(log n) get
 * LeetCode:  https://leetcode.com/problems/time-based-key-value-store/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=27465s  (07:37:45)
 */
export class TimeMap {
  set(key: string, value: string, timestamp: number): void {
    throw new Error('Not implemented');
  }

  get(key: string, timestamp: number): string {
    throw new Error('Not implemented');
  }
}
