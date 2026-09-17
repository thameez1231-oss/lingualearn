export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  emoji: string;
  translations: Record<string, string>; // languageId -> translated word
  exampleSentence: string;
  examplePhonetic: string;
  exampleTranslations: Record<string, string>;
}

export interface ExerciseItem {
  id: string;
  type: 'multiple_choice' | 'matching' | 'listen_choose' | 'sentence_builder' | 'translation';
  question: string;
  hint?: string;
  audioPrompt?: string; // word or phrase to be pronounced
  // Multiple Choice / Listen Choose
  options?: { text: string; subtext?: string; isCorrect: boolean }[];
  // Matching Pairs
  pairs?: { left: string; right: string }[];
  // Sentence Builder
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
    "id": "basics-lesson-1",
    "moduleId": "basics",
    "moduleTitle": "A1 - Beginner",
    "moduleBadge": "🌱 Beginner",
    "title": "Essential Greetings",
    "subtitle": "Learn the most important words to say hello and be polite.",
    "icon": "book",
    "xpReward": 100,
    "estimatedMinutes": 5,
    "vocabulary": [
      {
        "id": "v-basics-1",
        "word": "Hello",
        "phonetic": "heh-LOH",
        "emoji": "👋",
        "translations": {
          "Malayalam": "ഹലോ"
        },
        "exampleSentence": "Hello, how are you today?",
        "examplePhonetic": "heh-LOH, how are yoo tuh-DAY?",
        "exampleTranslations": {
          "Malayalam": "ഹലോ, നിങ്ങൾക്ക് ഇന്ന് സുഖമാണോ?"
        }
      },
      {
        "id": "v-basics-2",
        "word": "Please",
        "phonetic": "PLEEZ",
        "emoji": "🙏",
        "translations": {
          "Malayalam": "ദയവായി"
        },
        "exampleSentence": "Can I have some water, please?",
        "examplePhonetic": "Kan I hav sum WAH-ter, PLEEZ?",
        "exampleTranslations": {
          "Malayalam": "ദയവായി എനിക്ക് കുറച്ചു വെള്ളം തരുമോ?"
        }
      },
      {
        "id": "v-basics-3",
        "word": "Thank you",
        "phonetic": "THANGK yoo",
        "emoji": "😊",
        "translations": {
          "Malayalam": "നന്ദി"
        },
        "exampleSentence": "Thank you for your help.",
        "examplePhonetic": "THANGK yoo for yor help.",
        "exampleTranslations": {
          "Malayalam": "നിങ്ങളുടെ സഹായത്തിന് നന്ദി."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-basics-1",
        "type": "multiple_choice",
        "question": "Which word do you use to greet someone?",
        "hint": "Think of the word that starts with H.",
        "options": [
          {
            "text": "Hello",
            "isCorrect": true
          },
          {
            "text": "Please",
            "isCorrect": false
          },
          {
            "text": "Water",
            "isCorrect": false
          }
        ],
        "explanation": "We use \"Hello\" to greet people."
      },
      {
        "id": "ex-basics-2",
        "type": "sentence_builder",
        "question": "Translate: \"ദയവായി എനിക്ക് കുറച്ചു വെള്ളം തരുമോ?\"",
        "scrambledWords": [
          "Can",
          "I",
          "have",
          "water",
          "please",
          "the",
          "running"
        ],
        "correctSentence": "Can I have water please",
        "explanation": "This is a polite way to ask for water."
      }
    ]
  },
  {
    "id": "everyday-lesson-1",
    "moduleId": "everyday",
    "moduleTitle": "A2 - Pre-Intermediate",
    "moduleBadge": "☕ Everyday",
    "title": "At the Cafe",
    "subtitle": "Learn how to order food and drinks confidently.",
    "icon": "book",
    "xpReward": 150,
    "estimatedMinutes": 8,
    "vocabulary": [
      {
        "id": "v-cafe-1",
        "word": "Coffee",
        "phonetic": "KOF-ee",
        "emoji": "☕",
        "translations": {
          "Malayalam": "കോഫി"
        },
        "exampleSentence": "I would like a cup of coffee.",
        "examplePhonetic": "I wood lyk a kup ov KOF-ee.",
        "exampleTranslations": {
          "Malayalam": "എനിക്ക് ഒരു കപ്പ് കോഫി വേണം."
        }
      },
      {
        "id": "v-cafe-2",
        "word": "Menu",
        "phonetic": "MEN-yoo",
        "emoji": "📖",
        "translations": {
          "Malayalam": "മെനു"
        },
        "exampleSentence": "Could you bring the menu, please?",
        "examplePhonetic": "Kood yoo bring the MEN-yoo, PLEEZ?",
        "exampleTranslations": {
          "Malayalam": "ദയവായി മെനു കൊണ്ടുവരുമോ?"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-cafe-1",
        "type": "multiple_choice",
        "question": "What do you ask for to see the list of food?",
        "hint": "It is a book with food options.",
        "options": [
          {
            "text": "The Menu",
            "isCorrect": true
          },
          {
            "text": "The Water",
            "isCorrect": false
          },
          {
            "text": "The Coffee",
            "isCorrect": false
          }
        ],
        "explanation": "A menu lists all the food items."
      }
    ]
  },
  {
    "id": "grammar-lesson-1",
    "moduleId": "grammar",
    "moduleTitle": "B1 - Intermediate",
    "moduleBadge": "📘 Intermediate",
    "title": "Action Verbs (Present Continuous)",
    "subtitle": "Learn how to describe things happening right now.",
    "icon": "book",
    "xpReward": 200,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-gram-1",
        "word": "Eating",
        "phonetic": "EE-ting",
        "emoji": "🍽️",
        "translations": {
          "Malayalam": "കഴിക്കുന്നു"
        },
        "exampleSentence": "She is eating an apple.",
        "examplePhonetic": "She is EE-ting an AP-pul.",
        "exampleTranslations": {
          "Malayalam": "അവൾ ഒരു ആപ്പിൾ കഴിക്കുകയാണ്."
        }
      },
      {
        "id": "v-gram-2",
        "word": "Running",
        "phonetic": "RUN-ing",
        "emoji": "🏃",
        "translations": {
          "Malayalam": "ഓടുന്നു"
        },
        "exampleSentence": "The boy is running fast.",
        "examplePhonetic": "The boy is RUN-ing fast.",
        "exampleTranslations": {
          "Malayalam": "ആൺകുട്ടി വേഗത്തിൽ ഓടുകയാണ്."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-gram-1",
        "type": "multiple_choice",
        "question": "Fill in the blank: \"She ___ an apple right now.\"",
        "hint": "Use the present continuous tense.",
        "options": [
          {
            "text": "is eating",
            "isCorrect": true
          },
          {
            "text": "eat",
            "isCorrect": false
          },
          {
            "text": "ate",
            "isCorrect": false
          }
        ],
        "explanation": "\"is eating\" describes an action happening right now."
      }
    ]
  },
  {
    "id": "speaking-lesson-1",
    "moduleId": "speaking",
    "moduleTitle": "B2 - Upper-Intermediate",
    "moduleBadge": "🗣️ Advanced",
    "title": "Airport & Travel",
    "subtitle": "Navigate airports and flights without fear.",
    "icon": "book",
    "xpReward": 250,
    "estimatedMinutes": 12,
    "vocabulary": [
      {
        "id": "v-trav-1",
        "word": "Luggage",
        "phonetic": "LUG-ij",
        "emoji": "🧳",
        "translations": {
          "Malayalam": "ലഗേജ്"
        },
        "exampleSentence": "Where can I collect my luggage?",
        "examplePhonetic": "Wair kan I kuh-LEKT my LUG-ij?",
        "exampleTranslations": {
          "Malayalam": "എന്റെ ലഗേജ് എനിക്ക് എവിടെ നിന്ന് ലഭിക്കും?"
        }
      },
      {
        "id": "v-trav-2",
        "word": "Boarding Pass",
        "phonetic": "BOR-ding pas",
        "emoji": "🎫",
        "translations": {
          "Malayalam": "ബോർഡിംഗ് പാസ്"
        },
        "exampleSentence": "Please show your boarding pass at the gate.",
        "examplePhonetic": "PLEEZ shoh yor BOR-ding pas at the gayt.",
        "exampleTranslations": {
          "Malayalam": "ദയവായി ഗേറ്റിൽ നിങ്ങളുടെ ബോർഡിംഗ് പാസ് കാണിക്കുക."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-trav-1",
        "type": "multiple_choice",
        "question": "What document do you need to enter the airplane?",
        "hint": "It has your seat number on it.",
        "options": [
          {
            "text": "Boarding Pass",
            "isCorrect": true
          },
          {
            "text": "Luggage",
            "isCorrect": false
          },
          {
            "text": "Menu",
            "isCorrect": false
          }
        ],
        "explanation": "A boarding pass allows you to board the flight."
      }
    ]
  },
  {
    "id": "business-lesson-1",
    "moduleId": "business",
    "moduleTitle": "C1 - Advanced Professional",
    "moduleBadge": "💼 Professional",
    "title": "Corporate Meetings",
    "subtitle": "Professional English for the modern workplace.",
    "icon": "book",
    "xpReward": 300,
    "estimatedMinutes": 15,
    "vocabulary": [
      {
        "id": "v-bus-1",
        "word": "Deadline",
        "phonetic": "DED-lyn",
        "emoji": "⏰",
        "translations": {
          "Malayalam": "അവസാന തീയതി"
        },
        "exampleSentence": "We must meet the project deadline.",
        "examplePhonetic": "We must meet the PROJ-ekt DED-lyn.",
        "exampleTranslations": {
          "Malayalam": "നാം പ്രോജക്ടിന്റെ അവസാന തീയതി പാലിക്കേണ്ടതുണ്ട്."
        }
      },
      {
        "id": "v-bus-2",
        "word": "Strategy",
        "phonetic": "STRAT-uh-jee",
        "emoji": "📈",
        "translations": {
          "Malayalam": "തന്ത്രം"
        },
        "exampleSentence": "Our marketing strategy was highly effective.",
        "examplePhonetic": "Owr MAR-ki-ting STRAT-uh-jee wuz HY-lee ih-FEK-tiv.",
        "exampleTranslations": {
          "Malayalam": "ഞങ്ങളുടെ മാർക്കറ്റിംഗ് തന്ത്രം വളരെ ഫലപ്രദമായിരുന്നു."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-bus-1",
        "type": "sentence_builder",
        "question": "Translate: \"നാം പ്രോജക്ടിന്റെ അവസാന തീയതി പാലിക്കേണ്ടതുണ്ട്.\"",
        "scrambledWords": [
          "We",
          "must",
          "meet",
          "the",
          "project",
          "deadline",
          "hello",
          "water"
        ],
        "correctSentence": "We must meet the project deadline",
        "explanation": "A deadline is the latest time or date by which something should be completed."
      }
    ]
  },
  {
    "id": "expert-lesson-1",
    "moduleId": "expert",
    "moduleTitle": "C2 - Mastery & Idioms",
    "moduleBadge": "👑 Expert",
    "title": "Native Idioms",
    "subtitle": "Speak exactly like a native with common slang and idioms.",
    "icon": "book",
    "xpReward": 400,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-exp-1",
        "word": "Piece of cake",
        "phonetic": "pees ov kayk",
        "emoji": "🍰",
        "translations": {
          "Malayalam": "വളരെ എളുപ്പമുള്ള"
        },
        "exampleSentence": "The English exam was a piece of cake.",
        "examplePhonetic": "The ING-glish ig-ZAM wuz a pees ov kayk.",
        "exampleTranslations": {
          "Malayalam": "ഇംഗ്ലീഷ് പരീക്ഷ വളരെ എളുപ്പമുള്ള ഒന്നായിരുന്നു."
        }
      },
      {
        "id": "v-exp-2",
        "word": "Under the weather",
        "phonetic": "UN-der the WETH-er",
        "emoji": "🤒",
        "translations": {
          "Malayalam": "സുഖമില്ലാത്ത"
        },
        "exampleSentence": "I am feeling a bit under the weather today.",
        "examplePhonetic": "I am FEE-ling a bit UN-der the WETH-er tuh-DAY.",
        "exampleTranslations": {
          "Malayalam": "എനിക്കിന്ന് അല്പം സുഖമില്ലായ്മ തോന്നുന്നു."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-exp-1",
        "type": "multiple_choice",
        "question": "If something is very easy, what idiom do you use?",
        "hint": "It involves a popular dessert.",
        "options": [
          {
            "text": "A piece of cake",
            "isCorrect": true
          },
          {
            "text": "Under the weather",
            "isCorrect": false
          },
          {
            "text": "Break the ice",
            "isCorrect": false
          }
        ],
        "explanation": "\"Piece of cake\" is a native idiom meaning very easy."
      }
    ]
  }
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS_DATA.find((l) => l.id === id);
}

export function getNextLessonId(currentId: string): string {
  const idx = LESSONS_DATA.findIndex((l) => l.id === currentId);
  if (idx >= 0 && idx < LESSONS_DATA.length - 1) {
    return LESSONS_DATA[idx + 1].id;
  }
  return LESSONS_DATA[0].id;
}
