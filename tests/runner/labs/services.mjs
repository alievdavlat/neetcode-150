/**
 * Which container answered.
 *
 * A service reports its hostname, which docker sets to the short container id,
 * so "app2 served 400 requests" needs that id translated back into a service
 * name - both to say it in a message and to know which service to kill.
 */

export async function serviceByHost(compose) {
  const containers = await compose.ps();
  const map = new Map();

  for (const container of containers) {
    const id = String(container.ID ?? '').slice(0, 12);
    if (id !== '') map.set(id, container.Service);
  }

  return map;
}

/** `{ 3e2fdb90e8e9: 400 }` as `[{ service: 'app2', host, count }]`, busiest first. */
export function answeredBy(byServer, map) {
  return Object.entries(byServer)
    .map(([host, count]) => ({ host, service: map.get(host.slice(0, 12)) ?? host, count }))
    .sort((left, right) => right.count - left.count);
}

/**
 * The replica actually carrying traffic.
 *
 * Killing a replica the balancer never uses proves nothing, and a pool with
 * one member in it would pass a "killing a replica loses nothing" check by
 * accident. So the victim is chosen from what answered, not from the list of
 * what is running.
 */
export async function busiest({ compose, load, path = '/', seconds = 2 }) {
  const warmup = await load({ path, seconds });
  const map = await serviceByHost(compose);
  const [top] = answeredBy(warmup.byServer, map);

  if (!top) throw new Error('nothing answered during the warm-up, so there is no replica to take out');

  return { ...top, warmup };
}
