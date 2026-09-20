/**
 * 4019. User Compare   ·   Medium   ·   CodingJS
 *
 * Order one record made of aName and aId against another made of bName and
 * bId, comparing the names first and falling back to the numbers when the
 * names match. Return -1 when the first record sorts earlier, 1 when it sorts
 * later, and 0 when both parts are equal.
 *
 * Example 1:
 *   Input:  aName = "bb", aId = 1, bName = "zz", bId = 2
 *   Output: -1
 *
 * Example 2:
 *   Input:  aName = "bb", aId = 1, bName = "aa", bId = 2
 *   Output: 1
 *
 * Example 3:
 *   Input:  aName = "bb", aId = 1, bName = "bb", bId = 1
 *   Output: 0
 *
 * Example 4:
 *   Input:  aName = "bb", aId = 5, bName = "bb", bId = 1
 *   Output: 1
 *
 * Example 5:
 *   Input:  aName = "bb", aId = 5, bName = "bb", bId = 10
 *   Output: -1
 *
 * Example 6:
 *   Input:  aName = "adam", aId = 1, bName = "bob", bId = 2
 *   Output: -1
 *
 * Pattern:   Loop and collect, no library shortcuts
 * Target:    Not stated for this set
 * Source:    CodingJS, after Nick Parlante · statement written for this workspace
 */
export function userCompare(aName: string, aId: number, bName: string, bId: number): number {
  throw new Error('Not implemented');
}
