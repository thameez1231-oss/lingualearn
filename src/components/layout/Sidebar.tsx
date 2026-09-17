'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  MessageSquare,
  Mic,
  BookOpen,
  Users,
  Award,
  LogOut,
  BookMarked,
  User,
  Flame,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    xp?: number;
    streak?: number;
    preferredLanguage?: string;
  } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [badgeCount, setBadgeCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (!user) return;
    let active = true;
    const fetchBadge = async () => {
      try {
        const res = await fetch('/api/friends/badge');
        if (res.ok) {
          const data = await res.json();
          if (active) setBadgeCount(data.count || 0);
        }
      } catch {
        // silent fail
      }
    };
    fetchBadge();
    const interval = setInterval(fetchBadge, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Learn', href: '/learn', icon: BookOpen },
    { label: 'Speak', href: '/speak', icon: Mic, highlight: true },
    { label: 'AI Tutor', href: '/tutor', icon: MessageSquare },
    { label: 'Friends', href: '/friends', icon: Users, badge: badgeCount },
    { label: 'Words', href: '/words', icon: BookMarked },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0 px-4 py-6 justify-between select-none">
      {/* Brand Header */}
      <div>
        <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm dark:shadow-none shadow-indigo-100 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-xl">L</span>
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-50 tracking-tight block">
              Langua<span className="text-indigo-600">Learn</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block -mt-1">
              {user?.preferredLanguage ? `${user.preferredLanguage} Bridge` : 'Beginner English'}
            </span>
          </div>
        </Link>

        {/* Quick Stats Pill */}
        {user && (
          <div className="mb-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{user.streak || 1} Day Streak</span>
            </div>
            <div className="flex items-center gap-1 text-indigo-700 font-bold text-xs">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>{user.xp || 0} XP</span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px] shadow-sm animate-pulse">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : item.highlight ? (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wide">
                    Live
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        {user && (
          <div className="flex flex-col gap-2 px-2 py-2 mb-2 rounded-xl bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div className="truncate mr-2">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
            </div>
            <div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-200 dark:border-slate-800">
               <span className="text-[10px] font-semibold text-slate-400">Appearance</span>
               <ThemeToggle />
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
