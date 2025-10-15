import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProductShowcase from '@/components/ProductShowcase';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  );
}
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Section id="hero"><Hero /></Section>
      <Section id="features"><Features /></Section>
      <Section id="how"><ProductShowcase /></Section>
      <Section id="about"><Testimonials /></Section>
      <Section id="pricing"><Pricing /></Section>
      <Section id="contact"><FAQ /></Section>
      <Footer />
    </main>
  );
}
