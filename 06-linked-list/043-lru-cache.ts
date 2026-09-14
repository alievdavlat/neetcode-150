/**
 * 43. LRU Cache   ·   Medium   ·   Linked List
 *
 * Design a cache with a fixed capacity that evicts the least recently used
 * key. get(key) returns the value or -1 when the key is absent; put(key,
 * value) inserts or updates a key and evicts the least recently used entry
 * once capacity is exceeded. Both operations must run in O(1) average time,
 * and both count as a use of that key.
 *
 * Example 1:
 *   Input:  capacity = 2; put(1,1), put(2,2), get(1), put(3,3), get(2),
 *           put(4,4), get(1), get(3), get(4)
 *   Output: 1, -1, -1, 3, 4
 *
 * Constraints:
 *   - 1 <= capacity <= 3000
 *   - 0 <= key <= 10^4 and 0 <= value <= 10^5
 *   - At most 2 * 10^5 calls to get and put combined
 *
 * Follow-up: Build the doubly linked list by hand at least once before leaning
 * on Map.
 *
 * Pattern:   Hash map + doubly linked list (or JS Map ordering)
 * Target:    O(1) average per operation
 * LeetCode:  https://leetcode.com/problems/lru-cache/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=35940s  (09:59:00)
 */
export class LRUCache {
  constructor(capacity: number) {
    throw new Error('Not implemented');
  }

  get(key: number): number {
    throw new Error('Not implemented');
  }

  put(key: number, value: number): void {
    throw new Error('Not implemented');
  }
}
