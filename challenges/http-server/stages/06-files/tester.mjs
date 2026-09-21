import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const NAMES = ['notes.txt', 'readme.txt', 'shopping.txt', 'plan.txt'];

export default {
  title: 'GET /files/<name> serves a file, 404 when it is missing',

  /** A fresh directory each run, handed to the program the way a real one would be. */
  async prepare({ tmp, log }) {
    log(`--directory ${tmp}`);
    return { args: ['--directory', tmp] };
  },

  async run({ port, request, tmp, log }) {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];

    /** A non-ASCII character, so a length counted in characters is caught. */
    const body = `hello from disk — ${Math.random().toString(36).slice(2, 8)}`;
    const bytes = Buffer.byteLength(body);

    await writeFile(path.join(tmp, name), body, 'utf8');
    log(`wrote ${name} (${bytes} bytes)`);

    const found = await request(port, { target: `/files/${name}` });
    if (found.status !== 200) throw new Error(`GET /files/${name} answered ${found.status}, expected 200`);

    const type = found.headers['content-type'];
    if (type !== 'application/octet-stream') {
      throw new Error(`Content-Type was ${type ?? 'missing'}, expected application/octet-stream`);
    }

    if (found.headers['content-length'] !== String(bytes)) {
      throw new Error(
        `Content-Length was ${found.headers['content-length'] ?? 'missing'}, expected ${bytes} - that file is ${body.length} characters but ${bytes} bytes`,
      );
    }

    if (Buffer.from(found.body, 'latin1').toString('utf8') !== body) {
      throw new Error(`the body did not match the file; got ${JSON.stringify(found.body.slice(0, 60))}`);
    }

    log('GET /files/nothing-here.txt');
    const missing = await request(port, { target: '/files/nothing-here.txt' });
    if (missing.status !== 404) throw new Error(`a missing file answered ${missing.status}, expected 404`);
  },
};
