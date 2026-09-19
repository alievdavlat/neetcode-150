# Arrays & Hashing

The foundation section. Almost every problem here trades memory for time: a hash map or
hash set turns a nested scan into a single pass. Learn to spot the moment a lookup should
stop being a search.

**12 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 1 | ☑ | [Contains Duplicate](./001-contains-duplicate.ts) | 🟢 Easy | Hash set | [LC](https://leetcode.com/problems/contains-duplicate/) · [▶ 00:02:09](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=129s) |
| 2 | ☑ | [Valid Anagram](./002-valid-anagram.ts) | 🟢 Easy | Character frequency count | [LC](https://leetcode.com/problems/valid-anagram/) · [▶ 00:02:09](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=129s) |
| 3 | ☑ | [Two Sum](./003-two-sum.ts) | 🟢 Easy | Hash map of value -> index, one pass | [LC](https://leetcode.com/problems/two-sum/) · [▶ 00:18:30](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=1110s) |
| 4 | ☑ | [Group Anagrams](./004-group-anagrams.ts) | 🟡 Medium | Hash map keyed by a canonical form of the word | [LC](https://leetcode.com/problems/group-anagrams/) · [▶ 00:18:30](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=1110s) |
| 5 | ☑ | [Top K Frequent Elements](./005-top-k-frequent-elements.ts) | 🟡 Medium | Frequency map + bucket sort (or a size-k heap) | [LC](https://leetcode.com/problems/top-k-frequent-elements/) · [▶ 00:41:05](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=2465s) |
| 6 | ☑ | [Product of Array Except Self](./006-product-of-array-except-self.ts) | 🟡 Medium | Prefix product pass + suffix product pass | [LC](https://leetcode.com/problems/product-of-array-except-self/) · [▶ 00:41:05](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=2465s) |
| 7 | ☑ | [Valid Sudoku](./007-valid-sudoku.ts) | 🟡 Medium | Three sets of hash sets: rows, columns, 3x3 boxes | [LC](https://leetcode.com/problems/valid-sudoku/) · [▶ 01:08:33](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=4113s) |
| 8 | ☑ | [Encode and Decode Strings](./008-encode-and-decode-strings.ts) | 🟡 Medium | Length-prefixed serialization | [LC](https://leetcode.com/problems/encode-and-decode-strings/) · [▶ 01:08:33](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=4113s) |
| 9 | ☑ | [Longest Consecutive Sequence](./009-longest-consecutive-sequence.ts) | 🟡 Medium | Hash set + only walk up from sequence starts | [LC](https://leetcode.com/problems/longest-consecutive-sequence/) · [▶ 01:35:31](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=5731s) |
| 151 | ☐ | [Roman to Integer](./151-roman-to-integer.ts) | 🟢 Easy | Scan once and subtract a letter that is smaller than the one after it | [LC](https://leetcode.com/problems/roman-to-integer/) |
| 152 | ☐ | [Longest Common Prefix](./152-longest-common-prefix.ts) | 🟢 Easy | Walk the columns together and stop at the first disagreement | [LC](https://leetcode.com/problems/longest-common-prefix/) |
| 153 | ☐ | [Majority Element](./153-majority-element.ts) | 🟢 Easy | Boyer-Moore vote: hold one candidate and a running count | [LC](https://leetcode.com/problems/majority-element/) |
