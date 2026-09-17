'use client';

import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { AudioButton } from '@/components/ui/AudioButton';
import { CheckCircle2, Globe, Loader2 } from 'lucide-react';

export function InteractiveHeroDemo() {
  const [selectedLang, setSelectedLang] = useState('Malayalam');
  const [inputText, setInputText] = useState('എനിക്ക് വിശക്കുന്നു');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    detectedLanguage: string;
    nativeText: string;
    englishText: string;
    phoneticGuide: string;
  }>({
    detectedLanguage: 'Malayalam',
    nativeText: 'എനിക്ക് വിശക്കുന്നു',
    englishText: 'I am hungry.',
    phoneticGuide: 'eye am HUHNG-gree',
  });

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.id === selectedLang) || SUPPORTED_LANGUAGES[0];

  const handleTranslate = async (text: string, lang: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/speak/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setResult(data.result);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const sampleChips = {
    Malayalam: [
      { text: 'എനിക്ക് വിശക്കുന്നു', label: 'I am hungry' },
      { text: 'ഞാൻ നാളെ വരും', label: 'I will come tomorrow' },
      { text: 'എനിക്ക് office-ൽ പോകണം', label: 'Office code-switching' },
    ],
    Hindi: [
      { text: 'मुझे भूख लगी है', label: 'I am hungry' },
      { text: 'आप कहाँ जा रहे हैं?', label: 'Where are you going?' },
      { text: 'मुझे train पकड़नी है', label: 'Train code-switching' },
    ],
    Tamil: [
      { text: 'எனக்கு பசிக்கிறது', label: 'I am hungry' },
      { text: 'எனக்கு உதவி தேவை', label: 'I need help' },
    ],
    Telugu: [
      { text: 'నాకు ఆకలిగా ఉంది', label: 'I am hungry' },
      { text: 'మీరు ఎక్కడికి వెళ్తున్నారు?', label: 'Where are you going?' },
    ],
    Spanish: [
      { text: 'Tengo hambre', label: 'I am hungry' },
      { text: 'Dónde está la estación', label: 'Where is the station' },
    ],
  }[selectedLang] || [
    { text: currentLang.samplePhrase, label: currentLang.sampleTranslation },
  ];

  return (
    <div className="mt-16 max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none shadow-slate-100 p-6 sm:p-8 text-left transition-all">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live Native Bridge Demonstration
          </span>
        </div>

        {/* Language Picker */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          <select
            value={selectedLang}
            onChange={(e) => {
              const newLang = e.target.value;
              setSelectedLang(newLang);
              const langObj = SUPPORTED_LANGUAGES.find((l) => l.id === newLang);
              if (langObj) {
                setInputText(langObj.samplePhrase);
                handleTranslate(langObj.samplePhrase, newLang);
              }
            }}
            className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.flag} {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Try Chips */}
      <div className="flex items-center gap-2 my-4 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Try phrase:</span>
        {sampleChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInputText(chip.text);
              handleTranslate(chip.text, selectedLang);
            }}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all"
          >
            &ldquo;{chip.text}&rdquo;
          </button>
        ))}
      </div>

      {/* Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Native Language Box */}
        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
            <span>YOU SAY ({currentLang.name.toUpperCase()})</span>
            <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md">Native Input</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 leading-snug">
            &ldquo;{result.nativeText}&rdquo;
          </p>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTranslate(inputText, selectedLang);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type in ${currentLang.name}...`}
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Translate'}
              </button>
            </form>
          </div>
        </div>

        {/* Natural English Output Box */}
        <div className="bg-gradient-to-br from-indigo-50/70 to-violet-50/70 rounded-xl p-5 border border-indigo-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700 mb-3">
              <span>LANGUALEARN ENGLISH TUTOR</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold">
                Natural English
              </span>
            </div>
            <p className="text-2xl font-extrabold text-indigo-950 leading-snug">
              &ldquo;{result.englishText}&rdquo;
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-indigo-100/80">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Phonetic: <span className="font-semibold text-slate-700 dark:text-slate-300">{result.phoneticGuide}</span>
            </span>
            <AudioButton text={result.englishText} label="Listen" size="sm" />
          </div>
        </div>
      </div>

      <div className="mt-5 text-center sm:text-left text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Full sentence semantic translation: understands tense, context, and grammar without word-by-word substitution.
        </span>
      </div>
    </div>
  );
}
