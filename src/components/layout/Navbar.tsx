'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Mic } from 'lucide-react';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
  } | null;
}

import { ThemeToggle } from '../ui/ThemeToggle';

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm dark:shadow-none shadow-indigo-200 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-xl tracking-tight">L</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 transition-colors">
              Langua<span className="text-indigo-600">Learn</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">
              AI English Tutor
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
          <Link
            href="/#how-it-works"
            className="hover:text-indigo-600 transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/speak"
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <Mic className="w-4 h-4 text-emerald-500" />
            <span>Speak & Translate</span>
          </Link>
          <Link
            href="/learn"
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Courses</span>
          </Link>
          <Link
            href="/tutor"
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Tutor</span>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all active:scale-95"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-block px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-sm dark:shadow-none shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95"
              >
                Start Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
