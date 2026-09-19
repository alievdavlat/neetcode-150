/**
 * Where each problem sits in the course video. The table is the chapter list
 * from the video's own description - [timestamp, first problem of the pair] -
 * and one chapter covers that problem and the one after it.
 *
 * The generator writes it into every doc block and the studio reads it to line
 * a problem up with its lesson, so it lives here rather than inside either.
 */
export const VIDEO_ID = 'T0u5nwSA0w0';
export const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

const CHAPTERS = [
  ['00:02:09', 1], ['00:18:30', 3], ['00:41:05', 5], ['01:08:33', 7],
  ['01:35:31', 9], ['02:08:13', 11], ['02:40:58', 13], ['03:22:29', 15],
  ['03:43:04', 17], ['04:17:11', 19], ['04:59:44', 21], ['05:20:33', 23],
  ['05:45:54', 25], ['06:19:22', 27], ['06:46:23', 29], ['07:11:21', 31],
  ['07:37:45', 33], ['08:22:13', 35], ['08:41:04', 37], ['09:07:21', 39],
  ['09:33:40', 41], ['09:59:00', 43], ['10:33:35', 45], ['10:58:05', 47],
  ['11:12:42', 49], ['11:28:36', 51], ['11:47:38', 53], ['12:09:32', 55],
  ['12:30:28', 57], ['12:53:46', 59], ['13:20:24', 61], ['14:01:28', 63],
  ['14:30:37', 65], ['14:50:44', 67], ['15:19:56', 69], ['16:15:43', 71],
  ['16:15:43', 73], ['16:49:54', 75], ['17:16:03', 77], ['17:44:08', 79],
  ['18:12:44', 81], ['18:54:05', 83], ['19:21:28', 85], ['19:55:23', 87],
  ['20:24:16', 89], ['21:11:23', 91], ['21:42:50', 93], ['22:34:37', 95],
  ['23:14:40', 97], ['23:46:50', 99], ['24:50:25', 101], ['25:11:04', 103],
  ['25:39:56', 105], ['26:10:23', 107], ['27:07:00', 109], ['28:45:52', 111],
  ['29:14:46', 113], ['29:50:06', 115], ['30:33:26', 117], ['31:11:49', 119],
  ['31:54:37', 121], ['32:31:46', 123], ['33:07:02', 125], ['33:34:15', 127],
  ['33:55:28', 129], ['34:27:14', 131], ['35:00:49', 133], ['35:26:18', 135],
  ['36:00:31', 137], ['36:37:33', 139], ['36:52:25', 141], ['37:11:53', 143],
  ['37:41:02', 145], ['38:07:23', 147], ['38:35:03', 149],
];

/** Problem number to its chapter. Numbers, not the padded strings. */
export const chapterFor = new Map();
for (const [stamp, first] of CHAPTERS) {
  const [hours, minutes, seconds] = stamp.split(':').map(Number);
  const offset = hours * 3600 + minutes * 60 + seconds;
  chapterFor.set(first, { stamp, offset });
  chapterFor.set(first + 1, { stamp, offset });
}
