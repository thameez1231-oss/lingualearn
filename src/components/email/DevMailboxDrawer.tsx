'use client';

import React, { useState, useEffect } from 'react';
import { Mail, ExternalLink, RefreshCw, X, CheckCircle2 } from 'lucide-react';

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

export function DevMailboxDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState<OutboxEmail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;

    let ignore = false;
    const loadData = () => {
      fetch('/api/dev/emails')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!ignore && data?.emails) {
            setEmails(data.emails);
          }
        })
        .catch(() => {});
    };

    if (isOpen) {
      loadData();
    }
    const interval = setInterval(loadData, 8000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [isOpen]);

  const fetchEmails = async () => {
    if (process.env.NODE_ENV === 'production') return;
    try {
      setLoading(true);
      const res = await fetch('/api/dev/emails');
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
      }
    } catch (err) {
      console.error('Failed to load dev emails:', err);
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            fetchEmails();
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 text-white rounded-full shadow-xl border border-slate-700 hover:bg-slate-800 transition-all active:scale-95 text-xs font-semibold"
          title="Open Dev Mailbox to view verification and password reset emails"
        >
          <Mail className="w-4 h-4 text-indigo-400" />
          <span>Dev Mailbox</span>
          {emails.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-indigo-500 text-white rounded-full font-bold">
              {emails.length}
            </span>
          )}
        </button>
      )}

      {/* Expanded Modal / Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-96 max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-sm">Developer Mailbox</span>
              <span className="text-[10px] px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded border border-indigo-800">
                Local Emails
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={fetchEmails}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                title="Refresh mailbox"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
            {emails.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <p>No emails sent yet.</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Register an account or reset password to see live verification links here.
                </p>
              </div>
            ) : (
              emails.map((email) => {
                // Extract verification or reset link if present in HTML
                const linkMatch = email.html.match(/href="([^"]*(?:verify-email|reset-password)[^"]*)"/);
                const actionLink = linkMatch ? linkMatch[1] : null;

                return (
                  <div key={email.id} className="pt-2.5 first:pt-0">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800 truncate max-w-[190px]">
                        {email.to}
                      </span>
                      <span>
                        {new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="font-medium text-xs text-slate-900 mb-1.5 flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          email.type === 'VERIFICATION' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {email.subject}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-2">
                      {actionLink && (
                        <a
                          href={actionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete Action</span>
                        </a>
                      )}
                      {email.previewUrl && (
                        <a
                          href={email.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          <span>Ethereal Mail</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Real SMTP can be configured in .env</span>
            <a
              href="/dev/mailbox"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Full Page Mailbox →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
