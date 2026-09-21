import { busiest } from '../../../../tests/runner/labs/services.mjs';

export default {
  title: 'A replica that is still starting gets no traffic',

  async run({ compose, load, log }) {
    const victim = await busiest({ compose, load });
    log(`restarting ${victim.service}, which needs four seconds before it is ready`);

    const result = await load({
      path: '/',
      seconds: 10,
      during: async () => {
        await compose.restart(victim.service);
      },
    });

    log(`${result.sent} requests, ${result.failed} failed`);
    for (const [status, count] of Object.entries(result.byStatus)) {
      log(`  ${status === '0' ? 'no reply' : `HTTP ${status}`}: ${count}`);
    }

    const warming = result.byStatus['503'] ?? 0;
    if (warming > 0) {
      throw new Error(
        `${warming} requests were answered 503 by a replica that was still starting - a valid reply, handed straight to the client`,
      );
    }

    if (result.failed > 0) {
      throw new Error(
        `${result.failed} of ${result.sent} requests failed while ${victim.service} restarted (${result.examples.join(', ')})`,
      );
    }
  },
};
