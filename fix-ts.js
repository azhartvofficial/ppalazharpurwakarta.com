const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const regex = /alamatObj\.is_revised = true;/g;
const replace = `(alamatObj as any).is_revised = true;`;

code = code.replace(regex, replace);
fs.writeFileSync('src/app/admin/page.tsx', code);
