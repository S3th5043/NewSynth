import { embedMany, embedText } from '@/utils/embeddings';

export type VectorMetadata = Record<string, unknown>;
export type VectorDoc = { id: string; text: string; metadata?: VectorMetadata; embedding: Float32Array };

const store = new Map<string, VectorDoc[]>(); // projectId -> docs

export async function addDocuments(
  projectId: string,
  docs: Array<{ id?: string; text: string; metadata?: VectorMetadata }>
): Promise<number> {
  const texts = docs.map((d) => d.text);
  const embeddings = await embedMany(texts);
  const existing = store.get(projectId) ?? [];
  const newDocs = docs.map((d, i) => ({
    id: d.id ?? crypto.randomUUID(),
    text: d.text,
    metadata: d.metadata,
    embedding: Float32Array.from(embeddings[i]),
  }));
  store.set(projectId, [...existing, ...newDocs]);
  return newDocs.length;
}

export async function search(
  projectId: string,
  query: string,
  topK = 5
): Promise<Array<{ id: string; text: string; metadata?: VectorMetadata; score: number }>> {
  const docs = store.get(projectId) ?? [];
  if (docs.length === 0) return [];
  const q = Float32Array.from(await embedText(query));
  const scores = docs.map((d) => cosineSim(d.embedding, q));
  return docs
    .map((d, i) => ({ id: d.id, text: d.text, metadata: d.metadata, score: scores[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function cosineSim(a: Float32Array, b: Float32Array): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
}
