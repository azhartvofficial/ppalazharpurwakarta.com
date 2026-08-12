const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const targetAdminFunc = `  const handleAddPusatDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {`;

const replacementAdminFunc = `  const handleAdminDocumentChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'pas_foto'|'kk'|'akte'|'ijazah'|'sktm') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size > 4 * 1024 * 1024) {
        alert('Gagal: Ukuran file PDF maksimal adalah 4 MB. Silakan kompres PDF Anda terlebih dahulu.');
        e.target.value = '';
        setAddPusatDataFiles(prev => ({ ...prev, [fileType]: null }));
        return;
      }
      setAddPusatDataFiles(prev => ({ ...prev, [fileType]: file }));
    }
  };

  const handleAddPusatDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {`;

code = code.replace(targetAdminFunc, replacementAdminFunc);

code = code.replace(/onChange=\{\(e\) => e\.target\.files && setAddPusatDataFiles\(\{ \.\.\.addPusatDataFiles, kk: e\.target\.files\[0\] \}\)\}/g, `onChange={(e) => handleAdminDocumentChange(e, 'kk')}`);
code = code.replace(/onChange=\{\(e\) => e\.target\.files && setAddPusatDataFiles\(\{ \.\.\.addPusatDataFiles, akte: e\.target\.files\[0\] \}\)\}/g, `onChange={(e) => handleAdminDocumentChange(e, 'akte')}`);
code = code.replace(/onChange=\{\(e\) => e\.target\.files && setAddPusatDataFiles\(\{ \.\.\.addPusatDataFiles, ijazah: e\.target\.files\[0\] \}\)\}/g, `onChange={(e) => handleAdminDocumentChange(e, 'ijazah')}`);
code = code.replace(/onChange=\{\(e\) => e\.target\.files && setAddPusatDataFiles\(\{ \.\.\.addPusatDataFiles, sktm: e\.target\.files\[0\] \}\)\}/g, `onChange={(e) => handleAdminDocumentChange(e, 'sktm')}`);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Admin updated:', code.includes('handleAdminDocumentChange'));
