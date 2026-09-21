import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';

/**
 * What a stage tester is handed: the learner's program, running, and the means
 * to talk to it.
 *
 * Everything that knows about processes, ports and deadlines lives here, so a
 * tester is only ever a description of what the program should do.
 */

const KEEP_OUTPUT = 4000;
const READY_POLL_MS = 100;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** A child that spawned its own children would otherwise outlive the run on Windows. */
function killTree(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
    return;
  }

  child.kill('SIGKILL');
}

const reachable = (port, host) =>
  new Promise((resolve) => {
    const socket = net.connect({ port, host });
    const done = (answer) => {
      socket.destroy();
      resolve(answer);
    };

    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
  });

/**
 * Start the program the challenge declares and wait until its port answers.
 *
 * The command is data, not a guess - which is what makes a second language a
 * new `challenge.json` rather than a new runner.
 */
export async function startProgram({ dir, run, port, host = '127.0.0.1', readyMs = 10000 }) {
  /** `node` means this node, so a challenge cannot be run by a different one by accident. */
  const command = run.command === 'node' ? process.execPath : run.command;
  const child = spawn(command, run.args, { cwd: dir, windowsHide: true });

  let output = '';
  const keep = (chunk) => {
    output = `${output}${chunk}`.slice(-KEEP_OUTPUT);
  };

  child.stdout.on('data', keep);
  child.stderr.on('data', keep);

  let exited = null;
  child.on('exit', (code, signal) => (exited = signal ?? code));

  const program = {
    child,
    output: () => output.trim(),
    stop: () => killTree(child),
  };

  if (port === null) return program;

  /** A program that died on startup printed why; losing that is losing the answer. */
  const failed = (message) => Object.assign(new Error(message), { output: output.trim() });

  const deadline = Date.now() + readyMs;
  while (Date.now() < deadline) {
    if (exited !== null) throw failed(`the program exited (${exited}) before it listened on ${port}`);
    if (await reachable(port, host)) return program;
    await wait(READY_POLL_MS);
  }

  program.stop();
  throw failed(`nothing was listening on port ${port} after ${readyMs}ms`);
}

/**
 * One connection, with reads that carry a deadline. A tester that hangs is a
 * tester that tells you nothing, so every read either answers or says it did
 * not.
 */
export function connect(port, { host = '127.0.0.1', timeoutMs = 3000 } = {}) {
  return new Promise((resolve, reject) => {
    const socket = net.connect({ port, host });
    let buffer = Buffer.alloc(0);
    let closed = false;

    socket.on('data', (chunk) => (buffer = Buffer.concat([buffer, chunk])));
    socket.on('close', () => (closed = true));
    socket.once('error', reject);

    const until = async (test, ms, what) => {
      const deadline = Date.now() + ms;
      while (Date.now() < deadline) {
        const found = test(buffer);
        if (found) return buffer;
        if (closed && buffer.length > 0) return buffer;
        if (closed) throw new Error(`the connection closed before ${what}`);
        await wait(10);
      }

      throw new Error(
        `waited ${ms}ms for ${what}; got ${buffer.length === 0 ? 'nothing' : JSON.stringify(buffer.toString().slice(0, 120))}`,
      );
    };

    socket.once('connect', () =>
      resolve({
        send: (data) => socket.write(data),
        /** Everything received so far, once `marker` has arrived. */
        /** The marker is escaped in the message: a raw CRLF would break the line it explains. */
        readUntil: (marker, ms = timeoutMs) =>
          until((seen) => seen.includes(marker), ms, JSON.stringify(marker)),
        readBytes: (count, ms = timeoutMs) =>
          until((seen) => seen.length >= count, ms, `${count} bytes`),
        readAny: (ms = timeoutMs) => until((seen) => seen.length > 0, ms, 'any reply'),
        close: () => socket.destroy(),
      }),
    );
  });
}

/** `HTTP/1.1 200 OK\r\nX: y\r\n\r\nbody` as something a tester can assert on. */
export function parseResponse(raw) {
  const text = raw.toString('latin1');
  const split = text.indexOf('\r\n\r\n');
  if (split === -1) throw new Error(`the reply has no blank line after its headers: ${JSON.stringify(text.slice(0, 120))}`);

  const [start, ...lines] = text.slice(0, split).split('\r\n');
  const match = start.match(/^HTTP\/1\.[01] (\d{3})(?: (.*))?$/);
  if (!match) throw new Error(`the first line is not a status line: ${JSON.stringify(start)}`);

  const headers = {};
  for (const line of lines) {
    const at = line.indexOf(':');
    if (at === -1) continue;
    headers[line.slice(0, at).trim().toLowerCase()] = line.slice(at + 1).trim();
  }

  return { status: Number(match[1]), reason: match[2] ?? '', headers, body: text.slice(split + 4) };
}

/**
 * One request on its own connection, read to the end of its body.
 *
 * `Connection: close` unless a stage says otherwise, because a stage that is
 * not about keep-alive should not fail because of it.
 */
export async function request(port, { method = 'GET', target = '/', headers = {}, close = true, timeoutMs = 3000 } = {}) {
  const lines = [`${method} ${target} HTTP/1.1`, 'Host: localhost'];
  for (const [name, value] of Object.entries(headers)) lines.push(`${name}: ${value}`);
  if (close) lines.push('Connection: close');

  const connection = await connect(port, { timeoutMs });

  try {
    connection.send(`${lines.join('\r\n')}\r\n\r\n`);
    const head = await connection.readUntil('\r\n\r\n', timeoutMs);
    const parsed = parseResponse(head);
    const length = Number(parsed.headers['content-length'] ?? 0);

    if (length > parsed.body.length) {
      const full = await connection.readBytes(head.indexOf('\r\n\r\n') + 4 + length, timeoutMs);
      return parseResponse(full);
    }

    return parsed;
  } finally {
    connection.close();
  }
}

/** Where a challenge keeps its parts, resolved once so testers stay short. */
export const challengeDir = (root, slug) => path.join(root, 'challenges', slug);
