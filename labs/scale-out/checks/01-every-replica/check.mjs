import { answeredBy, serviceByHost } from '../../../../tests/runner/labs/services.mjs';

const isApp = (container) => container.Service.startsWith('app');

export default {
  title: 'Every replica takes traffic',

  async run({ compose, load, log }) {
    const running = (await compose.ps()).filter((container) => isApp(container) && /running|up/i.test(container.State));
    log(`app containers running: ${running.map((container) => container.Service).join(', ') || 'none'}`);

    if (running.length < 2) {
      throw new Error(`only ${running.length} app container is running - a balancer needs something to balance`);
    }

    const result = await load({ path: '/', seconds: 3 });
    const answered = answeredBy(result.byServer, await serviceByHost(compose));

    log(`${result.sent} requests, ${result.failed} failed`);
    for (const entry of answered) log(`  ${entry.service}: ${entry.count}`);

    if (answered.length < running.length) {
      const missing = running
        .map((container) => container.Service)
        .filter((service) => !answered.some((entry) => entry.service === service));

      throw new Error(
        `${running.length} replicas are running but only ${answered.length} answered - ${missing.join(', ')} got nothing`,
      );
    }
  },
};
