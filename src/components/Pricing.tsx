"use client";
import { motion } from 'framer-motion';

const plans = [
  { name: 'Starter', price: '$0', features: ['Basic components', 'Community support'] },
  { name: 'Pro', price: '$19', features: ['All components', 'Email support'] },
  { name: 'Enterprise', price: 'Contact', features: ['Custom work', 'Priority support'] },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-xl glass p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
              <p className="mt-2 text-3xl font-bold text-primary">{p.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <a href="#" className="mt-6 inline-block rounded-lg bg-secondary text-white px-4 py-2 shadow-glass hover:opacity-90">
                Choose {p.name}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
