interface Envelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: init?.body ? { 'content-type': 'application/json', ...init?.headers } : init?.headers,
  });

  const body = (await response.json().catch(() => null)) as Envelope<T> | null;
  if (!body?.success || body.data === undefined) throw new Error(body?.message ?? `request failed (${response.status})`);

  return body.data;
}
