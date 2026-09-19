const fs = require('fs');
let c = fs.readFileSync('src/lib/email.ts', 'utf8');

c = c.replace(
  /export async function sendVerificationEmail\(email: string, name: string, token: string\) \{/,
  'export async function sendVerificationEmail(email: string, name: string, token: string, customBaseUrl?: string) {'
);
c = c.replace(
  /const appUrl = getAppBaseUrl\(\);/,
  'const appUrl = customBaseUrl || getAppBaseUrl();'
);

c = c.replace(
  /export async function sendPasswordResetEmail\(email: string, name: string, token: string\) \{/,
  'export async function sendPasswordResetEmail(email: string, name: string, token: string, customBaseUrl?: string) {'
);
c = c.replace(
  /const appUrl = getAppBaseUrl\(\);/,
  'const appUrl = customBaseUrl || getAppBaseUrl();'
);

fs.writeFileSync('src/lib/email.ts', c);
