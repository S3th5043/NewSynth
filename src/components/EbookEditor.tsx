"use client";
import { useEffect, useMemo, useState } from 'react';
import { readFromStorage, writeToStorage } from '@/utils/storage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type EbookDetails = {
  title: string;
  subtitle: string;
  price: number;
  wordCount: number;
  chapters: Array<{ title: string; content: string }>;
  description: string;
  audience: string[];
  outcomes: string[];
  bonuses: string[];
};

const KEY = 'ebook:editor';

const defaultStructure = (): EbookDetails => ({
  title: 'The [Method] Playbook',
  subtitle: 'A practical guide to achieving [Outcome]',
  price: 97,
  wordCount: 12000,
  chapters: [
    { title: 'Introduction: The Case for [Problem Solution]', content: '' },
    { title: 'Understanding the Problem: [Root Cause Analysis]', content: '' },
    { title: 'Your Toolkit Setup: [Required Tools & Resources]', content: '' },
    { title: 'The [Method Name] Framework: [Core System]', content: '' },
    { title: 'Implementation Guide: [Step-by-Step Process]', content: '' },
    { title: 'Advanced Techniques: [Pro Tips & Shortcuts]', content: '' },
    { title: 'Team Rollout: [Scaling & Sharing]', content: '' },
    { title: 'Troubleshooting: [Common Issues & Solutions]', content: '' },
    { title: 'Automation & Sustainability: [Long-term Success]', content: '' },
  ],
  description: 'This ebook helps [audience] achieve [outcome] with a proven framework.',
  audience: ['Beginners', 'Professionals'],
  outcomes: ['Master the method', 'Implement quickly', 'Measure results'],
  bonuses: ['Checklists', 'Templates', 'Resource library'],
});

function estimateReadingTime(words: number): string {
  const minutes = Math.ceil(words / 225);
  return `${minutes} min read`;
}

export type EbookOutlinePrefill = {
  title: string;
  chapters: Array<{ title: string; summary?: string }>;
};

export default function EbookEditor({ prefillOutline, onOutlineApplied }: { prefillOutline?: EbookOutlinePrefill | null; onOutlineApplied?: () => void } = {}) {
  const [data, setData] = useState<EbookDetails>(() => readFromStorage(KEY, defaultStructure()));
  const [chapterIndex, setChapterIndex] = useState(0);

  useEffect(() => { writeToStorage(KEY, data); }, [data]);

  useEffect(() => {
    if (!prefillOutline) return;
    setData((prev) => {
      const chapters = prefillOutline.chapters.map((c, i) => ({ title: c.title || `Chapter ${i+1}`, content: '' }));
      return {
        ...prev,
        title: prefillOutline.title || prev.title,
        chapters,
      };
    });
    onOutlineApplied?.();
  }, [prefillOutline, onOutlineApplied]);

  const readingTime = useMemo(() => estimateReadingTime(data.wordCount), [data.wordCount]);

  function updateChapterContent(content: string) {
    setData((prev) => {
      const chapters = [...prev.chapters];
      chapters[chapterIndex] = { ...chapters[chapterIndex], content };
      return { ...prev, chapters };
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-4">
        <div className="rounded-xl glass p-4">
          <h3 className="font-medium text-gray-900">Ebook details</h3>
          <div className="mt-3 grid gap-3">
            <div>
              <label className="text-sm">Title</label>
              <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm">Subtitle</label>
              <input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm">Price ($)</label>
                <input type="number" min={47} max={297} value={data.price} onChange={(e) => setData({ ...data, price: Number(e.target.value) })} className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm">Word count</label>
                <input type="number" min={8000} max={15000} value={data.wordCount} onChange={(e) => setData({ ...data, wordCount: Number(e.target.value) })} className="mt-1 w-full rounded-md border px-3 py-2" />
                <p className="mt-1 text-xs text-gray-500">{readingTime}</p>
              </div>
              <div>
                <label className="text-sm">Chapters</label>
                <input type="number" min={6} max={12} value={data.chapters.length} onChange={(e) => {
                  const count = Math.max(6, Math.min(12, Number(e.target.value)));
                  setData((prev) => ({ ...prev, chapters: Array.from({ length: count }, (_, i) => prev.chapters[i] ?? { title: `Chapter ${i+1}`, content: '' }) }));
                }} className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="text-sm">Description (Markdown)</label>
              <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} className="mt-1 w-full rounded-md border p-2 h-24" />
            </div>
            <div>
              <label className="text-sm">Target audience</label>
              <input value={data.audience.join(', ')} onChange={(e) => setData({ ...data, audience: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm">Learning outcomes</label>
              <input value={data.outcomes.join(', ')} onChange={(e) => setData({ ...data, outcomes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm">Bonus materials (comma-separated)</label>
              <input value={data.bonuses.join(', ')} onChange={(e) => setData({ ...data, bonuses: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="rounded-xl glass p-4">
          <h3 className="font-medium text-gray-900">Chapters</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {data.chapters.map((c, i) => (
              <li key={i}>
                <button className={`w-full rounded-md px-2 py-1 text-left hover:bg-gray-100 ${i===chapterIndex ? 'bg-gray-100' : ''}`} onClick={() => setChapterIndex(i)}>
                  {i+1}. {c.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-xl glass p-4">
          <h3 className="font-medium text-gray-900">Editor</h3>
          <textarea
            value={data.chapters[chapterIndex]?.content ?? ''}
            onChange={(e) => updateChapterContent(e.target.value)}
            className="mt-2 w-full rounded-md border p-2 h-64 font-mono"
            placeholder="# Heading\n\nWrite your chapter content here...\n\n- Bullets\n- Lists\n\n```code\nexample\n```"
          />
        </div>

        <div className="rounded-xl glass p-4">
          <h3 className="font-medium text-gray-900">Preview</h3>
          <div className="prose max-w-none mt-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.chapters[chapterIndex]?.content ?? ''}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
