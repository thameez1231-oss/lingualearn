'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, RefreshCw, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { DevMailboxDrawer } from '@/components/email/DevMailboxDrawer';

function VerifyNoticeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || 'your email address';
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setResending(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailParam }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('A fresh verification link was sent to your email!');
      } else {
        setMessage(data.error || 'Failed to resend. Please try again later.');
      }
    } catch {
      setMessage('Network error while resending.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80 text-center">
      <div className="w-18 h-18 mx-auto rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl mb-6 shadow-xs">
        📧
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        Check your email
      </h2>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
        We&apos;ve sent a verification link to{' '}
        <strong className="text-slate-900 font-semibold">{emailParam}</strong>.
        Please verify your email before continuing.
      </p>

      {message && (
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-700 font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Primary Actions */}
      <div className="mt-8 space-y-3">
        <button
          onClick={handleResend}
          disabled={resending}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all shadow-md shadow-indigo-100 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
          <span>{resending ? 'Sending...' : 'Resend verification email'}</span>
        </button>

        <Link
          href="/signup"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change email address</span>
        </Link>
      </div>

      {/* Dev Convenience Helper */}
      <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-10 sm:-mx-10 p-5 rounded-b-3xl">
        <p className="text-xs font-bold text-slate-700 mb-1">
          Testing in Development?
        </p>
        <p className="text-[11px] text-slate-500 mb-3">
          Verification emails are recorded live in the Dev Mailbox. Click below to view and complete verification with one click!
        </p>
        <Link
          href="/dev/mailbox"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <span>Open Dev Mailbox</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function VerifyNoticePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
            L
          </div>
          <span className="font-extrabold text-2xl text-slate-900">
            Lingua<span className="text-indigo-600">Learn</span>
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading...</div>}>
          <VerifyNoticeContent />
        </Suspense>
      </div>

      <DevMailboxDrawer />
    </div>
  );
}
