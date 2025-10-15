import type { Metadata } from 'next';
import './globals.css';
import { inter } from './fonts';
import dynamic from 'next/dynamic';

const ScrollProgressBar = dynamic(() => import('@/components/ScrollProgressBar'), { ssr: false });

export const metadata: Metadata = {
  title: 'Modern React Website',
  description: 'Next.js 14 App Router site with Tailwind and animations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ScrollProgressBar />
        {children}
      </body>
    </html>
  );
}
