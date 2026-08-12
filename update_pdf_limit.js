const fs = require('fs');

let code = fs.readFileSync('src/app/pusda/page.tsx', 'utf8');

const targetFunc = `  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoFile(e.target.files[0]);
    }
  };`;
  
const replacementFunc = `  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoFile(e.target.files[0]);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size > 4 * 1024 * 1024) {
        alert('Gagal: Ukuran file PDF maksimal adalah 4 MB. Silakan kompres PDF Anda terlebih dahulu.');
        e.target.value = '';
        setter(null);
        return;
      }
      setter(file);
    }
  };`;

code = code.replace(targetFunc, replacementFunc);
code = code.replace('onChange={(e) => e.target.files && setKkFile(e.target.files[0])}', 'onChange={(e) => handleDocumentChange(e, setKkFile)}');
code = code.replace('onChange={(e) => e.target.files && setAkteFile(e.target.files[0])}', 'onChange={(e) => handleDocumentChange(e, setAkteFile)}');
code = code.replace('onChange={(e) => e.target.files && setIjazahFile(e.target.files[0])}', 'onChange={(e) => handleDocumentChange(e, setIjazahFile)}');
code = code.replace('onChange={(e) => e.target.files && setSktmFile(e.target.files[0])}', 'onChange={(e) => handleDocumentChange(e, setSktmFile)}');

fs.writeFileSync('src/app/pusda/page.tsx', code);
console.log('PUSDA updated:', code.includes('handleDocumentChange'));

// DO THE SAME FOR ADMIN PAGE IF IT HAS MANUAL UPLOADS

let adminCode = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

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

adminCode = adminCode.replace(targetAdminFunc, replacementAdminFunc);
adminCode = adminCode.replace(`onChange={(e) => e.target.files && setAddPusatDataFiles({ ...addPusatDataFiles, kk: e.target.files[0] })}`, `onChange={(e) => handleAdminDocumentChange(e, 'kk')}`);
adminCode = adminCode.replace(`onChange={(e) => e.target.files && setAddPusatDataFiles({ ...addPusatDataFiles, akte: e.target.files[0] })}`, `onChange={(e) => handleAdminDocumentChange(e, 'akte')}`);
adminCode = adminCode.replace(`onChange={(e) => e.target.files && setAddPusatDataFiles({ ...addPusatDataFiles, ijazah: e.target.files[0] })}`, `onChange={(e) => handleAdminDocumentChange(e, 'ijazah')}`);
adminCode = adminCode.replace(`onChange={(e) => e.target.files && setAddPusatDataFiles({ ...addPusatDataFiles, sktm: e.target.files[0] })}`, `onChange={(e) => handleAdminDocumentChange(e, 'sktm')}`);

fs.writeFileSync('src/app/admin/page.tsx', adminCode);
console.log('Admin updated:', adminCode.includes('handleAdminDocumentChange'));
