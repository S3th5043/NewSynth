"use client";
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, X, Brain } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Features', href: '#features', id: 'features' },
  { label: 'How it Works', href: '#how', id: 'how' },
  { label: 'Pricing', href: '#pricing', id: 'pricing' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Contact', href: '#contact', id: 'contact' },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.6],
        rootMargin: '-20% 0px -60% 0px',
      }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const headerClasses = useMemo(
    () =>
      `fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out ${
        scrolled ? 'h-14 bg-white/80 backdrop-blur-md border-b' : 'h-16 bg-transparent border-transparent'
      }`,
    [scrolled]
  );

  const linkClass = (id: string) =>
    `group relative text-sm transition-colors duration-300 ease-out ${
      active === id ? 'text-primary' : 'text-gray-700 hover:text-primary'
    } after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-primary after:w-0 group-hover:after:w-full after:transition-[width] after:duration-300`;

  const onNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setOpen(false);
    }
  }, []);

  const sideVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { when: 'beforeChildren', staggerChildren: 0.06 } },
    exit: { x: '100%' },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  } as const;

  return (
    <header className={headerClasses}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          <Link href="#" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" aria-hidden />
            <span className="font-semibold text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Synthesise AI
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={linkClass(item.id)}
                onClick={(e) => onNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className="ml-2 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-white shadow-soft transition-colors duration-300 ease-out hover:opacity-90"
            >
              Get Started Free
            </Link>
          </nav>
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <button
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sideVariants}
              className="fixed right-0 top-0 z-50 h-screen w-80 sm:w-96 bg-white shadow-glass md:hidden"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b">
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" aria-hidden />
                  <span className="font-semibold text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Synthesise AI
                  </span>
                </div>
                <button aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <motion.nav className="px-4 py-6 grid gap-3">
                {NAV_ITEMS.map((item) => (
                  <motion.a
                    key={item.id}
                    variants={itemVariants}
                    href={item.href}
                    onClick={(e) => onNavClick(e, item.href)}
                    className={`rounded-md px-3 py-2 text-base ${
                      active === item.id ? 'bg-gray-100 text-primary' : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.div variants={itemVariants}>
                  <Link href="/login" className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-white shadow-soft">
                    Get Started Free
                  </Link>
                </motion.div>
              </motion.nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
