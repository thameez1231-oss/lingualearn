const fs = require('fs');
let c = fs.readFileSync('src/lib/email.ts', 'utf8');

c = c.replace(
  /const verificationLink = \\$\{appUrl\}\/verify-email\?token=\$\{token\}\;/,
  'const verificationLink = \\$\{appUrl\}/api/auth/verify-email?token=\$\{token\}\;'
);

fs.writeFileSync('src/lib/email.ts', c);
