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
  CheckCircle2,
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

  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          const lang = data.user.preferredLanguage || 'Malayalam';
          const greetingNative =
            lang === 'Malayalam'
              ? `ഹലോ ${data.user.name}! ഞാൻ നിങ്ങളുടെ ഇംഗ്ലീഷ് അധ്യാപിക മായയാണ്. ഇന്ന് നിങ്ങൾക്ക് സുഖമാണോ?`
              : lang === 'Hindi'
              ? `नमस्ते ${data.user.name}! मैं कोच माया हूँ, आपकी निजी अंग्रेजी शिक्षक। आज आप कैसे हैं?`
              : lang === 'Tamil'
              ? `வணக்கம் ${data.user.name}! நான் உங்கள் ஆங்கில ஆசிரியர் மாயா. இன்று எப்படி இருக்கிறீர்கள்?`
              : undefined;

          // Initial greeting from Coach Maya
          setMessages([
            {
              id: 'msg-1',
              sender: 'tutor',
              text: `Hello ${data.user.name}! I am Coach Maya, your personal English tutor. How are you doing today?`,
              nativeTranslation: greetingNative,
              audioText: `Hello ${data.user.name}! I am Coach Maya, your personal English tutor. How are you doing today?`,
              timestamp: 'Just now',
            },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRec =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      const langCode = getSpeechCodeForLanguage(user?.preferredLanguage || 'Malayalam');
      recognition.lang = langCode || 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

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
          userLanguage: user?.preferredLanguage || 'Malayalam',
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
          text: data.response.replyEnglish,
          nativeTranslation: data.response.replyNative,
          correction: data.response.correction,
          audioText: data.response.replyEnglish,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, tutorMsg]);

        if (Array.isArray(data.response.suggestions) && data.response.suggestions.length > 0) {
          setSuggestions(data.response.suggestions);
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
          preferredLanguage: 'Malayalam',
        }
      }
    >
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-100">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-slate-900">Coach Maya</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  AI English Tutor
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Speaks simple English and explains in {user?.preferredLanguage || 'your language'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessages([
                {
                  id: 'msg-restart',
                  sender: 'tutor',
                  text: 'Fresh conversation started! What would you like to practice now?',
                  audioText: 'Fresh conversation started! What would you like to practice now?',
                  timestamp: 'Just now',
                },
              ]);
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Restart conversation"
          >
            <RefreshCw className="w-4 h-4" />
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
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-violet-100 text-violet-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-3'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  {msg.audioText && (
                    <AudioButton text={msg.audioText} label="" size="sm" className="shrink-0" />
                  )}
                </div>

                {/* Smart English Correction Box */}
                {msg.correction && (
                  <div className="mt-3 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-900 font-extrabold uppercase text-[10px] tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Smart Correction</span>
                    </div>
                    <p className="text-slate-600">
                      You said:{' '}
                      <span className="line-through text-rose-600 font-medium">
                        &ldquo;{msg.correction.original}&rdquo;
                      </span>
                    </p>
                    <p className="text-emerald-950 font-bold">
                      Better English:{' '}
                      <span className="text-emerald-700">&ldquo;{msg.correction.better}&rdquo;</span>
                    </p>
                    <p className="text-slate-600 pt-0.5">
                      💡 <strong>Why?</strong> {msg.correction.explanation}
                    </p>
                  </div>
                )}

                {/* Native Language Translation */}
                {msg.nativeTranslation && (
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      In {user?.preferredLanguage}:
                    </span>
                    {msg.nativeTranslation}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-11">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Coach Maya is typing...</span>
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
              className="px-3.5 py-1.5 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 border border-slate-200 rounded-full text-xs font-medium text-slate-700 whitespace-nowrap active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
              <span>{prompt}</span>
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
            className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500"
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-200'
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Tap to speak to Coach Maya'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : 'Speak or type in your language or English...'}
              className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 shadow-sm cursor-pointer"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
