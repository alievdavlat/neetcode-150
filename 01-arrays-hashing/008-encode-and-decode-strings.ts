/**
 * 8. Encode and Decode Strings   ·   Medium   ·   Arrays & Hashing
 *
 * Design an algorithm that turns a list of strings into one string and back
 * again. Implement encode(strs) and decode(str) so that decode(encode(strs))
 * returns the original list. The strings may contain any character, including
 * whatever delimiter you are tempted to use — so a plain join on a separator
 * is not enough.
 *
 * Example 1:
 *   Input:  ["neet", "code", "love", "you"]
 *   Output: ["neet", "code", "love", "you"]     // after a round trip
 *
 * Example 2:
 *   Input:  ["we", "say", ":", "yes"]
 *   Output: ["we", "say", ":", "yes"]           // ':' must survive the round trip
 *
 * Constraints:
 *   - 0 <= strs.length < 100
 *   - 0 <= strs[i].length < 200
 *   - strs[i] may contain any ASCII character
 *
 * Follow-up: Your encoding must be stateless — decode gets only the encoded
 * string.
 *
 * Pattern:   Length-prefixed serialization
 * Target:    O(n) time for both directions, O(n) space
 * LeetCode:  https://leetcode.com/problems/encode-and-decode-strings/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=4113s  (01:08:33)
 */
export function encode(strs: string[]): string {
  throw new Error('Not implemented');

}

export function decode(str: string): string[] {
  throw new Error('Not implemented');
}

console.log(['hello', 'world']);