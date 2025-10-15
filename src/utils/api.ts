export async function postJson<TInput, TOutput>(url: string, body: TInput): Promise<TOutput> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as TOutput;
}

export async function getJson<TOutput>(url: string): Promise<TOutput> {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as TOutput;
}
