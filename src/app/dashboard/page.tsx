"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/utils/session';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Layers, Folder, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

function StepDot({ active }: { active: boolean }) {
  return <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-primary' : 'bg-gray-300'}`} />;
}

export default function DashboardPage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const s = getSession();
    if (!s?.verified) router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs and actions */}
          <div className="flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
              <ol className="flex items-center gap-1">
                <li>Dashboard</li>
                <li className="mx-1">/</li>
                <li className="text-gray-900">Home</li>
              </ol>
            </nav>
            <div className="flex gap-2">
              <button className="rounded-md border px-3 py-1.5 hover:bg-gray-50">Import</button>
              <button className="rounded-md bg-primary px-3 py-1.5 text-white btn-glow">Create New Product</button>
            </div>
          </div>

          {/* Welcome */}
          <section className="mt-6">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
            <p className="text-gray-600">Here’s what’s happening with your products.</p>
          </section>

          {/* Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Products Created" value="8" icon={<Folder className="h-6 w-6 text-primary" />} />
            <StatCard title="Templates Used" value="14" icon={<Layers className="h-6 w-6 text-primary" />} />
            <StatCard title="This Week" value="3" />
            <StatCard title="Progress" value="72%" />
          </section>

          {/* Main grid */}
          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl glass p-6">
                <h3 className="font-medium text-gray-900">Quick actions</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="rounded-md border px-3 py-2 hover:bg-gray-50">Generate UVZ Report</button>
                  <button className="rounded-md border px-3 py-2 hover:bg-gray-50">Create Charter</button>
                  <button className="rounded-md border px-3 py-2 hover:bg-gray-50">Browse Templates</button>
                </div>
              </div>

              <div className="rounded-xl glass p-6">
                <h3 className="font-medium text-gray-900">Recent projects</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li className="flex items-center justify-between"><span>AI Course</span><span className="text-gray-400">Updated 2h ago</span></li>
                  <li className="flex items-center justify-between"><span>Coaching Pro</span><span className="text-gray-400">Updated 1d ago</span></li>
                  <li className="flex items-center justify-between"><span>Content Engine</span><span className="text-gray-400">Updated 3d ago</span></li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <RecentActivity />
              <div className="rounded-xl glass p-6">
                <h3 className="font-medium text-gray-900">Get started</h3>
                <p className="mt-2 text-sm text-gray-600">Kick off a new product with our guided flow.</p>
                <a href="/dashboard/create" className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-white btn-glow"><Rocket className="h-4 w-4" /> Create New Product</a>
              </div>
            </div>
          </section>
        </main>
      </div>

      {showOnboarding && (
        <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center p-4">
          <button aria-label="Close" className="absolute inset-0 bg-black/30" onClick={() => setShowOnboarding(false)} />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg rounded-2xl glass p-6">
            <h2 className="text-xl font-semibold text-gray-900">Getting started</h2>
            <p className="mt-1 text-gray-600">A quick tour of key features.</p>

            <div className="mt-4 space-y-3 text-gray-700">
              {step === 1 && <p>1. Calculate your Unique Value Zone (UVZ).</p>}
              {step === 2 && <p>2. Generate your product charter.</p>}
              {step === 3 && <p>3. Explore templates across industries.</p>}
              {step === 4 && <p>4. Share and export your plan.</p>}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">{[1,2,3,4].map((i) => <StepDot key={i} active={i===step} />)}</div>
              <div className="flex gap-2">
                <button className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setShowOnboarding(false)}>Skip</button>
                {step < 4 ? (
                  <button className="rounded-md bg-primary px-3 py-2 text-white btn-glow" onClick={() => setStep((s) => s + 1)}>Next</button>
                ) : (
                  <button className="rounded-md bg-primary px-3 py-2 text-white btn-glow" onClick={() => setShowOnboarding(false)}>Finish</button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
