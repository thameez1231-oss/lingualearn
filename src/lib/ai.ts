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
async function fetchNeuralTranslation(
  text: string,
  sourceLangCode: string
): Promise<string | null> {
  const query = encodeURIComponent(text);
  const sl = sourceLangCode && sourceLangCode !== 'auto' ? sourceLangCode : 'auto';

  // 1. Primary: Google Neural Translation Engine (Fast, preserves idioms and grammar)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=en&dt=t&q=${query}`;
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
          return naturalizeEnglish(combined);
        }
      }
    }
  } catch (err) {
    console.warn('[Translation] Primary engine notice:', err);
  }

  // 2. High-Reliability Neural Secondary Engine (MyMemory Translation API)
  if (sl !== 'auto') {
    try {
      const fallbackUrl = `https://api.mymemory.translated.net/get?q=${query}&langpair=${sl}|en`;
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
          return naturalizeEnglish(translated);
        }
      }
    } catch (err) {
      console.warn('[Translation] Secondary engine notice:', err);
    }
  }

  return null;
}

// Common grammar mistakes detector for English learning
const GRAMMAR_MISTAKES = [
  {
    regex: /\bi\s+am\s+go\s+to\b/i,
    better: 'I am going to',
    explanation: '"Going" (-ing) is used after "am" for actions happening now or planned.',
  },
  {
    regex: /\bi\s+go\s+yesterday\b/i,
    better: 'I went yesterday',
    explanation: 'Use the past tense "went" for actions completed yesterday.',
  },
  {
    regex: /\bhe\s+have\b/i,
    better: 'He has',
    explanation: 'With "He", "She", or "It", use "has" instead of "have".',
  },
  {
    regex: /\bshe\s+have\b/i,
    better: 'She has',
    explanation: 'With "He", "She", or "It", use "has" instead of "have".',
  },
  {
    regex: /\bshe\s+do\s+not\b/i,
    better: 'She does not',
    explanation: 'With "He", "She", or singular nouns, use "does not" (doesn\'t).',
  },
  {
    regex: /\bhe\s+do\s+not\b/i,
    better: 'He does not',
    explanation: 'With "He", "She", or singular nouns, use "does not" (doesn\'t).',
  },
  {
    regex: /\bi\s+am\s+agree\b/i,
    better: 'I agree',
    explanation: '"Agree" is already a verb; do not add "am" before it.',
  },
  {
    regex: /\bhow\s+much\s+years\b/i,
    better: 'How old are you?',
    explanation: 'When asking someone\'s age, say "How old are you?".',
  },
];

export async function translateNativeToEnglish(
  text: string,
  preferredLanguage: string,
  context?: string
): Promise<TranslationResult> {
  const trimmed = text.trim();
  const sourceLangCode = getLanguageCode(preferredLanguage);

  // 1. DO NOT OVER-TRANSLATE: Check if user input is already pure English
  const isPureEnglish = /^[a-zA-Z0-9\s.,!?'"-]+$/.test(trimmed);
  if (isPureEnglish && trimmed.split(/\s+/).length <= 4) {
    const natural = naturalizeEnglish(trimmed);
    return {
      detectedLanguage: 'English',
      nativeText: trimmed,
      englishText: natural,
      phoneticGuide: generatePhoneticGuide(natural),
      breakdown: [],
      naturalTip: 'Already natural English! Practice speaking it aloud.',
      confidence: 0.98,
    };
  }

  // 2. High-Quality AI LLM Translation (Tier 1: Google Gemini API)
  if (process.env.GEMINI_API_KEY) {
    try {
      const strictInstruction = `You are a highly accurate multilingual translation engine.
Translate the user's sentence from ${preferredLanguage} into natural, grammatically correct English.
First understand the complete meaning and context of the sentence.
Do not translate word-by-word.
Preserve the user's intended meaning.
Do not invent information.
Do not remove important information.
Do not add information that was not present.
If the source sentence is informal or conversational, produce natural conversational English.
If the source contains an idiom or expression, translate its meaning rather than translating the individual words literally.
If the source sentence is ambiguous, preserve the ambiguity rather than guessing an unrelated meaning.
Handle code-switching (e.g. ${preferredLanguage} mixed with English words) naturally.
${context ? `Context of conversation: "${context}"` : ''}

User's sentence: "${trimmed}"

Respond in JSON only with format:
{
  "detectedLanguage": "${preferredLanguage}",
  "englishText": "Natural, grammatically correct English translation preserving full meaning",
  "phoneticGuide": "Easy phonetic breakdown for beginners like eye am HUHNG-gree",
  "breakdown": [{"word": "native phrase", "meaning": "English meaning"}],
  "naturalTip": "1 short practical tip about how to use this English phrase naturally",
  "confidence": 0.95,
  "didYouMean": [] // include alternative interpretations if ambiguous, otherwise empty array
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
          const parsed = JSON.parse(content);
          if (parsed?.englishText) {
            const natural = naturalizeEnglish(parsed.englishText);
            return {
              detectedLanguage: parsed.detectedLanguage || preferredLanguage,
              nativeText: trimmed,
              englishText: natural,
              phoneticGuide: parsed.phoneticGuide || generatePhoneticGuide(natural),
              breakdown: parsed.breakdown || [],
              naturalTip: parsed.naturalTip || 'Practice saying this sentence aloud to build muscle memory.',
              confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.95,
              didYouMean: parsed.didYouMean || [],
            };
          }
        }
      }
    } catch (err) {
      console.warn('[AI] Gemini translation fallback to neural engine:', err);
    }
  }

  // 3. Full-Sentence Neural Translation Engine (Tier 2: Full Syntax & Meaning Translation)
  const neuralResult = await fetchNeuralTranslation(trimmed, sourceLangCode);
  if (neuralResult) {
    const phonetic = generatePhoneticGuide(neuralResult);
    return {
      detectedLanguage: preferredLanguage,
      nativeText: trimmed,
      englishText: neuralResult,
      phoneticGuide: phonetic,
      breakdown: [],
      naturalTip: 'Speak naturally in short sentences to practice your pronunciation!',
      confidence: 0.92,
    };
  }

  // 4. Uncertainty & Graceful Fallback
  return {
    detectedLanguage: preferredLanguage,
    nativeText: trimmed,
    englishText: naturalizeEnglish(trimmed),
    phoneticGuide: generatePhoneticGuide(trimmed),
    breakdown: [],
    naturalTip: 'We are not completely sure what was said. Try speaking clearly or clicking Edit.',
    confidence: 0.4,
    didYouMean: ['Could you please say that again?', 'Try speaking in a quieter room.'],
  };
}

export async function chatWithAITutor(
  userMessage: string,
  userLanguage: string,
  englishLevel: string,
  history: { role: 'user' | 'assistant'; text: string }[] = []
): Promise<TutorResponse> {
  const trimmed = userMessage.trim();

  // Check for smart grammar corrections if user attempted English
  let detectedCorrection: GrammarCorrection | undefined;
  for (const check of GRAMMAR_MISTAKES) {
    if (check.regex.test(trimmed)) {
      detectedCorrection = {
        original: trimmed,
        better: trimmed.replace(check.regex, check.better),
        explanation: check.explanation,
      };
      break;
    }
  }

  // If Gemini API is available, generate context-aware adaptive response
  if (process.env.GEMINI_API_KEY) {
    try {
      const conversationContext = history
        .slice(-4)
        .map((h) => `${h.role === 'user' ? 'Learner' : 'Coach Maya'}: ${h.text}`)
        .join('\n');

      const prompt = `You are Coach Maya, an encouraging, friendly English tutor for complete beginners at LinguaLearn.
Learner's native language: ${userLanguage}
Learner's English level: ${englishLevel}

Recent conversation context:
${conversationContext || 'No previous context.'}

Learner just said: "${trimmed}"

Rules:
1. Understand the meaning of what the learner said in the context of previous messages.
2. If the learner replied in their native language (${userLanguage}) or mixed language, understand their intent, respond warmly in simple English (1-2 clear sentences), and provide a translation in ${userLanguage}.
3. If the learner wrote in English with a mistake, explain gently with positive encouragement.
4. Keep English simple, friendly, and supportive.
5. Provide 2-3 short, relevant responses the user can say next.

Return JSON only:
{
  "replyEnglish": "Simple encouraging English response (1-2 sentences)",
  "replyNative": "Accurate natural translation in ${userLanguage}",
  "correction": null or {"original": "...", "better": "...", "explanation": "..."},
  "suggestions": ["Option 1", "Option 2"]
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            replyEnglish: naturalizeEnglish(parsed.replyEnglish),
            replyNative: parsed.replyNative || '',
            correction: parsed.correction || detectedCorrection,
            suggestions: parsed.suggestions || ['Hello!', 'How are you?', 'Thank you!'],
          };
        }
      }
    } catch (err) {
      console.warn('[AI] Gemini tutor fallback triggered:', err);
    }
  }

  // Neural translation of user message if native language
  let translatedContext = trimmed;
  const isPureEnglish = /^[a-zA-Z0-9\s.,!?'"-]+$/.test(trimmed);
  if (!isPureEnglish) {
    const trans = await fetchNeuralTranslation(trimmed, getLanguageCode(userLanguage));
    if (trans) translatedContext = trans;
  }

  // Context-aware responses
  const lower = translatedContext.toLowerCase();

  if (detectedCorrection) {
    return {
      replyEnglish: `Great try! A better way to say it is: "${detectedCorrection.better}". Keep practicing!`,
      replyNative: 'നല്ല ശ്രമം! കൂടുതൽ സ്വാഭാവികമായി ഇത് ഇങ്ങനെ പറയാം.',
      correction: detectedCorrection,
      suggestions: [detectedCorrection.better, 'Thank you for explaining!', 'Can you give another example?'],
    };
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('greetings')) {
    return {
      replyEnglish: `Hello! I am Coach Maya. I am very happy to help you practice English today. How are you?`,
      replyNative: 'ഹലോ! ഞാൻ കോച്ച് മായയാണ്. ഇന്ന് ഇംഗ്ലീഷ് പഠിക്കാൻ നിങ്ങളെ സഹായിക്കുന്നതിൽ എനിക്ക് സന്തോഷമുണ്ട്.',
      suggestions: ['I am doing good!', 'I want to learn new words.', 'How are you?'],
    };
  }

  if (lower.includes('hungry') || lower.includes('food') || lower.includes('eat')) {
    return {
      replyEnglish: `You can say: "I am hungry, let's have food!" What do you like to eat?`,
      replyNative: 'നിങ്ങൾക്ക് പറയാം: "I am hungry, let us have food!" എന്താണ് കഴിക്കാൻ ഇഷ്ടം?',
      suggestions: ['I like rice.', 'I like tea and coffee.', 'Let us order food.'],
    };
  }

  if (lower.includes('how are you') || lower.includes('how do you do')) {
    return {
      replyEnglish: 'I am doing great, thank you! What would you like to practice today?',
      replyNative: 'എനിക്ക് വളരെ സുഖമാണ്, നന്ദി! ഇന്ന് എന്താണ് നമ്മൾ പരിശീലിക്കാൻ ആഗ്രഹിക്കുന്നത്?',
      suggestions: ['Ordering food', 'Introducing myself', 'Asking for directions'],
    };
  }

  if (lower.includes('where') || lower.includes('go') || lower.includes('going')) {
    return {
      replyEnglish: `You can say: "Where are you going?" or "I am going to work." Practice saying both!`,
      replyNative: 'നിങ്ങൾക്ക് ചോദിക്കാം: "Where are you going?" അല്ലെങ്കിൽ "I am going to work." എന്ന് പറയാം.',
      suggestions: ['I am going to school.', 'Where is the bus stop?', 'I am going home.'],
    };
  }

  // Meaning-preserving general reply
  return {
    replyEnglish: `You said: "${naturalizeEnglish(translatedContext)}". Wonderful practice! Try saying it aloud.`,
    replyNative: 'വളരെ നല്ല ശ്രമം! ഇത് ഉച്ചത്തിൽ പറഞ്ഞു പരിശീലിക്കൂ.',
    suggestions: ['Tell me another sentence.', 'How do I say this better?', 'Thank you Coach Maya!'],
  };
}
