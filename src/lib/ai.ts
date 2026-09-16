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

// Comprehensive grammar mistake detector for beginner English learners
const GRAMMAR_MISTAKES = [
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
export function resolveManglishAndMixed(text: string): { isManglish: boolean; englishMeaning?: string; naturalTip?: string } {
  const lower = text.toLowerCase().trim();

  // 1. Direct Manglish phrases and common colloquial sentences
  const directPhrases: Array<{ pattern: RegExp; meaning: string; tip?: string }> = [
    {
      pattern: /\b(enthokke\s*(?:undu?|yundu?)|enthokke\s+vishesham|vishesham\s+entha|visheshangal\s+entha)\b/i,
      meaning: "What is up? How is everything going?",
      tip: "To say 'enthokke und vishesham' in English, say: 'How's it going?' or 'What's new?'",
    },
    {
      pattern: /\b(sukhamano|sukham\s+aano|sukham\s+alle|sukham\s+thanne)\b/i,
      meaning: "How are you? Are you doing well?",
      tip: "To ask 'sukhamano' in English, say: 'How are you doing today?'",
    },
    {
      pattern: /\b(food\s+kazhicho|lunch\s+kazhicho|dinner\s+kazhicho|choru\s+kazhicho|kazhicho)\b/i,
      meaning: "Did you have food? Have you eaten yet?",
      tip: "To ask 'food kazhicho' in English, say: 'Have you had lunch yet?' or 'Did you eat?'",
    },
    {
      pattern: /\b(ith(?:u)?\s+engane\s+(?:english(?:il)?\s+)?parayum|engane\s+parayum)\b/i,
      meaning: "How do I say this in English?",
      tip: "You can ask: 'How do you say this in English?'",
    },
    {
      pattern: /\b(njan|njaan)\s+(?:english\s+)?(?:padikkan|padikkanam|padikkan\s+aagrahikkunnu)\b/i,
      meaning: "I want to learn English.",
      tip: "Say: 'I want to improve my English speaking skills.'",
    },
    {
      pattern: /\b(oru\s+doubt(?:\s+und)?|oru\s+chodyam\s+chodichotte|doubt\s+chodikkam)\b/i,
      meaning: "May I ask a question or doubt?",
      tip: "In English, instead of saying 'I have a doubt', native speakers usually say: 'I have a question.'",
    },
    {
      pattern: /\b(njan|njaan)\s+(?:innale|yesterday)\s+(?:office-?il|veettil|college-?il)\s+(?:poyi|aayirunnu)\b/i,
      meaning: "I was at the office yesterday.",
      tip: "Say: 'I was at the office yesterday.'",
    },
    {
      pattern: /\b(njan|njaan)\s+office-?il\s+(?:aanu|aayirunnu)\b/i,
      meaning: "I am at the office.",
      tip: "Say: 'I am currently at the office.'",
    },
    {
      pattern: /\b(njan|njaan)\s+veettil\s+(?:aanu|ethi)\b/i,
      meaning: "I am at home / I reached home.",
      tip: "Say: 'I am at home now.'",
    },
    {
      pattern: /\b(njan|njaan)\s+train-?il\s+aanu\b/i,
      meaning: "I am on the train.",
      tip: "In English, remember to say 'on the train', not 'in the train'.",
    },
    {
      pattern: /\b(njan|njaan)\s+naale\s+varilla\b/i,
      meaning: "I will not come tomorrow.",
      tip: "Say: 'I won't be able to come tomorrow.'",
    },
    {
      pattern: /\b(ith(?:u)?\s+(?:correct\s+aano|thettundo|mistake\s+undo))\b/i,
      meaning: "Is this correct, or is there any mistake?",
      tip: "Say: 'Is this sentence grammatically correct?'",
    },
    {
      pattern: /\b(english\s+(?:speak|talk)\s+cheyyan\s+help\s+cheyyumo)\b/i,
      meaning: "Can you help me practice speaking English?",
      tip: "Say: 'Could you please help me practice speaking English?'",
    },
    {
      pattern: /\b(office-?il\s+late\s+aayi|late\s+aayi\s+poyi)\b/i,
      meaning: "I was late to the office.",
      tip: "Say: 'I got delayed on the way to the office.'",
    },
    {
      pattern: /\b(valare\s+nanni|nanni\s+und)\b/i,
      meaning: "Thank you very much!",
      tip: "Say: 'Thank you so much!'",
    },
  ];

  for (const item of directPhrases) {
    if (item.pattern.test(lower)) {
      return { isManglish: true, englishMeaning: item.meaning, naturalTip: item.tip };
    }
  }

  // 2. Detect common Manglish vocabulary tokens
  const manglishTokenPattern = /\b(njan|njaan|ente|enikku|enikk|ningal|ningalkk|avide|ivide|evide|entha|enthaanu|enthina|enthokke|vishesham|sukham|sukhamano|kazhicho|kazhichu|cheyyo|cheyyam|cheyyan|cheythatha|poyi|pokum|pokunnu|varum|vannu|undo|und|illa|athe|alla|alle|engane|engana|eppol|eppozha|chodyam|padikkan|padipikku|parayum|parayamo|veettil|thettundo|thettu|ariyilla|ariyumo|aagrahikkunnu|aano|aanu|aayirunnu|kandu|nokkam|sherikkum|karyam|pinnentha|pinne|nanni)\b/i;

  if (manglishTokenPattern.test(lower)) {
    const substituted = lower
      .replace(/\bnjan\b|\bnjaan\b/g, 'I')
      .replace(/\benikk(?:u)?\b/g, 'for me')
      .replace(/\bente\b/g, 'my')
      .replace(/\bningal(?:kku)?\b/g, 'you')
      .replace(/\bkazhicho\b/g, 'did you eat')
      .replace(/\bsukhamano\b/g, 'how are you')
      .replace(/\bvishesham\b/g, 'news')
      .replace(/\bentha(?:anu)?\b/g, 'what is')
      .replace(/\benthokke\b/g, 'what all')
      .replace(/\bevide(?:ya)?\b/g, 'where')
      .replace(/\bengane(?:ya)?\b/g, 'how')
      .replace(/\bpoyi\b/g, 'went')
      .replace(/\bvarum\b/g, 'will come')
      .replace(/\baanu\b/g, 'is')
      .replace(/\baayirunnu\b/g, 'was')
      .replace(/\billa\b/g, 'not')
      .replace(/\bundo\b/g, 'is there')
      .replace(/\bund\b/g, 'have')
      .replace(/\bpadikkan\b/g, 'to learn')
      .replace(/\bparayum\b/g, 'say')
      .replace(/\bthettundo\b/g, 'is it wrong')
      .replace(/\bcheyyo\b/g, 'will do')
      .replace(/\bcheyyan\b/g, 'to do')
      .replace(/\bhelp\s+cheyyumo\b/g, 'can you help');

    return {
      isManglish: true,
      englishMeaning: substituted.trim(),
      naturalTip: 'You used Manglish! Practice expressing this in natural English.',
    };
  }

  return { isManglish: false };
}

export async function translateNativeToEnglish(
  text: string,
  preferredLanguage: string,
  context?: string
): Promise<TranslationResult> {
  const trimmed = text.trim();
  const sourceLangCode = getLanguageCode(preferredLanguage);

  // 1. Manglish and Mixed Malayalam-English Detection
  const manglishCheck = resolveManglishAndMixed(trimmed);
  if (manglishCheck.isManglish && manglishCheck.englishMeaning) {
    const natural = naturalizeEnglish(manglishCheck.englishMeaning);
    return {
      detectedLanguage: 'Manglish (Malayalam)',
      nativeText: trimmed,
      englishText: natural,
      phoneticGuide: generatePhoneticGuide(natural),
      breakdown: [],
      naturalTip: manglishCheck.naturalTip || 'Practice speaking this in natural English!',
      confidence: 0.96,
    };
  }

  // 2. DO NOT OVER-TRANSLATE: Check if user input is already pure English
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

  // 3. High-Quality AI LLM Translation (Tier 1: Google Gemini API)
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of candidateModels) {
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
Handle code-switching (e.g. Malayalam mixed with English words, or Manglish in Latin alphabet) naturally.
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
            const cleanJson = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
            const parsed = JSON.parse(cleanJson);
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
        console.warn(`[AI] Gemini ${model} translation notice:`, err);
      }
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
  userLanguage: string = 'Malayalam',
  englishLevel: string = 'COMPLETE_BEGINNER',
  history: { role: 'user' | 'assistant'; text: string }[] = []
): Promise<TutorResponse> {
  const trimmed = userMessage.trim();
  const userLangCode = getLanguageCode(userLanguage);

  // 1. Check for smart grammar corrections if user typed in English
  let detectedCorrection: GrammarCorrection | undefined;
  for (const check of GRAMMAR_MISTAKES) {
    if (check.regex.test(trimmed)) {
      const betterReplacement = trimmed.replace(check.regex, check.better);
      detectedCorrection = {
        original: trimmed,
        better: betterReplacement,
        explanation: check.explanation,
      };
      break;
    }
  }

  // 2. If Gemini API is configured, generate generative response
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of candidateModels) {
      try {
        const conversationContext = history
          .slice(-8)
          .map((h) => `${h.role === 'user' ? 'Learner' : 'Coach Maya'}: ${h.text}`)
          .join('\n');

        const prompt = `You are Coach Maya, an encouraging, remarkably smart, empathetic English tutor for LinguaLearn.
Learner's Native Language: ${userLanguage}
Learner's English Proficiency: ${englishLevel}

Conversation History:
${conversationContext || 'No previous conversation yet.'}

Learner's Latest Message: "${trimmed}"

Linguistic Instructions:
1. The learner may communicate in:
   - Natural English (or beginner/broken English)
   - Malayalam script (e.g. "എനിക്ക് ഇംഗ്ലീഷ് സംസാരിക്കാൻ പഠിക്കണം", "സുഖമാണോ?")
   - Manglish / Latin-script Malayalam (e.g. "enthokke und vishesham", "sukhamano", "food kazhicho", "njan office-il aayirunnu", "ith engane englishil parayum", "oru doubt und")
   - Mixed Malayalam-English code-switching (e.g. "njan yesterday movie kandu", "office-il late aayi", "English speak cheyyan help cheyyumo", "ith correct aano?")
2. Accurately understand the learner's message regardless of whether it is in English, Malayalam script, Manglish, or mixed English-Malayalam.
3. Reply directly and conversationally in natural, friendly English (1-3 sentences max) appropriate for their level (${englishLevel}).
4. If they asked how to say something or wrote in Manglish/Malayalam, show them how to express that exact thought naturally in English.
5. If they made an English grammar, preposition, tense, or wording mistake, gently provide constructive guidance in the "correction" object (otherwise set "correction": null).
6. In "replyNative", translate your English response into Malayalam script (or ${userLanguage}).
7. In "suggestions", provide 3 natural, beginner-friendly English follow-up sentences the learner can easily say or click next.

Return PURE JSON only:
{
  "replyEnglish": "your clear English reply",
  "replyNative": "your reply translated into ${userLanguage}",
  "correction": null or {"original": "what learner wrote", "better": "natural correction", "explanation": "friendly 1-sentence tip"},
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.6,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            const cleanJson = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed?.replyEnglish) {
              return {
                replyEnglish: naturalizeEnglish(parsed.replyEnglish),
                replyNative: parsed.replyNative || '',
                correction: parsed.correction || detectedCorrection,
                suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
                  ? parsed.suggestions.slice(0, 3)
                  : ['Tell me more!', 'How do I pronounce that?', 'Can we try another sentence?'],
              };
            }
          }
        } else {
          console.warn(`[AI] Gemini model ${model} returned status: ${res.status}`);
        }
      } catch (modelErr) {
        console.warn(`[AI] Gemini ${model} invocation notice:`, modelErr);
      }
    }
  }

  // 3. High-Precision Conversational Intelligence Engine (Zero External Key Needed)
  // Step A: Universal Semantic Understanding (English, Malayalam, Manglish, Code-Switching)
  const manglishData = resolveManglishAndMixed(trimmed);
  let englishMeaning = trimmed;

  if (manglishData.isManglish && manglishData.englishMeaning) {
    englishMeaning = manglishData.englishMeaning;
  } else {
    const isPureEnglish = /^[a-zA-Z0-9\s.,!?'"-]+$/.test(trimmed);
    if (!isPureEnglish) {
      const neuralMeaning = await fetchNeuralTranslation(trimmed, userLangCode, 'en');
      if (neuralMeaning) englishMeaning = neuralMeaning;
    }
  }

  const cleanLower = englishMeaning.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  const lowerWords = cleanLower.split(/\s+/).filter(Boolean);

  let replyEnglish = '';
  let suggestions: string[] = [];

  // --- Case 0: Manglish & Malayalam Conversational Expressions ---
  if (!replyEnglish && manglishData.isManglish) {
    if (cleanLower.includes('how is everything going') || cleanLower.includes('what is up')) {
      replyEnglish = `I am doing wonderfully, thank you! In English, to say "enthokke und vishesham", you can say: "How is everything going?" or "What's new?" How has your day been?`;
      suggestions = ['Everything is going great!', 'I had a busy day.', 'What about you, Coach Maya?'];
    } else if (cleanLower.includes('how are you') || cleanLower.includes('are you doing well')) {
      replyEnglish = `I am doing very well! To ask someone "sukhamano" in English, you can say: "How are you doing today?" or "I hope you are doing well!" How are you feeling today?`;
      suggestions = ['I am feeling happy today.', 'I am a bit tired.', 'I am ready to learn English!'];
    } else if (cleanLower.includes('did you have food') || cleanLower.includes('have you eaten yet')) {
      replyEnglish = `Yes, thank you for asking! In English, to ask "food kazhicho", you can say: "Have you had lunch yet?" or "Did you eat?" What did you have to eat today?`;
      suggestions = ['I had rice and fish curry.', 'I just had some tea and snacks.', 'I have not eaten yet.'];
    } else if (cleanLower.includes('i want to learn english')) {
      replyEnglish = `That is fantastic! In English, you can say: "I want to speak fluent English." You are in the right place! What would you like to practice first — daily conversation, ordering food, or grammar?`;
      suggestions = ['I want to practice daily conversation.', 'Teach me some common English phrases.', 'Can you correct my grammar?'];
    } else if (cleanLower.includes('can i ask a question') || cleanLower.includes('doubt')) {
      replyEnglish = `Of course! In English, native speakers usually say: "I have a question" rather than "I have a doubt". What question would you like to ask me?`;
      suggestions = ['How do I introduce myself?', 'What does this word mean?', 'How can I practice speaking?'];
    } else if (cleanLower.includes('can you help me practice speaking english')) {
      replyEnglish = `I would love to help you practice! In English, you can say: "Could you please help me practice speaking English?" Let's start: Tell me about your favorite hobby or food!`;
      suggestions = ['I enjoy listening to music.', 'My favorite food is biryani.', 'I like playing sports.'];
    } else if (cleanLower.includes('is this correct') || cleanLower.includes('mistake')) {
      replyEnglish = `Let's review it together! In English, you can ask: "Is this sentence grammatically correct?" Tell me the sentence you want to check!`;
      suggestions = ['Can you check my sentence?', 'Is my pronunciation good?', 'Give me an example sentence.'];
    } else if (cleanLower.includes('i was at the office') || cleanLower.includes('i am at the office')) {
      replyEnglish = `Great! In English, you can say: "I was working at the office today." How was your work day?`;
      suggestions = ['My workday was very busy.', 'It was a relaxed day.', 'I am heading home now.'];
    } else if (cleanLower.includes('i am on the train')) {
      replyEnglish = `Have a safe journey! In English, remember to say "I am on the train" (we use "on" for trains and buses). Where are you traveling to?`;
      suggestions = ['I am going to my hometown.', 'I am traveling to work.', 'I am coming back home.'];
    }
  }

  // Step B: Context & History Tracking (What did Coach Maya last ask or say?)
  const lastMayaMessage = [...history].reverse().find((h) => h.role === 'assistant')?.text?.toLowerCase() || '';

  // --- Case 1: Answering Maya's Direct Question from History ---
  if (lastMayaMessage.includes('your name') || lastMayaMessage.includes('call you')) {
    const rawName = trimmed.replace(/^(my name is|i am|myself|it is|call me)\s+/i, '').trim();
    const capitalizedName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Learner';
    replyEnglish = `It is lovely to meet you, ${capitalizedName}! In English, you can always introduce yourself by saying: "Nice to meet you, Coach Maya!" Where in the world are you from?`;
    suggestions = ['I am from India.', 'I live in the United States.', 'Where are you from, Coach Maya?'];
  } else if (lastMayaMessage.includes('where are you from') || lastMayaMessage.includes('where do you live')) {
    const place = englishMeaning.replace(/^(i am from|i come from|i live in|from)\s+/i, '').trim();
    replyEnglish = `${place ? place + ' sounds like a wonderful place!' : 'That is wonderful!'} You can say: "I come from ${place || 'my hometown'}." What is your favorite thing about your city?`;
    suggestions = ['The food is delicious.', 'The people are very friendly.', 'The weather is beautiful.'];
  } else if (lastMayaMessage.includes('like to eat') || lastMayaMessage.includes('favorite food') || lastMayaMessage.includes('what did you eat')) {
    const food = englishMeaning.replace(/^(i like|my favorite food is|i love|i ate)\s+/i, '').trim();
    replyEnglish = `Mmm, ${food || 'that'} is such a tasty choice! A complete sentence you can practice is: "My favorite food is ${food || 'delicious'}." Do you usually cook it at home or eat at restaurants?`;
    suggestions = ['I cook it at home.', 'I prefer eating at restaurants.', 'Can we practice ordering food in English?'];
  } else if (lastMayaMessage.includes('how are you') || lastMayaMessage.includes('how do you do')) {
    if (cleanLower.includes('good') || cleanLower.includes('fine') || cleanLower.includes('great') || cleanLower.includes('well') || cleanLower.includes('happy')) {
      replyEnglish = `I'm so glad to hear that! You can say: "I am doing very well, thank you!" Shall we practice introducing yourself, ordering food, or asking for directions today?`;
      suggestions = ['Let us practice ordering food.', 'Teach me how to introduce myself.', 'How to ask for directions?'];
    } else if (cleanLower.includes('tired') || cleanLower.includes('bad') || cleanLower.includes('sad') || cleanLower.includes('busy') || cleanLower.includes('sick')) {
      replyEnglish = `I'm sorry you are feeling that way. A natural English phrase to express this is: "I have had a long and tiring day." Take it easy! Would you like a very light, easy practice?`;
      suggestions = ['Yes, a light practice please.', 'I want to learn 3 easy words.', 'Thank you for understanding.'];
    }
  }

  // --- Case 2: User Asking Direct Questions ---
  // A. "How do I say [X] in English?" or "How to say [X]?"
  if (!replyEnglish && (cleanLower.startsWith('how do i say') || cleanLower.startsWith('how to say') || cleanLower.includes('in english'))) {
    const match = trimmed.match(/how\s+(?:do\s+i\s+say|to\s+say)\s+["']?(.+?)["']?\s+(?:in\s+english)?$/i)
      || trimmed.match(/^["']?(.+?)["']?\s+in\s+english\??$/i);
    const phraseToTranslate = match ? match[1].replace(/[?.,]$/, '').trim() : trimmed;
    const translatedPhrase = await fetchNeuralTranslation(phraseToTranslate, userLangCode, 'en') || phraseToTranslate;

    replyEnglish = `To say "${phraseToTranslate}" in English, you can say: "${naturalizeEnglish(translatedPhrase)}". For example: "I would like to say: ${translatedPhrase}." Try saying it aloud!`;
    suggestions = [naturalizeEnglish(translatedPhrase), 'Can you give another example sentence?', 'How do I pronounce that?'];
  }

  // B. "What does [X] mean?" or "What is the meaning of [X]?"
  if (!replyEnglish && (cleanLower.startsWith('what does') || cleanLower.includes('meaning of') || cleanLower.startsWith('what is the meaning'))) {
    const wordMatch = trimmed.match(/what\s+does\s+["']?(\w+)["']?\s+mean/i)
      || trimmed.match(/meaning\s+of\s+["']?(\w+)["']?/i);
    const targetWord = wordMatch ? wordMatch[1] : lowerWords[lowerWords.length - 1];

    replyEnglish = `"${targetWord}" is a great English word! It means to have a specific quality or action in everyday life. For example: "This is a ${targetWord} experience." Would you like to practice making a sentence with it?`;
    suggestions = [`I want to use "${targetWord}" in a sentence.`, 'Can you give another example?', 'What is another word like this?'];
  }

  // C. "What is the difference between [A] and [B]?"
  if (!replyEnglish && (cleanLower.includes('difference between') || (cleanLower.includes(' vs ') || cleanLower.includes(' or ')))) {
    if (cleanLower.includes('see') && cleanLower.includes('watch')) {
      replyEnglish = `"See" means noticing something naturally with your eyes (e.g. "I see a bird in the tree"), while "Watch" means looking at something moving with attention over time (e.g. "I watch a movie").`;
      suggestions = ['I see a car outside.', 'I watch cricket every Sunday.', 'What about hear and listen?'];
    } else if (cleanLower.includes('listen') && cleanLower.includes('hear')) {
      replyEnglish = `"Hear" is receiving sound naturally without trying (e.g. "I hear a bell ringing"), while "Listen" is paying deliberate, focused attention (e.g. "I listen to English podcasts").`;
      suggestions = ['I hear music next door.', 'I listen carefully to you.', 'Can you explain another word?'];
    } else if (cleanLower.includes('lend') && cleanLower.includes('borrow')) {
      replyEnglish = `"Borrow" means taking something temporarily (e.g. "Can I borrow your pen?"), while "Lend" means giving something temporarily to someone else (e.g. "I will lend you my umbrella").`;
      suggestions = ['Can I borrow five dollars?', 'Will you lend me your book?', 'Thank you for explaining!'];
    }
  }

  // D. "Who are you?" / "What is your name?"
  if (!replyEnglish && (cleanLower.includes('who are you') || cleanLower.includes('what is your name') || cleanLower.includes('tell me about yourself'))) {
    replyEnglish = `I am Coach Maya, your friendly AI English tutor here at LinguaLearn! My goal is to help you speak fluent, confident English step by step with zero fear of making mistakes. How are you doing today?`;
    suggestions = ['I am doing great!', 'I want to improve my speaking.', 'Can you help me practice?'];
  }

  // --- Case 3: Interactive Roleplay Scenarios ---
  if (!replyEnglish && (cleanLower.includes('order food') || cleanLower.includes('restaurant') || cleanLower.includes('cafe') || cleanLower.includes('menu'))) {
    replyEnglish = `Welcome to Lingua Cafe! ☕ I am your server today. "Hello! Welcome to our cafe. Here is our menu. What would you like to order today?"`;
    suggestions = ['Could I please have a hot coffee?', 'What do you recommend?', 'I would like a sandwich and tea.'];
  } else if (!replyEnglish && (lastMayaMessage.includes('lingua cafe') || lastMayaMessage.includes('welcome to our cafe') || lastMayaMessage.includes('what can i get for you'))) {
    replyEnglish = `Excellent choice! In English, you can say: "Could I also get the bill, please?" That will be $5. Will you be paying with cash or card today?`;
    suggestions = ['I will pay with card.', 'Here is the cash, keep the change.', 'Thank you very much!'];
  } else if (!replyEnglish && (cleanLower.includes('airport') || cleanLower.includes('flight') || cleanLower.includes('travel') || cleanLower.includes('ticket'))) {
    replyEnglish = `Let's practice airport English! ✈️ "Hello passenger! Welcome to the check-in desk. May I please see your passport and flight ticket?"`;
    suggestions = ['Here is my passport and ticket.', 'Do I have a window seat?', 'Where is gate number 5?'];
  } else if (!replyEnglish && (cleanLower.includes('interview') || cleanLower.includes('job') || cleanLower.includes('career'))) {
    replyEnglish = `Job interview practice is a superpower! 💼 Let's start with the most common question: "Hello, thank you for coming in today. Could you please tell me a little bit about yourself?"`;
    suggestions = ['My name is Alex and I am a developer.', 'I have two years of work experience.', 'I am passionate about learning new skills.'];
  } else if (!replyEnglish && (cleanLower.includes('directions') || cleanLower.includes('where is the') || cleanLower.includes('how to reach'))) {
    replyEnglish = `Asking for directions is super useful! You can say: "Excuse me, could you please tell me how to get to the train station?" Then listen for keywords like "turn left", "turn right", and "straight ahead". Try asking me!`;
    suggestions = ['Excuse me, where is the nearest hospital?', 'How do I get to the bus station?', 'Is it within walking distance?'];
  }

  // --- Case 4: Everyday Conversational Topics ---
  if (!replyEnglish) {
    if (cleanLower.includes('hello') || cleanLower.includes('hi') || cleanLower.includes('hey') || cleanLower.includes('good morning') || cleanLower.includes('good evening')) {
      replyEnglish = `Hello! It is wonderful to talk with you. I am Coach Maya. What would you like to practice today — conversational speaking, ordering food, or learning new words?`;
      suggestions = ['I want to practice speaking.', 'Let us learn new vocabulary.', 'How are you today, Maya?'];
    } else if (cleanLower.includes('weather') || cleanLower.includes('rain') || cleanLower.includes('sunny') || cleanLower.includes('hot') || cleanLower.includes('cold')) {
      replyEnglish = `Talking about the weather is classic small talk in English! You can say: "The weather is lovely and sunny today!" or "It is pouring rain outside!" How is the weather where you are right now?`;
      suggestions = ['It is very hot today.', 'It is raining heavily here.', 'The weather is cool and breezy.'];
    } else if (cleanLower.includes('thank') || cleanLower.includes('appreciate') || cleanLower.includes('you are good') || cleanLower.includes('helpful')) {
      replyEnglish = `You are very welcome! Seeing your English grow brings me immense joy. Whenever someone thanks you in English, you can say: "You are most welcome!" or "My pleasure!" What should we learn next?`;
      suggestions = ['Teach me five new everyday words.', 'Can we practice another conversation?', 'I want to practice pronunciation.'];
    } else if (cleanLower.includes('hobby') || cleanLower.includes('music') || cleanLower.includes('movie') || cleanLower.includes('cricket') || cleanLower.includes('football') || cleanLower.includes('game')) {
      replyEnglish = `That is such a fun topic! In English, you can say: "In my free time, I really enjoy watching movies and listening to music." What is your all-time favorite movie or song?`;
      suggestions = ['I love listening to melody songs.', 'My favorite movie is an action thriller.', 'I like playing sports with my friends.'];
    } else if (cleanLower.includes('yes') || cleanLower.includes('yeah') || cleanLower.includes('sure') || cleanLower.includes('ok') || cleanLower.includes('okay')) {
      replyEnglish = `Awesome! Let's take the next step. A natural phrase you can use is: "Yes, that sounds like a great plan!" Would you like to practice building complete sentences together?`;
      suggestions = ['Yes, let us build sentences!', 'Can you give me an exercise?', 'Teach me a daily phrase.'];
    }
  }

  // --- Case 5: Smart Fallback (Expands user's thought into a polished English sentence) ---
  if (!replyEnglish) {
    const naturalPhrase = naturalizeEnglish(englishMeaning);
    if (detectedCorrection) {
      replyEnglish = `Great effort! A more natural way to express that is: "${detectedCorrection.better}". Notice the difference: ${detectedCorrection.explanation}. Try saying it out loud!`;
      suggestions = [detectedCorrection.better, 'Thank you for correcting me!', 'Can you give another example?'];
    } else {
      replyEnglish = `You expressed: "${naturalPhrase}". That is clear English! A polished way to say that in conversation is: "I would like to say that ${naturalPhrase.toLowerCase().replace(/[.]+$/, '')}." Can you repeat it?`;
      suggestions = [naturalPhrase, 'How do I say this more naturally?', 'Can you ask me a question?'];
    }
  }

  // Step C: Dynamic Bidirectional Native Translation (Tailored to user's selected language)
  let replyNative = '';
  try {
    const translatedNative = await fetchNeuralTranslation(replyEnglish, 'en', userLangCode);
    if (translatedNative) {
      replyNative = translatedNative;
    }
  } catch (err) {
    console.warn('[AI] Native reply translation warning:', err);
  }

  // Ensure default native fallback if neural translation was empty
  if (!replyNative) {
    replyNative = userLanguage === 'Malayalam'
      ? 'ഇത് ഇംഗ്ലീഷിൽ സ്വാഭാവികമായി പറയാൻ പരിശീലിക്കൂ!'
      : 'Practice saying this naturally in English!';
  }

  // Fallback suggestions if empty
  if (suggestions.length === 0) {
    suggestions = ['Can you explain that again?', 'Give me an example sentence.', 'What should I say next?'];
  }

  return {
    replyEnglish,
    replyNative,
    correction: detectedCorrection,
    suggestions: suggestions.slice(0, 3),
  };
}

