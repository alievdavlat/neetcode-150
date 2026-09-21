import http from 'node:http';

/**
 * A closed-loop load generator, in this process.
 *
 * Small on purpose: a separate load tool would be another thing to install and
 * another 200 MB on a laptop that has none to spare. Concurrency is scaled by
 * the machine rather than fixed, which is safe because labs are judged on
 * invariants - "no request was lost" is true at four workers and at forty.
 */

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Which replica answered, so "both served traffic" is a fact rather than a hope. */
const SERVER_HEADER = 'x-server';

function once(agent, { host, port, path: target, timeoutMs }) {
  return new Promise((resolve) => {
    const started = Date.now();
    const request = http.request({ host, port, path: target, agent, timeout: timeoutMs }, (response) => {
      response.resume();
      response.on('end', () =>
        resolve({
          ok: response.statusCode < 500,
          status: response.statusCode,
          server: response.headers[SERVER_HEADER] ?? null,
          ms: Date.now() - started,
        }),
      );
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({ ok: false, status: 0, server: null, ms: Date.now() - started, error: 'timed out' });
    });

    request.on('error', (error) => resolve({ ok: false, status: 0, server: null, ms: Date.now() - started, error: error.code ?? error.message }));
    request.end();
  });
}

/**
 * Hammer one path for `seconds`, and report what came back.
 *
 * `failed` counts everything a user would call a failure: a refused
 * connection, a timeout, a 5xx. That is the number an invariant is written
 * against.
 */
export async function load({
  host = '127.0.0.1',
  port,
  path: target = '/',
  seconds = 3,
  workers = 4,
  timeoutMs = 2000,
  during = null,
  /** How long to keep sending after `during` has finished, whatever it did. */
  tailSeconds = 5,
}) {
  const agent = new http.Agent({ keepAlive: true, maxSockets: workers });
  const results = [];
  let deadline = Date.now() + seconds * 1000;
  let stop = false;

  const worker = async () => {
    while (!stop && Date.now() < deadline) {
      results.push(await once(agent, { host, port, path: target, timeoutMs }));
    }
  };

  const running = Array.from({ length: workers }, worker);

  /**
   * Something to do to the stack while it is under load - a kill, a restart.
   *
   * The deadline is pushed out afterwards because how long a disruption takes
   * is not known in advance: `docker compose restart` on a container that
   * ignores SIGTERM takes the full ten second grace period, and a window that
   * closed before the container went down would report a flawless run.
   */
  if (during) {
    await wait(Math.min(600, (seconds * 1000) / 3));
    await during();
    deadline = Math.max(deadline, Date.now() + tailSeconds * 1000);
  }

  await Promise.all(running);
  stop = true;
  agent.destroy();

  const byStatus = {};
  const byServer = {};
  for (const result of results) {
    byStatus[result.status] = (byStatus[result.status] ?? 0) + 1;
    if (result.server) byServer[result.server] = (byServer[result.server] ?? 0) + 1;
  }

  const failures = results.filter((result) => !result.ok);

  return {
    sent: results.length,
    ok: results.length - failures.length,
    failed: failures.length,
    byStatus,
    byServer,
    /** The first few, so a failure message can name what went wrong. */
    examples: failures.slice(0, 3).map((result) => result.error ?? `HTTP ${result.status}`),
  };
}

/** Wait for a URL to answer, the way a person would before starting a test. */
export async function waitFor({ host = '127.0.0.1', port, path: target = '/', timeoutMs = 60000 }) {
  const agent = new http.Agent({ keepAlive: false });
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const answer = await once(agent, { host, port, path: target, timeoutMs: 2000 });
    if (answer.ok) {
      agent.destroy();
      return answer;
    }
    await wait(250);
  }

  agent.destroy();
  throw new Error(`${target} never answered on port ${port} within ${timeoutMs}ms`);
}

/** Four workers on a laptop, more where there is room; the verdict does not depend on it. */
export const workersFor = (machine) => Math.max(2, Math.min(8, Math.floor(machine.cores / 2)));
