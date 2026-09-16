/** getNewsFeed returns up to the 10 most recent tweet ids, newest first. */
export default {
  cases: [
    {
      label: 'doc block sequence',
      construct: [],
      ops: [
        ['postTweet', [1, 5]],
        ['getNewsFeed', [1], [5]],
        ['follow', [1, 2]],
        ['postTweet', [2, 6]],
        ['getNewsFeed', [1], [6, 5]],
        ['unfollow', [1, 2]],
        ['getNewsFeed', [1], [5]],
      ],
    },
    {
      label: 'a user with no tweets and nobody followed',
      construct: [],
      ops: [['getNewsFeed', [9], []]],
    },
    {
      label: 'the feed is capped at ten, newest first',
      construct: [],
      ops: [
        ...Array.from({ length: 12 }, (_, index) => ['postTweet', [1, index + 1]]),
        ['getNewsFeed', [1], [12, 11, 10, 9, 8, 7, 6, 5, 4, 3]],
      ],
    },
    {
      label: 'tweets from two users interleave by recency',
      construct: [],
      ops: [
        ['postTweet', [1, 1]],
        ['postTweet', [2, 2]],
        ['follow', [1, 2]],
        ['postTweet', [1, 3]],
        ['getNewsFeed', [1], [3, 2, 1]],
        ['getNewsFeed', [2], [2]],
      ],
    },
    {
      label: 'unfollow only removes that one user',
      construct: [],
      ops: [
        ['postTweet', [2, 20]],
        ['postTweet', [3, 30]],
        ['follow', [1, 2]],
        ['follow', [1, 3]],
        ['unfollow', [1, 2]],
        ['getNewsFeed', [1], [30]],
      ],
    },
    {
      label: 'following yourself must not duplicate your own tweets',
      construct: [],
      ops: [
        ['postTweet', [1, 1]],
        ['follow', [1, 1]],
        ['getNewsFeed', [1], [1]],
      ],
    },
  ],
};
