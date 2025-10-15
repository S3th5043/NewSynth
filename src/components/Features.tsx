"use client";
import { motion } from 'framer-motion';
import { Target, FileSpreadsheet } from 'lucide-react';

const cards = [
  {
    icon: Target,
    title: 'Quickly identify your Unique Value Zone (UVZ)',
    description:
      "Use machine learning to rapidly identify where your audience's struggles and your skills and knowledge intersect.",
  },
  {
    icon: FileSpreadsheet,
    title: 'Build your transformative product charter',
    description:
      'Discover a step-by-step blueprint that takes your customers from start to success, eliminating months of guesswork and labour.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Innovation-driven product creation</h2>
        </div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="relative rounded-2xl p-px animated-border"
            >
              <div className="rounded-2xl glass p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 text-primary transition-transform duration-300 group-hover:rotate-6">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{c.title}</h3>
                <p className="mt-2 text-gray-600">{c.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
