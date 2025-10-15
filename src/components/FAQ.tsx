"use client";
import { useState } from 'react';

const faqs = [
  { q: 'What is this stack?', a: 'Next.js 14, Tailwind CSS, TypeScript, Framer Motion.' },
  { q: 'Is it responsive?', a: 'Yes, mobile-first and optimized.' },
  { q: 'Can I customize it?', a: 'Absolutely, extend the components and styles.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={item.q} className="rounded-xl glass p-4">
              <button
                className="w-full text-left font-medium text-gray-900"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.q}
              </button>
              {open === i && (
                <p className="mt-2 text-gray-600">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
