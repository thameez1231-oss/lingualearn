export interface DictionaryEntry {
  id: string;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  emoji: string;
  simpleDefinition: string;
  exampleSentence: string;
  exampleTranslation: string;
  translations: Record<string, string>;
  category: string;
}

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    "id": "d-word-1",
    "word": "Hello",
    "partOfSpeech": "noun",
    "phonetic": "heh-LOH",
    "emoji": "👋",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Hello, how are you?",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഹലോ",
      "Chinese": "你好",
      "Mandarin": "你好",
      "Hindi": "नमस्ते"
    },
    "category": "basics"
  },
  {
    "id": "d-word-2",
    "word": "Please",
    "partOfSpeech": "noun",
    "phonetic": "PLEEZ",
    "emoji": "🙏",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Water, please.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ദയവായി",
      "Chinese": "请",
      "Mandarin": "请",
      "Hindi": "कृपया"
    },
    "category": "basics"
  },
  {
    "id": "d-word-3",
    "word": "Thank you",
    "partOfSpeech": "noun",
    "phonetic": "THANGK yoo",
    "emoji": "😊",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Thank you very much.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "നന്ദി",
      "Chinese": "谢谢",
      "Mandarin": "谢谢",
      "Hindi": "धन्यवाद"
    },
    "category": "basics"
  },
  {
    "id": "d-word-4",
    "word": "One",
    "partOfSpeech": "noun",
    "phonetic": "wun",
    "emoji": "1️⃣",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I have one apple.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഒന്ന്",
      "Chinese": "一",
      "Mandarin": "一",
      "Hindi": "एक"
    },
    "category": "basics"
  },
  {
    "id": "d-word-5",
    "word": "Two",
    "partOfSpeech": "noun",
    "phonetic": "too",
    "emoji": "2️⃣",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "There are two cars.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "രണ്ട്",
      "Chinese": "二",
      "Mandarin": "二",
      "Hindi": "दो"
    },
    "category": "basics"
  },
  {
    "id": "d-word-6",
    "word": "Three",
    "partOfSpeech": "noun",
    "phonetic": "three",
    "emoji": "3️⃣",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I see three birds.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "മൂന്ന്",
      "Chinese": "三",
      "Mandarin": "三",
      "Hindi": "तीन"
    },
    "category": "basics"
  },
  {
    "id": "d-word-7",
    "word": "Red",
    "partOfSpeech": "noun",
    "phonetic": "red",
    "emoji": "🔴",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "The apple is red.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ചുവപ്പ്",
      "Chinese": "红色",
      "Mandarin": "红色",
      "Hindi": "लाल"
    },
    "category": "basics"
  },
  {
    "id": "d-word-8",
    "word": "Blue",
    "partOfSpeech": "noun",
    "phonetic": "bloo",
    "emoji": "🔵",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "The sky is blue.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "നീല",
      "Chinese": "蓝色",
      "Mandarin": "蓝色",
      "Hindi": "नीला"
    },
    "category": "basics"
  },
  {
    "id": "d-word-9",
    "word": "Green",
    "partOfSpeech": "noun",
    "phonetic": "green",
    "emoji": "🟢",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "The grass is green.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "പച്ച",
      "Chinese": "绿色",
      "Mandarin": "绿色",
      "Hindi": "हरा"
    },
    "category": "basics"
  },
  {
    "id": "d-word-10",
    "word": "Coffee",
    "partOfSpeech": "noun",
    "phonetic": "KOF-ee",
    "emoji": "☕",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I want a coffee.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "കോഫി",
      "Chinese": "咖啡",
      "Mandarin": "咖啡",
      "Hindi": "कॉफी"
    },
    "category": "everyday"
  },
  {
    "id": "d-word-11",
    "word": "Menu",
    "partOfSpeech": "noun",
    "phonetic": "MEN-yoo",
    "emoji": "📖",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Bring the menu.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "മെനു",
      "Chinese": "菜单",
      "Mandarin": "菜单",
      "Hindi": "मेन्यू"
    },
    "category": "everyday"
  },
  {
    "id": "d-word-12",
    "word": "Water",
    "partOfSpeech": "noun",
    "phonetic": "WAH-ter",
    "emoji": "💧",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "A glass of water.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "വെള്ളം",
      "Chinese": "水",
      "Mandarin": "水",
      "Hindi": "पानी"
    },
    "category": "everyday"
  },
  {
    "id": "d-word-13",
    "word": "Wake up",
    "partOfSpeech": "noun",
    "phonetic": "wayk up",
    "emoji": "🌅",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I wake up early.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഉണരുക",
      "Chinese": "醒来",
      "Mandarin": "醒来",
      "Hindi": "जागना"
    },
    "category": "everyday"
  },
  {
    "id": "d-word-14",
    "word": "Breakfast",
    "partOfSpeech": "noun",
    "phonetic": "BREK-fust",
    "emoji": "🍳",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I eat breakfast.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "പ്രഭാതഭക്ഷണം",
      "Chinese": "早餐",
      "Mandarin": "早餐",
      "Hindi": "नाश्ता"
    },
    "category": "everyday"
  },
  {
    "id": "d-word-15",
    "word": "Sleep",
    "partOfSpeech": "noun",
    "phonetic": "sleep",
    "emoji": "😴",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I sleep at night.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഉറങ്ങുക",
      "Chinese": "睡觉",
      "Mandarin": "睡觉",
      "Hindi": "सोना"
    },
    "category": "everyday"
  },
  {
    "id": "d-word-16",
    "word": "Friend",
    "partOfSpeech": "noun",
    "phonetic": "frend",
    "emoji": "🤝",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "He is my friend.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "സുഹൃത്ത്",
      "Chinese": "朋友",
      "Mandarin": "朋友",
      "Hindi": "दोस्त"
    },
    "category": "everyday"
  },
  {
    "id": "d-word-17",
    "word": "Mother",
    "partOfSpeech": "noun",
    "phonetic": "MUTH-er",
    "emoji": "👩",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "My mother is kind.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "അമ്മ",
      "Chinese": "母亲",
      "Mandarin": "母亲",
      "Hindi": "माँ"
    },
    "category": "everyday"
  },
  {
    "id": "d-word-18",
    "word": "Father",
    "partOfSpeech": "noun",
    "phonetic": "FAH-ther",
    "emoji": "👨",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "My father works hard.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "അച്ഛൻ",
      "Chinese": "父亲",
      "Mandarin": "父亲",
      "Hindi": "पिता"
    },
    "category": "everyday"
  },
  {
    "id": "d-word-19",
    "word": "Eating",
    "partOfSpeech": "noun",
    "phonetic": "EE-ting",
    "emoji": "🍽️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "She is eating.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "കഴിക്കുന്നു",
      "Chinese": "吃",
      "Mandarin": "吃",
      "Hindi": "खा रहा हूँ"
    },
    "category": "grammar"
  },
  {
    "id": "d-word-20",
    "word": "Running",
    "partOfSpeech": "noun",
    "phonetic": "RUN-ing",
    "emoji": "🏃",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "He is running.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഓടുന്നു",
      "Chinese": "跑",
      "Mandarin": "跑",
      "Hindi": "दौड़ रहा हूँ"
    },
    "category": "grammar"
  },
  {
    "id": "d-word-21",
    "word": "Reading",
    "partOfSpeech": "noun",
    "phonetic": "REE-ding",
    "emoji": "📚",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I am reading a book.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "വായിക്കുന്നു",
      "Chinese": "阅读",
      "Mandarin": "阅读",
      "Hindi": "पढ़ रहा हूँ"
    },
    "category": "grammar"
  },
  {
    "id": "d-word-22",
    "word": "Went",
    "partOfSpeech": "noun",
    "phonetic": "went",
    "emoji": "🚶",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I went home.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "പോയി",
      "Chinese": "去了",
      "Mandarin": "去了",
      "Hindi": "गया"
    },
    "category": "grammar"
  },
  {
    "id": "d-word-23",
    "word": "Ate",
    "partOfSpeech": "noun",
    "phonetic": "ayt",
    "emoji": "🍎",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "He ate lunch.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "കഴിച്ചു",
      "Chinese": "吃了",
      "Mandarin": "吃了",
      "Hindi": "खाया"
    },
    "category": "grammar"
  },
  {
    "id": "d-word-24",
    "word": "Saw",
    "partOfSpeech": "noun",
    "phonetic": "saw",
    "emoji": "👁️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "We saw a movie.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "കണ്ടു",
      "Chinese": "看见",
      "Mandarin": "看见",
      "Hindi": "देखा"
    },
    "category": "grammar"
  },
  {
    "id": "d-word-25",
    "word": "Will",
    "partOfSpeech": "noun",
    "phonetic": "wil",
    "emoji": "🔮",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I will go.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ചെയ്യും",
      "Chinese": "将",
      "Mandarin": "将",
      "Hindi": "करूँगा"
    },
    "category": "grammar"
  },
  {
    "id": "d-word-26",
    "word": "Tomorrow",
    "partOfSpeech": "noun",
    "phonetic": "tuh-MOR-oh",
    "emoji": "📅",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "See you tomorrow.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "നാളെ",
      "Chinese": "明天",
      "Mandarin": "明天",
      "Hindi": "कल"
    },
    "category": "grammar"
  },
  {
    "id": "d-word-27",
    "word": "Soon",
    "partOfSpeech": "noun",
    "phonetic": "soon",
    "emoji": "⏳",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "It will happen soon.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഉടൻ",
      "Chinese": "很快",
      "Mandarin": "很快",
      "Hindi": "जल्द ही"
    },
    "category": "grammar"
  },
  {
    "id": "d-word-28",
    "word": "Luggage",
    "partOfSpeech": "noun",
    "phonetic": "LUG-ij",
    "emoji": "🧳",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Where is my luggage?",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ലഗേജ്",
      "Chinese": "行李",
      "Mandarin": "行李",
      "Hindi": "सामान"
    },
    "category": "speaking"
  },
  {
    "id": "d-word-29",
    "word": "Boarding Pass",
    "partOfSpeech": "noun",
    "phonetic": "BOR-ding pas",
    "emoji": "🎫",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Show your boarding pass.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ബോർഡിംഗ് പാസ്",
      "Chinese": "登机牌",
      "Mandarin": "登机牌",
      "Hindi": "बोर्डिंग पास"
    },
    "category": "speaking"
  },
  {
    "id": "d-word-30",
    "word": "Flight",
    "partOfSpeech": "noun",
    "phonetic": "flyt",
    "emoji": "✈️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "My flight is delayed.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഫ്ലൈറ്റ്",
      "Chinese": "航班",
      "Mandarin": "航班",
      "Hindi": "उड़ान"
    },
    "category": "speaking"
  },
  {
    "id": "d-word-31",
    "word": "Reservation",
    "partOfSpeech": "noun",
    "phonetic": "rez-er-VAY-shun",
    "emoji": "🛎️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I have a reservation.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "റിസർവേഷൻ",
      "Chinese": "预订",
      "Mandarin": "预订",
      "Hindi": "आरक्षण"
    },
    "category": "speaking"
  },
  {
    "id": "d-word-32",
    "word": "Key",
    "partOfSpeech": "noun",
    "phonetic": "kee",
    "emoji": "🔑",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Here is your room key.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "താക്കോൽ",
      "Chinese": "钥匙",
      "Mandarin": "钥匙",
      "Hindi": "चाबी"
    },
    "category": "speaking"
  },
  {
    "id": "d-word-33",
    "word": "Checkout",
    "partOfSpeech": "noun",
    "phonetic": "CHEK-owt",
    "emoji": "🚪",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Checkout is at noon.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ചെക്കൗട്ട്",
      "Chinese": "退房",
      "Mandarin": "退房",
      "Hindi": "चेकआउट"
    },
    "category": "speaking"
  },
  {
    "id": "d-word-34",
    "word": "Straight",
    "partOfSpeech": "noun",
    "phonetic": "strayt",
    "emoji": "⬆️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Go straight ahead.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "നേരെ",
      "Chinese": "直走",
      "Mandarin": "直走",
      "Hindi": "सीधे"
    },
    "category": "speaking"
  },
  {
    "id": "d-word-35",
    "word": "Left",
    "partOfSpeech": "noun",
    "phonetic": "left",
    "emoji": "⬅️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Turn left here.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഇടത്തോട്ട്",
      "Chinese": "左",
      "Mandarin": "左",
      "Hindi": "बाएं"
    },
    "category": "speaking"
  },
  {
    "id": "d-word-36",
    "word": "Right",
    "partOfSpeech": "noun",
    "phonetic": "ryt",
    "emoji": "➡️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Turn right at the light.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "വലത്തോട്ട്",
      "Chinese": "右",
      "Mandarin": "右",
      "Hindi": "दाएं"
    },
    "category": "speaking"
  },
  {
    "id": "d-word-37",
    "word": "Deadline",
    "partOfSpeech": "noun",
    "phonetic": "DED-lyn",
    "emoji": "⏰",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "We must meet the deadline.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "അവസാന തീയതി",
      "Chinese": "截止日期",
      "Mandarin": "截止日期",
      "Hindi": "अंतिम तिथि"
    },
    "category": "business"
  },
  {
    "id": "d-word-38",
    "word": "Strategy",
    "partOfSpeech": "noun",
    "phonetic": "STRAT-uh-jee",
    "emoji": "📈",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "A good strategy wins.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "തന്ത്രം",
      "Chinese": "策略",
      "Mandarin": "策略",
      "Hindi": "रणनीति"
    },
    "category": "business"
  },
  {
    "id": "d-word-39",
    "word": "Agenda",
    "partOfSpeech": "noun",
    "phonetic": "uh-JEN-duh",
    "emoji": "📋",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "What is on the agenda?",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "അജണ്ട",
      "Chinese": "议程",
      "Mandarin": "议程",
      "Hindi": "कार्यसूची"
    },
    "category": "business"
  },
  {
    "id": "d-word-40",
    "word": "Attach",
    "partOfSpeech": "noun",
    "phonetic": "uh-TACH",
    "emoji": "📎",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Please attach the file.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "അറ്റാച്ചുചെയ്യുക",
      "Chinese": "附加",
      "Mandarin": "附加",
      "Hindi": "जोड़ें"
    },
    "category": "business"
  },
  {
    "id": "d-word-41",
    "word": "Forward",
    "partOfSpeech": "noun",
    "phonetic": "FOR-werd",
    "emoji": "🔄",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I will forward the email.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഫോർവേഡ് ചെയ്യുക",
      "Chinese": "转发",
      "Mandarin": "转发",
      "Hindi": "अग्रेषित"
    },
    "category": "business"
  },
  {
    "id": "d-word-42",
    "word": "Regards",
    "partOfSpeech": "noun",
    "phonetic": "rih-GAHRDZ",
    "emoji": "✒️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Best regards.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ആദരവോടെ",
      "Chinese": "问候",
      "Mandarin": "问候",
      "Hindi": "सादर"
    },
    "category": "business"
  },
  {
    "id": "d-word-43",
    "word": "Compromise",
    "partOfSpeech": "noun",
    "phonetic": "KOM-pruh-myz",
    "emoji": "🤝",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "We reached a compromise.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "വിട്ടുവീഴ്ച",
      "Chinese": "妥协",
      "Mandarin": "妥协",
      "Hindi": "समझौता"
    },
    "category": "business"
  },
  {
    "id": "d-word-44",
    "word": "Proposal",
    "partOfSpeech": "noun",
    "phonetic": "pruh-POH-zul",
    "emoji": "📄",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Review the proposal.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "നിർദ്ദേശം",
      "Chinese": "提议",
      "Mandarin": "提议",
      "Hindi": "प्रस्ताव"
    },
    "category": "business"
  },
  {
    "id": "d-word-45",
    "word": "Contract",
    "partOfSpeech": "noun",
    "phonetic": "KON-trakt",
    "emoji": "🖋️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Sign the contract.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "കരാർ",
      "Chinese": "合同",
      "Mandarin": "合同",
      "Hindi": "अनुबंध"
    },
    "category": "business"
  },
  {
    "id": "d-word-46",
    "word": "Piece of cake",
    "partOfSpeech": "noun",
    "phonetic": "pees ov kayk",
    "emoji": "🍰",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "The test was a piece of cake.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "വളരെ എളുപ്പമുള്ള",
      "Chinese": "小菜一碟",
      "Mandarin": "小菜一碟",
      "Hindi": "बहुत आसान"
    },
    "category": "expert"
  },
  {
    "id": "d-word-47",
    "word": "Under the weather",
    "partOfSpeech": "noun",
    "phonetic": "UN-der the WETH-er",
    "emoji": "🤒",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I feel under the weather.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "സുഖമില്ലാത്ത",
      "Chinese": "身体不适",
      "Mandarin": "身体不适",
      "Hindi": "अस्वस्थ"
    },
    "category": "expert"
  },
  {
    "id": "d-word-48",
    "word": "Break the ice",
    "partOfSpeech": "noun",
    "phonetic": "brayk the ays",
    "emoji": "🧊",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Tell a joke to break the ice.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "തുടക്കമിടുക",
      "Chinese": "打破僵局",
      "Mandarin": "打破僵局",
      "Hindi": "शुरुआत करना"
    },
    "category": "expert"
  },
  {
    "id": "d-word-49",
    "word": "Ubiquitous",
    "partOfSpeech": "noun",
    "phonetic": "yoo-BIK-wih-tus",
    "emoji": "🌍",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Smartphones are ubiquitous.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "സർവ്വവ്യാപിയായ",
      "Chinese": "无处不在的",
      "Mandarin": "无处不在的",
      "Hindi": "सर्वव्यापी"
    },
    "category": "expert"
  },
  {
    "id": "d-word-50",
    "word": "Ephemeral",
    "partOfSpeech": "noun",
    "phonetic": "ih-FEM-er-ul",
    "emoji": "⏳",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Fame is ephemeral.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ക്ഷണികമായ",
      "Chinese": "短暂的",
      "Mandarin": "短暂的",
      "Hindi": "अल्पकालिक"
    },
    "category": "expert"
  },
  {
    "id": "d-word-51",
    "word": "Eloquent",
    "partOfSpeech": "noun",
    "phonetic": "EL-uh-kwunt",
    "emoji": "🗣️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "She gave an eloquent speech.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "വാചാലനായ",
      "Chinese": "雄辩的",
      "Mandarin": "雄辩的",
      "Hindi": "सुवक्ता"
    },
    "category": "expert"
  },
  {
    "id": "d-word-52",
    "word": "Give up",
    "partOfSpeech": "noun",
    "phonetic": "giv up",
    "emoji": "🏳️",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Never give up your dreams.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "ഉപേക്ഷിക്കുക",
      "Chinese": "放弃",
      "Mandarin": "放弃",
      "Hindi": "हार मानना"
    },
    "category": "expert"
  },
  {
    "id": "d-word-53",
    "word": "Put off",
    "partOfSpeech": "noun",
    "phonetic": "put of",
    "emoji": "📅",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "Do not put off your work.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "മാറ്റിവെക്കുക",
      "Chinese": "推迟",
      "Mandarin": "推迟",
      "Hindi": "टालना"
    },
    "category": "expert"
  },
  {
    "id": "d-word-54",
    "word": "Look into",
    "partOfSpeech": "noun",
    "phonetic": "luk IN-too",
    "emoji": "🔍",
    "simpleDefinition": "A core vocabulary word.",
    "exampleSentence": "I will look into the matter.",
    "exampleTranslation": "Translated example.",
    "translations": {
      "Malayalam": "അന്വേഷിക്കുക",
      "Chinese": "调查",
      "Mandarin": "调查",
      "Hindi": "जांच करना"
    },
    "category": "expert"
  }
];

export function searchDictionary(query: string): DictionaryEntry[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return DICTIONARY_DATA.filter((w) => w.word.toLowerCase().includes(q));
}
