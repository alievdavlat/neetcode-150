import { busiest } from '../../../../tests/runner/labs/services.mjs';

export default {
  title: 'Killing a replica loses nothing',

  async run({ compose, load, log }) {
    /** Whoever is actually carrying traffic - killing an idle replica proves nothing. */
    const victim = await busiest({ compose, load });
    log(`${victim.service} answered ${victim.count} of the warm-up requests, so that is the one to take out`);

    const result = await load({
      path: '/',
      seconds: 6,
      during: async () => {
        log(`killing ${victim.service} mid-flight`);
        await compose.kill(victim.service);
      },
    });

    log(`${result.sent} requests, ${result.failed} failed`);
    for (const [status, count] of Object.entries(result.byStatus)) {
      log(`  ${status === '0' ? 'no reply' : `HTTP ${status}`}: ${count}`);
    }

    if (result.failed > 0) {
      throw new Error(
        `${result.failed} of ${result.sent} requests failed while ${victim.service} was killed (${result.examples.join(', ')}) - the balancer kept sending traffic to a server that was gone`,
      );
    }
  },
};
