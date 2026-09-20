const fs = require('fs');
let content = fs.readFileSync('src/lib/ai.ts', 'utf-8');

const grammarStart = content.indexOf('// Comprehensive grammar mistake detector');
const geminiStart = content.indexOf('const geminiKey =');

if (grammarStart !== -1 && geminiStart !== -1) {
  content = content.substring(0, grammarStart) + 'let detectedCorrection = undefined;\n    ' + content.substring(geminiStart);
  fs.writeFileSync('src/lib/ai.ts', content);
  console.log("Cleaned logic successfully");
} else {
  console.log("Could not find boundaries");
}
