const fs = require('fs');
let content = fs.readFileSync('src/app/words/page.tsx', 'utf-8');

content = content.replace(/w\.category\.toLowerCase\(\)/g, 'w.level.toLowerCase()');
content = content.replace(/const cat = item\.category\.toUpperCase\(\);/g, 'const cat = item.level.toUpperCase();');
content = content.replace(/\{item\.emoji\}/g, '');
content = content.replace(/\{item\.exampleTranslation\}/g, '{item.translations[user?.preferredLanguage || "English"]}');
content = content.replace(/Category: \{item\.category\}/g, 'Level: {item.level}');

fs.writeFileSync('src/app/words/page.tsx', content);
