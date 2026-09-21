const WORDS = ['raspberry', 'orange', 'pineapple', 'coconut', 'apricot', 'blueberry'];

export default {
  title: 'GET /echo/<word> returns the word',

  async run({ port, request, log }) {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    log(`GET /echo/${word}`);

    const response = await request(port, { target: `/echo/${word}` });

    if (response.status !== 200) throw new Error(`answered ${response.status}, expected 200`);
    if (response.body !== word) {
      throw new Error(`the body was ${JSON.stringify(response.body)}, expected ${JSON.stringify(word)}`);
    }

    const type = response.headers['content-type'];
    if (type !== 'text/plain') throw new Error(`Content-Type was ${type ?? 'missing'}, expected text/plain`);

    const length = response.headers['content-length'];
    if (length !== String(word.length)) {
      throw new Error(`Content-Length was ${length ?? 'missing'}, expected ${word.length}`);
    }

    log(`got ${word.length} bytes back`);
  },
};
