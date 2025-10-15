import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { chatJson } from '@/utils/ai';

const BodySchema = z.object({
  topic: z.string().min(3),
  chapters: z.number().min(6).max(12).default(9),
});

const OutlineSchema = z.object({
  title: z.string(),
  chapters: z.array(z.object({ title: z.string(), summary: z.string().optional() })).min(3),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try { body = BodySchema.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const messages = [
    { role: 'system', content: 'You are a structured content planner that returns only JSON.' },
    { role: 'user', content: `Create an ebook outline for topic: ${body.topic}. Include ${body.chapters} chapter titles with brief summaries. Return JSON with keys: title, chapters[{title, summary}] only.` },
  ] as const;

  try {
    const outline = await chatJson({ messages: messages as any, schema: OutlineSchema });
    return NextResponse.json(outline);
  } catch {
    // fallback mock
    const outline = {
      title: `The ${body.topic} Playbook`,
      chapters: Array.from({ length: body.chapters }, (_, i) => ({ title: `Chapter ${i+1}: ${body.topic} Essentials` })),
    };
    return NextResponse.json(outline);
  }
}
