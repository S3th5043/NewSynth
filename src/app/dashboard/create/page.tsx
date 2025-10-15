"use client";
import { BookOpen, Video, MoreHorizontal, Info } from 'lucide-react';
import Link from 'next/link';
import Tooltip from '@/components/Tooltip';

function FormatCard({ href, title, description, details, icon: Icon, disabled = false }: { href?: string; title: string; description: string; details: string[]; icon: any; disabled?: boolean }) {
  const content = (
    <div className={`relative rounded-2xl p-px animated-border ${disabled ? 'opacity-60' : ''}`}>
      <div className="rounded-2xl glass p-6 h-full">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {title}
              <Tooltip label="Feature comparison">
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {details.map((d) => (<li key={d}>{d}</li>))}
        </ul>
      </div>
    </div>
  );
  if (disabled || !href) return content;
  return <Link href={href} className="block hover:scale-[1.01] transition-transform duration-200">{content}</Link>;
}

export default function CreatePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">What format do you want for your digital product?</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <FormatCard
          href="/dashboard/create/ebook"
          title="Create Ebook"
          description="PDF-based digital product"
          details={["Includes: Cover design, structured content, bonus materials","Best for: Guides, tutorials, reference materials","Time to complete: 30-45 minutes"]}
          icon={BookOpen}
        />
        <FormatCard
          href="/dashboard/create/course"
          title="Create Video Course"
          description="Script and outline generation"
          details={["Module breakdown with learning objectives","Video structure and talking points","Best for: Step-by-step teaching, demonstrations","Time to complete: 45-60 minutes"]}
          icon={Video}
        />
        <div className="sm:col-span-2">
          <FormatCard
            title="More formats coming soon"
            description="Premium features like coaching offers will appear here"
            details={["Coaching offer (hidden in free)","More product types in development"]}
            icon={MoreHorizontal}
            disabled
          />
        </div>
      </div>
    </main>
  );
}
