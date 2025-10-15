import OpenAI from 'openai';
import { env } from '@/utils/env';

export async function embedText(text: string, dims = 384): Promise<number[]> {
  if (env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const res = await client.embeddings.create({ model: 'text-embedding-3-small', input: text });
    return res.data[0]?.embedding ?? cheapEmbedding(text, dims);
  }
  return cheapEmbedding(text, dims);
}

export async function embedMany(texts: string[], dims = 384): Promise<number[][]> {
  if (env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const res = await client.embeddings.create({ model: 'text-embedding-3-small', input: texts });
    return res.data.map((d) => d.embedding) as number[][];
  }
  return texts.map((t) => cheapEmbedding(t, dims));
}

function cheapEmbedding(text: string, dims = 384): number[] {
  const vec = new Float32Array(dims);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    const idx = Math.abs(hash) % dims;
    vec[idx] += 1;
  }
  // normalize
  let norm = 0;
  for (let i = 0; i < dims; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < dims; i++) vec[i] = vec[i] / norm;
  return Array.from(vec);
}
