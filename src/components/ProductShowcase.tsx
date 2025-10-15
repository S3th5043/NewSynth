"use client";
import { motion } from 'framer-motion';

export default function ProductShowcase() {
  return (
    <section id="how" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-xl glass p-6"
        >
          <div className="aspect-[16/9] w-full rounded-md bg-white/60 shadow-soft" />
          <div className="mt-6 space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Product Showcase</h2>
            <p className="text-gray-600">Drop your screenshots or demo here.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
