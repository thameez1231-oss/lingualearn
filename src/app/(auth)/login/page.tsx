'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DevMailboxDrawer } from '@/components/email/DevMailboxDrawer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendStatus('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      // Check onboarding
      if (data.user?.emailVerified === false) {
          router.push('/verify-email');
        } else if (data.user?.onboardingCompleted) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm dark:shadow-none shadow-indigo-200 group-hover:scale-105 transition-transform font-black text-xl">
            L
          </div>
          <span className="font-extrabold text-2xl text-slate-900 dark:text-slate-50 tracking-tight">
            Langua<span className="text-indigo-600">Learn</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Continue your English journey right where you left off
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-lg dark:shadow-none shadow-slate-200/50 rounded-xl border border-slate-200 dark:border-slate-700/80 sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{error}</span>
                {error.includes('No account found') && (
                  <div className="mt-2 pt-2 border-t border-rose-200">
                    <Link
                      href="/signup"
                      className="font-bold text-indigo-700 hover:text-indigo-900 underline inline-flex items-center gap-1"
                    >
                      <span>Create a free account now →</span>
                    </Link>
                  </div>
                )}
                {error.includes('Incorrect password') && (
                  <div className="mt-2 pt-2 border-t border-rose-200">
                    <Link
                      href="/forgot-password"
                      className="font-bold text-indigo-700 hover:text-indigo-900 underline inline-flex items-center gap-1"
                    >
                      <span>Reset your password →</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {resendStatus && (
            <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all shadow-sm dark:shadow-none shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Login Helper */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@langualearn.com');
                  setPassword('Password123!');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60 transition-all cursor-pointer"
                title="Pre-fills demo account credentials"
              >
                <span>⚡ Fill Demo Account (demo@langualearn.com)</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-bold text-indigo-600 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <DevMailboxDrawer />
    </div>
  );
}
