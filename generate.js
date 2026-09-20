const fs = require('fs');

const vocab = [
    // BEGINNER
    ['hello', 'heh-LOH', 'greeting', 'A word used to greet someone.', 'Hello, how are you?', 'നമസ്കാരം', '你好', 'नमस्ते', 'Hola', 'BEGINNER'],
    ['water', 'WAH-ter', 'noun', 'A clear liquid we drink.', 'I need some water.', 'വെള്ളം', '水', 'पानी', 'Agua', 'BEGINNER'],
    ['food', 'food', 'noun', 'What we eat to live.', 'The food is delicious.', 'ഭക്ഷണം', '食物', 'खाना', 'Comida', 'BEGINNER'],
    ['home', 'hohm', 'noun', 'The place where you live.', 'I am going home.', 'വീട്', '家', 'घर', 'Casa', 'BEGINNER'],
    ['school', 'skool', 'noun', 'A place for learning.', 'The kids are at school.', 'സ്കൂൾ', '学校', 'स्कूल', 'Escuela', 'BEGINNER'],
    ['friend', 'frend', 'noun', 'A person you like and trust.', 'She is my best friend.', 'സുഹൃത്ത്', '朋友', 'दोस्त', 'Amigo', 'BEGINNER'],
    ['family', 'FAM-ih-lee', 'noun', 'Parents and children.', 'My family is big.', 'കുടുംബം', '家庭', 'परिवार', 'Familia', 'BEGINNER'],
    ['work', 'wurk', 'noun', 'A job or task.', 'I have a lot of work.', 'ജോലി', '工作', 'काम', 'Trabajo', 'BEGINNER'],
    ['eat', 'eet', 'verb', 'To consume food.', 'Let\'s eat dinner.', 'കഴിക്കുക', '吃', 'खाना', 'Comer', 'BEGINNER'],
    ['drink', 'dringk', 'verb', 'To consume liquid.', 'Drink more water.', 'കുടിക്കുക', '喝', 'पीना', 'Beber', 'BEGINNER'],
    ['go', 'goh', 'verb', 'To move to a place.', 'I have to go now.', 'പോകുക', '去', 'जाना', 'Ir', 'BEGINNER'],
    ['help', 'help', 'verb', 'To assist someone.', 'Can you help me?', 'സഹായിക്കുക', '帮助', 'मदद', 'Ayuda', 'BEGINNER'],
    ['today', 'tuh-DAY', 'noun', 'This current day.', 'Today is Monday.', 'ഇന്ന്', '今天', 'आज', 'Hoy', 'BEGINNER'],
    ['tomorrow', 'tuh-MOR-oh', 'noun', 'The day after today.', 'See you tomorrow.', 'നാളെ', '明天', 'कल', 'Mañana', 'BEGINNER'],
    
    // INTERMEDIATE
    ['communicate', 'kuh-MYOO-nih-kayt', 'verb', 'To share information.', 'We need to communicate better.', 'ആശയവിനിമയം നടത്തുക', '沟通', 'संवाद करना', 'Comunicar', 'INTERMEDIATE'],
    ['improve', 'im-PROOV', 'verb', 'To make something better.', 'I want to improve my English.', 'മെച്ചപ്പെടുത്തുക', '改善', 'सुधारना', 'Mejorar', 'INTERMEDIATE'],
    ['experience', 'ik-SPEER-ee-ens', 'noun', 'Knowledge gained by doing.', 'She has a lot of experience.', 'അനുഭവം', '经验', 'अनुभव', 'Experiencia', 'INTERMEDIATE'],
    ['opportunity', 'op-er-TOO-nih-tee', 'noun', 'A chance to do something.', 'This is a great opportunity.', 'അവസരം', '机会', 'अवसर', 'Oportunidad', 'INTERMEDIATE'],
    ['decision', 'dih-SIZH-un', 'noun', 'A choice made after thinking.', 'It was a difficult decision.', 'തീരുമാനം', '决定', 'निर्णय', 'Decisión', 'INTERMEDIATE'],
    ['environment', 'en-VY-run-ment', 'noun', 'The surroundings or conditions.', 'A healthy work environment.', 'പരിസ്ഥിതി', '环境', 'पर्यावरण', 'Entorno', 'INTERMEDIATE'],
    ['responsibility', 'rih-spon-suh-BIL-ih-tee', 'noun', 'A duty to deal with something.', 'It is my responsibility.', 'ഉത്തരവാദിത്തം', '责任', 'ज़िम्मेदारी', 'Responsabilidad', 'INTERMEDIATE'],
    
    // ADVANCED
    ['consequently', 'KON-suh-kwent-lee', 'adverb', 'As a result.', 'It rained heavily; consequently, the game was canceled.', 'തൽഫലമായി', '因此', 'फलस्वरूप', 'En consecuencia', 'ADVANCED'],
    ['substantial', 'sub-STAN-shul', 'adjective', 'Large in amount or importance.', 'A substantial amount of money.', 'ഗണ്യമായ', '大量的', 'पर्याप्त', 'Sustancial', 'ADVANCED'],
    ['interpret', 'in-TUR-prit', 'verb', 'To explain or understand the meaning.', 'How do you interpret this data?', 'വ്യാഖ്യാനിക്കുക', '解释', 'व्याख्या करना', 'Interpretar', 'ADVANCED'],
    ['demonstrate', 'DEM-un-strayt', 'verb', 'To show clearly.', 'Let me demonstrate how it works.', 'പ്രദർശിപ്പിക്കുക', '证明', 'प्रदर्शित करना', 'Demostrar', 'ADVANCED'],
    ['facilitate', 'fuh-SIL-ih-tayt', 'verb', 'To make an action easier.', 'The new software will facilitate the process.', 'സുഗമമാക്കുക', '促进', 'सुविधाजनक बनाना', 'Facilitar', 'ADVANCED'],
    ['perspective', 'per-SPEK-tiv', 'noun', 'A particular way of considering something.', 'From my perspective, it\'s a good idea.', 'കാഴ്ചപ്പാട്', '观点', 'दृष्टिकोण', 'Perspectiva', 'ADVANCED'],
    ['acquire', 'uh-KWY-er', 'verb', 'To get or obtain something.', 'He managed to acquire the rare book.', 'നേടുക', '获得', 'प्राप्त करना', 'Adquirir', 'ADVANCED'],
    
    // PROFESSIONAL
    ['negotiate', 'nih-GOH-shee-ayt', 'verb', 'To discuss in order to reach an agreement.', 'We need to negotiate the contract.', 'ചർച്ച ചെയ്യുക', '谈判', 'बातचीत करना', 'Negociar', 'PROFESSIONAL'],
    ['proposal', 'pruh-POH-zul', 'noun', 'A formal plan or suggestion.', 'The board accepted our proposal.', 'നിർദ്ദേശം', '提议', 'प्रस्ताव', 'Propuesta', 'PROFESSIONAL'],
    ['strategy', 'STRAT-uh-jee', 'noun', 'A plan of action to achieve a goal.', 'Our marketing strategy is effective.', 'തന്ത്രം', '战略', 'रणनीति', 'Estrategia', 'PROFESSIONAL'],
    ['stakeholder', 'STAYK-hohl-der', 'noun', 'A person with an interest in a business.', 'We must update all stakeholders.', 'പങ്കാളി', '利益相关者', 'हितधारक', 'Parte interesada', 'PROFESSIONAL'],
    ['revenue', 'REV-uh-noo', 'noun', 'Income a company receives.', 'Company revenue increased by 20%.', 'വരുമാനം', '收入', 'राजस्व', 'Ingresos', 'PROFESSIONAL'],
    ['deadline', 'DED-lyn', 'noun', 'The time by which something must be finished.', 'We cannot miss this deadline.', 'സമയപരിധി', '截止日期', 'समयसीमा', 'Fecha límite', 'PROFESSIONAL'],
    ['collaboration', 'kuh-lab-uh-RAY-shun', 'noun', 'Working together to create something.', 'Thanks for your collaboration.', 'സഹകരണം', '合作', 'सहयोग', 'Colaboración', 'PROFESSIONAL']
];

let output = `export interface DictionaryEntry {
  id: string;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  simpleDefinition: string;
  exampleSentence: string;
  translations: Record<string, string>;
  level: string;
}

export const DICTIONARY_DATA: DictionaryEntry[] = [\n`;

vocab.forEach((v, i) => {
    output += `  {
    id: "d-word-${i+1}",
    word: "${v[0]}",
    partOfSpeech: "${v[2]}",
    phonetic: "${v[1]}",
    simpleDefinition: "${v[3]}",
    exampleSentence: "${v[4]}",
    translations: {
      "Malayalam": "${v[5]}",
      "Chinese": "${v[6]}",
      "Hindi": "${v[7]}",
      "Spanish": "${v[8]}",
      "English": "${v[0]}"
    },
    level: "${v[9]}"
  },\n`;
});

output += `];\n\nexport function searchDictionary(query: string): DictionaryEntry[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return DICTIONARY_DATA.filter((w) => w.word.toLowerCase().includes(q));
}\n`;

fs.writeFileSync('src/data/dictionary.ts', output);
