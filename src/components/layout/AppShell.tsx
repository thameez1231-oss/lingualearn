'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { DevMailboxDrawer } from '../email/DevMailboxDrawer';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';

interface AppShellProps {
  children: React.ReactNode;
  user: {
    id: string;
    name: string;
    email: string;
    xp?: number;
    streak?: number;
    preferredLanguage?: string;
    englishLevel?: string;
  };
}

export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <Sidebar user={user} />

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              L
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-slate-50">
              Langua<span className="text-indigo-600">Learn</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              🔥 {user.streak || 1}
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              ⚡ {user.xp || 0}
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Dev Mailbox drawer for effortless email verification checks */}
      <DevMailboxDrawer />
    </div>
  );
}
