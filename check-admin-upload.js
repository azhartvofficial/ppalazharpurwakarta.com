const fs = require('fs');
const lines = fs.readFileSync('src/app/admin/page.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('let pas_foto = "", kk_url = ""'));
console.log(lines.slice(idx, idx + 40).join('\n'));
