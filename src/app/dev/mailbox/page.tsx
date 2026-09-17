'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mail, RefreshCw, ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface OutboxEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  previewUrl?: string;
  type: string;
  createdAt: string;
}

export default function DevMailboxPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const [emails, setEmails] = useState<OutboxEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<OutboxEmail | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dev/emails');
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        if (data.emails?.length > 0 && !selectedEmail) {
          setSelectedEmail(data.emails[0]);
        }
      }
    } catch (err) {
      console.error('Fetch emails error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch('/api/dev/emails')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.emails) {
          setEmails(data.emails);
          if (data.emails.length > 0) {
            setSelectedEmail((prev) => prev || data.emails[0]);
          }
        }
      })
      .catch((err) => console.error('Fetch emails error:', err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-800 flex flex-col">
      {/* Top Banner */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            <span className="font-extrabold text-base">LanguaLearn Developer Mailbox</span>
            <span className="text-[11px] px-2 py-0.5 bg-indigo-900/60 text-indigo-300 border border-indigo-700 rounded font-semibold">
              Live Inspection
            </span>
          </div>
        </div>

        <button
          onClick={fetchEmails}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </header>

      {/* Main Mailbox Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email List Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 overflow-hidden flex flex-col">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-3">
            Outbox Messages ({emails.length})
          </h2>

          <div className="flex-1 overflow-y-auto space-y-2">
            {emails.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No emails dispatched yet.
              </div>
            ) : (
              emails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <button
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{email.to}</span>
                      <span>
                        {new Date(email.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-50 truncate">
                      {email.subject}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Email Preview Area */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
          {selectedEmail ? (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Email Meta */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                      {selectedEmail.subject}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      To: <strong className="text-slate-800 dark:text-slate-200">{selectedEmail.to}</strong> •{' '}
                      {new Date(selectedEmail.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {selectedEmail.previewUrl && (
                    <a
                      href={selectedEmail.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors"
                    >
                      <span>Open in Ethereal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Quick Extract Action Link */}
                {(() => {
                  const match = selectedEmail.html.match(
                    /href="([^"]*(?:verify-email|reset-password)[^"]*)"/
                  );
                  if (match) {
                    return (
                      <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-bold text-emerald-950">
                            Action link found in this email!
                          </span>
                        </div>
                        <a
                          href={match[1]}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          Execute Verification / Action →
                        </a>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Rendered HTML Sandbox */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-700 overflow-auto">
                <div
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-xs overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select an email from the left sidebar to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
