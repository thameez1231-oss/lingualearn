'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Mic, MessageSquare, Users, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const [badgeCount, setBadgeCount] = useState<number>(0);

  useEffect(() => {
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
  }, []);

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Learn', href: '/learn', icon: BookOpen },
    { label: 'Speak', href: '/speak', icon: Mic, accent: true },
    { label: 'Friends', href: '/friends', icon: Users, badge: badgeCount },
    { label: 'Tutor', href: '/tutor', icon: MessageSquare },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 px-2 py-2 flex items-center justify-around shadow-sm dark:shadow-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-1 px-1.5 min-w-[50px] transition-colors relative ${
              isActive
                ? 'text-indigo-600 font-bold'
                : item.accent
                ? 'text-emerald-600 hover:text-emerald-700'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-indigo-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-1 truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
