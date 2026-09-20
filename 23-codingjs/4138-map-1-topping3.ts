/**
 * 4138. Topping3   ·   Medium   ·   CodingJS
 *
 * If someMap contains the key 'potato', store its value under 'fries' as well,
 * and if it contains the key 'salad', store that value under 'spinach' as
 * well. Return someMap.
 *
 * Example 1:
 *   Input:  someMap = [["potato","ketchup"]]
 *   Output: [["potato","ketchup"],["fries","ketchup"]]
 *
 * Example 2:
 *   Input:  someMap = [["potato","butter"]]
 *   Output: [["potato","butter"],["fries","butter"]]
 *
 * Example 3:
 *   Input:  someMap = [["salad","oil"],["potato","ketchup"]]
 *   Output: [["salad","oil"],["potato","ketchup"],["fries","ketchup"],["spinach","oil"]]
 *
 * Example 4:
 *   Input:  someMap = [["toast","butter"],["salad","oil"],["potato","ketchup"]]
 *   Output: [["toast","butter"],["salad","oil"],["potato","ketchup"],["fries","ketchup"],["spinach","oil"]]
 *
 * Example 5:
 *   Input:  someMap = []
 *   Output: []
 *
 * Example 6:
 *   Input:  someMap = [["salad","pepper"],["fries","salt"]]
 *   Output: [["salad","pepper"],["fries","salt"],["spinach","pepper"]]
 *
 * Pattern:   Read and write a map by key
 * Target:    Not stated for this set
 * Source:    CodingJS, after Nick Parlante · statement written for this workspace
 */
export function topping3(someMap: Map<string, string>): Map<string, string> {
  throw new Error('Not implemented');
}
