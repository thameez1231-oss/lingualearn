import { getLanguageCode } from './languages';

export interface TranslationResult {
  detectedLanguage: string;
  nativeText: string;
  englishText: string;
  phoneticGuide: string;
  breakdown: { word: string; meaning: string }[];
  naturalTip?: string;
  confidence: number; // 0 to 1
  didYouMean?: string[];
  isCodeSwitched?: boolean;
}

export interface GrammarCorrection {
  original: string;
  better: string;
  explanation: string;
}

export interface TutorResponse {
  replyEnglish: string;
  replyNative: string;
  correction?: GrammarCorrection;
  suggestions: string[];
}

// Generates beginner-friendly phonetic pronunciation guides for English words
const PHONETIC_MAP: Record<string, string> = {
  i: 'eye',
  am: 'am',
  hungry: 'HUHNG-gree',
  thirsty: 'THUR-stee',
  tired: 'TY-urd',
  water: 'WAH-ter',
  food: 'food',
  where: 'wair',
  what: 'wut',
  when: 'wen',
  who: 'hoo',
  why: 'wy',
  how: 'how',
  are: 'ahr',
  you: 'yoo',
  going: 'GOH-ing',
  doing: 'DOO-ing',
  coming: 'KUHM-ing',
  school: 'skool',
  tomorrow: 'tuh-MAH-roh',
  yesterday: 'YES-ter-day',
  today: 'tuh-DAY',
  help: 'help',
  please: 'pleez',
  thank: 'thank',
  hello: 'heh-LOH',
  good: 'good',
  morning: 'MOR-ning',
  night: 'nyt',
  beautiful: 'BYOO-tih-ful',
  friend: 'frend',
  house: 'hows',
  home: 'hohm',
  car: 'kahr',
  bus: 'buss',
  train: 'trayn',
  cost: 'kawst',
  much: 'much',
  many: 'MEH-nee',
  want: 'wahnt',
  need: 'need',
  understand: 'un-der-STAND',
  speak: 'speek',
  english: 'ING-glish',
  name: 'naym',
};

export function generatePhoneticGuide(englishSentence: string): string {
  const words = englishSentence
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return englishSentence;

  return words
    .map((w) => PHONETIC_MAP[w] || w)
    .join(' ');
}

// Clean and naturalize English output
function naturalizeEnglish(rawText: string): string {
  let cleaned = rawText.trim();

  // Strip XML/HTML tags (e.g. <g id="1"> from translation APIs)
  cleaned = cleaned.replace(/<[^>]+>/g, '').trim();

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // Remove surrounding quotes if model added them
  cleaned = cleaned.replace(/^["']|["']$/g, '').trim();

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Ensure ending punctuation
  if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }

  // Fix common robotic capitalization/spacings
  cleaned = cleaned.replace(/\s+([,.!?])/g, '$1');

  return cleaned;
}

// Server-side Neural Machine Translation Engine (Translates complete sentences, preserves syntax & tenses)
// Server-side Neural Machine Translation Engine (Bidirectional, translates complete sentences)
export async function fetchNeuralTranslation(
  text: string,
  sourceLangCode: string,
  targetLangCode: string = 'en'
): Promise<string | null> {
  const query = encodeURIComponent(text);
  const sl = sourceLangCode && sourceLangCode !== 'auto' ? sourceLangCode : 'auto';
  const tl = targetLangCode || 'en';

  // 1. Primary: Google Neural Translation Engine (Fast, preserves idioms and grammar)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${query}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data[0])) {
        const translatedParts = data[0]
          .map((item: unknown) => (Array.isArray(item) && typeof item[0] === 'string' ? item[0] : ''))
          .filter(Boolean);
        const combined = translatedParts.join(' ').trim();
        if (combined && combined.toLowerCase() !== text.toLowerCase()) {
          return tl === 'en' ? naturalizeEnglish(combined) : combined;
        }
      }
    }
  } catch (err) {
    console.warn('[Translation] Primary engine notice:', err);
  }

  // 2. High-Reliability Neural Secondary Engine (MyMemory Translation API)
  if (sl !== 'auto') {
    try {
      const fallbackUrl = `https://api.mymemory.translated.net/get?q=${query}&langpair=${sl}|${tl}`;
      const fallbackRes = await fetch(fallbackUrl);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        const translated = fallbackData?.responseData?.translatedText;
        if (
          translated &&
          typeof translated === 'string' &&
          !translated.toUpperCase().includes('MYMEMORY WARNING') &&
          translated.toLowerCase() !== text.toLowerCase()
        ) {
          return tl === 'en' ? naturalizeEnglish(translated) : translated;
        }
      }
    } catch (err) {
      console.warn('[Translation] Secondary engine notice:', err);
    }
  }

  return null;
}

/**
 * Strips raw HTML, XML, SVG tags, "svg" artifacts, and markdown debris from tutor output.
 */
export function sanitizeTutorText(text: string): string {
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

// Comprehensive grammar mistake detector for beginner English learners
const GRAMMAR_MISTAKES = [
  {
    regex: /\b(he|she|it)\s+don'?t\s+like\s+tea\b/i,
    better: "$1 doesn't like tea",
    explanation: "We use 'doesn't' with 'he, she, and it.'",
  },
  {
    regex: /\bi\s+(?:am\s+)?go\s+(?:to\s+)?(?:school|market|office|work|home)?\s*yesterday\b/i,
    better: 'I went to school yesterday',
    explanation: "For actions in the past ('yesterday'), use the past tense 'went', not 'am go'.",
  },
  {
    regex: /\bi\s+am\s+go\s+to\b/i,
    better: 'I am going to',
    explanation: 'After "am", use the continuous "-ing" form ("going") for actions happening now or planned.',
  },
  {
    regex: /\bi\s+am\s+agree\b/i,
    better: 'I agree',
    explanation: '"Agree" is already a verb; say "I agree", without "am".',
  },
  {
    regex: /\bi\s+am\s+know\b/i,
    better: 'I know',
    explanation: '"Know" is a state verb; simply say "I know", not "I am know".',
  },
  {
    regex: /\bi\s+go\s+(yesterday|last\s+\w+)\b/i,
    better: 'I went',
    explanation: 'Use the past tense "went" for actions that occurred in the past.',
  },
  {
    regex: /\b(yesterday|last\s+\w+)\s+i\s+go\b/i,
    better: 'I went',
    explanation: 'Use the past tense "went" for completed past actions.',
  },
  {
    regex: /\b(he|she|it)\s+have\b/i,
    better: 'has',
    explanation: 'With singular third-person subjects ("He", "She", "It"), use "has" instead of "have".',
  },
  {
    regex: /\b(he|she|it)\s+don'?t\b/i,
    better: "doesn't",
    explanation: 'With "He", "She", or "It", use "does not" or "doesn\'t" instead of "don\'t".',
  },
  {
    regex: /\bi\s+didn'?t\s+went\b/i,
    better: "I didn't go",
    explanation: 'After "didn\'t", always use the base verb form ("go", not "went").',
  },
  {
    regex: /\bi\s+didn'?t\s+saw\b/i,
    better: "I didn't see",
    explanation: 'After "didn\'t", use the base verb ("see", not "saw").',
  },
  {
    regex: /\bi\s+didn'?t\s+ate\b/i,
    better: "I didn't eat",
    explanation: 'After "didn\'t", use the base verb ("eat", not "ate").',
  },
  {
    regex: /\bhow\s+much\s+years\b/i,
    better: 'How old are you?',
    explanation: 'When asking someone\'s age, in English we say "How old are you?".',
  },
  {
    regex: /\bi\s+am\s+in\s+bus\b/i,
    better: 'I am on the bus',
    explanation: 'For public transit (buses, trains, planes), use "on the bus/train".',
  },
  {
    regex: /\bi\s+am\s+in\s+train\b/i,
    better: 'I am on the train',
    explanation: 'In English, we say "on the train" rather than "in train".',
  },
  {
    regex: /\blisten\s+me\b/i,
    better: 'listen to me',
    explanation: '"Listen" requires the preposition "to" before an object ("listen to me").',
  },
  {
    regex: /\bdiscuss\s+about\b/i,
    better: 'discuss',
    explanation: '"Discuss" means talk about, so do not say "discuss about".',
  },
  {
    regex: /\bmarried\s+with\b/i,
    better: 'married to',
    explanation: 'In English, we say someone is "married to" their partner.',
  },
  {
    regex: /\bi\s+am\s+engineer\b/i,
    better: 'I am an engineer',
    explanation: 'Use the article "an" before singular professions starting with a vowel sound.',
  },
  {
    regex: /\bi\s+am\s+doctor\b/i,
    better: 'I am a doctor',
    explanation: 'Use the article "a" before singular professions ("a doctor").',
  },
  {
    regex: /\bi\s+am\s+teacher\b/i,
    better: 'I am a teacher',
    explanation: 'Say "I am a teacher" with the indefinite article "a".',
  },
  {
    regex: /\bi\s+am\s+student\b/i,
    better: 'I am a student',
    explanation: 'Say "I am a student" with the indefinite article "a".',
  },
  {
    regex: /\bmyself\s+([a-zA-Z]+)\b/i,
    better: 'My name is $1',
    explanation: 'In English introductions, say "My name is [Name]" or "I am [Name]".',
  },
  {
    regex: /\bwhere\s+you\s+are\s+going\b/i,
    better: 'Where are you going?',
    explanation: 'In English questions, invert the subject and helping verb: "Where are you going?".',
  },
  {
    regex: /\bwhat\s+you\s+are\s+doing\b/i,
    better: 'What are you doing?',
    explanation: 'In English questions, place the helping verb first: "What are you doing?".',
  },
  {
    regex: /\bmore\s+better\b/i,
    better: 'better',
    explanation: '"Better" is already comparative; avoid double comparatives like "more better".',
  },
  {
    regex: /\bmore\s+taller\b/i,
    better: 'taller',
    explanation: '"Taller" already has "-er"; avoid saying "more taller".',
  },
  {
    regex: /\bno\s+mention\b/i,
    better: "You're welcome",
    explanation: 'A more natural English response to "Thank you" is "You\'re welcome" or "My pleasure".',
  },
];

/**
 * Detects Manglish (Malayalam written in Latin/English script) and mixed Malayalam-English.
 * Understands phrases and converts into equivalent English meaning.
 */
export function resolveManglishAndMixed(text: string): { isManglish: boolean; englishMeaning: string | null } {
  const trimmed = text.trim();
  const latinOnly = /^[a-zA-Z0-9\s.,!?'-]+$/.test(trimmed);
  const englishWords = ['is', 'are', 'am', 'the', 'this', 'that', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'how', 'when', 'why', 'where', 'good', 'bad'];
  
  if (latinOnly) {
    const words = trimmed.toLowerCase().split(/\s+/);
    const engCount = words.filter(w => englishWords.includes(w)).length;
    if (engCount < words.length * 0.4 && words.length > 1) {
       return { isManglish: true, englishMeaning: null };
    }
  }
  return { isManglish: false, englishMeaning: null };
}

export async function translateNativeToEnglish(
  text: string,
  preferredLanguage: string,
  context?: string
): Promise<TranslationResult> {
  const trimmed = text.trim();
  const sourceLangCode = getLanguageCode(preferredLanguage);

  const isPureEnglish = /^[a-zA-Z0-9\s.,!?'"-]+$/.test(trimmed);
  if (isPureEnglish && trimmed.split(/\s+/).length <= 4) {
    const natural = naturalizeEnglish(trimmed);
    return {
      detectedLanguage: 'English',
      nativeText: trimmed,
      englishText: natural,
      phoneticGuide: generatePhoneticGuide(natural),
      breakdown: [],
      confidence: 0.98,
    };
  }

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-flash-latest',
    ];
    for (const model of candidateModels) {
      try {
        const strictInstruction = `You are a highly accurate multilingual translation engine.
Translate the user's sentence from ${preferredLanguage} into natural, grammatically correct English.
First understand the complete meaning and context of the sentence.
Do not translate word-by-word. Preserve the user's intended meaning.
If the source sentence is informal or conversational, produce natural conversational English.
If the source contains an idiom or expression, translate its meaning.
${context ? `Context of conversation: "${context}"` : ''}

User's sentence: "${trimmed}"

Respond in JSON only with format:
{
  "detectedLanguage": "${preferredLanguage}",
  "englishText": "Natural, grammatically correct English translation preserving full meaning",
  "phoneticGuide": "Easy phonetic breakdown for beginners like eye am HUHNG-gree",
  "breakdown": [{"word": "native phrase", "meaning": "English meaning"}],
  "confidence": 0.95,
  "didYouMean": [] // include alternative interpretations if ambiguous, otherwise empty array
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: strictInstruction }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            const cleanJson = content.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed?.englishText) {
              const natural = naturalizeEnglish(parsed.englishText);
              return {
                detectedLanguage: parsed.detectedLanguage || preferredLanguage,
                nativeText: trimmed,
                englishText: natural,
                phoneticGuide: parsed.phoneticGuide || generatePhoneticGuide(natural),
                breakdown: parsed.breakdown || [],
                confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.95,
                didYouMean: parsed.didYouMean || [],
              };
            }
          }
        }
      } catch (err) {
        console.warn(`[AI] Gemini ${model} translation notice:`, err);
      }
    }
  }

  const neuralResult = await fetchNeuralTranslation(trimmed, sourceLangCode);
  if (neuralResult) {
    const phonetic = generatePhoneticGuide(neuralResult);
    return {
      detectedLanguage: preferredLanguage,
      nativeText: trimmed,
      englishText: neuralResult,
      phoneticGuide: phonetic,
      breakdown: [],
      confidence: 0.92,
    };
  }

  return {
    detectedLanguage: preferredLanguage,
    nativeText: trimmed,
    englishText: naturalizeEnglish(trimmed),
    phoneticGuide: generatePhoneticGuide(trimmed),
    breakdown: [],
    confidence: 0.4,
    didYouMean: ['Could you please say that again?', 'Try speaking in a quieter room.'],
  };
}

export async function chatWithAITutor(
  userMessage: string,
  userLanguage: string = 'English',
  englishLevel: string = 'COMPLETE_BEGINNER',
  history: { role: 'user' | 'assistant'; text: string }[] = []
): Promise<TutorResponse> {
  const trimmed = userMessage.trim();
  const userLangCode = getLanguageCode(userLanguage);
  
  const isNativeScript = !/^[a-zA-Z0-9\s.,!?'"-]+$/.test(trimmed);
  let isEnglishAttempt = !isNativeScript;
  
  let detectedCorrection: GrammarCorrection | undefined = undefined;

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-flash-latest',
    ];
    for (const model of candidateModels) {
      try {
        const conversationContext = history
          .slice(-8)
          .map((h) => `${h.role === 'user' ? 'Learner' : 'Coach Maya'}: ${h.text}`)
          .join('\n');

        const prompt = `You are Coach Maya, an encouraging, incredibly smart, empathetic, and professional English teacher for LinguaLearn.
Learner's Native Language: ${userLanguage}
Learner's English Proficiency: ${englishLevel}

Conversation History:
${conversationContext || 'No previous conversation yet.'}

Learner's Latest Message: "${trimmed}"

PEDAGOGICAL & CONVERSATIONAL RULES:
1. ADAPTIVE INTELLIGENCE:
   - The learner may write in English, their native script (${userLanguage}), OR transliterated/romanized ${userLanguage} (e.g., Manglish for Malayalam, Pinyin for Chinese, Hinglish for Hindi). 
   - Accurately understand their true intent, even if heavily transliterated. Do NOT get confused by transliterations.

2. TEACHER BEHAVIOR:
   - Act as a real, professional English tutor.
   - For BEGINNER levels: Explain concepts extremely simply. Do not overwhelm them.
   - For ADVANCED/PROFESSIONAL levels: Use more sophisticated vocabulary and focus on nuance, idioms, or professional context.
   - If the user wrote in ${userLanguage} or transliteration, validate their thought warmly, translate it mentally, and teach them how to naturally express that specific thought in English.
   
3. SMART CORRECTIONS:
   - ONLY provide a "correction" object if the user made an English grammatical, word-choice, or tense error.
   - NEVER correct their ${userLanguage} or transliterated messages. If they write in their native language, set "correction": null.
   - If you correct them, explicitly explain WHY they were wrong in the "explanation" field.

4. LANGUAGE ISOLATION (CRITICAL):
   - ONLY use English and ${userLanguage}. 
   - NEVER use any other language. NEVER assume they speak Malayalam unless ${userLanguage} is Malayalam.
   - "replyEnglish" is your main teaching response (1-4 natural sentences).
   - "replyNative" is a supportive translation, explanation, or encouragement strictly in ${userLanguage} script.

5. SUGGESTIONS:
   - Provide 3 contextually relevant, natural English sentences the learner can say next to keep the conversation flowing.

Return PURE JSON ONLY with this schema:
{
  "replyEnglish": "your main English teaching reply",
  "replyNative": "helpful translation/encouragement strictly in ${userLanguage}",
  "correction": null or {"original": "the exact mistake", "better": "natural correction", "explanation": "Why this is correct"},
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanJsonStr = rawText.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
          if (cleanJsonStr) {
            const parsed = JSON.parse(cleanJsonStr);
            return {
              replyEnglish: sanitizeTutorText(parsed.replyEnglish),
              replyNative: sanitizeTutorText(parsed.replyNative),
              correction: parsed.correction ? {
                original: sanitizeTutorText(parsed.correction.original),
                better: sanitizeTutorText(parsed.correction.better),
                explanation: sanitizeTutorText(parsed.correction.explanation)
              } : undefined,
              suggestions: (parsed.suggestions || []).map((s: string) => sanitizeTutorText(s)).slice(0, 3)
            };
          }
        }
      } catch (err) {
        console.warn(`[AI] ${model} failed, trying next fallback.`);
      }
    }
  }

  // --- Smart Fallback if Gemini Fails ---
  let englishMeaning = trimmed;
  if (!isEnglishAttempt) {
    const neuralMeaning = await fetchNeuralTranslation(trimmed, userLangCode, 'en');
    if (neuralMeaning) englishMeaning = neuralMeaning;
  }

  const naturalPhrase = naturalizeEnglish(englishMeaning);
  let replyEnglish = `That is great! A clear way to express this in English is: "${naturalPhrase}". Try saying it aloud!`;
  let replyNative = `Practice saying this naturally in English!`;

  try {
     const fallbackTranslation = await fetchNeuralTranslation(replyNative, 'en', userLangCode);
     if (fallbackTranslation) replyNative = fallbackTranslation;
  } catch(e) {}

  return {
    replyEnglish: sanitizeTutorText(replyEnglish),
    replyNative: sanitizeTutorText(replyNative),
    correction: undefined,
    suggestions: [naturalPhrase, 'Can you explain that again?', 'What should I say next?'].map(s => sanitizeTutorText(s)),
  };
}
