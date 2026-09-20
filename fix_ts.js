const fs = require('fs');

let page = fs.readFileSync('src/app/learn/page.tsx', 'utf-8');
page = page.replace('<AppShell>', '<AppShell user={user}>');
fs.writeFileSync('src/app/learn/page.tsx', page);

let lessons = fs.readFileSync('src/data/lessons.ts', 'utf-8');
lessons = lessons.replace(/"l":/g, '"left":');
lessons = lessons.replace(/"r":/g, '"right":');
fs.writeFileSync('src/data/lessons.ts', lessons);
