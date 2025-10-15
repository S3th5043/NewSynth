"use client";
import { useState } from 'react';
import ProgressSteps from '@/components/ProgressSteps';
import dynamic from 'next/dynamic';
const KnowledgeBaseManager = dynamic(() => import('@/components/KnowledgeBaseManager'), { ssr: false });
const EbookEditor = dynamic(() => import('@/components/EbookEditor'), { ssr: false });

function Section({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <section className="rounded-xl glass p-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-gray-600">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}

export default function EbookWizard() {
  const [step, setStep] = useState(1);

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Create Ebook</h1>
        <ProgressSteps current={step} total={3} />
      </div>

      {step === 1 && (
        <Section title="Map out key transformations" description="Define clear before/after states to articulate tangible outcomes">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Before</label>
              <textarea className="mt-1 w-full rounded-md border p-2 h-28" placeholder="Describe the before state…" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">After</label>
              <textarea className="mt-1 w-full rounded-md border p-2 h-28" placeholder="Describe the after state…" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="rounded-md bg-primary px-3 py-2 text-white btn-glow" onClick={() => setStep(2)}>Continue</button>
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section title="Add your knowledge base">
          <KnowledgeBaseManager />
          <div className="mt-4 flex justify-between">
            <button className="rounded-md border px-3 py-2 hover:bg-gray-50" onClick={() => setStep(1)}>Back</button>
            <button className="rounded-md bg-primary px-3 py-2 text-white btn-glow" onClick={() => setStep(3)}>Continue</button>
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section title="Create your ebook outline" description="Auto-generate chapters, edit content, preview and export.">
          <EbookEditor />
          <div className="mt-4 flex justify-between">
            <button className="rounded-md border px-3 py-2 hover:bg-gray-50" onClick={() => setStep(2)}>Back</button>
            <button className="rounded-md bg-primary px-3 py-2 text-white btn-glow">Generate Structure</button>
          </div>
        </Section>
      )}
    </main>
  );
}
