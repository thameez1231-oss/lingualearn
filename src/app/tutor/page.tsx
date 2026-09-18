'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AudioButton } from '@/components/ui/AudioButton';
import { getSpeechCodeForLanguage } from '@/lib/languages';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  RefreshCw,
  Loader2,
  Mic,
  MicOff,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  nativeTranslation?: string;
  correction?: {
    original: string;
    better: string;
    explanation: string;
  };
  audioText?: string;
  timestamp: string;
}

function cleanDisplay(text?: string): string {
  if (!text) return '';
  let cleaned = text
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<\/?[a-z0-9]+(?:\s+[^>]*?)?>/gi, '')
    .replace(/(?:^|\b)\*?\*?svg\*?\*?(?:\b|$)/gi, '')
    .replace(/\[\s*svg\s*\]/gi, '')
    .replace(/\bXML\b/gi, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Balance unclosed quotes if model omitted closing quote before punctuation
  // Ignore contractions (like don't, doesn't, it's, I'm) when counting quotation marks
  const nonContractionQuotes = cleaned.replace(/\b[a-zA-Z]+'[a-zA-Z]+\b/g, '').match(/'/g) || [];
  if (nonContractionQuotes.length % 2 !== 0 && /(?:^|[\s:,"'])'[^']*$/.test(cleaned)) {
    if (cleaned.endsWith('.')) {
      cleaned = cleaned.slice(0, -1) + ".'";
    } else {
      cleaned += "'";
    }
  }

  // Also clean up any accidental trailing dangling quotes
  cleaned = cleaned.replace(/([a-zA-Z0-9]+)\'\s*$/, '$1');

  return cleaned;
}

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
  };
}

interface SpeechRecognitionEvent {
  results?: SpeechRecognitionResultList;
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
}

const DEFAULT_WELCOME_MSG: ChatMessage = {
  id: 'msg-welcome',
  sender: 'tutor',
  text: 'Hello! I am Coach Maya, your personal AI English tutor. We can practice speaking, chatting, or checking grammar. You can type in English or your native language! What would you like to talk about today?',
  nativeTranslation: 'ഹലോ! ഞാൻ കോച്ച് മായയാണ്, നിങ്ങളുടെ ഇംഗ്ലീഷ് അധ്യാപിക. എന്ത് സംസാരിക്കാനാണ് നിങ്ങൾക്ക് താല്പര്യം?',
  audioText: 'Hello! I am Coach Maya, your personal AI English tutor. What would you like to talk about today?',
  timestamp: 'Just now',
};

export default function TutorPage() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    xp?: number;
    streak?: number;
    preferredLanguage?: string;
    englishLevel?: string;
  } | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'How do I introduce myself in English?',
    'Let us practice ordering food in a cafe.',
    'I am go to school yesterday.',
    'What is the difference between see and watch?',
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          const welcomeName = data.user.name ? data.user.name.split(' ')[0] : 'there';
          setMessages((prev) =>
            prev.map((m) =>
              m.id === 'msg-welcome'
                ? {
                    ...m,
                    text: `Hello ${welcomeName}! I am Coach Maya, your personal AI English tutor. We can practice speaking, chatting, or checking grammar. You can type in English or your native language! What would you like to talk about today?`,
                    audioText: `Hello ${welcomeName}! I am Coach Maya, your personal AI English tutor. What would you like to talk about today?`,
                  }
                : m
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: new () => BrowserSpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => BrowserSpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = getSpeechCodeForLanguage(user?.preferredLanguage || 'en-US');
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${crypto.randomUUID()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          userLanguage: user?.preferredLanguage || 'English',
          proficiencyLevel: user?.englishLevel || 'BEGINNER',
          history: messages.slice(-8).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.response) {
        const tutorMsg: ChatMessage = {
          id: `tutor-${crypto.randomUUID()}`,
          sender: 'tutor',
          text: cleanDisplay(data.response.replyEnglish),
          nativeTranslation: cleanDisplay(data.response.replyNative),
          correction: data.response.correction,
          audioText: cleanDisplay(data.response.replyEnglish),
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, tutorMsg]);

        if (Array.isArray(data.response.suggestions) && data.response.suggestions.length > 0) {
          setSuggestions(data.response.suggestions.map((s: string) => cleanDisplay(s)));
        }

        if (data.awardedXp && user) {
          setUser({ ...user, xp: (user.xp || 0) + data.awardedXp });
        }
      }
    } catch (err) {
      console.error('Tutor chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      user={
        user || {
          id: 'guest',
          name: 'Learner',
          email: '',
          preferredLanguage: 'English',
        }
      }
    >
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-sm dark:shadow-none shadow-violet-100 select-none">
              <Bot className="w-6 h-6 select-none pointer-events-none" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-slate-900 dark:text-slate-50">Coach Maya</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  AI English Tutor
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speaks simple English and explains in {user?.preferredLanguage || 'your language'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const welcomeName = user?.name ? user.name.split(' ')[0] : 'there';
              setMessages([
                {
                  id: 'msg-restart',
                  sender: 'tutor',
                  text: `Fresh conversation started! What would you like to practice now, ${welcomeName}?`,
                  nativeTranslation: 'പുതിയ സംഭാഷണം ആരംഭിച്ചു! നമുക്ക് എന്ത് സംസാരിക്കണം?',
                  audioText: 'Fresh conversation started! What would you like to practice now?',
                  timestamp: 'Just now',
                },
              ]);
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer"
            title="Restart conversation"
          >
            <RefreshCw className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold select-none ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-violet-100 text-violet-700'
                }`}
                aria-hidden="true"
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
                ) : (
                  <Bot className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-xl p-4 sm:p-5 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none space-y-2.5'
                }`}
              >
                <div>
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap select-text">
                    {cleanDisplay(msg.text)}
                  </p>
                </div>

                {/* Smart English Correction Box */}
                {msg.correction && (
                  <div className="mt-2.5 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs space-y-1.5 select-text">
                    <div className="flex items-center gap-1.5 text-amber-900 font-extrabold uppercase text-[10px] tracking-wider select-none">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 select-none pointer-events-none" aria-hidden="true" />
                      <span className="select-none">Smart Correction</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      You said:{' '}
                      <span className="line-through text-rose-600 font-medium">
                        &ldquo;{cleanDisplay(msg.correction.original)}&rdquo;
                      </span>
                    </p>
                    <p className="text-emerald-950 font-bold">
                      Better English:{' '}
                      <span className="text-emerald-700">&ldquo;{cleanDisplay(msg.correction.better)}&rdquo;</span>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 pt-0.5">
                      💡 <strong>Why?</strong> {cleanDisplay(msg.correction.explanation)}
                    </p>
                  </div>
                )}

                {/* Native Language Translation */}
                {msg.nativeTranslation &&
                  cleanDisplay(msg.nativeTranslation).trim() !== '' &&
                  cleanDisplay(msg.nativeTranslation).toLowerCase().trim() !== cleanDisplay(msg.text).toLowerCase().trim() && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium select-text">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5 select-none">
                        In {user?.preferredLanguage || 'your language'}:
                      </span>
                      {cleanDisplay(msg.nativeTranslation)}
                    </div>
                )}

                {/* Bubble Action Footer (AudioButton cleanly separated from message text) */}
                {msg.audioText && msg.sender === 'tutor' && (
                  <div className="pt-1 flex items-center justify-end select-none">
                    <AudioButton
                      text={cleanDisplay(msg.audioText)}
                      label="Listen"
                      size="sm"
                      className="shrink-0 select-none text-[11px] py-1 px-2.5"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-11 select-none">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600 select-none pointer-events-none" aria-hidden="true" />
              <span className="select-none">Coach Maya is typing...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Contextual Suggestions Bar */}
        <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-900 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer select-none"
            >
              <Sparkles className="w-3 h-3 text-indigo-500 shrink-0 select-none pointer-events-none" aria-hidden="true" />
              <span className="select-none">{prompt}</span>
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500"
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all cursor-pointer select-none ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-sm dark:shadow-none shadow-rose-200'
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Tap to speak to Coach Maya'}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
              ) : (
                <Mic className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
              )}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : 'Speak or type in your language or English...'}
              className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none text-slate-900 dark:text-slate-50 placeholder:text-slate-400 font-medium"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 shadow-sm cursor-pointer select-none"
              title="Send message"
            >
              <Send className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
