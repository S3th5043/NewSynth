import { NextResponse } from 'next/server';

export async function GET() {
  const categories = [
    {
      id: 'coaching',
      name: 'Coaching',
      templates: [
        { id: 'coach-101', title: 'Foundations Coaching', summary: 'A starter coaching product', categoryId: 'coaching' },
        { id: 'coach-pro', title: 'Pro Coaching System', summary: 'Advanced coaching pipeline', categoryId: 'coaching' },
      ],
    },
    {
      id: 'education',
      name: 'Education',
      templates: [
        { id: 'course-fast', title: 'Fast Course', summary: 'Rapid course outline', categoryId: 'education' },
        { id: 'course-master', title: 'Masterclass', summary: 'In-depth curriculum plan', categoryId: 'education' },
      ],
    },
  ];
  return NextResponse.json({ categories });
}
