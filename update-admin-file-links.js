const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const fields = [
  { 
    search: `<div><label>Pas Foto {isEditingPusatData ? '(Opsional)' : '*'}</label><input type="file" required={!isEditingPusatData} accept="image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, pas_foto: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>`, 
    linkVar: 'pas_foto',
    linkLabel: 'Lihat Pas Foto Saat Ini'
  },
  { 
    search: `<div><label>Kartu Keluarga (KK) {isEditingPusatData ? '(Opsional)' : '*'}</label><input type="file" required={!isEditingPusatData} accept=".pdf,image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, kk: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>`, 
    linkVar: 'kk_url',
    linkLabel: 'Lihat KK Saat Ini'
  },
  { 
    search: `<div><label>Akte Kelahiran</label><input type="file" accept=".pdf,image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, akte: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>`, 
    linkVar: 'akte_url',
    linkLabel: 'Lihat Akte Saat Ini'
  },
  { 
    search: `<div><label>Ijazah Terakhir</label><input type="file" accept=".pdf,image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, ijazah: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>`, 
    linkVar: 'ijazah_url',
    linkLabel: 'Lihat Ijazah Saat Ini'
  },
  { 
    search: `<div><label>SKTM (Bila Ada)</label><input type="file" accept=".pdf,image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, sktm: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>`, 
    linkVar: 'sktm_url',
    linkLabel: 'Lihat SKTM Saat Ini'
  }
];

fields.forEach(f => {
  const replaceStr = `<div>
    ${f.search.replace('<div>', '').replace('</div>', '')}
    {isEditingPusatData && addPusatDataExistingFiles.${f.linkVar} && (
      <div style={{ marginTop: '8px' }}>
        <a href={addPusatDataExistingFiles.${f.linkVar}} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>${f.linkLabel}</a>
      </div>
    )}
  </div>`;
  code = code.replace(f.search, replaceStr);
});

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('File links updated');
