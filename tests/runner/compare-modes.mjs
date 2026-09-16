/**
 * How each problem's result should be compared, read from its own statement.
 *
 * The default is `exact`, which is right for most problems and wrong for the
 * ones below - a correct answer in a different order would be reported as a
 * failure. `unordered` frees the outer list only; `groups` also frees the order
 * inside each entry. The distinction matters: Permutations is `unordered`
 * because [1,2,3] and [3,2,1] are different answers, while 3Sum is `groups`
 * because its statement says the values inside a triplet may come in any order.
 *
 * A problem's own case file can still override this.
 */
export const COMPARE_MODES = {
  '003': 'unordered', // "The order of the two returned indices does not matter"
  '004': 'groups', // "groups in any order, and the strings inside each group in any order"
  '005': 'unordered', // the k most frequent elements, in any order
  '012': 'groups', // "the order of the triplets and of the values inside them does not matter"
  '024': 'unordered', // "Order does not matter"
  '063': 'unordered', // "Each answer appears once, in any order"
  '066': 'unordered', // "may be returned in any order" - each point stays an ordered pair
  '071': 'groups', // "the order of subsets does not matter"
  '072': 'groups', // combinations compared as multisets
  '073': 'unordered', // "may be returned in any order" - a permutation's own order is the answer
  '074': 'groups', // "no duplicate subset, in any order"
  '075': 'groups', // unique combinations, order unspecified
  '077': 'unordered', // partitions are ordered, the list of them is not
  '078': 'unordered', // "the answers may be in any order"
  '079': 'unordered', // solutions in any order, rows within a solution are ordered
  '083': 'unordered', // coordinates in any order, each stays [row, column]
  '131': 'unordered', // merged intervals cover the same ranges; the judge accepts any order
};

export const compareModeFor = (number) => COMPARE_MODES[number] ?? 'exact';
