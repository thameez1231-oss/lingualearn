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
    "moduleBadge": "?? Beginner",
    "title": "Mastery Part 1",
    "subtitle": "Learn essential A1 - Beginner concepts.",
    "icon": "book",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-basics-1",
        "word": "Concept 1",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-basics-1",
        "type": "multiple_choice",
        "question": "Choose the correct application for A1 - Beginner.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "basics-lesson-2",
    "moduleId": "basics",
    "moduleTitle": "A1 - Beginner",
    "moduleBadge": "?? Beginner",
    "title": "Mastery Part 2",
    "subtitle": "Learn essential A1 - Beginner concepts.",
    "icon": "book",
    "xpReward": 200,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-basics-2",
        "word": "Concept 2",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-basics-2",
        "type": "multiple_choice",
        "question": "Choose the correct application for A1 - Beginner.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "basics-lesson-3",
    "moduleId": "basics",
    "moduleTitle": "A1 - Beginner",
    "moduleBadge": "?? Beginner",
    "title": "Mastery Part 3",
    "subtitle": "Learn essential A1 - Beginner concepts.",
    "icon": "book",
    "xpReward": 300,
    "estimatedMinutes": 30,
    "vocabulary": [
      {
        "id": "v-basics-3",
        "word": "Concept 3",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-basics-3",
        "type": "multiple_choice",
        "question": "Choose the correct application for A1 - Beginner.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "everyday-lesson-1",
    "moduleId": "everyday",
    "moduleTitle": "A2 - Pre-Intermediate",
    "moduleBadge": "? Everyday",
    "title": "Mastery Part 1",
    "subtitle": "Learn essential A2 - Pre-Intermediate concepts.",
    "icon": "book",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-everyday-1",
        "word": "Concept 1",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-everyday-1",
        "type": "multiple_choice",
        "question": "Choose the correct application for A2 - Pre-Intermediate.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "everyday-lesson-2",
    "moduleId": "everyday",
    "moduleTitle": "A2 - Pre-Intermediate",
    "moduleBadge": "? Everyday",
    "title": "Mastery Part 2",
    "subtitle": "Learn essential A2 - Pre-Intermediate concepts.",
    "icon": "book",
    "xpReward": 200,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-everyday-2",
        "word": "Concept 2",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-everyday-2",
        "type": "multiple_choice",
        "question": "Choose the correct application for A2 - Pre-Intermediate.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "everyday-lesson-3",
    "moduleId": "everyday",
    "moduleTitle": "A2 - Pre-Intermediate",
    "moduleBadge": "? Everyday",
    "title": "Mastery Part 3",
    "subtitle": "Learn essential A2 - Pre-Intermediate concepts.",
    "icon": "book",
    "xpReward": 300,
    "estimatedMinutes": 30,
    "vocabulary": [
      {
        "id": "v-everyday-3",
        "word": "Concept 3",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-everyday-3",
        "type": "multiple_choice",
        "question": "Choose the correct application for A2 - Pre-Intermediate.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "grammar-lesson-1",
    "moduleId": "grammar",
    "moduleTitle": "B1 - Intermediate",
    "moduleBadge": "?? Intermediate",
    "title": "Mastery Part 1",
    "subtitle": "Learn essential B1 - Intermediate concepts.",
    "icon": "book",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-grammar-1",
        "word": "Concept 1",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-grammar-1",
        "type": "multiple_choice",
        "question": "Choose the correct application for B1 - Intermediate.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "grammar-lesson-2",
    "moduleId": "grammar",
    "moduleTitle": "B1 - Intermediate",
    "moduleBadge": "?? Intermediate",
    "title": "Mastery Part 2",
    "subtitle": "Learn essential B1 - Intermediate concepts.",
    "icon": "book",
    "xpReward": 200,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-grammar-2",
        "word": "Concept 2",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-grammar-2",
        "type": "multiple_choice",
        "question": "Choose the correct application for B1 - Intermediate.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "grammar-lesson-3",
    "moduleId": "grammar",
    "moduleTitle": "B1 - Intermediate",
    "moduleBadge": "?? Intermediate",
    "title": "Mastery Part 3",
    "subtitle": "Learn essential B1 - Intermediate concepts.",
    "icon": "book",
    "xpReward": 300,
    "estimatedMinutes": 30,
    "vocabulary": [
      {
        "id": "v-grammar-3",
        "word": "Concept 3",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-grammar-3",
        "type": "multiple_choice",
        "question": "Choose the correct application for B1 - Intermediate.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "speaking-lesson-1",
    "moduleId": "speaking",
    "moduleTitle": "B2 - Upper-Intermediate",
    "moduleBadge": "??? Advanced",
    "title": "Mastery Part 1",
    "subtitle": "Learn essential B2 - Upper-Intermediate concepts.",
    "icon": "book",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-speaking-1",
        "word": "Concept 1",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-speaking-1",
        "type": "multiple_choice",
        "question": "Choose the correct application for B2 - Upper-Intermediate.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "speaking-lesson-2",
    "moduleId": "speaking",
    "moduleTitle": "B2 - Upper-Intermediate",
    "moduleBadge": "??? Advanced",
    "title": "Mastery Part 2",
    "subtitle": "Learn essential B2 - Upper-Intermediate concepts.",
    "icon": "book",
    "xpReward": 200,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-speaking-2",
        "word": "Concept 2",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-speaking-2",
        "type": "multiple_choice",
        "question": "Choose the correct application for B2 - Upper-Intermediate.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "speaking-lesson-3",
    "moduleId": "speaking",
    "moduleTitle": "B2 - Upper-Intermediate",
    "moduleBadge": "??? Advanced",
    "title": "Mastery Part 3",
    "subtitle": "Learn essential B2 - Upper-Intermediate concepts.",
    "icon": "book",
    "xpReward": 300,
    "estimatedMinutes": 30,
    "vocabulary": [
      {
        "id": "v-speaking-3",
        "word": "Concept 3",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-speaking-3",
        "type": "multiple_choice",
        "question": "Choose the correct application for B2 - Upper-Intermediate.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "business-lesson-1",
    "moduleId": "business",
    "moduleTitle": "C1 - Advanced Professional",
    "moduleBadge": "?? Professional",
    "title": "Mastery Part 1",
    "subtitle": "Learn essential C1 - Advanced Professional concepts.",
    "icon": "book",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-business-1",
        "word": "Concept 1",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-business-1",
        "type": "multiple_choice",
        "question": "Choose the correct application for C1 - Advanced Professional.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "business-lesson-2",
    "moduleId": "business",
    "moduleTitle": "C1 - Advanced Professional",
    "moduleBadge": "?? Professional",
    "title": "Mastery Part 2",
    "subtitle": "Learn essential C1 - Advanced Professional concepts.",
    "icon": "book",
    "xpReward": 200,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-business-2",
        "word": "Concept 2",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-business-2",
        "type": "multiple_choice",
        "question": "Choose the correct application for C1 - Advanced Professional.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "business-lesson-3",
    "moduleId": "business",
    "moduleTitle": "C1 - Advanced Professional",
    "moduleBadge": "?? Professional",
    "title": "Mastery Part 3",
    "subtitle": "Learn essential C1 - Advanced Professional concepts.",
    "icon": "book",
    "xpReward": 300,
    "estimatedMinutes": 30,
    "vocabulary": [
      {
        "id": "v-business-3",
        "word": "Concept 3",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-business-3",
        "type": "multiple_choice",
        "question": "Choose the correct application for C1 - Advanced Professional.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "expert-lesson-1",
    "moduleId": "expert",
    "moduleTitle": "C2 - Mastery & Idioms",
    "moduleBadge": "?? Expert",
    "title": "Mastery Part 1",
    "subtitle": "Learn essential C2 - Mastery & Idioms concepts.",
    "icon": "book",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-expert-1",
        "word": "Concept 1",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-expert-1",
        "type": "multiple_choice",
        "question": "Choose the correct application for C2 - Mastery & Idioms.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "expert-lesson-2",
    "moduleId": "expert",
    "moduleTitle": "C2 - Mastery & Idioms",
    "moduleBadge": "?? Expert",
    "title": "Mastery Part 2",
    "subtitle": "Learn essential C2 - Mastery & Idioms concepts.",
    "icon": "book",
    "xpReward": 200,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-expert-2",
        "word": "Concept 2",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-expert-2",
        "type": "multiple_choice",
        "question": "Choose the correct application for C2 - Mastery & Idioms.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
      }
    ]
  },
  {
    "id": "expert-lesson-3",
    "moduleId": "expert",
    "moduleTitle": "C2 - Mastery & Idioms",
    "moduleBadge": "?? Expert",
    "title": "Mastery Part 3",
    "subtitle": "Learn essential C2 - Mastery & Idioms concepts.",
    "icon": "book",
    "xpReward": 300,
    "estimatedMinutes": 30,
    "vocabulary": [
      {
        "id": "v-expert-3",
        "word": "Concept 3",
        "phonetic": "kon-sept",
        "emoji": "??",
        "translations": {
          "Spanish": "Concepto"
        },
        "exampleSentence": "This is a key concept.",
        "examplePhonetic": "This is a key kon-sept.",
        "exampleTranslations": {
          "Spanish": "Este es un concepto clave."
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-expert-3",
        "type": "multiple_choice",
        "question": "Choose the correct application for C2 - Mastery & Idioms.",
        "hint": "Review the rules.",
        "options": [
          {
            "text": "Correct Application",
            "isCorrect": true
          },
          {
            "text": "Incorrect Application",
            "isCorrect": false
          }
        ],
        "explanation": "It is the correct standard usage."
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
