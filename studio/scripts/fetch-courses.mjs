import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Turn the hand-picked list in data/courses.source.json into course files.
 *
 * Everything factual - the real title, the channel, the length, the chapter
 * list - is read from the video's own watch page, so a course here can never
 * claim a lesson the video does not have. Re-run it whenever a chapter list
 * changes: `npm run courses`.
 */

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, 'data', 'courses.source.json');
const OUT = path.join(ROOT, 'courses');

const AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/** Logged out, YouTube answers some requests with a consent page instead of the video. */
const HEADERS = { 'user-agent': AGENT, 'accept-language': 'en-US,en;q=0.9', cookie: 'CONSENT=YES+1' };
const TRIES = 3;

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** `1:04:22` and `9:41` both mean seconds. */
const secondsOf = (stamp) =>
  stamp
    .split(':')
    .map(Number)
    .reduce((total, part) => total * 60 + part, 0);

function extract(html, key) {
  const at = html.indexOf(key);
  if (at === -1) return null;

  const start = html.indexOf('{', at);
  let depth = 0;
  let quoted = false;
  let escaped = false;

  for (let index = start; index < html.length; index += 1) {
    const char = html[index];

    if (escaped) escaped = false;
    else if (char === '\\') escaped = true;
    else if (char === '"') quoted = !quoted;
    else if (!quoted && char === '{') depth += 1;
    else if (!quoted && char === '}') {
      depth -= 1;
      if (depth === 0) return JSON.parse(html.slice(start, index + 1));
    }
  }

  return null;
}

function collect(node, found = []) {
  if (!node || typeof node !== 'object') return found;
  if (node.macroMarkersListItemRenderer) {
    const marker = node.macroMarkersListItemRenderer;
    const title = marker.title?.simpleText ?? marker.title?.runs?.[0]?.text;
    const at = marker.timeDescription?.simpleText;
    if (title && at) found.push({ title: title.trim(), at: secondsOf(at) });
  }
  for (const key of Object.keys(node)) collect(node[key], found);

  return found;
}

/**
 * Not every video serves its chapter panel to a plain request, but the ones
 * that have chapters list them in the description too. Same data, written by
 * the same person.
 */
function fromDescription(text, total) {
  const marks = [];

  for (const line of text.split('\n')) {
    const match = /^[^\d\n]{0,8}\(?((?:\d{1,2}:)?\d{1,2}:\d{2})\)?[\s\-–|]+(.{2,})$/.exec(line.trim());
    if (!match) continue;

    const at = secondsOf(match[1]);
    if (at > total) continue;
    marks.push({ title: match[2].trim(), at });
  }

  return marks;
}

/**
 * The chapter panel is not in the HTML a plain request gets back, but it is in
 * the answer to the call the page itself makes. The key and client version are
 * read out of that same HTML, so nothing is hard-coded to a version of YouTube.
 */
async function fetchPanel(html, videoId) {
  const key = /"INNERTUBE_API_KEY":"([^"]+)"/.exec(html)?.[1];
  const version = /"INNERTUBE_CLIENT_VERSION":"([^"]+)"/.exec(html)?.[1];
  if (!key || !version) return [];

  const response = await fetch(`https://www.youtube.com/youtubei/v1/next?key=${key}`, {
    method: 'POST',
    headers: { ...HEADERS, 'content-type': 'application/json' },
    body: JSON.stringify({ context: { client: { clientName: 'WEB', clientVersion: version, hl: 'en' } }, videoId }),
  });
  if (!response.ok) return [];

  return collect(await response.json());
}

/** A consent page carries no video, so ask again rather than give up on the course. */
async function fetchPage(url) {
  for (let attempt = 1; attempt <= TRIES; attempt += 1) {
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) throw new Error(`youtube answered ${response.status}`);

    const html = await response.text();
    const player = extract(html, 'var ytInitialPlayerResponse =') ?? extract(html, 'ytInitialPlayerResponse =');
    if (player?.videoDetails) return { html, player };

    if (attempt < TRIES) await pause(1500 * attempt);
  }

  throw new Error('no video details after three tries');
}

async function fetchCourse(entry) {
  const url = `https://www.youtube.com/watch?v=${entry.video}`;
  const { html, player } = await fetchPage(url);
  const data = extract(html, 'var ytInitialData =');
  const details = player.videoDetails;

  const total = Number(details.lengthSeconds);
  /** The panel the page asks for is the fullest list; the page's own HTML is often short of it. */
  const found = await fetchPanel(html, entry.video);
  let from = 'chapter panel';

  if (found.length === 0) {
    found.push(...collect(data));
    from = 'page chapters';
  }
  if (found.length === 0) {
    found.push(...fromDescription(details.shortDescription ?? '', total));
    from = 'description';
  }

  const marks = found.filter((mark, index, all) => all.findIndex((other) => other.at === mark.at) === index);
  marks.sort((left, right) => left.at - right.at);

  const lessons = marks.map((mark, index) => ({
    title: mark.title,
    at: mark.at,
    seconds: (marks[index + 1]?.at ?? total) - mark.at,
  }));

  return {
    id: entry.id,
    track: entry.track,
    name: entry.name,
    blurb: entry.blurb,
    video: entry.video,
    url,
    title: details.title,
    channel: details.author,
    seconds: total,
    lessons,
    from,
    fetchedAt: new Date().toISOString(),
  };
}

const source = JSON.parse(await readFile(SOURCE, 'utf8'));
const force = process.argv.includes('--force');
await mkdir(OUT, { recursive: true });

let first = true;

for (const entry of source.courses) {
  const target = path.join(OUT, `${entry.id}.json`);

  if (!force) {
    const existing = await readFile(target, 'utf8')
      .then((raw) => JSON.parse(raw))
      .catch(() => null);

    if (existing?.video === entry.video && existing.lessons?.length > 0) {
      console.log(`${entry.id}: already imported (${existing.lessons.length} lessons) — --force to refresh`);
      continue;
    }
  }

  /** Asked for a dozen videos back to back, YouTube starts answering with a consent page. */
  if (!first) await pause(2500);
  first = false;

  try {
    const course = await fetchCourse(entry);
    if (course.lessons.length === 0) {
      console.log(`${entry.id}: no chapters on this video — skipped, it would be a course of one lesson`);
      continue;
    }

    await writeFile(target, `${JSON.stringify(course, null, 2)}
`);
    console.log(
      `${entry.id}: ${course.lessons.length} lessons · ${Math.round(course.seconds / 60)} min · ${course.channel} · from the ${course.from}`,
    );
  } catch (error) {
    console.log(`${entry.id}: ${error.message}`);
  }
}
