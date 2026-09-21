import type { MachineProfile, PlaygroundItem, StageReport } from '@/lib/types';
import { runBridge } from './workspace';

/**
 * Challenges and labs, read through the bridge like everything else outside
 * `studio/`.
 *
 * Held for a few seconds rather than cached properly: half of what this
 * returns is a reading of the machine, which moves, but asking Docker how much
 * memory it has on every course page is a spawn and a daemon round trip for an
 * answer that was true a moment ago.
 */

const HOLD_MS = 15000;

interface PlaygroundPayload {
  machine: MachineProfile;
  items: PlaygroundItem[];
}

let held: { at: number; payload: Promise<PlaygroundPayload> } | null = null;

export async function getPlayground(): Promise<PlaygroundPayload> {
  if (held !== null && Date.now() - held.at < HOLD_MS) return held.payload;

  const payload = runBridge<PlaygroundPayload>({ script: 'playground.mjs', timeoutMs: 20000 });
  held = { at: Date.now(), payload };

  /** A failed read must not be remembered as the answer. */
  payload.catch(() => {
    held = null;
  });

  return payload;
}

export async function getPlaygroundItem(slug: string): Promise<PlaygroundItem | null> {
  const { items } = await getPlayground();

  return items.find((item) => item.slug === slug) ?? null;
}

/**
 * Run a challenge's stages. Generous timeout: six stages each start a program
 * and wait for a port, and a learner watching a spinner would rather wait than
 * be told it took too long.
 */
export async function runStages(slug: string, upTo?: number): Promise<StageReport> {
  return runBridge<StageReport>({
    script: 'run-stage.mjs',
    args: upTo === undefined ? [slug] : [slug, String(upTo)],
    timeoutMs: 180000,
  });
}
