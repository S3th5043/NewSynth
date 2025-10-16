"use client";
import { Bell, Search, Settings, ChevronDown, LogOut } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Topbar() {
  const { data: session, status } = useSession();
  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input aria-label="Search" placeholder="Search…" className="w-full rounded-md border px-3 py-2 pl-9 outline-none focus:ring-2 focus:ring-primary" />
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="relative rounded-md p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-secondary" />
          </button>
          <button aria-label="Settings" className="rounded-md p-2 hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>
          {status === 'authenticated' ? (
            <div className="ml-2 inline-flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 hover:bg-gray-50">
                <span className="h-6 w-6 rounded-full bg-gray-300" />
                <span className="text-sm">{session.user?.name ?? 'Account'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button aria-label="Sign out" className="rounded-md p-2 hover:bg-gray-100" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button className="ml-2 inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 hover:bg-gray-50" onClick={() => signIn()}>
              <span className="text-sm">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
