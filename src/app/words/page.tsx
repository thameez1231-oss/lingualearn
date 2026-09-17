'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AudioButton } from '@/components/ui/AudioButton';
import {
  Search,
  BookMarked,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { DictionaryEntry } from '@/data/dictionary';

export default function WordsPage() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    preferredLanguage?: string;
  } | null>(null);

  const [query, setQuery] = useState('');
  const [words, setWords] = useState<DictionaryEntry[]>([]);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);

  const fetchWords = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/words?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setWords(data.words || []);
        setSavedWords(data.savedWords || []);
      }
    } catch (err) {
      console.error('Fetch words error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.user) setUser(data.user);
      })
      .catch(() => {});

    fetch('/api/words?q=')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          setWords(data.words || []);
          setSavedWords(data.savedWords || []);
        }
      })
      .catch((err) => console.error('Initial words load error:', err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleSave = async (word: DictionaryEntry) => {
    const isSaved = savedWords.includes(word.word.toLowerCase());
    // Optimistic update
    setSavedWords((prev) =>
      isSaved
        ? prev.filter((w) => w !== word.word.toLowerCase())
        : [...prev, word.word.toLowerCase()]
    );

    try {
      await fetch('/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: word.word,
          nativeTranslation:
            word.translations[user?.preferredLanguage || 'Malayalam'] || '',
          definition: word.simpleDefinition,
        }),
      });
    } catch (err) {
      console.error('Bookmark toggle error:', err);
    }
  };

  const displayedWords = filterSavedOnly
    ? words.filter((w) => savedWords.includes(w.word.toLowerCase()))
    : words;

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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Bilingual Dictionary</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Word Lookup
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Search any English word to get instant native translations, pronunciation, and examples.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFilterSavedOnly(!filterSavedOnly)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              filterSavedOnly
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${filterSavedOnly ? 'fill-white' : ''}`} />
            <span>Saved Words ({savedWords.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              fetchWords(e.target.value);
            }}
            placeholder="What word do you want to learn? (e.g. Beautiful, Apple, Water)..."
            className="w-full pl-12 pr-4 py-3.5 text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400"
          />
        </div>

        {/* Word Cards Grouped by Level/Category */}
        <div className="space-y-10">
          {Object.entries(
            displayedWords.reduce((acc, item) => {
              const cat = item.category.toUpperCase();
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(item);
              return acc;
            }, {} as Record<string, DictionaryEntry[]>)
          ).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                {category} LEVEL
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => {
            const isSaved = savedWords.includes(item.word.toLowerCase());
            const nativeWord =
              item.translations[user?.preferredLanguage || 'Malayalam'] ||
              item.translations['Malayalam'];

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-50">
                            {item.word}
                          </h3>
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {item.partOfSpeech}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {item.phonetic}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSave(item)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                      }`}
                      title={isSaved ? 'Remove from Saved Words' : 'Save to My Words'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Native Translation */}
                  <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Meaning in {user?.preferredLanguage || 'Malayalam'}
                    </span>
                    <p className="font-bold text-base text-indigo-950">{nativeWord}</p>
                  </div>

                  {/* Definition */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    {item.simpleDefinition}
                  </p>

                  {/* Example Sentence */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        &ldquo;{item.exampleSentence}&rdquo;
                      </p>
                      <AudioButton text={item.exampleSentence} label="" size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.exampleTranslation}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <AudioButton text={item.word} label="Pronounce Word" size="sm" />
                  <span className="text-[11px] font-medium text-slate-400">
                    Category: {item.category}
                  </span>
                </div>
              </div>
            );
                })}
              </div>
            </div>
          ))}
        </div>

        {displayedWords.length === 0 && !loading && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No words found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try searching for another word or clear the filter.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
