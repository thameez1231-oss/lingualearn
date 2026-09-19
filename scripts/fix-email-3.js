const fs = require('fs');
let c = fs.readFileSync('src/lib/email.ts', 'utf8');
c = c.replace(
  /\$\{appUrl\}\/verify-email\?token=\$\{token\}/g,
  '\$\{appUrl\}/api/auth/verify-email?token=\$\{token\}'
);
fs.writeFileSync('src/lib/email.ts', c);
