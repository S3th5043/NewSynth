import { NextRequest, NextResponse } from 'next/server';
import type { UVZInput, UVZResult } from '@/types/app';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as UVZInput;
  const skillsWeight = Math.min(body.skills.length * 12, 60);
  const strugglesWeight = Math.min(body.audienceStruggles.length * 10, 40);
  const experienceWeight = Math.min(Math.max(body.experienceYears, 0), 20);
  const score = Math.min(Math.round(skillsWeight + strugglesWeight + experienceWeight), 100);

  const intersections = (body.skills.slice(0, 5)).map((s, i) => ({ topic: s, weight: Math.max(10, 30 - i * 4) }));

  const result: UVZResult = {
    score,
    explanation: `Based on ${body.skills.length} skills, ${body.audienceStruggles.length} audience struggles, and ${body.experienceYears} years of experience, your UVZ score is ${score}.`,
    intersections,
  };

  return NextResponse.json(result);
}
