/**
 * 69. Design Twitter   ·   Medium   ·   Heap / Priority Queue
 *
 * Design a simplified Twitter with four operations: postTweet(userId, tweetId)
 * publishes a tweet; getNewsFeed(userId) returns the 10 most recent tweet ids
 * posted by the user or by anyone they follow, newest first;
 * follow(followerId, followeeId) and unfollow(followerId, followeeId) manage
 * the follow graph. A user implicitly follows themselves.
 *
 * Example 1:
 *   Input:  postTweet(1, 5), getNewsFeed(1), follow(1, 2), postTweet(2, 6),
 *           getNewsFeed(1), unfollow(1, 2), getNewsFeed(1)
 *   Output: [5], [6, 5], [5]
 *
 * Constraints:
 *   - 1 <= userId, followerId, followeeId <= 500
 *   - 0 <= tweetId <= 10^4
 *   - All tweet ids are unique
 *   - At most 3 * 10^4 calls in total
 *
 * Follow-up: What timestamp do you need if tweet ids are not monotonically
 * increasing?
 *
 * Pattern:   Per-user tweet lists + k-way merge for the feed
 * Target:    O(followees * log followees) per feed read
 * LeetCode:  https://leetcode.com/problems/design-twitter/
 * Video:     https://www.youtube.com/watch?v=T0u5nwSA0w0&t=55196s  (15:19:56)
 */
export class Twitter {
  postTweet(userId: number, tweetId: number): void {
    throw new Error('Not implemented');
  }

  getNewsFeed(userId: number): number[] {
    throw new Error('Not implemented');
  }

  follow(followerId: number, followeeId: number): void {
    throw new Error('Not implemented');
  }

  unfollow(followerId: number, followeeId: number): void {
    throw new Error('Not implemented');
  }
}
