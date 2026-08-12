const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search = `<span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>Kelas {selectedPusatData.kelas}</span>`;
const replace = `<span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>Kelas {selectedPusatData.kelas} ( {parseInt(selectedPusatData.kelas) >= 10 ? 'Madrasah Aliyah' : 'Madrasah Tsanawiyah'} )</span>`;

if (code.includes(search)) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/app/admin/page.tsx', code);
  console.log('Class format updated');
} else {
  console.log('Search string not found');
}
