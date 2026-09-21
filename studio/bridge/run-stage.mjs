import { runChallenge } from '../../tests/runner/stages/run.mjs';

/**
 * One challenge, up to a stage, as JSON.
 *
 * Only challenges run from the studio. A lab takes a minute and a half and
 * wants a terminal to watch, so it stays a command - the studio shows what it
 * asks for and what it last said, and says how to run it.
 */

const [slug, upTo] = process.argv.slice(2);
if (!slug) throw new Error('a challenge slug is required');

const report = await runChallenge(slug, { upTo: upTo === undefined ? Infinity : Number(upTo) });

process.stdout.write(JSON.stringify(report));
