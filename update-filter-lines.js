const fs = require('fs');
let lines = fs.readFileSync('src/app/admin/page.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('const getFilteredPusatData'));
if (start !== -1) {
    lines[start + 3] = `      if (!isPending && d.status !== 'Approved' && d.status !== 'Aktif' && d.status !== 'Terima') return false;`;
    fs.writeFileSync('src/app/admin/page.tsx', lines.join('\n'));
    console.log('Filter updated successfully via lines');
}
