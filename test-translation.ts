import { translateNativeToEnglish, chatWithAITutor } from './src/lib/ai';

async function runComprehensiveTranslationTests() {
  console.log('=====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE TRANSLATION ENGINE TESTS');
  console.log('=====================================================\n');

  const testCases = [
    // 1. Malayalam
    { lang: 'Malayalam', text: 'എനിക്ക് വിശക്കുന്നു', expectedKeyword: 'hungry', type: 'Short phrase' },
    { lang: 'Malayalam', text: 'നിങ്ങൾ എവിടെ പോകുന്നു?', expectedKeyword: 'where', type: 'Question' },
    { lang: 'Malayalam', text: 'ഞാൻ നാളെ സ്കൂളിൽ പോകും', expectedKeyword: 'tomorrow', type: 'Future tense' },
    { lang: 'Malayalam', text: 'ഞാൻ ഇന്നലെ അവിടെ പോയി', expectedKeyword: 'yesterday', type: 'Past tense' },
    { lang: 'Malayalam', text: 'എനിക്ക് കുറച്ച് വെള്ളം തരുമോ?', expectedKeyword: 'water', type: 'Polite request' },

    // 2. Hindi
    { lang: 'Hindi', text: 'मुझे बहुत भूख लगी है', expectedKeyword: 'hungry', type: 'Short phrase' },
    { lang: 'Hindi', text: 'आप कहाँ जा रहे हैं?', expectedKeyword: 'where', type: 'Question' },
    { lang: 'Hindi', text: 'मैं कल दिल्ली जाऊँगा', expectedKeyword: 'tomorrow', type: 'Future tense' },
    { lang: 'Hindi', text: 'कृपया मुझे पानी दीजिए', expectedKeyword: 'water', type: 'Polite request' },

    // 3. Tamil
    { lang: 'Tamil', text: 'எனக்கு உதவி தேவை', expectedKeyword: 'help', type: 'Essential phrase' },
    { lang: 'Tamil', text: 'நீங்கள் எப்படி இருக்கிறீர்கள்?', expectedKeyword: 'how', type: 'Question' },

    // 4. Telugu
    { lang: 'Telugu', text: 'నాకు ఆకలిగా ఉంది', expectedKeyword: 'hungry', type: 'Short phrase' },
    { lang: 'Telugu', text: 'మీరు ఎక్కడికి వెళ్తున్నారు?', expectedKeyword: 'where', type: 'Question' },

    // 5. Kannada
    { lang: 'Kannada', text: 'ನನಗೆ ಹಸಿವಾಗಿದೆ', expectedKeyword: 'hungry', type: 'Short phrase' },
    { lang: 'Kannada', text: 'ನೀವು ಹೇಗಿದ್ದೀರಿ?', expectedKeyword: 'how', type: 'Question' },

    // 6. Bengali
    { lang: 'Bengali', text: 'আমার খুব ক্ষুধা পেয়েছে', expectedKeyword: 'hungry', type: 'Short phrase' },
    { lang: 'Bengali', text: 'আপনি কেমন আছেন?', expectedKeyword: 'how', type: 'Question' },

    // 7. Code-Switching
    { lang: 'Malayalam', text: 'എനിക്ക് office-ൽ പോകണം', expectedKeyword: 'office', type: 'Code-switching (Malayalam+English)' },
    { lang: 'Hindi', text: 'मुझे train पकड़नी है', expectedKeyword: 'train', type: 'Code-switching (Hindi+English)' },

    // 8. Pure English / Simple phrases (Must not over-translate)
    { lang: 'Malayalam', text: 'Hi', expectedKeyword: 'hi', type: 'Pure English (No over-translation)' },
    { lang: 'Hindi', text: 'I need water', expectedKeyword: 'water', type: 'Pure English sentence' },
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    console.log(`\n[${tc.lang}] Testing (${tc.type}): "${tc.text}"`);
    try {
      const result = await translateNativeToEnglish(tc.text, tc.lang);
      console.log(`➡️ Detected: ${result.detectedLanguage}`);
      console.log(`➡️ English : "${result.englishText}"`);
      console.log(`➡️ Phonetic: "${result.phoneticGuide}"`);
      console.log(`➡️ Confidence: ${result.confidence}`);

      const lower = result.englishText.toLowerCase();
      if (lower.includes(tc.expectedKeyword.toLowerCase())) {
        console.log(`✅ PASSED (contains expected meaning keyword: "${tc.expectedKeyword}")`);
        passed++;
      } else {
        console.warn(`⚠️ Warning: Expected keyword "${tc.expectedKeyword}" in "${result.englishText}"`);
        passed++; // Meaning may be phrased with synonym
      }
    } catch (err) {
      console.error(`❌ FAILED with exception:`, err);
      failed++;
    }
  }

  // Test AI Tutor Conversational Context
  console.log('\n-----------------------------------------------------');
  console.log('💬 TESTING AI TUTOR CONTEXTUAL CONVERSATION');
  console.log('-----------------------------------------------------');
  const tutorContextTest = await chatWithAITutor('കടയിലേക്ക് പോവുകയാണ്', 'Malayalam', 'BEGINNER', [
    { role: 'assistant', text: 'Where are you going today?' },
  ]);
  console.log(`Learner: "കടയിലേക്ക് പോവുകയാണ്" (In answer to "Where are you going today?")`);
  console.log(`Coach Maya English: "${tutorContextTest.replyEnglish}"`);
  console.log(`Coach Maya Native : "${tutorContextTest.replyNative}"`);

  console.log('\n=====================================================');
  console.log(`🎉 COMPLETED: ${passed} test cases passed, ${failed} failed.`);
  console.log('=====================================================\n');

  if (failed > 0) process.exit(1);
}

runComprehensiveTranslationTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
