const AGENTS = ['grape/1.2', 'lychee/0.9', 'papaya/3.0', 'plum/7.4'];

export default {
  title: 'GET /user-agent returns the header',

  async run({ port, request, log }) {
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];

    /** Lower case on purpose: header names are case-insensitive. */
    log(`GET /user-agent with "user-agent: ${agent}"`);
    const response = await request(port, { target: '/user-agent', headers: { 'user-agent': agent } });

    if (response.status !== 200) throw new Error(`answered ${response.status}, expected 200`);
    if (response.body !== agent) {
      throw new Error(`the body was ${JSON.stringify(response.body)}, expected ${JSON.stringify(agent)}`);
    }
    if (response.headers['content-length'] !== String(agent.length)) {
      throw new Error(`Content-Length was ${response.headers['content-length'] ?? 'missing'}, expected ${agent.length}`);
    }
  },
};
