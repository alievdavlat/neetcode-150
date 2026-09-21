export default {
  title: 'Answer GET / with 200 OK',

  async run({ port, request, log }) {
    log('GET /');
    const response = await request(port, { target: '/' });

    if (response.status !== 200) {
      throw new Error(`GET / answered ${response.status} ${response.reason}, expected 200`);
    }

    log(`got ${response.status} ${response.reason}`);
  },
};
