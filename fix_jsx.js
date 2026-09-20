const fs = require('fs');
let content = fs.readFileSync('src/app/learn/page.tsx', 'utf-8');

// Replace literal \` with `
content = content.replace(/\\`/g, '`');
// Replace literal \$ with $
content = content.replace(/\\\$/g, '$');

fs.writeFileSync('src/app/learn/page.tsx', content);
