const fs = require('fs');

const output = `export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  emoji: string;
  translations: Record<string, string>;
  exampleSentence: string;
  examplePhonetic: string;
  exampleTranslations: Record<string, string>;
}

export interface ExerciseItem {
  id: string;
  type: 'multiple_choice' | 'matching' | 'listen_choose' | 'sentence_builder' | 'translation';
  question: string;
  hint?: string;
  audioPrompt?: string;
  options?: { text: string; subtext?: string; isCorrect: boolean }[];
  pairs?: { left: string; right: string }[];
  scrambledWords?: string[];
  correctSentence?: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  moduleTitle: string;
  moduleBadge: string;
  title: string;
  subtitle: string;
  icon: string;
  xpReward: number;
  estimatedMinutes: number;
  vocabulary: VocabWord[];
  exercises: ExerciseItem[];
}

export const LESSONS_DATA: Lesson[] = [
  {
    id: "basics-1",
    moduleId: "basics",
    moduleTitle: "A1 - Beginner",
    moduleBadge: "🌟 Beginner",
    title: "Essential Greetings",
    subtitle: "Learn how to say hello and be polite.",
    icon: "👋",
    xpReward: 50,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: "v-hello", word: "hello", phonetic: "heh-LOH", emoji: "👋",
        translations: { Malayalam: "നമസ്കാരം", Chinese: "你好", Hindi: "नमस्ते", Spanish: "Hola", English: "hello" },
        exampleSentence: "Hello, how are you?", examplePhonetic: "heh-LOH, how ahr yoo?", exampleTranslations: {}
      },
      {
        id: "v-friend", word: "friend", phonetic: "frend", emoji: "🤝",
        translations: { Malayalam: "സുഹൃത്ത്", Chinese: "朋友", Hindi: "दोस्त", Spanish: "Amigo", English: "friend" },
        exampleSentence: "She is my best friend.", examplePhonetic: "shee iz my best frend.", exampleTranslations: {}
      }
    ],
    exercises: [
      {
        id: "ex-1", type: "multiple_choice",
        question: "How do you greet someone?",
        options: [
          { text: "hello", isCorrect: true },
          { text: "water", isCorrect: false },
          { text: "tomorrow", isCorrect: false }
        ],
        explanation: "'Hello' is the standard English greeting."
      },
      {
        id: "ex-2", type: "sentence_builder",
        question: "Build the sentence:",
        correctSentence: "hello friend",
        scrambledWords: ["hello", "friend", "water"],
        explanation: "Combine 'hello' and 'friend' to greet someone."
      }
    ]
  },
  {
    id: "everyday-1",
    moduleId: "everyday",
    moduleTitle: "A2 - Pre-Intermediate",
    moduleBadge: "☕ Everyday",
    title: "Food & Drink",
    subtitle: "Order food and talk about meals.",
    icon: "🍎",
    xpReward: 60,
    estimatedMinutes: 7,
    vocabulary: [
      {
        id: "v-water", word: "water", phonetic: "WAH-ter", emoji: "💧",
        translations: { Malayalam: "വെള്ളം", Chinese: "水", Hindi: "पानी", Spanish: "Agua", English: "water" },
        exampleSentence: "I need some water.", examplePhonetic: "eye need sum WAH-ter.", exampleTranslations: {}
      },
      {
        id: "v-food", word: "food", phonetic: "food", emoji: "🍔",
        translations: { Malayalam: "ഭക്ഷണം", Chinese: "食物", Hindi: "खाना", Spanish: "Comida", English: "food" },
        exampleSentence: "The food is delicious.", examplePhonetic: "thuh food iz dih-LISH-us.", exampleTranslations: {}
      }
    ],
    exercises: [
      {
        id: "ex-3", type: "listen_choose",
        question: "Listen and choose the correct word.",
        audioPrompt: "water",
        options: [
          { text: "water", isCorrect: true },
          { text: "food", isCorrect: false },
          { text: "go", isCorrect: false }
        ],
        explanation: "You heard the word 'water'."
      },
      {
        id: "ex-4", type: "sentence_builder",
        question: "Build the sentence:",
        correctSentence: "I need water",
        scrambledWords: ["I", "need", "water", "food"],
        explanation: "I need water expresses thirst."
      }
    ]
  },
  {
    id: "grammar-1",
    moduleId: "grammar",
    moduleTitle: "B1 - Intermediate",
    moduleBadge: "🧠 Intermediate",
    title: "Making Decisions",
    subtitle: "Communicate choices and responsibilities.",
    icon: "⚖️",
    xpReward: 70,
    estimatedMinutes: 8,
    vocabulary: [
      {
        id: "v-decision", word: "decision", phonetic: "dih-SIZH-un", emoji: "🤔",
        translations: { Malayalam: "തീരുമാനം", Chinese: "决定", Hindi: "निर्णय", Spanish: "Decisión", English: "decision" },
        exampleSentence: "It was a difficult decision.", examplePhonetic: "it wuz a dif-ih-kult dih-SIZH-un.", exampleTranslations: {}
      },
      {
        id: "v-communicate", word: "communicate", phonetic: "kuh-MYOO-nih-kayt", emoji: "💬",
        translations: { Malayalam: "ആശയവിനിമയം നടത്തുക", Chinese: "沟通", Hindi: "संवाद करना", Spanish: "Comunicar", English: "communicate" },
        exampleSentence: "We need to communicate better.", examplePhonetic: "wee need to kuh-MYOO-nih-kayt bet-er.", exampleTranslations: {}
      }
    ],
    exercises: [
      {
        id: "ex-5", type: "multiple_choice",
        question: "Which word means to share information?",
        options: [
          { text: "communicate", isCorrect: true },
          { text: "decision", isCorrect: false },
          { text: "environment", isCorrect: false }
        ],
        explanation: "'Communicate' means to share thoughts or information."
      },
      {
        id: "ex-6", type: "sentence_builder",
        question: "Build the sentence:",
        correctSentence: "make a good decision",
        scrambledWords: ["make", "a", "good", "decision", "communicate"],
        explanation: "To 'make a decision' is the standard English phrase."
      }
    ]
  },
  {
    id: "business-1",
    moduleId: "business",
    moduleTitle: "C1 - Professional",
    moduleBadge: "💼 Professional",
    title: "Business Negotiations",
    subtitle: "Advanced vocabulary for the workplace.",
    icon: "🤝",
    xpReward: 100,
    estimatedMinutes: 10,
    vocabulary: [
      {
        id: "v-negotiate", word: "negotiate", phonetic: "nih-GOH-shee-ayt", emoji: "💼",
        translations: { Malayalam: "ചർച്ച ചെയ്യുക", Chinese: "谈判", Hindi: "बातचीत करना", Spanish: "Negociar", English: "negotiate" },
        exampleSentence: "We need to negotiate the contract.", examplePhonetic: "wee need to nih-GOH-shee-ayt the kon-trakt.", exampleTranslations: {}
      },
      {
        id: "v-strategy", word: "strategy", phonetic: "STRAT-uh-jee", emoji: "📈",
        translations: { Malayalam: "തന്ത്രം", Chinese: "战略", Hindi: "रणनीति", Spanish: "Estrategia", English: "strategy" },
        exampleSentence: "Our marketing strategy is effective.", examplePhonetic: "owr mar-kih-ting STRAT-uh-jee iz ih-fek-tiv.", exampleTranslations: {}
      }
    ],
    exercises: [
      {
        id: "ex-7", type: "matching",
        question: "Match the word to its meaning:",
        pairs: [
          { left: "negotiate", right: "reach an agreement" },
          { left: "strategy", right: "plan of action" }
        ],
        explanation: "Negotiate means to discuss to reach agreement. Strategy is a plan."
      },
      {
        id: "ex-8", type: "sentence_builder",
        question: "Build the sentence:",
        correctSentence: "we must negotiate a strategy",
        scrambledWords: ["we", "must", "negotiate", "a", "strategy", "food"],
        explanation: "This is a professional business sentence."
      }
    ]
  }
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS_DATA.find((l) => l.id === id);
}

export function getNextLessonId(currentLessonId: string): string {
  const currentIndex = LESSONS_DATA.findIndex((l) => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === LESSONS_DATA.length - 1) {
    return LESSONS_DATA[0].id;
  }
  return LESSONS_DATA[currentIndex + 1].id;
}
`;
fs.writeFileSync('src/data/lessons.ts', output);
