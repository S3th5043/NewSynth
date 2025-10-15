"use client";
import Link from 'next/link';
import { LayoutGrid, PlusSquare, Folder, Layers, BarChart3, Settings, HelpCircle, Crown } from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/create', label: 'Create Product', icon: PlusSquare },
  { href: '/dashboard/products', label: 'My Products', icon: Folder },
  { href: '/dashboard/templates', label: 'Templates', icon: Layers },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/help', label: 'Help & Support', icon: HelpCircle },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 shrink-0 border-r bg-white/70 backdrop-blur">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded bg-primary/20" />
          <span className="font-semibold">Synthesise AI</span>
        </div>
      </div>
      <nav className="px-2 py-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="mt-6 hidden">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
            <Crown className="h-5 w-5" />
            <span>Upgrade</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
