import { NextRequest, NextResponse } from 'next/server';
import type { CharterInput, CharterOutput } from '@/types/app';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CharterInput;
  const steps = body.outcomes.slice(0, 6).map((o, i) => ({
    title: `Step ${i + 1}: ${o}`,
    description: `Operationalize the outcome "${o}" with actionable guidance and measurable checkpoints.`,
  }));

  const payload: CharterOutput = {
    vision: `${body.productName} empowers ${body.audience} to achieve their goals through a structured, outcome-driven framework.`,
    pillars: ['Clarity', 'Consistency', 'Velocity', 'Feedback'],
    steps,
  };

  return NextResponse.json(payload);
}
