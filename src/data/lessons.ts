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
  moduleId: 'basics' | 'everyday' | 'speaking' | 'grammar' | 'vocabulary';
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
  // 🟢 Module 1: English Basics - Lesson 1: Everyday Greetings
  {
    id: 'basics-greetings',
    moduleId: 'basics',
    moduleTitle: 'English Basics',
    moduleBadge: '🟢 Basics',
    title: 'Hello & Everyday Greetings',
    subtitle: 'Learn how to say hello, goodbye, and polite phrases to anyone.',
    icon: '👋',
    xpReward: 40,
    estimatedMinutes: 5,
    vocabulary: [
      {
        id: 'w-hello',
        word: 'Hello',
        phonetic: 'heh-LOH',
        emoji: '👋',
        translations: {
          Malayalam: 'ഹലോ / നമസ്കാരം',
          Hindi: 'नमस्ते / हैलो',
          Tamil: 'வணக்கம்',
          Telugu: 'నమస్కారం',
          Spanish: 'Hola',
          French: 'Bonjour',
          Arabic: 'مرحبا',
        },
        exampleSentence: 'Hello, my friend!',
        examplePhonetic: 'heh-LOH, my frend',
        exampleTranslations: {
          Malayalam: 'ഹലോ, എന്റെ സുഹൃത്തേ!',
          Hindi: 'नमस्ते, मेरे दोस्त!',
          Tamil: 'வணக்கம், என் நண்பரே!',
          Telugu: 'హలో, నా స్నేహితుడా!',
          Spanish: '¡Hola, amigo mío!',
          French: 'Bonjour, mon ami!',
          Arabic: 'مرحبا يا صديقي!',
        },
      },
      {
        id: 'w-goodmorning',
        word: 'Good morning',
        phonetic: 'good MOR-ning',
        emoji: '🌅',
        translations: {
          Malayalam: 'ശുഭോദയം',
          Hindi: 'शुभ प्रभात',
          Tamil: 'காலை வணக்கம்',
          Telugu: 'శుభోదయం',
          Spanish: 'Buenos días',
          French: 'Bonjour (matin)',
          Arabic: 'صباح الخير',
        },
        exampleSentence: 'Good morning, teacher!',
        examplePhonetic: 'good MOR-ning, TEE-cher',
        exampleTranslations: {
          Malayalam: 'ശുഭോദയം, ടീച്ചർ!',
          Hindi: 'शुभ प्रभात, शिक्षक!',
          Tamil: 'காலை வணக்கம், ஆசிரியர்!',
          Telugu: 'శుభోదయం, గురువుగారూ!',
          Spanish: '¡Buenos días, profesor!',
          French: 'Bonjour, professeur!',
          Arabic: 'صباح الخير يا أستاذ!',
        },
      },
      {
        id: 'w-thankyou',
        word: 'Thank you',
        phonetic: 'THANK yoo',
        emoji: '🙏',
        translations: {
          Malayalam: 'നന്ദി',
          Hindi: 'धन्यवाद / शुक्रिया',
          Tamil: 'நன்றி',
          Telugu: 'ధన్యవాదాలు',
          Spanish: 'Gracias',
          French: 'Merci',
          Arabic: 'شكراً',
        },
        exampleSentence: 'Thank you very much.',
        examplePhonetic: 'THANK yoo VEH-ree much',
        exampleTranslations: {
          Malayalam: 'വളരെ നന്ദി.',
          Hindi: 'बहुत-बहुत धन्यवाद।',
          Tamil: 'மிக்க நன்றி.',
          Telugu: 'చాలా ధన్యవాదాలు.',
          Spanish: 'Muchas gracias.',
          French: 'Merci beaucoup.',
          Arabic: 'شكرا جزيلا.',
        },
      },
      {
        id: 'w-please',
        word: 'Please',
        phonetic: 'pleez',
        emoji: '🤝',
        translations: {
          Malayalam: 'ദയവായി',
          Hindi: 'कृपया',
          Tamil: 'தயவுசெய்து',
          Telugu: 'దయచేసి',
          Spanish: 'Por favor',
          French: "S'il vous plaît",
          Arabic: 'من فضلك',
        },
        exampleSentence: 'Water, please.',
        examplePhonetic: 'WAH-ter, pleez',
        exampleTranslations: {
          Malayalam: 'വെള്ളം, ദയവായി.',
          Hindi: 'पानी, कृपया।',
          Tamil: 'தண்ணீர், தயவுசெய்து.',
          Telugu: 'మంచి నీరు, దయచేసి.',
          Spanish: 'Agua, por favor.',
          French: "De l'eau, s'il vous plaît.",
          Arabic: 'ماء، من فضلك.',
        },
      },
    ],
    exercises: [
      {
        id: 'ex-1',
        type: 'multiple_choice',
        question: 'What do you say when you meet someone in the morning?',
        options: [
          { text: 'Good morning', subtext: '🌅 Used from dawn until noon', isCorrect: true },
          { text: 'Good night', subtext: '🌙 Used when going to sleep', isCorrect: false },
          { text: 'Thank you', subtext: '🙏 Used to show gratitude', isCorrect: false },
          { text: 'Goodbye', subtext: '👋 Used when departing', isCorrect: false },
        ],
        explanation: 'Say "Good morning" to greet someone politely before 12:00 PM noon.',
      },
      {
        id: 'ex-2',
        type: 'matching',
        question: 'Match the English words with their correct meaning:',
        pairs: [
          { left: 'Hello', right: '👋 Friendly Greeting' },
          { left: 'Thank you', right: '🙏 Gratitude' },
          { left: 'Please', right: '🤝 Polite Request' },
          { left: 'Good morning', right: '🌅 Morning Greeting' },
        ],
        explanation: 'Great job matching all the essential polite greetings!',
      },
      {
        id: 'ex-3',
        type: 'listen_choose',
        question: 'Listen carefully and select the word you hear:',
        audioPrompt: 'Thank you',
        options: [
          { text: 'Thank you', isCorrect: true },
          { text: 'Hello', isCorrect: false },
          { text: 'Please', isCorrect: false },
          { text: 'Water', isCorrect: false },
        ],
        explanation: '"Thank you" is spoken with a soft "th" sound at the start.',
      },
      {
        id: 'ex-4',
        type: 'sentence_builder',
        question: 'Arrange the words to make the polite sentence:',
        scrambledWords: ['please', 'Water', ','],
        correctSentence: 'Water , please',
        explanation: 'Polite requests are easy: state what you want and add "please" at the end!',
      },
    ],
  },

  // 🟢 Module 1: English Basics - Lesson 2: Numbers & Counting
  {
    id: 'basics-numbers',
    moduleId: 'basics',
    moduleTitle: 'English Basics',
    moduleBadge: '🟢 Basics',
    title: 'Numbers (1 to 10)',
    subtitle: 'Count objects, prices, and phone numbers in English with confidence.',
    icon: '🔢',
    xpReward: 45,
    estimatedMinutes: 6,
    vocabulary: [
      {
        id: 'w-one',
        word: 'One',
        phonetic: 'wun',
        emoji: '1️⃣',
        translations: { Malayalam: 'ഒന്ന്', Hindi: 'एक', Tamil: 'ஒன்று', Telugu: 'ఒకటి', Spanish: 'Uno', French: 'Un', Arabic: 'واحد' },
        exampleSentence: 'One apple, please.',
        examplePhonetic: 'wun AP-pul, pleez',
        exampleTranslations: { Malayalam: 'ഒരു ആപ്പിൾ, ദയവായി.', Hindi: 'एक सेब, कृपया।', Tamil: 'ஒரு ஆப்பிள், தயவுசெய்து.', Telugu: 'ఒక ఆపిల్, దయచేసి.', Spanish: 'Una manzana, por favor.', French: 'Une pomme, s’il vous plaît.', Arabic: 'تفاحة واحدة من فضلك.' },
      },
      {
        id: 'w-two',
        word: 'Two',
        phonetic: 'too',
        emoji: '2️⃣',
        translations: { Malayalam: 'രണ്ട്', Hindi: 'दो', Tamil: 'இரண்டு', Telugu: 'రెండు', Spanish: 'Dos', French: 'Deux', Arabic: 'اثنان' },
        exampleSentence: 'I have two cups of tea.',
        examplePhonetic: 'eye hav too kups uv tee',
        exampleTranslations: { Malayalam: 'എനിക്ക് രണ്ട് കപ്പ് ചായയുണ്ട്.', Hindi: 'मेरे पास दो कप चाय है।', Tamil: 'என்னிடம் இரண்டு கப் தேநீர் உள்ளது.', Telugu: 'నాకు రెండు కప్పుల టీ ఉన్నాయి.', Spanish: 'Tengo dos tazas de té.', French: 'J’ai deux tasses de thé.', Arabic: 'لدي فنجانان من الشاي.' },
      },
      {
        id: 'w-five',
        word: 'Five',
        phonetic: 'fyv',
        emoji: '5️⃣',
        translations: { Malayalam: 'അഞ്ച്', Hindi: 'पाँच', Tamil: 'ஐந்து', Telugu: 'ఐదు', Spanish: 'Cinco', French: 'Cinq', Arabic: 'خمسة' },
        exampleSentence: 'Five dollars only.',
        examplePhonetic: 'fyv DOL-erz OHN-lee',
        exampleTranslations: { Malayalam: 'അഞ്ച് ഡോളർ മാത്രം.', Hindi: 'केवल पाँच डॉलर।', Tamil: 'ஐந்து டாலர்கள் மட்டுமே.', Telugu: 'కేవలం ఐదు డాలర్లు.', Spanish: 'Solo cinco dólares.', French: 'Cinq dollars seulement.', Arabic: 'خمسة دولارات فقط.' },
      },
      {
        id: 'w-ten',
        word: 'Ten',
        phonetic: 'ten',
        emoji: '🔟',
        translations: { Malayalam: 'പത്ത്', Hindi: 'दस', Tamil: 'பத்து', Telugu: 'పది', Spanish: 'Diez', French: 'Dix', Arabic: 'عشرة' },
        exampleSentence: 'Count to ten.',
        examplePhonetic: 'kownt too ten',
        exampleTranslations: { Malayalam: 'പത്ത് വരെ എണ്ണുക.', Hindi: 'दस तक गिनो।', Tamil: 'பத்து வரை எண்ணுங்கள்.', Telugu: 'పది వరకు లెక్కించండి.', Spanish: 'Cuenta hasta diez.', French: 'Comptez jusqu’à dix.', Arabic: 'عد إلى عشرة.' },
      },
    ],
    exercises: [
      {
        id: 'ex-num-1',
        type: 'multiple_choice',
        question: 'Which number is spelled "Two"?',
        options: [
          { text: '2️⃣ (2)', isCorrect: true },
          { text: '1️⃣ (1)', isCorrect: false },
          { text: '5️⃣ (5)', isCorrect: false },
          { text: '🔟 (10)', isCorrect: false },
        ],
        explanation: 'Two represents the number 2.',
      },
      {
        id: 'ex-num-2',
        type: 'matching',
        pairs: [
          { left: 'One', right: '1️⃣' },
          { left: 'Two', right: '2️⃣' },
          { left: 'Five', right: '5️⃣' },
          { left: 'Ten', right: '🔟' },
        ],
        question: 'Match English numbers with digits:',
        explanation: 'Superb! You know your core numbers.',
      },
    ],
  },

  // 🔵 Module 2: Everyday English - Lesson 1: Introducing Yourself
  {
    id: 'everyday-intro',
    moduleId: 'everyday',
    moduleTitle: 'Everyday English',
    moduleBadge: '🔵 Everyday',
    title: 'Introducing Yourself',
    subtitle: 'Share your name, where you come from, and connect with people.',
    icon: '🙋',
    xpReward: 50,
    estimatedMinutes: 7,
    vocabulary: [
      {
        id: 'w-name',
        word: 'Name',
        phonetic: 'naym',
        emoji: '🏷️',
        translations: { Malayalam: 'പേര്', Hindi: 'नाम', Tamil: 'பெயர்', Telugu: 'పేరు', Spanish: 'Nombre', French: 'Nom', Arabic: 'اسم' },
        exampleSentence: 'My name is Alex.',
        examplePhonetic: 'my naym iz AL-eks',
        exampleTranslations: { Malayalam: 'എന്റെ പേര് അലക്സ് എന്നാണ്.', Hindi: 'मेरा नाम एलेक्स है।', Tamil: 'என் பெயர் அலெக்ஸ்.', Telugu: 'నా పేరు అలెక్స్.', Spanish: 'Mi nombre es Alex.', French: 'Mon nom est Alex.', Arabic: 'اسمي أليكس.' },
      },
      {
        id: 'w-from',
        word: 'From',
        phonetic: 'frum',
        emoji: '📍',
        translations: { Malayalam: 'നിന്ന് / സ്വദേശി', Hindi: 'से', Tamil: 'இருந்து', Telugu: 'నుండి', Spanish: 'De / Desde', French: 'De', Arabic: 'من' },
        exampleSentence: 'I am from India.',
        examplePhonetic: 'eye am frum IN-dee-uh',
        exampleTranslations: { Malayalam: 'ഞാൻ ഇന്ത്യയിൽ നിന്നാണ്.', Hindi: 'मैं भारत से हूँ।', Tamil: 'நான் இந்தியாவில் இருந்து வருகிறேன்.', Telugu: 'నేను భారతదేశం నుండి వచ్చాను.', Spanish: 'Soy de la India.', French: 'Je viens d’Inde.', Arabic: 'أنا من الهند.' },
      },
      {
        id: 'w-nice-to-meet',
        word: 'Nice to meet you',
        phonetic: 'nys too MEET yoo',
        emoji: '🤝',
        translations: { Malayalam: 'കണ്ടതിൽ സന്തോഷം', Hindi: 'आपसे मिलकर खुशी हुई', Tamil: 'உங்களை சந்தித்ததில் மகிழ்ச்சி', Telugu: 'మిమ్మల్ని కలవడం ఆనందంగా ఉంది', Spanish: 'Mucho gusto', French: 'Enchanté(e)', Arabic: 'تشرفت بمعرفتك' },
        exampleSentence: 'Nice to meet you too.',
        examplePhonetic: 'nys too MEET yoo too',
        exampleTranslations: { Malayalam: 'നിങ്ങളെയും കണ്ടതിൽ സന്തോഷം.', Hindi: 'आपसे मिलकर भी खुशी हुई।', Tamil: 'உங்களையும் சந்தித்ததில் மகிழ்ச்சி.', Telugu: 'మిమ్మల్ని కలవడం కూడా ఆనందంగా ఉంది.', Spanish: 'El gusto es mío.', French: 'Enchanté également.', Arabic: 'الشرف لي أيضاً.' },
      },
    ],
    exercises: [
      {
        id: 'ex-intro-1',
        type: 'sentence_builder',
        question: 'Build the English sentence: "My name is John."',
        scrambledWords: ['is', 'John', 'My', 'name'],
        correctSentence: 'My name is John',
        explanation: 'Always follow the structure: [My name] + [is] + [Your Name].',
      },
      {
        id: 'ex-intro-2',
        type: 'multiple_choice',
        question: 'Someone tells you: "Nice to meet you!" How should you respond?',
        options: [
          { text: 'Nice to meet you too!', subtext: 'Friendly & polite return', isCorrect: true },
          { text: 'I am hungry.', subtext: 'Unrelated answer', isCorrect: false },
          { text: 'Goodbye.', subtext: 'Rude or premature', isCorrect: false },
        ],
        explanation: 'Adding "too" at the end of "Nice to meet you" is the most natural reply.',
      },
    ],
  },

  // 🔵 Module 2: Everyday English - Lesson 2: Ordering Food & Drinks
  {
    id: 'everyday-food',
    moduleId: 'everyday',
    moduleTitle: 'Everyday English',
    moduleBadge: '🔵 Everyday',
    title: 'Food & Ordering at a Cafe',
    subtitle: 'Order delicious meals, coffee, and water like a pro.',
    icon: '☕',
    xpReward: 55,
    estimatedMinutes: 6,
    vocabulary: [
      {
        id: 'w-water',
        word: 'Water',
        phonetic: 'WAH-ter',
        emoji: '💧',
        translations: { Malayalam: 'വെള്ളം', Hindi: 'पानी', Tamil: 'தண்ணீர்', Telugu: 'మంచి నీరు', Spanish: 'Agua', French: 'Eau', Arabic: 'ماء' },
        exampleSentence: 'I drink water every day.',
        examplePhonetic: 'eye drink WAH-ter EV-ree day',
        exampleTranslations: { Malayalam: 'ഞാൻ എല്ലാ ദിവസവും വെള്ളം കുടിക്കുന്നു.', Hindi: 'मैं रोज़ पानी पीता हूँ।', Tamil: 'நான் தினமும் தண்ணீர் குடிக்கிறேன்.', Telugu: 'నేను ప్రతిరోజూ నీరు తాగుతాను.', Spanish: 'Bebo agua todos los días.', French: 'Je bois de l’eau tous les jours.', Arabic: 'أشرب الماء كل يوم.' },
      },
      {
        id: 'w-tea',
        word: 'Tea / Coffee',
        phonetic: 'tee / KAW-fee',
        emoji: '☕',
        translations: { Malayalam: 'ചായ / കാപ്പി', Hindi: 'चाय / कॉफ़ी', Tamil: 'தேநீர் / காபி', Telugu: 'టీ / కాఫీ', Spanish: 'Té / Café', French: 'Thé / Café', Arabic: 'شاي / قهوة' },
        exampleSentence: 'One hot tea, please.',
        examplePhonetic: 'wun hot tee, pleez',
        exampleTranslations: { Malayalam: 'ഒരു ചൂട് ചായ, ദയവായി.', Hindi: 'एक गर्म चाय, कृपया।', Tamil: 'ஒரு சூடான தேநீர், தயவுசெய்து.', Telugu: 'ఒక వేడి టీ, దయచేసి.', Spanish: 'Un té caliente, por favor.', French: 'Un thé chaud, s’il vous plaît.', Arabic: 'شاي ساخن واحد من فضلك.' },
      },
      {
        id: 'w-hungry',
        word: 'Hungry',
        phonetic: 'HUHNG-gree',
        emoji: '🍽️',
        translations: { Malayalam: 'വിശപ്പുള്ള', Hindi: 'भूखा', Tamil: 'பசி', Telugu: 'ఆకలి', Spanish: 'Hambriento', French: 'Affamé', Arabic: 'جائع' },
        exampleSentence: 'I am hungry now.',
        examplePhonetic: 'eye am HUHNG-gree now',
        exampleTranslations: { Malayalam: 'എനിക്ക് ഇപ്പോൾ വിശക്കുന്നു.', Hindi: 'मुझे अब भूख लगी है।', Tamil: 'எனக்கு இப்போது பசிக்கிறது.', Telugu: 'నాకు ఇప్పుడు ఆకలిగా ఉంది.', Spanish: 'Tengo hambre ahora.', French: 'J’ai faim maintenant.', Arabic: 'أنا جائع الآن.' },
      },
    ],
    exercises: [
      {
        id: 'ex-food-1',
        type: 'sentence_builder',
        question: 'How do you say "I am hungry" in English?',
        scrambledWords: ['hungry', 'am', 'I'],
        correctSentence: 'I am hungry',
        explanation: 'In English, you say: "I am hungry". Simple and natural!',
      },
      {
        id: 'ex-food-2',
        type: 'multiple_choice',
        question: 'Which word means "വെള്ളം / पानी / தண்ணீர் / Agua"?',
        options: [
          { text: 'Water 💧', isCorrect: true },
          { text: 'Fire 🔥', isCorrect: false },
          { text: 'House 🏠', isCorrect: false },
          { text: 'Car 🚗', isCorrect: false },
        ],
        explanation: 'Water is pronounced "WAH-ter".',
      },
    ],
  },

  // 🟡 Module 3: Speaking & Conversation - Lesson 1: Asking Questions
  {
    id: 'speaking-questions',
    moduleId: 'speaking',
    moduleTitle: 'Speaking & Conversation',
    moduleBadge: '🟡 Speaking',
    title: 'Asking Everyday Questions',
    subtitle: 'Master the 5 power words: What, Where, When, Who, and Why.',
    icon: '❓',
    xpReward: 60,
    estimatedMinutes: 8,
    vocabulary: [
      {
        id: 'w-what',
        word: 'What',
        phonetic: 'wut',
        emoji: '💡',
        translations: { Malayalam: 'എന്ത്', Hindi: 'क्या', Tamil: 'என்ன', Telugu: 'ఏమిటి', Spanish: 'Qué', French: 'Quoi', Arabic: 'ماذا' },
        exampleSentence: 'What is this?',
        examplePhonetic: 'wut iz this',
        exampleTranslations: { Malayalam: 'ഇത് എന്താണ്?', Hindi: 'यह क्या है?', Tamil: 'இது என்ன?', Telugu: 'ఇది ఏమిటి?', Spanish: '¿Qué es esto?', French: 'Qu’est-ce que c’est?', Arabic: 'ما هذا؟' },
      },
      {
        id: 'w-where',
        word: 'Where',
        phonetic: 'wair',
        emoji: '🗺️',
        translations: { Malayalam: 'എവിടെ', Hindi: 'कहाँ', Tamil: 'எங்கே', Telugu: 'ఎక్కడ', Spanish: 'Dónde', French: 'Où', Arabic: 'أين' },
        exampleSentence: 'Where is the station?',
        examplePhonetic: 'wair iz the STAY-shun',
        exampleTranslations: { Malayalam: 'സ്റ്റേഷൻ എവിടെയാണ്?', Hindi: 'स्टेशन कहाँ है?', Tamil: 'நிலையம் எங்கே இருக்கிறது?', Telugu: 'స్టేషన్ ఎక్కడ ఉంది?', Spanish: '¿Dónde está la estación?', French: 'Où est la gare?', Arabic: 'أين المحطة؟' },
      },
    ],
    exercises: [
      {
        id: 'ex-q-1',
        type: 'multiple_choice',
        question: 'When asking for a location or place, which question word do you use?',
        options: [
          { text: 'Where (🗺️)', isCorrect: true },
          { text: 'What (💡)', isCorrect: false },
          { text: 'Who (👤)', isCorrect: false },
        ],
        explanation: 'Use "Where" to ask about places (e.g., "Where is the bus?").',
      },
    ],
  },

  // 🟣 Module 4: Grammar Made Simple - Lesson 1: Am, Is, Are
  {
    id: 'grammar-verbs',
    moduleId: 'grammar',
    moduleTitle: 'Grammar Made Simple',
    moduleBadge: '🟣 Grammar',
    title: 'Am, Is, and Are',
    subtitle: 'Learn the golden rule of English state verbs without confusing jargon.',
    icon: '✨',
    xpReward: 50,
    estimatedMinutes: 7,
    vocabulary: [
      {
        id: 'w-am',
        word: 'I am',
        phonetic: 'eye am',
        emoji: '🙋‍♂️',
        translations: { Malayalam: 'ഞാൻ ആകുന്നു', Hindi: 'मैं हूँ', Tamil: 'நான் இருக்கிறேன்', Telugu: 'నేను ఉన్నాను', Spanish: 'Yo soy / estoy', French: 'Je suis', Arabic: 'أنا' },
        exampleSentence: 'I am happy.',
        examplePhonetic: 'eye am HAP-ee',
        exampleTranslations: { Malayalam: 'ഞാൻ സന്തുഷ്ടനാണ്.', Hindi: 'मैं खुश हूँ।', Tamil: 'நான் மகிழ்ச்சியாக இருக்கிறேன்.', Telugu: 'నేను సంతోషంగా ఉన్నాను.', Spanish: 'Estoy feliz.', French: 'Je suis heureux.', Arabic: 'أنا سعيد.' },
      },
      {
        id: 'w-is',
        word: 'He is / She is',
        phonetic: 'hee iz / shee iz',
        emoji: '👥',
        translations: { Malayalam: 'അവൻ / അവൾ ആണ്', Hindi: 'वह है', Tamil: 'அவன் / அவள் இருக்கிறார்', Telugu: 'అతను / ఆమె ఉన్నారు', Spanish: 'Él es / Ella es', French: 'Il est / Elle est', Arabic: 'هو / هي' },
        exampleSentence: 'She is a student.',
        examplePhonetic: 'shee iz uh STYOO-dent',
        exampleTranslations: { Malayalam: 'അവൾ ഒരു വിദ്യാർത്ഥിനിയാണ്.', Hindi: 'वह एक छात्रा है।', Tamil: 'அவள் ஒரு மாணவி.', Telugu: 'ఆమె ఒక విద్యార్థి.', Spanish: 'Ella es estudiante.', French: 'Elle est étudiante.', Arabic: 'هي طالبة.' },
      },
    ],
    exercises: [
      {
        id: 'ex-gram-1',
        type: 'multiple_choice',
        question: 'Choose the correct word: "I ___ a doctor."',
        options: [
          { text: 'am', subtext: 'Always use "am" with "I"', isCorrect: true },
          { text: 'is', subtext: 'Used for he / she / it', isCorrect: false },
          { text: 'are', subtext: 'Used for you / we / they', isCorrect: false },
        ],
        explanation: 'Remember the golden rule: "I am", "He is", "They are"!',
      },
    ],
  },

  // 🟠 Module 5: Vocabulary Power - Lesson 1: Everyday Essentials
  {
    id: 'vocab-essentials',
    moduleId: 'vocabulary',
    moduleTitle: 'Essential Vocabulary',
    moduleBadge: '🟠 Vocabulary',
    title: 'Top 10 Everyday Essentials',
    subtitle: 'High frequency words you will see and use every single day.',
    icon: '🍎',
    xpReward: 50,
    estimatedMinutes: 6,
    vocabulary: [
      {
        id: 'w-apple',
        word: 'Apple',
        phonetic: 'AP-pul',
        emoji: '🍎',
        translations: { Malayalam: 'ആപ്പിൾ', Hindi: 'सेब', Tamil: 'ஆப்பிள்', Telugu: 'ఆపిల్', Spanish: 'Manzana', French: 'Pomme', Arabic: 'تفاحة' },
        exampleSentence: 'I eat a fresh apple.',
        examplePhonetic: 'eye eet uh fresh AP-pul',
        exampleTranslations: { Malayalam: 'ഞാൻ ഒരു പുതിയ ആപ്പിൾ കഴിക്കുന്നു.', Hindi: 'मैं एक ताज़ा सेब खाता हूँ।', Tamil: 'நான் ஒரு புதிய ஆப்பிளை சாப்பிடுகிறேன்.', Telugu: 'నేను ఒక తాజా ఆపిల్ తింటాను.', Spanish: 'Como una manzana fresca.', French: 'Je mange une pomme fraîche.', Arabic: 'آكل تفاحة طازجة.' },
      },
      {
        id: 'w-house',
        word: 'House / Home',
        phonetic: 'hows / hohm',
        emoji: '🏠',
        translations: { Malayalam: 'വീട്', Hindi: 'घर', Tamil: 'வீடு', Telugu: 'ఇల్లు', Spanish: 'Casa / Hogar', French: 'Maison', Arabic: 'بيت / منزل' },
        exampleSentence: 'Welcome to my house.',
        examplePhonetic: 'WEL-kum too my hows',
        exampleTranslations: { Malayalam: 'എന്റെ വീട്ടിലേക്ക് സ്വാഗതം.', Hindi: 'मेरे घर में आपका स्वागत है।', Tamil: 'என் வீட்டிற்கு வருக.', Telugu: 'నా ఇంటికి స్వాగతం.', Spanish: 'Bienvenido a mi casa.', French: 'Bienvenue chez moi.', Arabic: 'مرحبا بك في بيتي.' },
      },
      {
        id: 'w-car',
        word: 'Car',
        phonetic: 'kahr',
        emoji: '🚗',
        translations: { Malayalam: 'കാർ', Hindi: 'गाड़ी / कार', Tamil: 'மகிழுந்து / கார்', Telugu: 'కారు', Spanish: 'Coche / Carro', French: 'Voiture', Arabic: 'سيارة' },
        exampleSentence: 'The blue car is fast.',
        examplePhonetic: 'the bloo kahr iz fast',
        exampleTranslations: { Malayalam: 'നീല കാർ വേഗതയുള്ളതാണ്.', Hindi: 'नीली कार तेज़ है।', Tamil: 'நீல கார் வேகமாக செல்கிறது.', Telugu: 'నీలి రంగు కారు వేగంగా వెళ్తుంది.', Spanish: 'El coche azul es rápido.', French: 'La voiture bleue est rapide.', Arabic: 'السيارة الزرقاء سريعة.' },
      },
      {
        id: 'w-friend',
        word: 'Friend',
        phonetic: 'frend',
        emoji: '👫',
        translations: { Malayalam: 'സുഹൃത്ത്', Hindi: 'दोस्त / मित्र', Tamil: 'நண்பர்', Telugu: 'స్నేహితుడు', Spanish: 'Amigo', French: 'Ami', Arabic: 'صديق' },
        exampleSentence: 'You are my best friend.',
        examplePhonetic: 'yoo ahr my best frend',
        exampleTranslations: { Malayalam: 'നീ എന്റെ ഏറ്റവും നല്ല സുഹൃത്താണ്.', Hindi: 'तुम मेरे सबसे अच्छे दोस्त हो।', Tamil: 'நீ என் சிறந்த நண்பன்.', Telugu: 'నువ్వు నా ప్రాణ స్నేహితుడివి.', Spanish: 'Eres mi mejor amigo.', French: 'Tu es mon meilleur ami.', Arabic: 'أنت أفضل أصدقائي.' },
      },
    ],
    exercises: [
      {
        id: 'ex-v-1',
        type: 'matching',
        question: 'Match the English vocabulary with their icons:',
        pairs: [
          { left: 'Apple', right: '🍎' },
          { left: 'House', right: '🏠' },
          { left: 'Car', right: '🚗' },
          { left: 'Friend', right: '👫' },
        ],
        explanation: 'Excellent visual memory!',
      },
    ],
  },
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
