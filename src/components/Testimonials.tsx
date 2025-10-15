"use client";
import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Alex J.', text: 'This setup saved me days!' },
  { name: 'Priya S.', text: 'Clean, fast, and beautiful.' },
  { name: 'Marcus L.', text: 'Everything I need to launch.' },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-xl glass p-6"
            >
              <blockquote className="text-gray-700">“{t.text}”</blockquote>
              <figcaption className="mt-4 text-sm text-gray-500">— {t.name}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
