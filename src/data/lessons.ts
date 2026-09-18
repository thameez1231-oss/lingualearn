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
    "subtitle": "Learn how to say hello and be polite.",
    "icon": "book",
    "xpReward": 100,
    "estimatedMinutes": 5,
    "vocabulary": [
      {
        "id": "v-b1-1",
        "word": "Hello",
        "phonetic": "heh-LOH",
        "emoji": "👋",
        "translations": {
          "Malayalam": "ഹലോ",
          "Chinese": "你好",
          "Mandarin": "你好",
          "Hindi": "नमस्ते"
        },
        "exampleSentence": "Hello, how are you?",
        "examplePhonetic": "heh-LOH, how are yoo?",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-b1-2",
        "word": "Please",
        "phonetic": "PLEEZ",
        "emoji": "🙏",
        "translations": {
          "Malayalam": "ദയവായി",
          "Chinese": "请",
          "Mandarin": "请",
          "Hindi": "कृपया"
        },
        "exampleSentence": "Water, please.",
        "examplePhonetic": "WAH-ter, PLEEZ.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-b1-3",
        "word": "Thank you",
        "phonetic": "THANGK yoo",
        "emoji": "😊",
        "translations": {
          "Malayalam": "നന്ദി",
          "Chinese": "谢谢",
          "Mandarin": "谢谢",
          "Hindi": "धन्यवाद"
        },
        "exampleSentence": "Thank you very much.",
        "examplePhonetic": "THANGK yoo ver-ee much.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-b1-1",
        "type": "multiple_choice",
        "question": "Which word do you use to greet someone?",
        "hint": "Starts with H.",
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
            "text": "Thank you",
            "isCorrect": false
          }
        ],
        "explanation": "Hello is the standard greeting."
      },
      {
        "id": "ex-b1-2",
        "type": "sentence_builder",
        "question": "Translate: \"വളരെ നന്ദി.\"",
        "scrambledWords": [
          "Thank",
          "you",
          "very",
          "much",
          "please",
          "hello"
        ],
        "correctSentence": "Thank you very much",
        "explanation": "This is a polite way to show gratitude."
      }
    ]
  },
  {
    "id": "basics-lesson-2",
    "moduleId": "basics",
    "moduleTitle": "A1 - Beginner",
    "moduleBadge": "🌱 Beginner",
    "title": "Numbers 1-10",
    "subtitle": "Count from one to ten in English.",
    "icon": "book",
    "xpReward": 110,
    "estimatedMinutes": 5,
    "vocabulary": [
      {
        "id": "v-b2-1",
        "word": "One",
        "phonetic": "wun",
        "emoji": "1️⃣",
        "translations": {
          "Malayalam": "ഒന്ന്",
          "Chinese": "一",
          "Mandarin": "一",
          "Hindi": "एक"
        },
        "exampleSentence": "I have one apple.",
        "examplePhonetic": "I hav wun AP-pul.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-b2-2",
        "word": "Two",
        "phonetic": "too",
        "emoji": "2️⃣",
        "translations": {
          "Malayalam": "രണ്ട്",
          "Chinese": "二",
          "Mandarin": "二",
          "Hindi": "दो"
        },
        "exampleSentence": "There are two cars.",
        "examplePhonetic": "Thair ar too karz.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-b2-3",
        "word": "Three",
        "phonetic": "three",
        "emoji": "3️⃣",
        "translations": {
          "Malayalam": "മൂന്ന്",
          "Chinese": "三",
          "Mandarin": "三",
          "Hindi": "तीन"
        },
        "exampleSentence": "I see three birds.",
        "examplePhonetic": "I see three berdz.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-b2-1",
        "type": "multiple_choice",
        "question": "What comes after One?",
        "hint": "It is the number 2.",
        "options": [
          {
            "text": "Two",
            "isCorrect": true
          },
          {
            "text": "Three",
            "isCorrect": false
          },
          {
            "text": "Five",
            "isCorrect": false
          }
        ],
        "explanation": "Two follows one."
      }
    ]
  },
  {
    "id": "basics-lesson-3",
    "moduleId": "basics",
    "moduleTitle": "A1 - Beginner",
    "moduleBadge": "🌱 Beginner",
    "title": "Colors",
    "subtitle": "Learn basic colors in English.",
    "icon": "book",
    "xpReward": 120,
    "estimatedMinutes": 6,
    "vocabulary": [
      {
        "id": "v-b3-1",
        "word": "Red",
        "phonetic": "red",
        "emoji": "🔴",
        "translations": {
          "Malayalam": "ചുവപ്പ്",
          "Chinese": "红色",
          "Mandarin": "红色",
          "Hindi": "लाल"
        },
        "exampleSentence": "The apple is red.",
        "examplePhonetic": "The AP-pul iz red.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-b3-2",
        "word": "Blue",
        "phonetic": "bloo",
        "emoji": "🔵",
        "translations": {
          "Malayalam": "നീല",
          "Chinese": "蓝色",
          "Mandarin": "蓝色",
          "Hindi": "नीला"
        },
        "exampleSentence": "The sky is blue.",
        "examplePhonetic": "The sky iz bloo.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-b3-3",
        "word": "Green",
        "phonetic": "green",
        "emoji": "🟢",
        "translations": {
          "Malayalam": "പച്ച",
          "Chinese": "绿色",
          "Mandarin": "绿色",
          "Hindi": "हरा"
        },
        "exampleSentence": "The grass is green.",
        "examplePhonetic": "The gras iz green.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-b3-1",
        "type": "multiple_choice",
        "question": "What color is the sky?",
        "hint": "Think of the ocean.",
        "options": [
          {
            "text": "Blue",
            "isCorrect": true
          },
          {
            "text": "Red",
            "isCorrect": false
          },
          {
            "text": "Green",
            "isCorrect": false
          }
        ],
        "explanation": "The sky is blue."
      }
    ]
  },
  {
    "id": "everyday-lesson-1",
    "moduleId": "everyday",
    "moduleTitle": "A2 - Pre-Intermediate",
    "moduleBadge": "☕ Everyday",
    "title": "At the Cafe",
    "subtitle": "Learn how to order food and drinks.",
    "icon": "book",
    "xpReward": 130,
    "estimatedMinutes": 8,
    "vocabulary": [
      {
        "id": "v-e1-1",
        "word": "Coffee",
        "phonetic": "KOF-ee",
        "emoji": "☕",
        "translations": {
          "Malayalam": "കോഫി",
          "Chinese": "咖啡",
          "Mandarin": "咖啡",
          "Hindi": "कॉफी"
        },
        "exampleSentence": "I want a coffee.",
        "examplePhonetic": "I wont a KOF-ee.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-e1-2",
        "word": "Menu",
        "phonetic": "MEN-yoo",
        "emoji": "📖",
        "translations": {
          "Malayalam": "മെനു",
          "Chinese": "菜单",
          "Mandarin": "菜单",
          "Hindi": "मेन्यू"
        },
        "exampleSentence": "Bring the menu.",
        "examplePhonetic": "Bring the MEN-yoo.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-e1-3",
        "word": "Water",
        "phonetic": "WAH-ter",
        "emoji": "💧",
        "translations": {
          "Malayalam": "വെള്ളം",
          "Chinese": "水",
          "Mandarin": "水",
          "Hindi": "पानी"
        },
        "exampleSentence": "A glass of water.",
        "examplePhonetic": "A glas ov WAH-ter.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-e1-1",
        "type": "multiple_choice",
        "question": "Where do you look to choose food?",
        "hint": "It lists all items.",
        "options": [
          {
            "text": "Menu",
            "isCorrect": true
          },
          {
            "text": "Coffee",
            "isCorrect": false
          },
          {
            "text": "Water",
            "isCorrect": false
          }
        ],
        "explanation": "A menu lists all options."
      }
    ]
  },
  {
    "id": "everyday-lesson-2",
    "moduleId": "everyday",
    "moduleTitle": "A2 - Pre-Intermediate",
    "moduleBadge": "☕ Everyday",
    "title": "Daily Routine",
    "subtitle": "Describe what you do every day.",
    "icon": "book",
    "xpReward": 140,
    "estimatedMinutes": 8,
    "vocabulary": [
      {
        "id": "v-e2-1",
        "word": "Wake up",
        "phonetic": "wayk up",
        "emoji": "🌅",
        "translations": {
          "Malayalam": "ഉണരുക",
          "Chinese": "醒来",
          "Mandarin": "醒来",
          "Hindi": "जागना"
        },
        "exampleSentence": "I wake up early.",
        "examplePhonetic": "I wayk up ER-lee.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-e2-2",
        "word": "Breakfast",
        "phonetic": "BREK-fust",
        "emoji": "🍳",
        "translations": {
          "Malayalam": "പ്രഭാതഭക്ഷണം",
          "Chinese": "早餐",
          "Mandarin": "早餐",
          "Hindi": "नाश्ता"
        },
        "exampleSentence": "I eat breakfast.",
        "examplePhonetic": "I eet BREK-fust.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-e2-3",
        "word": "Sleep",
        "phonetic": "sleep",
        "emoji": "😴",
        "translations": {
          "Malayalam": "ഉറങ്ങുക",
          "Chinese": "睡觉",
          "Mandarin": "睡觉",
          "Hindi": "सोना"
        },
        "exampleSentence": "I sleep at night.",
        "examplePhonetic": "I sleep at nyt.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-e2-1",
        "type": "sentence_builder",
        "question": "Translate: \"ഞാൻ നേരത്തെ ഉണരും.\"",
        "scrambledWords": [
          "I",
          "wake",
          "up",
          "early",
          "sleep",
          "late"
        ],
        "correctSentence": "I wake up early",
        "explanation": "This describes your morning habit."
      }
    ]
  },
  {
    "id": "everyday-lesson-3",
    "moduleId": "everyday",
    "moduleTitle": "A2 - Pre-Intermediate",
    "moduleBadge": "☕ Everyday",
    "title": "Family & Friends",
    "subtitle": "Talk about the people you love.",
    "icon": "book",
    "xpReward": 150,
    "estimatedMinutes": 8,
    "vocabulary": [
      {
        "id": "v-e3-1",
        "word": "Friend",
        "phonetic": "frend",
        "emoji": "🤝",
        "translations": {
          "Malayalam": "സുഹൃത്ത്",
          "Chinese": "朋友",
          "Mandarin": "朋友",
          "Hindi": "दोस्त"
        },
        "exampleSentence": "He is my friend.",
        "examplePhonetic": "He iz my frend.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-e3-2",
        "word": "Mother",
        "phonetic": "MUTH-er",
        "emoji": "👩",
        "translations": {
          "Malayalam": "അമ്മ",
          "Chinese": "母亲",
          "Mandarin": "母亲",
          "Hindi": "माँ"
        },
        "exampleSentence": "My mother is kind.",
        "examplePhonetic": "My MUTH-er iz kynd.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-e3-3",
        "word": "Father",
        "phonetic": "FAH-ther",
        "emoji": "👨",
        "translations": {
          "Malayalam": "അച്ഛൻ",
          "Chinese": "父亲",
          "Mandarin": "父亲",
          "Hindi": "पिता"
        },
        "exampleSentence": "My father works hard.",
        "examplePhonetic": "My FAH-ther werks hard.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-e3-1",
        "type": "multiple_choice",
        "question": "What do you call a male parent?",
        "hint": "Not the mother.",
        "options": [
          {
            "text": "Father",
            "isCorrect": true
          },
          {
            "text": "Friend",
            "isCorrect": false
          },
          {
            "text": "Mother",
            "isCorrect": false
          }
        ],
        "explanation": "Father is the male parent."
      }
    ]
  },
  {
    "id": "grammar-lesson-1",
    "moduleId": "grammar",
    "moduleTitle": "B1 - Intermediate",
    "moduleBadge": "📘 Intermediate",
    "title": "Action Verbs (Present)",
    "subtitle": "Learn how to describe things happening now.",
    "icon": "book",
    "xpReward": 160,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-g1-1",
        "word": "Eating",
        "phonetic": "EE-ting",
        "emoji": "🍽️",
        "translations": {
          "Malayalam": "കഴിക്കുന്നു",
          "Chinese": "吃",
          "Mandarin": "吃",
          "Hindi": "खा रहा हूँ"
        },
        "exampleSentence": "She is eating.",
        "examplePhonetic": "She iz EE-ting.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-g1-2",
        "word": "Running",
        "phonetic": "RUN-ing",
        "emoji": "🏃",
        "translations": {
          "Malayalam": "ഓടുന്നു",
          "Chinese": "跑",
          "Mandarin": "跑",
          "Hindi": "दौड़ रहा हूँ"
        },
        "exampleSentence": "He is running.",
        "examplePhonetic": "He iz RUN-ing.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-g1-3",
        "word": "Reading",
        "phonetic": "REE-ding",
        "emoji": "📚",
        "translations": {
          "Malayalam": "വായിക്കുന്നു",
          "Chinese": "阅读",
          "Mandarin": "阅读",
          "Hindi": "पढ़ रहा हूँ"
        },
        "exampleSentence": "I am reading a book.",
        "examplePhonetic": "I am REE-ding a book.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-g1-1",
        "type": "multiple_choice",
        "question": "Fill in the blank: \"She ___ an apple right now.\"",
        "hint": "Present continuous.",
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
        "explanation": "\"is eating\" shows an action happening now."
      }
    ]
  },
  {
    "id": "grammar-lesson-2",
    "moduleId": "grammar",
    "moduleTitle": "B1 - Intermediate",
    "moduleBadge": "📘 Intermediate",
    "title": "Past Tense",
    "subtitle": "Describe things that happened yesterday.",
    "icon": "book",
    "xpReward": 170,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-g2-1",
        "word": "Went",
        "phonetic": "went",
        "emoji": "🚶",
        "translations": {
          "Malayalam": "പോയി",
          "Chinese": "去了",
          "Mandarin": "去了",
          "Hindi": "गया"
        },
        "exampleSentence": "I went home.",
        "examplePhonetic": "I went hohm.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-g2-2",
        "word": "Ate",
        "phonetic": "ayt",
        "emoji": "🍎",
        "translations": {
          "Malayalam": "കഴിച്ചു",
          "Chinese": "吃了",
          "Mandarin": "吃了",
          "Hindi": "खाया"
        },
        "exampleSentence": "He ate lunch.",
        "examplePhonetic": "He ayt lunch.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-g2-3",
        "word": "Saw",
        "phonetic": "saw",
        "emoji": "👁️",
        "translations": {
          "Malayalam": "കണ്ടു",
          "Chinese": "看见",
          "Mandarin": "看见",
          "Hindi": "देखा"
        },
        "exampleSentence": "We saw a movie.",
        "examplePhonetic": "We saw a MOO-vee.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-g2-1",
        "type": "sentence_builder",
        "question": "Translate: \"ഞങ്ങൾ ഒരു സിനിമ കണ്ടു.\"",
        "scrambledWords": [
          "We",
          "saw",
          "a",
          "movie",
          "see",
          "movies"
        ],
        "correctSentence": "We saw a movie",
        "explanation": "Saw is the past tense of see."
      }
    ]
  },
  {
    "id": "grammar-lesson-3",
    "moduleId": "grammar",
    "moduleTitle": "B1 - Intermediate",
    "moduleBadge": "📘 Intermediate",
    "title": "Future Tense",
    "subtitle": "Describe things that will happen tomorrow.",
    "icon": "book",
    "xpReward": 180,
    "estimatedMinutes": 10,
    "vocabulary": [
      {
        "id": "v-g3-1",
        "word": "Will",
        "phonetic": "wil",
        "emoji": "🔮",
        "translations": {
          "Malayalam": "ചെയ്യും",
          "Chinese": "将",
          "Mandarin": "将",
          "Hindi": "करूँगा"
        },
        "exampleSentence": "I will go.",
        "examplePhonetic": "I wil go.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-g3-2",
        "word": "Tomorrow",
        "phonetic": "tuh-MOR-oh",
        "emoji": "📅",
        "translations": {
          "Malayalam": "നാളെ",
          "Chinese": "明天",
          "Mandarin": "明天",
          "Hindi": "कल"
        },
        "exampleSentence": "See you tomorrow.",
        "examplePhonetic": "See yoo tuh-MOR-oh.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-g3-3",
        "word": "Soon",
        "phonetic": "soon",
        "emoji": "⏳",
        "translations": {
          "Malayalam": "ഉടൻ",
          "Chinese": "很快",
          "Mandarin": "很快",
          "Hindi": "जल्द ही"
        },
        "exampleSentence": "It will happen soon.",
        "examplePhonetic": "It wil HAP-un soon.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-g3-1",
        "type": "multiple_choice",
        "question": "Which word indicates the future tense?",
        "hint": "It implies certainty about later.",
        "options": [
          {
            "text": "Will",
            "isCorrect": true
          },
          {
            "text": "Did",
            "isCorrect": false
          },
          {
            "text": "Am",
            "isCorrect": false
          }
        ],
        "explanation": "\"Will\" sets the future tense."
      }
    ]
  },
  {
    "id": "speaking-lesson-1",
    "moduleId": "speaking",
    "moduleTitle": "B2 - Upper-Intermediate",
    "moduleBadge": "🗣️ Advanced",
    "title": "Airport & Travel",
    "subtitle": "Navigate airports without fear.",
    "icon": "book",
    "xpReward": 190,
    "estimatedMinutes": 12,
    "vocabulary": [
      {
        "id": "v-s1-1",
        "word": "Luggage",
        "phonetic": "LUG-ij",
        "emoji": "🧳",
        "translations": {
          "Malayalam": "ലഗേജ്",
          "Chinese": "行李",
          "Mandarin": "行李",
          "Hindi": "सामान"
        },
        "exampleSentence": "Where is my luggage?",
        "examplePhonetic": "Wair iz my LUG-ij?",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-s1-2",
        "word": "Boarding Pass",
        "phonetic": "BOR-ding pas",
        "emoji": "🎫",
        "translations": {
          "Malayalam": "ബോർഡിംഗ് പാസ്",
          "Chinese": "登机牌",
          "Mandarin": "登机牌",
          "Hindi": "बोर्डिंग पास"
        },
        "exampleSentence": "Show your boarding pass.",
        "examplePhonetic": "Shoh yor BOR-ding pas.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-s1-3",
        "word": "Flight",
        "phonetic": "flyt",
        "emoji": "✈️",
        "translations": {
          "Malayalam": "ഫ്ലൈറ്റ്",
          "Chinese": "航班",
          "Mandarin": "航班",
          "Hindi": "उड़ान"
        },
        "exampleSentence": "My flight is delayed.",
        "examplePhonetic": "My flyt iz dih-LAYD.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-s1-1",
        "type": "multiple_choice",
        "question": "What document is required to board the plane?",
        "hint": "It has your seat number.",
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
        "explanation": "The boarding pass lets you on the plane."
      }
    ]
  },
  {
    "id": "speaking-lesson-2",
    "moduleId": "speaking",
    "moduleTitle": "B2 - Upper-Intermediate",
    "moduleBadge": "🗣️ Advanced",
    "title": "Hotel Check-In",
    "subtitle": "Speak confidently at hotel receptions.",
    "icon": "book",
    "xpReward": 200,
    "estimatedMinutes": 12,
    "vocabulary": [
      {
        "id": "v-s2-1",
        "word": "Reservation",
        "phonetic": "rez-er-VAY-shun",
        "emoji": "🛎️",
        "translations": {
          "Malayalam": "റിസർവേഷൻ",
          "Chinese": "预订",
          "Mandarin": "预订",
          "Hindi": "आरक्षण"
        },
        "exampleSentence": "I have a reservation.",
        "examplePhonetic": "I hav a rez-er-VAY-shun.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-s2-2",
        "word": "Key",
        "phonetic": "kee",
        "emoji": "🔑",
        "translations": {
          "Malayalam": "താക്കോൽ",
          "Chinese": "钥匙",
          "Mandarin": "钥匙",
          "Hindi": "चाबी"
        },
        "exampleSentence": "Here is your room key.",
        "examplePhonetic": "Heer iz yor room kee.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-s2-3",
        "word": "Checkout",
        "phonetic": "CHEK-owt",
        "emoji": "🚪",
        "translations": {
          "Malayalam": "ചെക്കൗട്ട്",
          "Chinese": "退房",
          "Mandarin": "退房",
          "Hindi": "चेकआउट"
        },
        "exampleSentence": "Checkout is at noon.",
        "examplePhonetic": "CHEK-owt iz at noon.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-s2-1",
        "type": "sentence_builder",
        "question": "Translate: \"എനിക്ക് ഒരു റിസർവേഷൻ ഉണ്ട്.\"",
        "scrambledWords": [
          "I",
          "have",
          "a",
          "reservation",
          "key",
          "room"
        ],
        "correctSentence": "I have a reservation",
        "explanation": "Say this when arriving at the hotel."
      }
    ]
  },
  {
    "id": "speaking-lesson-3",
    "moduleId": "speaking",
    "moduleTitle": "B2 - Upper-Intermediate",
    "moduleBadge": "🗣️ Advanced",
    "title": "Giving Directions",
    "subtitle": "Help others or ask for directions.",
    "icon": "book",
    "xpReward": 210,
    "estimatedMinutes": 12,
    "vocabulary": [
      {
        "id": "v-s3-1",
        "word": "Straight",
        "phonetic": "strayt",
        "emoji": "⬆️",
        "translations": {
          "Malayalam": "നേരെ",
          "Chinese": "直走",
          "Mandarin": "直走",
          "Hindi": "सीधे"
        },
        "exampleSentence": "Go straight ahead.",
        "examplePhonetic": "Go strayt uh-HED.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-s3-2",
        "word": "Left",
        "phonetic": "left",
        "emoji": "⬅️",
        "translations": {
          "Malayalam": "ഇടത്തോട്ട്",
          "Chinese": "左",
          "Mandarin": "左",
          "Hindi": "बाएं"
        },
        "exampleSentence": "Turn left here.",
        "examplePhonetic": "Tern left heer.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-s3-3",
        "word": "Right",
        "phonetic": "ryt",
        "emoji": "➡️",
        "translations": {
          "Malayalam": "വലത്തോട്ട്",
          "Chinese": "右",
          "Mandarin": "右",
          "Hindi": "दाएं"
        },
        "exampleSentence": "Turn right at the light.",
        "examplePhonetic": "Tern ryt at the lyt.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-s3-1",
        "type": "multiple_choice",
        "question": "Which word means the opposite of Left?",
        "hint": "It also means correct.",
        "options": [
          {
            "text": "Right",
            "isCorrect": true
          },
          {
            "text": "Straight",
            "isCorrect": false
          },
          {
            "text": "Back",
            "isCorrect": false
          }
        ],
        "explanation": "Right is the opposite of left."
      }
    ]
  },
  {
    "id": "business-lesson-1",
    "moduleId": "business",
    "moduleTitle": "C1 - Advanced Professional",
    "moduleBadge": "💼 Professional",
    "title": "Corporate Meetings",
    "subtitle": "Professional vocabulary for meetings.",
    "icon": "book",
    "xpReward": 220,
    "estimatedMinutes": 15,
    "vocabulary": [
      {
        "id": "v-c1-1",
        "word": "Deadline",
        "phonetic": "DED-lyn",
        "emoji": "⏰",
        "translations": {
          "Malayalam": "അവസാന തീയതി",
          "Chinese": "截止日期",
          "Mandarin": "截止日期",
          "Hindi": "अंतिम तिथि"
        },
        "exampleSentence": "We must meet the deadline.",
        "examplePhonetic": "We must meet the DED-lyn.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-c1-2",
        "word": "Strategy",
        "phonetic": "STRAT-uh-jee",
        "emoji": "📈",
        "translations": {
          "Malayalam": "തന്ത്രം",
          "Chinese": "策略",
          "Mandarin": "策略",
          "Hindi": "रणनीति"
        },
        "exampleSentence": "A good strategy wins.",
        "examplePhonetic": "A good STRAT-uh-jee winz.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-c1-3",
        "word": "Agenda",
        "phonetic": "uh-JEN-duh",
        "emoji": "📋",
        "translations": {
          "Malayalam": "അജണ്ട",
          "Chinese": "议程",
          "Mandarin": "议程",
          "Hindi": "कार्यसूची"
        },
        "exampleSentence": "What is on the agenda?",
        "examplePhonetic": "Wut iz on the uh-JEN-duh?",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-c1-1",
        "type": "multiple_choice",
        "question": "What is the list of topics to be discussed in a meeting called?",
        "hint": "Starts with A.",
        "options": [
          {
            "text": "Agenda",
            "isCorrect": true
          },
          {
            "text": "Deadline",
            "isCorrect": false
          },
          {
            "text": "Strategy",
            "isCorrect": false
          }
        ],
        "explanation": "The agenda guides the meeting."
      }
    ]
  },
  {
    "id": "business-lesson-2",
    "moduleId": "business",
    "moduleTitle": "C1 - Advanced Professional",
    "moduleBadge": "💼 Professional",
    "title": "Writing Emails",
    "subtitle": "Formal and effective communication.",
    "icon": "book",
    "xpReward": 230,
    "estimatedMinutes": 15,
    "vocabulary": [
      {
        "id": "v-c2-1",
        "word": "Attach",
        "phonetic": "uh-TACH",
        "emoji": "📎",
        "translations": {
          "Malayalam": "അറ്റാച്ചുചെയ്യുക",
          "Chinese": "附加",
          "Mandarin": "附加",
          "Hindi": "जोड़ें"
        },
        "exampleSentence": "Please attach the file.",
        "examplePhonetic": "PLEEZ uh-TACH the fyl.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-c2-2",
        "word": "Forward",
        "phonetic": "FOR-werd",
        "emoji": "🔄",
        "translations": {
          "Malayalam": "ഫോർവേഡ് ചെയ്യുക",
          "Chinese": "转发",
          "Mandarin": "转发",
          "Hindi": "अग्रेषित"
        },
        "exampleSentence": "I will forward the email.",
        "examplePhonetic": "I wil FOR-werd the EE-mayl.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-c2-3",
        "word": "Regards",
        "phonetic": "rih-GAHRDZ",
        "emoji": "✒️",
        "translations": {
          "Malayalam": "ആദരവോടെ",
          "Chinese": "问候",
          "Mandarin": "问候",
          "Hindi": "सादर"
        },
        "exampleSentence": "Best regards.",
        "examplePhonetic": "Best rih-GAHRDZ.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-c2-1",
        "type": "sentence_builder",
        "question": "Translate: \"ദയവായി ഫയൽ അറ്റാച്ചുചെയ്യുക.\"",
        "scrambledWords": [
          "Please",
          "attach",
          "the",
          "file",
          "forward",
          "email"
        ],
        "correctSentence": "Please attach the file",
        "explanation": "Use this when sending a document."
      }
    ]
  },
  {
    "id": "business-lesson-3",
    "moduleId": "business",
    "moduleTitle": "C1 - Advanced Professional",
    "moduleBadge": "💼 Professional",
    "title": "Negotiations",
    "subtitle": "Advanced vocabulary for agreements.",
    "icon": "book",
    "xpReward": 240,
    "estimatedMinutes": 15,
    "vocabulary": [
      {
        "id": "v-c3-1",
        "word": "Compromise",
        "phonetic": "KOM-pruh-myz",
        "emoji": "🤝",
        "translations": {
          "Malayalam": "വിട്ടുവീഴ്ച",
          "Chinese": "妥协",
          "Mandarin": "妥协",
          "Hindi": "समझौता"
        },
        "exampleSentence": "We reached a compromise.",
        "examplePhonetic": "We reecht a KOM-pruh-myz.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-c3-2",
        "word": "Proposal",
        "phonetic": "pruh-POH-zul",
        "emoji": "📄",
        "translations": {
          "Malayalam": "നിർദ്ദേശം",
          "Chinese": "提议",
          "Mandarin": "提议",
          "Hindi": "प्रस्ताव"
        },
        "exampleSentence": "Review the proposal.",
        "examplePhonetic": "rih-VYOO the pruh-POH-zul.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-c3-3",
        "word": "Contract",
        "phonetic": "KON-trakt",
        "emoji": "🖋️",
        "translations": {
          "Malayalam": "കരാർ",
          "Chinese": "合同",
          "Mandarin": "合同",
          "Hindi": "अनुबंध"
        },
        "exampleSentence": "Sign the contract.",
        "examplePhonetic": "Syn the KON-trakt.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-c3-1",
        "type": "multiple_choice",
        "question": "What do you sign at the end of a negotiation?",
        "hint": "A legally binding document.",
        "options": [
          {
            "text": "Contract",
            "isCorrect": true
          },
          {
            "text": "Compromise",
            "isCorrect": false
          },
          {
            "text": "Proposal",
            "isCorrect": false
          }
        ],
        "explanation": "A contract binds the agreement."
      }
    ]
  },
  {
    "id": "expert-lesson-1",
    "moduleId": "expert",
    "moduleTitle": "C2 - Mastery & Idioms",
    "moduleBadge": "👑 Expert",
    "title": "Native Idioms",
    "subtitle": "Common slang and idioms.",
    "icon": "book",
    "xpReward": 250,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-ex1-1",
        "word": "Piece of cake",
        "phonetic": "pees ov kayk",
        "emoji": "🍰",
        "translations": {
          "Malayalam": "വളരെ എളുപ്പമുള്ള",
          "Chinese": "小菜一碟",
          "Mandarin": "小菜一碟",
          "Hindi": "बहुत आसान"
        },
        "exampleSentence": "The test was a piece of cake.",
        "examplePhonetic": "The test wuz a pees ov kayk.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-ex1-2",
        "word": "Under the weather",
        "phonetic": "UN-der the WETH-er",
        "emoji": "🤒",
        "translations": {
          "Malayalam": "സുഖമില്ലാത്ത",
          "Chinese": "身体不适",
          "Mandarin": "身体不适",
          "Hindi": "अस्वस्थ"
        },
        "exampleSentence": "I feel under the weather.",
        "examplePhonetic": "I feel UN-der the WETH-er.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-ex1-3",
        "word": "Break the ice",
        "phonetic": "brayk the ays",
        "emoji": "🧊",
        "translations": {
          "Malayalam": "തുടക്കമിടുക",
          "Chinese": "打破僵局",
          "Mandarin": "打破僵局",
          "Hindi": "शुरुआत करना"
        },
        "exampleSentence": "Tell a joke to break the ice.",
        "examplePhonetic": "Tel a johk to brayk the ays.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-ex1-1",
        "type": "multiple_choice",
        "question": "Which idiom means \"very easy\"?",
        "hint": "Involves dessert.",
        "options": [
          {
            "text": "Piece of cake",
            "isCorrect": true
          },
          {
            "text": "Break the ice",
            "isCorrect": false
          },
          {
            "text": "Under the weather",
            "isCorrect": false
          }
        ],
        "explanation": "Piece of cake means simple."
      }
    ]
  },
  {
    "id": "expert-lesson-2",
    "moduleId": "expert",
    "moduleTitle": "C2 - Mastery & Idioms",
    "moduleBadge": "👑 Expert",
    "title": "Advanced Vocabulary",
    "subtitle": "Words for highly fluent speakers.",
    "icon": "book",
    "xpReward": 260,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-ex2-1",
        "word": "Ubiquitous",
        "phonetic": "yoo-BIK-wih-tus",
        "emoji": "🌍",
        "translations": {
          "Malayalam": "സർവ്വവ്യാപിയായ",
          "Chinese": "无处不在的",
          "Mandarin": "无处不在的",
          "Hindi": "सर्वव्यापी"
        },
        "exampleSentence": "Smartphones are ubiquitous.",
        "examplePhonetic": "SMART-fohnz ar yoo-BIK-wih-tus.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-ex2-2",
        "word": "Ephemeral",
        "phonetic": "ih-FEM-er-ul",
        "emoji": "⏳",
        "translations": {
          "Malayalam": "ക്ഷണികമായ",
          "Chinese": "短暂的",
          "Mandarin": "短暂的",
          "Hindi": "अल्पकालिक"
        },
        "exampleSentence": "Fame is ephemeral.",
        "examplePhonetic": "Faym iz ih-FEM-er-ul.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-ex2-3",
        "word": "Eloquent",
        "phonetic": "EL-uh-kwunt",
        "emoji": "🗣️",
        "translations": {
          "Malayalam": "വാചാലനായ",
          "Chinese": "雄辩的",
          "Mandarin": "雄辩的",
          "Hindi": "सुवक्ता"
        },
        "exampleSentence": "She gave an eloquent speech.",
        "examplePhonetic": "She gayv an EL-uh-kwunt speech.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-ex2-1",
        "type": "sentence_builder",
        "question": "Translate: \"സ്മാർട്ട്‌ഫോണുകൾ സർവ്വവ്യാപിയാണ്.\"",
        "scrambledWords": [
          "Smartphones",
          "are",
          "ubiquitous",
          "phones",
          "everywhere"
        ],
        "correctSentence": "Smartphones are ubiquitous",
        "explanation": "Ubiquitous means found everywhere."
      }
    ]
  },
  {
    "id": "expert-lesson-3",
    "moduleId": "expert",
    "moduleTitle": "C2 - Mastery & Idioms",
    "moduleBadge": "👑 Expert",
    "title": "Nuanced Phrasal Verbs",
    "subtitle": "Master complex multi-word verbs.",
    "icon": "book",
    "xpReward": 270,
    "estimatedMinutes": 20,
    "vocabulary": [
      {
        "id": "v-ex3-1",
        "word": "Give up",
        "phonetic": "giv up",
        "emoji": "🏳️",
        "translations": {
          "Malayalam": "ഉപേക്ഷിക്കുക",
          "Chinese": "放弃",
          "Mandarin": "放弃",
          "Hindi": "हार मानना"
        },
        "exampleSentence": "Never give up your dreams.",
        "examplePhonetic": "NEV-er giv up yor dreemz.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-ex3-2",
        "word": "Put off",
        "phonetic": "put of",
        "emoji": "📅",
        "translations": {
          "Malayalam": "മാറ്റിവെക്കുക",
          "Chinese": "推迟",
          "Mandarin": "推迟",
          "Hindi": "टालना"
        },
        "exampleSentence": "Do not put off your work.",
        "examplePhonetic": "Doo not put of yor werk.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      },
      {
        "id": "v-ex3-3",
        "word": "Look into",
        "phonetic": "luk IN-too",
        "emoji": "🔍",
        "translations": {
          "Malayalam": "അന്വേഷിക്കുക",
          "Chinese": "调查",
          "Mandarin": "调查",
          "Hindi": "जांच करना"
        },
        "exampleSentence": "I will look into the matter.",
        "examplePhonetic": "I wil luk IN-too the MAT-er.",
        "exampleTranslations": {
          "Malayalam": "ഇതൊരു ഉദാഹരണമാണ്.",
          "Chinese": "这是一个例子。",
          "Mandarin": "这是一个例子。",
          "Hindi": "यह एक उदाहरण है।"
        }
      }
    ],
    "exercises": [
      {
        "id": "ex-ex3-1",
        "type": "multiple_choice",
        "question": "Which phrasal verb means to \"delay\" or \"postpone\"?",
        "hint": "You put it on a later date.",
        "options": [
          {
            "text": "Put off",
            "isCorrect": true
          },
          {
            "text": "Give up",
            "isCorrect": false
          },
          {
            "text": "Look into",
            "isCorrect": false
          }
        ],
        "explanation": "Put off means to delay something."
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
