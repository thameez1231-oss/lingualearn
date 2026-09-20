const fs = require('fs');

const replacement = `export async function chatWithAITutor(
  userMessage: string,
  userLanguage: string = 'English',
  englishLevel: string = 'COMPLETE_BEGINNER',
  history: { role: 'user' | 'assistant'; text: string }[] = []
): Promise<TutorResponse> {
  const trimmed = userMessage.trim();
  const userLangCode = getLanguageCode(userLanguage);
  
  const isNativeScript = !/^[a-zA-Z0-9\\s.,!?'"-]+$/.test(trimmed);
  let isEnglishAttempt = !isNativeScript;
  
  let detectedCorrection: GrammarCorrection | undefined = undefined;

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-flash-latest',
    ];
    for (const model of candidateModels) {
      try {
        const conversationContext = history
          .slice(-8)
          .map((h) => \`\${h.role === 'user' ? 'Learner' : 'Coach Maya'}: \${h.text}\`)
          .join('\\n');

        const prompt = \`You are Coach Maya, an encouraging, incredibly smart, empathetic, and professional English teacher for LinguaLearn.
Learner's Native Language: \${userLanguage}
Learner's English Proficiency: \${englishLevel}

Conversation History:
\${conversationContext || 'No previous conversation yet.'}

Learner's Latest Message: "\${trimmed}"

PEDAGOGICAL & CONVERSATIONAL RULES:
1. ADAPTIVE INTELLIGENCE:
   - The learner may write in English, their native script (\${userLanguage}), OR transliterated/romanized \${userLanguage} (e.g., Manglish for Malayalam, Pinyin for Chinese, Hinglish for Hindi). 
   - Accurately understand their true intent, even if heavily transliterated. Do NOT get confused by transliterations.

2. TEACHER BEHAVIOR:
   - Act as a real, professional English tutor.
   - For BEGINNER levels: Explain concepts extremely simply. Do not overwhelm them.
   - For ADVANCED/PROFESSIONAL levels: Use more sophisticated vocabulary and focus on nuance, idioms, or professional context.
   - If the user wrote in \${userLanguage} or transliteration, validate their thought warmly, translate it mentally, and teach them how to naturally express that specific thought in English.
   
3. SMART CORRECTIONS:
   - ONLY provide a "correction" object if the user made an English grammatical, word-choice, or tense error.
   - NEVER correct their \${userLanguage} or transliterated messages. If they write in their native language, set "correction": null.
   - If you correct them, explicitly explain WHY they were wrong in the "explanation" field.

4. LANGUAGE ISOLATION (CRITICAL):
   - ONLY use English and \${userLanguage}. 
   - NEVER use any other language. NEVER assume they speak Malayalam unless \${userLanguage} is Malayalam.
   - "replyEnglish" is your main teaching response (1-4 natural sentences).
   - "replyNative" is a supportive translation, explanation, or encouragement strictly in \${userLanguage} script.

5. SUGGESTIONS:
   - Provide 3 contextually relevant, natural English sentences the learner can say next to keep the conversation flowing.

Return PURE JSON ONLY with this schema:
{
  "replyEnglish": "your main English teaching reply",
  "replyNative": "helpful translation/encouragement strictly in \${userLanguage}",
  "correction": null or {"original": "the exact mistake", "better": "natural correction", "explanation": "Why this is correct"},
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}\`;

        const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${geminiKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanJsonStr = rawText.replace(/^\\s*\`\`\`(?:json)?\\s*/i, '').replace(/\\s*\`\`\`\\s*$/i, '').trim();
          if (cleanJsonStr) {
            const parsed = JSON.parse(cleanJsonStr);
            return {
              replyEnglish: sanitizeTutorText(parsed.replyEnglish),
              replyNative: sanitizeTutorText(parsed.replyNative),
              correction: parsed.correction ? {
                original: sanitizeTutorText(parsed.correction.original),
                better: sanitizeTutorText(parsed.correction.better),
                explanation: sanitizeTutorText(parsed.correction.explanation)
              } : undefined,
              suggestions: (parsed.suggestions || []).map((s: string) => sanitizeTutorText(s)).slice(0, 3)
            };
          }
        }
      } catch (err) {
        console.warn(\`[AI] \${model} failed, trying next fallback.\`);
      }
    }
  }

  // --- Smart Fallback if Gemini Fails ---
  let englishMeaning = trimmed;
  if (!isEnglishAttempt) {
    const neuralMeaning = await fetchNeuralTranslation(trimmed, userLangCode, 'en');
    if (neuralMeaning) englishMeaning = neuralMeaning;
  }

  const naturalPhrase = naturalizeEnglish(englishMeaning);
  let replyEnglish = \`That is great! A clear way to express this in English is: "\${naturalPhrase}". Try saying it aloud!\`;
  let replyNative = \`Practice saying this naturally in English!\`;

  try {
     const fallbackTranslation = await fetchNeuralTranslation(replyNative, 'en', userLangCode);
     if (fallbackTranslation) replyNative = fallbackTranslation;
  } catch(e) {}

  return {
    replyEnglish: sanitizeTutorText(replyEnglish),
    replyNative: sanitizeTutorText(replyNative),
    correction: undefined,
    suggestions: [naturalPhrase, 'Can you explain that again?', 'What should I say next?'].map(s => sanitizeTutorText(s)),
  };
}
`;

let content = fs.readFileSync('src/lib/ai.ts', 'utf-8');
const searchString = "export async function chatWithAITutor(";
const startIndex = content.indexOf(searchString);

if (startIndex !== -1) {
  content = content.substring(0, startIndex) + replacement;
  fs.writeFileSync('src/lib/ai.ts', content);
  console.log("Successfully replaced chatWithAITutor");
} else {
  console.log("Could not find chatWithAITutor");
}
