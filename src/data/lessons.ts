
export interface VocabWord {
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
  order: number;
  isCheckpoint?: boolean;
}

export const LESSONS_DATA: Lesson[] = [
  {
    "id": "beginner-1",
    "moduleId": "beginner",
    "moduleTitle": "BEGINNER",
    "moduleBadge": "Beginner",
    "title": "Lesson 1",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 1,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-beginner-1-0",
        "word": "wake",
        "phonetic": "wayk",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "wake"
        },
        "exampleSentence": "I wake up at seven.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-beginner-1-1",
        "word": "sleep",
        "phonetic": "sleep",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "sleep"
        },
        "exampleSentence": "I sleep at night.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-beginner-1-2",
        "word": "eat",
        "phonetic": "eet",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "eat"
        },
        "exampleSentence": "I eat breakfast.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-beginner-1-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"To stop sleeping.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "wake",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is wake."
      },
      {
        "id": "ex-beginner-1-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To rest with eyes closed.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "sleep",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is sleep."
      },
      {
        "id": "ex-beginner-1-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"To consume food.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "eat",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is eat."
      },
      {
        "id": "ex-beginner-1-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "I wake up at seven.",
        "scrambledWords": [
          "up",
          "at",
          "wake",
          "seven",
          "I"
        ],
        "explanation": "Correct sentence: I wake up at seven."
      }
    ]
  },
  {
    "id": "beginner-2",
    "moduleId": "beginner",
    "moduleTitle": "BEGINNER",
    "moduleBadge": "Beginner",
    "title": "Lesson 2",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 2,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-beginner-2-0",
        "word": "price",
        "phonetic": "prys",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "price"
        },
        "exampleSentence": "What is the price?",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-beginner-2-1",
        "word": "buy",
        "phonetic": "by",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "buy"
        },
        "exampleSentence": "I want to buy this.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-beginner-2-2",
        "word": "cheap",
        "phonetic": "cheep",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "cheap"
        },
        "exampleSentence": "This is very cheap.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-beginner-2-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"How much money something costs.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "price",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is price."
      },
      {
        "id": "ex-beginner-2-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To pay for something.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "buy",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is buy."
      },
      {
        "id": "ex-beginner-2-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Not expensive.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "cheap",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is cheap."
      },
      {
        "id": "ex-beginner-2-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "What is the price?",
        "scrambledWords": [
          "What",
          "price",
          "is",
          "the"
        ],
        "explanation": "Correct sentence: What is the price?"
      }
    ]
  },
  {
    "id": "beginner-3",
    "moduleId": "beginner",
    "moduleTitle": "BEGINNER",
    "moduleBadge": "Beginner",
    "title": "Lesson 3",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 3,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-beginner-3-0",
        "word": "name",
        "phonetic": "naym",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "name"
        },
        "exampleSentence": "My name is John.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-beginner-3-1",
        "word": "hello",
        "phonetic": "heh-LOH",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "hello"
        },
        "exampleSentence": "Hello, how are you?",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-beginner-3-2",
        "word": "good",
        "phonetic": "good",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "good"
        },
        "exampleSentence": "This is good.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-beginner-3-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"What you are called.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "name",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is name."
      },
      {
        "id": "ex-beginner-3-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"A greeting.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "hello",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is hello."
      },
      {
        "id": "ex-beginner-3-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Not bad.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "good",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is good."
      },
      {
        "id": "ex-beginner-3-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "My name is John.",
        "scrambledWords": [
          "name",
          "My",
          "John",
          "is"
        ],
        "explanation": "Correct sentence: My name is John."
      }
    ]
  },
  {
    "id": "beginner-4",
    "moduleId": "beginner",
    "moduleTitle": "BEGINNER",
    "moduleBadge": "Beginner",
    "title": "Lesson 4",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 4,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-beginner-4-0",
        "word": "water",
        "phonetic": "WAH-ter",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "water"
        },
        "exampleSentence": "I need water.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-beginner-4-1",
        "word": "food",
        "phonetic": "food",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "food"
        },
        "exampleSentence": "The food is good.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-beginner-4-2",
        "word": "home",
        "phonetic": "hohm",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "home"
        },
        "exampleSentence": "I go home.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-beginner-4-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"A clear liquid you drink.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "water",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is water."
      },
      {
        "id": "ex-beginner-4-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"What you eat.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "food",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is food."
      },
      {
        "id": "ex-beginner-4-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Where you live.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "home",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is home."
      },
      {
        "id": "ex-beginner-4-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "I need water.",
        "scrambledWords": [
          "I",
          "need",
          "water"
        ],
        "explanation": "Correct sentence: I need water."
      }
    ]
  },
  {
    "id": "checkpoint-beginner",
    "moduleId": "beginner",
    "moduleTitle": "BEGINNER",
    "moduleBadge": "Beginner",
    "title": "Checkpoint: BEGINNER",
    "subtitle": "Pass this checkpoint with 80% to unlock the next level.",
    "icon": "🎯",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "order": 5,
    "isCheckpoint": true,
    "vocabulary": [],
    "exercises": [
      {
        "id": "ex-chk-beginner-0",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"What you are called.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "name",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is name."
      },
      {
        "id": "ex-chk-beginner-1",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To stop sleeping.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "wake",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is wake."
      },
      {
        "id": "ex-chk-beginner-2",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"A clear liquid you drink.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "water",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is water."
      },
      {
        "id": "ex-chk-beginner-3",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"A greeting.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "hello",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is hello."
      },
      {
        "id": "ex-chk-beginner-4",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To rest with eyes closed.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "sleep",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is sleep."
      }
    ]
  },
  {
    "id": "elementary-1",
    "moduleId": "elementary",
    "moduleTitle": "ELEMENTARY",
    "moduleBadge": "Elementary",
    "title": "Lesson 1",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 6,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-elementary-1-0",
        "word": "station",
        "phonetic": "STAY-shun",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "station"
        },
        "exampleSentence": "Where is the train station?",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-elementary-1-1",
        "word": "left",
        "phonetic": "left",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "left"
        },
        "exampleSentence": "Turn left here.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-elementary-1-2",
        "word": "ticket",
        "phonetic": "TIK-it",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "ticket"
        },
        "exampleSentence": "I need a ticket.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-elementary-1-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"A place where trains stop.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "station",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is station."
      },
      {
        "id": "ex-elementary-1-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"Direction opposite of right.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "left",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is left."
      },
      {
        "id": "ex-elementary-1-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Paper to travel.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "ticket",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is ticket."
      },
      {
        "id": "ex-elementary-1-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "Where is the train station?",
        "scrambledWords": [
          "train",
          "the",
          "station",
          "is",
          "Where"
        ],
        "explanation": "Correct sentence: Where is the train station?"
      }
    ]
  },
  {
    "id": "elementary-2",
    "moduleId": "elementary",
    "moduleTitle": "ELEMENTARY",
    "moduleBadge": "Elementary",
    "title": "Lesson 2",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 7,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-elementary-2-0",
        "word": "hobby",
        "phonetic": "HOB-ee",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "hobby"
        },
        "exampleSentence": "What is your hobby?",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-elementary-2-1",
        "word": "plan",
        "phonetic": "plan",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "plan"
        },
        "exampleSentence": "Do you have a plan?",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-elementary-2-2",
        "word": "family",
        "phonetic": "FAM-ih-lee",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "family"
        },
        "exampleSentence": "I love my family.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-elementary-2-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"Activity done for fun.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "hobby",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is hobby."
      },
      {
        "id": "ex-elementary-2-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"Idea for what to do.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "plan",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is plan."
      },
      {
        "id": "ex-elementary-2-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Parents and children.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "family",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is family."
      },
      {
        "id": "ex-elementary-2-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "What is your hobby?",
        "scrambledWords": [
          "What",
          "hobby",
          "is",
          "your"
        ],
        "explanation": "Correct sentence: What is your hobby?"
      }
    ]
  },
  {
    "id": "elementary-3",
    "moduleId": "elementary",
    "moduleTitle": "ELEMENTARY",
    "moduleBadge": "Elementary",
    "title": "Lesson 3",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 8,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-elementary-3-0",
        "word": "morning",
        "phonetic": "MOR-ning",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "morning"
        },
        "exampleSentence": "Good morning.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-elementary-3-1",
        "word": "always",
        "phonetic": "AWL-wayz",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "always"
        },
        "exampleSentence": "I always study.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-elementary-3-2",
        "word": "never",
        "phonetic": "NEV-er",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "never"
        },
        "exampleSentence": "I never smoke.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-elementary-3-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"Early part of the day.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "morning",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is morning."
      },
      {
        "id": "ex-elementary-3-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"At all times.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "always",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is always."
      },
      {
        "id": "ex-elementary-3-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"At no time.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "never",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is never."
      },
      {
        "id": "ex-elementary-3-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "Good morning.",
        "scrambledWords": [
          "morning",
          "Good"
        ],
        "explanation": "Correct sentence: Good morning."
      }
    ]
  },
  {
    "id": "elementary-4",
    "moduleId": "elementary",
    "moduleTitle": "ELEMENTARY",
    "moduleBadge": "Elementary",
    "title": "Lesson 4",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 9,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-elementary-4-0",
        "word": "friend",
        "phonetic": "frend",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "friend"
        },
        "exampleSentence": "He is my friend.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-elementary-4-1",
        "word": "visit",
        "phonetic": "VIZ-it",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "visit"
        },
        "exampleSentence": "I visit my family.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-elementary-4-2",
        "word": "often",
        "phonetic": "AWF-en",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "often"
        },
        "exampleSentence": "I often travel.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-elementary-4-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"Someone you like.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "friend",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is friend."
      },
      {
        "id": "ex-elementary-4-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To go see someone.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "visit",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is visit."
      },
      {
        "id": "ex-elementary-4-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Many times.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "often",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is often."
      },
      {
        "id": "ex-elementary-4-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "He is my friend.",
        "scrambledWords": [
          "He",
          "is",
          "my",
          "friend"
        ],
        "explanation": "Correct sentence: He is my friend."
      }
    ]
  },
  {
    "id": "checkpoint-elementary",
    "moduleId": "elementary",
    "moduleTitle": "ELEMENTARY",
    "moduleBadge": "Elementary",
    "title": "Checkpoint: ELEMENTARY",
    "subtitle": "Pass this checkpoint with 80% to unlock the next level.",
    "icon": "🎯",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "order": 10,
    "isCheckpoint": true,
    "vocabulary": [],
    "exercises": [
      {
        "id": "ex-chk-elementary-0",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Early part of the day.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "morning",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is morning."
      },
      {
        "id": "ex-chk-elementary-1",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"At no time.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "never",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is never."
      },
      {
        "id": "ex-chk-elementary-2",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Someone you like.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "friend",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is friend."
      },
      {
        "id": "ex-chk-elementary-3",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To go see someone.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "visit",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is visit."
      },
      {
        "id": "ex-chk-elementary-4",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Idea for what to do.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "plan",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is plan."
      }
    ]
  },
  {
    "id": "intermediate-1",
    "moduleId": "intermediate",
    "moduleTitle": "INTERMEDIATE",
    "moduleBadge": "Intermediate",
    "title": "Lesson 1",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 11,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-intermediate-1-0",
        "word": "meeting",
        "phonetic": "MEE-ting",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "meeting"
        },
        "exampleSentence": "We have a meeting.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-intermediate-1-1",
        "word": "discuss",
        "phonetic": "dih-SKUS",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "discuss"
        },
        "exampleSentence": "Let us discuss this.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-intermediate-1-2",
        "word": "schedule",
        "phonetic": "SKEJ-ool",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "schedule"
        },
        "exampleSentence": "My schedule is full.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-intermediate-1-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"People coming together.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "meeting",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is meeting."
      },
      {
        "id": "ex-intermediate-1-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To talk about something.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "discuss",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is discuss."
      },
      {
        "id": "ex-intermediate-1-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"A plan of times.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "schedule",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is schedule."
      },
      {
        "id": "ex-intermediate-1-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "We have a meeting.",
        "scrambledWords": [
          "meeting",
          "a",
          "have",
          "We"
        ],
        "explanation": "Correct sentence: We have a meeting."
      }
    ]
  },
  {
    "id": "intermediate-2",
    "moduleId": "intermediate",
    "moduleTitle": "INTERMEDIATE",
    "moduleBadge": "Intermediate",
    "title": "Lesson 2",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 12,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-intermediate-2-0",
        "word": "opinion",
        "phonetic": "uh-PIN-yun",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "opinion"
        },
        "exampleSentence": "In my opinion, it is good.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-intermediate-2-1",
        "word": "agree",
        "phonetic": "uh-GREE",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "agree"
        },
        "exampleSentence": "I agree with you.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-intermediate-2-2",
        "word": "story",
        "phonetic": "STOR-ee",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "story"
        },
        "exampleSentence": "Tell me a story.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-intermediate-2-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"What you think about something.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "opinion",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is opinion."
      },
      {
        "id": "ex-intermediate-2-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To have the same opinion.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "agree",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is agree."
      },
      {
        "id": "ex-intermediate-2-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"A tale of events.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "story",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is story."
      },
      {
        "id": "ex-intermediate-2-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "In my opinion, it is good.",
        "scrambledWords": [
          "In",
          "my",
          "good",
          "it",
          "is",
          "opinion"
        ],
        "explanation": "Correct sentence: In my opinion, it is good."
      }
    ]
  },
  {
    "id": "intermediate-3",
    "moduleId": "intermediate",
    "moduleTitle": "INTERMEDIATE",
    "moduleBadge": "Intermediate",
    "title": "Lesson 3",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 13,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-intermediate-3-0",
        "word": "challenge",
        "phonetic": "CHAL-inj",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "challenge"
        },
        "exampleSentence": "This is a challenge.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-intermediate-3-1",
        "word": "decide",
        "phonetic": "dih-SYD",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "decide"
        },
        "exampleSentence": "I must decide now.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-intermediate-3-2",
        "word": "improve",
        "phonetic": "im-PROOV",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "improve"
        },
        "exampleSentence": "I want to improve.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-intermediate-3-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"Something difficult.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "challenge",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is challenge."
      },
      {
        "id": "ex-intermediate-3-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To make a choice.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "decide",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is decide."
      },
      {
        "id": "ex-intermediate-3-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"To get better.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "improve",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is improve."
      },
      {
        "id": "ex-intermediate-3-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "This is a challenge.",
        "scrambledWords": [
          "a",
          "challenge",
          "is",
          "This"
        ],
        "explanation": "Correct sentence: This is a challenge."
      }
    ]
  },
  {
    "id": "intermediate-4",
    "moduleId": "intermediate",
    "moduleTitle": "INTERMEDIATE",
    "moduleBadge": "Intermediate",
    "title": "Lesson 4",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 14,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-intermediate-4-0",
        "word": "focus",
        "phonetic": "FOH-kus",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "focus"
        },
        "exampleSentence": "I need to focus.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-intermediate-4-1",
        "word": "goal",
        "phonetic": "gohl",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "goal"
        },
        "exampleSentence": "My goal is to win.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-intermediate-4-2",
        "word": "achieve",
        "phonetic": "uh-CHEEV",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "achieve"
        },
        "exampleSentence": "I will achieve it.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-intermediate-4-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"To pay attention.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "focus",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is focus."
      },
      {
        "id": "ex-intermediate-4-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"What you want to achieve.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "goal",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is goal."
      },
      {
        "id": "ex-intermediate-4-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"To succeed in doing.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "achieve",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is achieve."
      },
      {
        "id": "ex-intermediate-4-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "I need to focus.",
        "scrambledWords": [
          "focus",
          "need",
          "to",
          "I"
        ],
        "explanation": "Correct sentence: I need to focus."
      }
    ]
  },
  {
    "id": "checkpoint-intermediate",
    "moduleId": "intermediate",
    "moduleTitle": "INTERMEDIATE",
    "moduleBadge": "Intermediate",
    "title": "Checkpoint: INTERMEDIATE",
    "subtitle": "Pass this checkpoint with 80% to unlock the next level.",
    "icon": "🎯",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "order": 15,
    "isCheckpoint": true,
    "vocabulary": [],
    "exercises": [
      {
        "id": "ex-chk-intermediate-0",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To succeed in doing.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "achieve",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is achieve."
      },
      {
        "id": "ex-chk-intermediate-1",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To get better.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "improve",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is improve."
      },
      {
        "id": "ex-chk-intermediate-2",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"People coming together.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "meeting",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is meeting."
      },
      {
        "id": "ex-chk-intermediate-3",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"What you want to achieve.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "goal",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is goal."
      },
      {
        "id": "ex-chk-intermediate-4",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"A tale of events.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "story",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is story."
      }
    ]
  },
  {
    "id": "upper_intermediate-1",
    "moduleId": "upper_intermediate",
    "moduleTitle": "UPPER_INTERMEDIATE",
    "moduleBadge": "Upper-Int",
    "title": "Lesson 1",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 16,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-upper_intermediate-1-0",
        "word": "alternative",
        "phonetic": "awl-TUR-nuh-tiv",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "alternative"
        },
        "exampleSentence": "We need an alternative.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-upper_intermediate-1-1",
        "word": "resolve",
        "phonetic": "rih-ZOLV",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "resolve"
        },
        "exampleSentence": "We must resolve this problem.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-upper_intermediate-1-2",
        "word": "effective",
        "phonetic": "ih-FEK-tiv",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "effective"
        },
        "exampleSentence": "This is an effective method.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-upper_intermediate-1-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"Another option.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "alternative",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is alternative."
      },
      {
        "id": "ex-upper_intermediate-1-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To find a solution.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "resolve",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is resolve."
      },
      {
        "id": "ex-upper_intermediate-1-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Successful in producing a result.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "effective",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is effective."
      },
      {
        "id": "ex-upper_intermediate-1-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "We need an alternative.",
        "scrambledWords": [
          "alternative",
          "We",
          "need",
          "an"
        ],
        "explanation": "Correct sentence: We need an alternative."
      }
    ]
  },
  {
    "id": "upper_intermediate-2",
    "moduleId": "upper_intermediate",
    "moduleTitle": "UPPER_INTERMEDIATE",
    "moduleBadge": "Upper-Int",
    "title": "Lesson 2",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 17,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-upper_intermediate-2-0",
        "word": "argument",
        "phonetic": "AR-gyoo-ment",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "argument"
        },
        "exampleSentence": "That is a strong argument.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-upper_intermediate-2-1",
        "word": "nuance",
        "phonetic": "NOO-ahns",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "nuance"
        },
        "exampleSentence": "Understand the nuance of the word.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-upper_intermediate-2-2",
        "word": "compare",
        "phonetic": "kum-PAIR",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "compare"
        },
        "exampleSentence": "Compare these two ideas.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-upper_intermediate-2-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"A reason given in debate.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "argument",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is argument."
      },
      {
        "id": "ex-upper_intermediate-2-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"A subtle difference.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "nuance",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is nuance."
      },
      {
        "id": "ex-upper_intermediate-2-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"To look at similarities and differences.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "compare",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is compare."
      },
      {
        "id": "ex-upper_intermediate-2-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "That is a strong argument.",
        "scrambledWords": [
          "strong",
          "That",
          "argument",
          "is",
          "a"
        ],
        "explanation": "Correct sentence: That is a strong argument."
      }
    ]
  },
  {
    "id": "upper_intermediate-3",
    "moduleId": "upper_intermediate",
    "moduleTitle": "UPPER_INTERMEDIATE",
    "moduleBadge": "Upper-Int",
    "title": "Lesson 3",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 18,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-upper_intermediate-3-0",
        "word": "essential",
        "phonetic": "ih-SEN-shul",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "essential"
        },
        "exampleSentence": "Water is essential.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-upper_intermediate-3-1",
        "word": "contribute",
        "phonetic": "kun-TRIB-yoot",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "contribute"
        },
        "exampleSentence": "I want to contribute.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-upper_intermediate-3-2",
        "word": "analyze",
        "phonetic": "AN-uh-lyz",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "analyze"
        },
        "exampleSentence": "Analyze the data.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-upper_intermediate-3-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"Absolutely necessary.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "essential",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is essential."
      },
      {
        "id": "ex-upper_intermediate-3-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To give to help achieve something.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "contribute",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is contribute."
      },
      {
        "id": "ex-upper_intermediate-3-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"To study closely.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "analyze",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is analyze."
      },
      {
        "id": "ex-upper_intermediate-3-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "Water is essential.",
        "scrambledWords": [
          "essential",
          "is",
          "Water"
        ],
        "explanation": "Correct sentence: Water is essential."
      }
    ]
  },
  {
    "id": "upper_intermediate-4",
    "moduleId": "upper_intermediate",
    "moduleTitle": "UPPER_INTERMEDIATE",
    "moduleBadge": "Upper-Int",
    "title": "Lesson 4",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 19,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-upper_intermediate-4-0",
        "word": "strategy",
        "phonetic": "STRAT-ih-jee",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "strategy"
        },
        "exampleSentence": "We need a new strategy.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-upper_intermediate-4-1",
        "word": "evidence",
        "phonetic": "EV-ih-duns",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "evidence"
        },
        "exampleSentence": "Show me the evidence.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-upper_intermediate-4-2",
        "word": "impact",
        "phonetic": "IM-pakt",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "impact"
        },
        "exampleSentence": "This has a big impact.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-upper_intermediate-4-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"A plan of action.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "strategy",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is strategy."
      },
      {
        "id": "ex-upper_intermediate-4-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"Facts that prove something.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "evidence",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is evidence."
      },
      {
        "id": "ex-upper_intermediate-4-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"A strong effect.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "impact",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is impact."
      },
      {
        "id": "ex-upper_intermediate-4-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "We need a new strategy.",
        "scrambledWords": [
          "new",
          "a",
          "need",
          "We",
          "strategy"
        ],
        "explanation": "Correct sentence: We need a new strategy."
      }
    ]
  },
  {
    "id": "checkpoint-upper_intermediate",
    "moduleId": "upper_intermediate",
    "moduleTitle": "UPPER_INTERMEDIATE",
    "moduleBadge": "Upper-Int",
    "title": "Checkpoint: UPPER_INTERMEDIATE",
    "subtitle": "Pass this checkpoint with 80% to unlock the next level.",
    "icon": "🎯",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "order": 20,
    "isCheckpoint": true,
    "vocabulary": [],
    "exercises": [
      {
        "id": "ex-chk-upper_intermediate-0",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Absolutely necessary.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "essential",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is essential."
      },
      {
        "id": "ex-chk-upper_intermediate-1",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Successful in producing a result.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "effective",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is effective."
      },
      {
        "id": "ex-chk-upper_intermediate-2",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To give to help achieve something.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "contribute",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is contribute."
      },
      {
        "id": "ex-chk-upper_intermediate-3",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"A plan of action.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "strategy",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is strategy."
      },
      {
        "id": "ex-chk-upper_intermediate-4",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Another option.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "alternative",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is alternative."
      }
    ]
  },
  {
    "id": "advanced-1",
    "moduleId": "advanced",
    "moduleTitle": "ADVANCED",
    "moduleBadge": "Advanced",
    "title": "Lesson 1",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 21,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-advanced-1-0",
        "word": "clarify",
        "phonetic": "KLAR-ih-fy",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "clarify"
        },
        "exampleSentence": "Please clarify your point.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-advanced-1-1",
        "word": "implement",
        "phonetic": "IM-pluh-ment",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "implement"
        },
        "exampleSentence": "We will implement the plan.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-advanced-1-2",
        "word": "evaluate",
        "phonetic": "ih-VAL-yoo-ayt",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "evaluate"
        },
        "exampleSentence": "Evaluate the results.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-advanced-1-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"To make something clear.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "clarify",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is clarify."
      },
      {
        "id": "ex-advanced-1-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To put into action.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "implement",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is implement."
      },
      {
        "id": "ex-advanced-1-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"To judge the value.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "evaluate",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is evaluate."
      },
      {
        "id": "ex-advanced-1-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "Please clarify your point.",
        "scrambledWords": [
          "your",
          "clarify",
          "Please",
          "point"
        ],
        "explanation": "Correct sentence: Please clarify your point."
      }
    ]
  },
  {
    "id": "advanced-2",
    "moduleId": "advanced",
    "moduleTitle": "ADVANCED",
    "moduleBadge": "Advanced",
    "title": "Lesson 2",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 22,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-advanced-2-0",
        "word": "idiom",
        "phonetic": "ID-ee-um",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "idiom"
        },
        "exampleSentence": "That is a common English idiom.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-advanced-2-1",
        "word": "formal",
        "phonetic": "FOR-mul",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "formal"
        },
        "exampleSentence": "This is a formal letter.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-advanced-2-2",
        "word": "context",
        "phonetic": "KON-tekst",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "context"
        },
        "exampleSentence": "Look at the context.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-advanced-2-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"A phrase with figurative meaning.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "idiom",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is idiom."
      },
      {
        "id": "ex-advanced-2-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"Proper and official.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "formal",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is formal."
      },
      {
        "id": "ex-advanced-2-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"The situation surrounding an event.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "context",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is context."
      },
      {
        "id": "ex-advanced-2-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "That is a common English idiom.",
        "scrambledWords": [
          "common",
          "That",
          "English",
          "is",
          "a",
          "idiom"
        ],
        "explanation": "Correct sentence: That is a common English idiom."
      }
    ]
  },
  {
    "id": "advanced-3",
    "moduleId": "advanced",
    "moduleTitle": "ADVANCED",
    "moduleBadge": "Advanced",
    "title": "Lesson 3",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 23,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-advanced-3-0",
        "word": "perspective",
        "phonetic": "per-SPEK-tiv",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "perspective"
        },
        "exampleSentence": "From my perspective, yes.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-advanced-3-1",
        "word": "ambiguous",
        "phonetic": "am-BIG-yoo-us",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "ambiguous"
        },
        "exampleSentence": "The rules are ambiguous.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-advanced-3-2",
        "word": "coherent",
        "phonetic": "koh-HEER-unt",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "coherent"
        },
        "exampleSentence": "Make a coherent argument.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-advanced-3-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"A way of thinking.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "perspective",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is perspective."
      },
      {
        "id": "ex-advanced-3-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"Having more than one meaning.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "ambiguous",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is ambiguous."
      },
      {
        "id": "ex-advanced-3-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Logical and consistent.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "coherent",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is coherent."
      },
      {
        "id": "ex-advanced-3-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "From my perspective, yes.",
        "scrambledWords": [
          "yes",
          "my",
          "From",
          "perspective"
        ],
        "explanation": "Correct sentence: From my perspective, yes."
      }
    ]
  },
  {
    "id": "advanced-4",
    "moduleId": "advanced",
    "moduleTitle": "ADVANCED",
    "moduleBadge": "Advanced",
    "title": "Lesson 4",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 24,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-advanced-4-0",
        "word": "facilitate",
        "phonetic": "fuh-SIL-ih-tayt",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "facilitate"
        },
        "exampleSentence": "I will facilitate the meeting.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-advanced-4-1",
        "word": "comprehensive",
        "phonetic": "kom-prih-HEN-siv",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "comprehensive"
        },
        "exampleSentence": "A comprehensive report.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-advanced-4-2",
        "word": "innovative",
        "phonetic": "IN-uh-vay-tiv",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "innovative"
        },
        "exampleSentence": "An innovative solution.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-advanced-4-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"To make easier.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "facilitate",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is facilitate."
      },
      {
        "id": "ex-advanced-4-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"Complete and including everything.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "comprehensive",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is comprehensive."
      },
      {
        "id": "ex-advanced-4-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Using new ideas.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "innovative",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is innovative."
      },
      {
        "id": "ex-advanced-4-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "I will facilitate the meeting.",
        "scrambledWords": [
          "I",
          "will",
          "facilitate",
          "meeting",
          "the"
        ],
        "explanation": "Correct sentence: I will facilitate the meeting."
      }
    ]
  },
  {
    "id": "checkpoint-advanced",
    "moduleId": "advanced",
    "moduleTitle": "ADVANCED",
    "moduleBadge": "Advanced",
    "title": "Checkpoint: ADVANCED",
    "subtitle": "Pass this checkpoint with 80% to unlock the next level.",
    "icon": "🎯",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "order": 25,
    "isCheckpoint": true,
    "vocabulary": [],
    "exercises": [
      {
        "id": "ex-chk-advanced-0",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To make something clear.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "clarify",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is clarify."
      },
      {
        "id": "ex-chk-advanced-1",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Proper and official.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "formal",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is formal."
      },
      {
        "id": "ex-chk-advanced-2",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"A phrase with figurative meaning.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "idiom",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is idiom."
      },
      {
        "id": "ex-chk-advanced-3",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To put into action.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "implement",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is implement."
      },
      {
        "id": "ex-chk-advanced-4",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To make easier.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "facilitate",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is facilitate."
      }
    ]
  },
  {
    "id": "professional-1",
    "moduleId": "professional",
    "moduleTitle": "PROFESSIONAL",
    "moduleBadge": "Professional",
    "title": "Lesson 1",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 26,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-professional-1-0",
        "word": "negotiation",
        "phonetic": "nih-goh-shee-AY-shun",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "negotiation"
        },
        "exampleSentence": "The negotiation was tough.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-professional-1-1",
        "word": "stakeholder",
        "phonetic": "STAYK-hohl-der",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "stakeholder"
        },
        "exampleSentence": "Meet the stakeholder.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-professional-1-2",
        "word": "revenue",
        "phonetic": "REV-uh-noo",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "revenue"
        },
        "exampleSentence": "Revenue increased this year.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-professional-1-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"Discussion aimed at reaching an agreement.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "negotiation",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is negotiation."
      },
      {
        "id": "ex-professional-1-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"Person with an interest in a business.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "stakeholder",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is stakeholder."
      },
      {
        "id": "ex-professional-1-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Income for a company.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "revenue",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is revenue."
      },
      {
        "id": "ex-professional-1-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "The negotiation was tough.",
        "scrambledWords": [
          "tough",
          "was",
          "negotiation",
          "The"
        ],
        "explanation": "Correct sentence: The negotiation was tough."
      }
    ]
  },
  {
    "id": "professional-2",
    "moduleId": "professional",
    "moduleTitle": "PROFESSIONAL",
    "moduleBadge": "Professional",
    "title": "Lesson 2",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 27,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-professional-2-0",
        "word": "presentation",
        "phonetic": "prez-en-TAY-shun",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "presentation"
        },
        "exampleSentence": "Give a good presentation.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-professional-2-1",
        "word": "objective",
        "phonetic": "ub-JEK-tiv",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "objective"
        },
        "exampleSentence": "Our objective is clear.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-professional-2-2",
        "word": "collaboration",
        "phonetic": "kuh-lab-uh-RAY-shun",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "collaboration"
        },
        "exampleSentence": "Collaboration is key.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-professional-2-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"A formal talk showing information.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "presentation",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is presentation."
      },
      {
        "id": "ex-professional-2-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"A goal or purpose.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "objective",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is objective."
      },
      {
        "id": "ex-professional-2-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Working together.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "collaboration",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is collaboration."
      },
      {
        "id": "ex-professional-2-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "Give a good presentation.",
        "scrambledWords": [
          "good",
          "a",
          "Give",
          "presentation"
        ],
        "explanation": "Correct sentence: Give a good presentation."
      }
    ]
  },
  {
    "id": "professional-3",
    "moduleId": "professional",
    "moduleTitle": "PROFESSIONAL",
    "moduleBadge": "Professional",
    "title": "Lesson 3",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 28,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-professional-3-0",
        "word": "synergy",
        "phonetic": "SIN-er-jee",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "synergy"
        },
        "exampleSentence": "We need team synergy.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-professional-3-1",
        "word": "leverage",
        "phonetic": "LEV-er-ij",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "leverage"
        },
        "exampleSentence": "Leverage our assets.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-professional-3-2",
        "word": "benchmark",
        "phonetic": "BENCH-mark",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "benchmark"
        },
        "exampleSentence": "Set a new benchmark.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-professional-3-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"Combined power of a group.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "synergy",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is synergy."
      },
      {
        "id": "ex-professional-3-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"To use to maximum advantage.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "leverage",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is leverage."
      },
      {
        "id": "ex-professional-3-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"A standard to measure against.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "benchmark",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is benchmark."
      },
      {
        "id": "ex-professional-3-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "We need team synergy.",
        "scrambledWords": [
          "synergy",
          "team",
          "need",
          "We"
        ],
        "explanation": "Correct sentence: We need team synergy."
      }
    ]
  },
  {
    "id": "professional-4",
    "moduleId": "professional",
    "moduleTitle": "PROFESSIONAL",
    "moduleBadge": "Professional",
    "title": "Lesson 4",
    "subtitle": "Learn 3 new words.",
    "icon": "📖",
    "xpReward": 50,
    "estimatedMinutes": 5,
    "order": 29,
    "isCheckpoint": false,
    "vocabulary": [
      {
        "id": "v-professional-4-0",
        "word": "liability",
        "phonetic": "ly-uh-BIL-ih-tee",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "liability"
        },
        "exampleSentence": "Reduce our liability.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-professional-4-1",
        "word": "equity",
        "phonetic": "EK-wih-tee",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "equity"
        },
        "exampleSentence": "Build brand equity.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      },
      {
        "id": "v-professional-4-2",
        "word": "scalable",
        "phonetic": "SKAY-luh-bul",
        "emoji": "💡",
        "translations": {
          "Malayalam": "Translation",
          "English": "scalable"
        },
        "exampleSentence": "A scalable business model.",
        "examplePhonetic": "",
        "exampleTranslations": {}
      }
    ],
    "exercises": [
      {
        "id": "ex-professional-4-0-0",
        "type": "multiple_choice",
        "question": "Which word means \"State of being responsible.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "liability",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is liability."
      },
      {
        "id": "ex-professional-4-1-0",
        "type": "multiple_choice",
        "question": "Which word means \"Fairness or shares in a company.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "equity",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is equity."
      },
      {
        "id": "ex-professional-4-2-0",
        "type": "multiple_choice",
        "question": "Which word means \"Able to be changed in size or scale.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "scalable",
            "isCorrect": true
          },
          {
            "text": "random",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is scalable."
      },
      {
        "id": "ex-professional-4-sb",
        "type": "sentence_builder",
        "question": "Build the correct sentence:",
        "correctSentence": "Reduce our liability.",
        "scrambledWords": [
          "Reduce",
          "liability",
          "our"
        ],
        "explanation": "Correct sentence: Reduce our liability."
      }
    ]
  },
  {
    "id": "checkpoint-professional",
    "moduleId": "professional",
    "moduleTitle": "PROFESSIONAL",
    "moduleBadge": "Professional",
    "title": "Checkpoint: PROFESSIONAL",
    "subtitle": "Pass this checkpoint with 80% to unlock the next level.",
    "icon": "🎯",
    "xpReward": 100,
    "estimatedMinutes": 10,
    "order": 30,
    "isCheckpoint": true,
    "vocabulary": [],
    "exercises": [
      {
        "id": "ex-chk-professional-0",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Working together.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "collaboration",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is collaboration."
      },
      {
        "id": "ex-chk-professional-1",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Discussion aimed at reaching an agreement.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "negotiation",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is negotiation."
      },
      {
        "id": "ex-chk-professional-2",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"Person with an interest in a business.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "stakeholder",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is stakeholder."
      },
      {
        "id": "ex-chk-professional-3",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"A formal talk showing information.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "presentation",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is presentation."
      },
      {
        "id": "ex-chk-professional-4",
        "type": "multiple_choice",
        "question": "Checkpoint Question: Which word means \"To use to maximum advantage.\"?",
        "audioPrompt": "",
        "options": [
          {
            "text": "leverage",
            "isCorrect": true
          },
          {
            "text": "wrong",
            "isCorrect": false
          },
          {
            "text": "incorrect",
            "isCorrect": false
          }
        ],
        "explanation": "The correct word is leverage."
      }
    ]
  }
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS_DATA.find((lesson) => lesson.id === id);
}

export function getNextLessonId(currentLessonId: string): string {
  const currentIndex = LESSONS_DATA.findIndex((l) => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === LESSONS_DATA.length - 1) {
    return currentLessonId; 
  }
  return LESSONS_DATA[currentIndex + 1].id;
}
