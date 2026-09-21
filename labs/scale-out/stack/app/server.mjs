import http from 'node:http';
import net from 'node:net';
import os from 'node:os';

/**
 * The service under test. It is given working - this lab is about what stands
 * in front of it and what it writes to, not about the service itself.
 *
 * It answers with the name of the container that served the request, which is
 * how "every replica took traffic" becomes something a check can see rather
 * than something you hope.
 */

const PORT = Number(process.env.PORT ?? 3000);
const REDIS_HOST = process.env.REDIS_HOST ?? 'redis';
const REDIS_PORT = Number(process.env.REDIS_PORT ?? 6379);

/** Real services are not ready the moment they are started. This one admits it. */
const READY_AFTER_MS = Number(process.env.READY_AFTER_MS ?? 4000);

const NAME = process.env.SERVER_NAME ?? os.hostname();
const startedAt = Date.now();

/** Redis speaks a format simple enough to write out by hand, which is why it is here. */
const encode = (parts) =>
  `*${parts.length}\r\n${parts.map((part) => `$${Buffer.byteLength(String(part))}\r\n${part}\r\n`).join('')}`;

function command(parts) {
  return new Promise((resolve, reject) => {
    const socket = net.connect({ host: REDIS_HOST, port: REDIS_PORT });
    let buffer = '';

    socket.setTimeout(2000, () => {
      socket.destroy();
      reject(new Error('redis timed out'));
    });

    socket.on('error', reject);
    socket.on('connect', () => socket.write(encode(parts)));
    socket.on('data', (chunk) => {
      buffer += chunk.toString();
      if (!buffer.endsWith('\r\n')) return;

      socket.end();
      const head = buffer[0];
      const body = buffer.slice(1, buffer.indexOf('\r\n'));

      if (head === '-') reject(new Error(body));
      else resolve(head === ':' ? Number(body) : body);
    });
  });
}

const readBody = (request) =>
  new Promise((resolve) => {
    let body = '';
    request.on('data', (chunk) => (body += chunk));
    request.on('end', () => resolve(body));
  });

const send = (response, status, body, type = 'text/plain') => {
  response.writeHead(status, { 'content-type': type, 'x-server': NAME });
  response.end(body);
};

const ready = () => Date.now() - startedAt >= READY_AFTER_MS;

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');

  if (url.pathname === '/health') {
    send(response, ready() ? 200 : 503, ready() ? 'ready' : 'still starting');
    return;
  }

  /**
   * A service that is not ready does not serve. It is listening - the socket
   * was open the moment the process started - which is exactly why "the port
   * answers" is not the same question as "this replica can take traffic".
   */
  if (!ready()) {
    send(response, 503, 'still starting');
    return;
  }

  if (url.pathname === '/notes' && request.method === 'POST') {
    const note = (await readBody(request)) || 'empty';
    await command(['LPUSH', 'notes', note]).catch(() => null);
    send(response, 201, 'stored');
    return;
  }

  if (url.pathname === '/notes') {
    const count = await command(['LLEN', 'notes']).catch(() => -1);
    send(response, 200, JSON.stringify({ count }), 'application/json');
    return;
  }

  send(response, 200, NAME);
});

server.listen(PORT, () => console.log(`${NAME} listening on ${PORT}, ready in ${READY_AFTER_MS}ms`));

/**
 * A process running as PID 1 does not get the default "terminate" behaviour:
 * a signal it has no handler for is ignored, so `docker stop` waits out its
 * whole grace period and then kills it. Ten seconds of that on every restart
 * is the difference between a deploy and an outage.
 */
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
