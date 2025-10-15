"use client";
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const phrases = [
  'Intelligent AI',
  'Actionable Insights',
  'Creator-Grade Speed',
];

export default function Hero() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 400], [0, 60]);
  const yFloat1 = useTransform(scrollY, [0, 400], [0, -20]);
  const yFloat2 = useTransform(scrollY, [0, 400], [0, 14]);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const target = useMemo(() => phrases[phraseIndex], [phraseIndex]);

  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + target[i]);
      i += 1;
      if (i >= target.length) {
        clearInterval(interval);
        setTimeout(() => setPhraseIndex((v) => (v + 1) % phrases.length), 1800);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <section id="hero" className="relative overflow-hidden pt-28 sm:pt-32 min-h-[100vh] flex items-center">
      {/* Gradient background with animated particles */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
        </div>
      </motion.div>

      {/* Floating particles */}
      <motion.span style={{ y: yFloat1 }} className="absolute left-[10%] top-[20%] h-3 w-3 rounded-full bg-primary/40 blur-[2px]" />
      <motion.span style={{ y: yFloat2 }} className="absolute right-[12%] top-[30%] h-2.5 w-2.5 rounded-full bg-accent/40 blur-[1px]" />
      <motion.span style={{ y: yFloat1 }} className="absolute right-[18%] bottom-[18%] h-3 w-3 rounded-full bg-secondary/40 blur-[2px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid items-center gap-10 lg:grid-cols-5">
          {/* Text: 3/5 -> 60% */}
          <div className="lg:col-span-3">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900"
            >
              {"Create class-leading digital products with "}
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
              >
                {displayText}
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-base sm:text-lg text-gray-600"
            >
              {"Discover the breakthrough tool developed and used by the world's foremost online creators to create world-class digital products with fully-populated frameworks and product charters."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="/login"
                className="rounded-lg bg-primary text-white px-6 py-3 shadow-soft transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-glass"
              >
                Start Creating Free
              </a>
              <a
                href="#how"
                className="rounded-lg glass px-6 py-3 text-primary transition-transform duration-300 ease-out hover:scale-[1.02]"
              >
                Watch Demo
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 text-sm text-gray-700"
            >
              <span className="font-medium text-gray-900">Hundreds of class-leading digital products created</span>
            </motion.div>
          </div>

          {/* Visual: 2/5 -> 40% */}
          <div className="lg:col-span-2 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 -z-10 rounded-2xl bg-white/40 shadow-glass" />
              <Image
                src="/images/ai-dashboard.svg"
                alt="AI dashboard interface"
                width={1200}
                height={720}
                priority
                className="h-auto w-full rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
