/**
 * 4135. Map AB   ·   Medium   ·   CodingJS
 *
 * When someMap contains both 'a' and 'b', store their two values joined
 * together, the value of 'a' first, under the key 'ab'. Change nothing else
 * and return someMap.
 *
 * Example 1:
 *   Input:  someMap = [["a","Hi"],["b","There"]]
 *   Output: [["a","Hi"],["b","There"],["ab","HiThere"]]
 *
 * Example 2:
 *   Input:  someMap = [["a","Hi"]]
 *   Output: [["a","Hi"]]
 *
 * Example 3:
 *   Input:  someMap = [["b","There"]]
 *   Output: [["b","There"]]
 *
 * Example 4:
 *   Input:  someMap = [["c","meh"]]
 *   Output: [["c","meh"]]
 *
 * Example 5:
 *   Input:  someMap = [["a","aaa"],["ab","nope"],["b","bbb"],["c","ccc"]]
 *   Output: [["a","aaa"],["ab","aaabbb"],["b","bbb"],["c","ccc"]]
 *
 * Example 6:
 *   Input:  someMap = [["ab","nope"],["b","bbb"],["c","ccc"]]
 *   Output: [["ab","nope"],["b","bbb"],["c","ccc"]]
 *
 * Pattern:   Read and write a map by key
 * Target:    Not stated for this set
 * Source:    CodingJS, after Nick Parlante · statement written for this workspace
 */
export function mapAB(someMap: Map<string, string>): Map<string, string> {
  throw new Error('Not implemented');
}
