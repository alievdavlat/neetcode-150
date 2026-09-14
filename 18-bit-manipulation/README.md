# Bit Manipulation

Short problems, sharp edges. In JavaScript the bitwise operators coerce to signed 32-bit
integers and >> keeps the sign while >>> does not — most of the bugs in this section are
that one distinction. Keep a truth table for XOR and for n & (n - 1) within reach.

**7 problems.**

| # | Done | Problem | Difficulty | Pattern | Links |
| --: | :--: | --- | --- | --- | --- |
| 144 | ☐ | [Single Number](./144-single-number.ts) | 🟢 Easy | XOR cancels every pair | [LC](https://leetcode.com/problems/single-number/) · [▶ 37:11:53](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=133913s) |
| 145 | ☐ | [Number of 1 Bits](./145-number-of-1-bits.ts) | 🟢 Easy | n & (n - 1) clears the lowest set bit | [LC](https://leetcode.com/problems/number-of-1-bits/) · [▶ 37:41:02](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=135662s) |
| 146 | ☐ | [Counting Bits](./146-counting-bits.ts) | 🟢 Easy | dp[i] = dp[i >> 1] + (i & 1) | [LC](https://leetcode.com/problems/counting-bits/) · [▶ 37:41:02](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=135662s) |
| 147 | ☐ | [Reverse Bits](./147-reverse-bits.ts) | 🟢 Easy | Shift out of the input, shift into the output, 32 times | [LC](https://leetcode.com/problems/reverse-bits/) · [▶ 38:07:23](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=137243s) |
| 148 | ☐ | [Missing Number](./148-missing-number.ts) | 🟢 Easy | XOR of indices and values (or the Gauss sum) | [LC](https://leetcode.com/problems/missing-number/) · [▶ 38:07:23](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=137243s) |
| 149 | ☐ | [Sum of Two Integers](./149-sum-of-two-integers.ts) | 🟡 Medium | XOR is the sum without carry; AND << 1 is the carry | [LC](https://leetcode.com/problems/sum-of-two-integers/) · [▶ 38:35:03](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=138903s) |
| 150 | ☐ | [Reverse Integer](./150-reverse-integer.ts) | 🟡 Medium | Pop the last digit, push it, check the 32-bit bound before pushing | [LC](https://leetcode.com/problems/reverse-integer/) · [▶ 38:35:03](https://www.youtube.com/watch?v=T0u5nwSA0w0&t=138903s) |
