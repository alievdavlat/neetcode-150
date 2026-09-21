import http from 'node:http';

const post = (port, body) =>
  new Promise((resolve, reject) => {
    const request = http.request(
      { host: '127.0.0.1', port, path: '/notes', method: 'POST', headers: { 'content-length': Buffer.byteLength(body) } },
      (response) => {
        response.resume();
        response.on('end', () => resolve(response.statusCode));
      },
    );
    request.on('error', reject);
    request.end(body);
  });

const count = (port) =>
  new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port, path: '/notes' }, (response) => {
        let body = '';
        response.on('data', (chunk) => (body += chunk));
        response.on('end', () => {
          try {
            resolve(JSON.parse(body).count);
          } catch {
            reject(new Error(`GET /notes did not answer with JSON: ${body.slice(0, 80)}`));
          }
        });
      })
      .on('error', reject);
  });

const HOW_MANY = 5;

/** How long a replaced store is given to start accepting connections again. */
const SETTLE_MS = 20000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** The first answer the store actually gives, rather than the first attempt. */
async function settled(port) {
  const deadline = Date.now() + SETTLE_MS;

  while (Date.now() < deadline) {
    const answer = await count(port).catch(() => -1);
    if (answer >= 0) return answer;
    await wait(500);
  }

  return -1;
}

export default {
  title: 'What was written survives a restart',

  async run({ compose, port, waitFor, log }) {
    for (let index = 0; index < HOW_MANY; index += 1) {
      await post(port, `note ${index + 1} at ${Date.now()}`);
    }

    const before = await count(port);
    log(`wrote ${HOW_MANY} notes, the store now holds ${before}`);

    if (before < HOW_MANY) {
      throw new Error(`only ${before} of ${HOW_MANY} notes were stored before anything was restarted`);
    }

    /**
     * Replaced, not restarted. A restart keeps the container and everything
     * written inside it, which would let a store with no volume pass.
     */
    log('replacing the store container');
    await compose.recreate('redis');
    await waitFor({ path: '/health', timeoutMs: 30000 });

    /**
     * `/health` says the app is up, which is a different question from whether
     * the store is. A replacement container takes a moment to accept
     * connections, and reading one instant too early would look like data loss.
     */
    const after = await settled(port);
    log(after < 0 ? 'the store never answered again' : `afterwards it holds ${after}`);

    if (after < 0) {
      throw new Error(`the store did not answer within ${Math.round(SETTLE_MS / 1000)}s of being replaced`);
    }

    if (after !== before) {
      throw new Error(
        `${before} notes before, ${after} after - the store keeps its data inside the container, so replacing the container takes the data with it`,
      );
    }
  },
};
