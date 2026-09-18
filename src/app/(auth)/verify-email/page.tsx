'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
    });
  } catch {
    // Ignored if canvas not ready
  }
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const statusParam = searchParams.get('status');

  const [loading, setLoading] = useState(token ? true : false);
  const [verified, setVerified] = useState(statusParam === 'success');
  const [error, setError] = useState('');

  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    if (!token && !verified) {
      fetch('/api/auth/me').then(res => res.json()).then(data => {
        if (data?.user?.email) setResendEmail(data.user.email);
      }).catch(() => {});
    }
  }, [token, verified]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResending(true);
    setResendError('');
    setResendSuccess(false);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setResendSuccess(true);
      } else {
        setResendError(data.error || 'Failed to resend email.');
      }
    } catch (err) {
      setResendError('Network error connecting to the server.');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (statusParam === 'success') {
      triggerConfetti();
      return;
    }

    if (token) {
      const verify = async () => {
        try {
          const res = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setVerified(true);
            triggerConfetti();
          } else {
            setError(data.error || 'Verification failed. The link may have expired.');
          }
        } catch {
          setError('Network error during verification.');
        } finally {
          setLoading(false);
        }
      };
      verify();
    }
  }, [token, statusParam]);

  return (
    <div className="bg-white dark:bg-slate-900 py-10 px-6 sm:px-10 shadow-lg dark:shadow-none shadow-slate-200/50 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
      {loading && (
        <div className="py-12 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Verifying your email...</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Please wait a moment while we activate your account.</p>
        </div>
      )}

      {!loading && !token && !verified && (
        <div className="py-12 space-y-4">
          <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">??</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Check your email</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            We've sent a verification link to your inbox. Please click the link to verify your account and continue.
          </p>

          <form onSubmit={handleResend} className="mt-8 max-w-sm mx-auto space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Didn't receive the email?</p>
            <div className="flex flex-col space-y-2">
              <input type="email" value={resendEmail} onChange={e => setResendEmail(e.target.value)} placeholder="Enter your email" className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              <button type="submit" disabled={resending} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold disabled:opacity-50">
                {resending ? 'Sending...' : 'Resend Verification Email'}   
              </button>
            </div>
            {resendSuccess && <p className="text-xs text-emerald-600 font-bold p-2 bg-emerald-50 rounded-md">Verification link sent! Check your inbox (and spam folder).</p>}
            {resendError && <p className="text-xs text-rose-600 font-bold p-2 bg-rose-50 rounded-md">{resendError}</p>}
          </form>

          <div className="pt-6">
            {process.env.NODE_ENV !== 'production' && (
              <Link href="/dev/mailbox" target="_blank" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline">
                Open Development Mailbox (for testing)
              </Link>
            )}
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Verification Link Invalid</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">{error}</p>
          <div className="pt-4 space-y-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 text-sm shadow-sm"
            >
              Go to Log In
            </Link>
          </div>
        </div>
      )}

      {!loading && verified && (
        <div className="py-4 space-y-6">
          <div className="w-20 h-20 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm dark:shadow-none shadow-emerald-50">
            ?
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Email verified successfully! ?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Your account is now fully verified. Let's personalize your English learning experience.
            </p>
          </div>

          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-left flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-indigo-900 block mb-0.5">Next step: Quick Onboarding</span>
              Choose your native language (Malayalam, Hindi, etc.) and your starting English level.
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/onboarding"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all shadow-sm dark:shadow-none shadow-indigo-100"
            >
              <span>Continue to Onboarding</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
            L
          </div>
          <span className="font-extrabold text-2xl text-slate-900 dark:text-slate-50">
            Langua<span className="text-indigo-600">Learn</span>
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
