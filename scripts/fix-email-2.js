const fs = require('fs');
let c = fs.readFileSync('src/lib/email.ts', 'utf8');
const searchStr = 'const verificationLink = \\/verify-email?token=\\;';
const replaceStr = 'const verificationLink = \\/api/auth/verify-email?token=\\;';
c = c.replace(searchStr, replaceStr);
fs.writeFileSync('src/lib/email.ts', c);
