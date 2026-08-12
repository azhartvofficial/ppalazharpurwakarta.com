const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
const searchString = `              <button onClick={() => setSelectedPusatData(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>?</button>`;
const replaceString = `              <button onClick={() => setSelectedPusatData(null)} style={{ background: '#fee2e2', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', color: '#991b1b', padding: '0.4rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>? Tutup</button>`;

if (code.includes(searchString)) {
    code = code.replace(searchString, replaceString);
    fs.writeFileSync('src/app/admin/page.tsx', code);
    console.log('Successfully replaced the close button!');
} else {
    console.log('Search string not found in admin/page.tsx');
}
