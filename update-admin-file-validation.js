const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search1 = `if (!addPusatDataFiles.pas_foto) { openAlert("Pas foto wajib diunggah."); return; }`;
const replace1 = `if (!isEditingPusatData && !addPusatDataFiles.pas_foto) { openAlert("Pas foto wajib diunggah."); return; }`;

const search2 = `if (!addPusatDataFiles.kk) { openAlert("Kartu Keluarga (KK) wajib diunggah."); return; }`;
const replace2 = `if (!isEditingPusatData && !addPusatDataFiles.kk) { openAlert("Kartu Keluarga (KK) wajib diunggah."); return; }`;

code = code.replace(search1, replace1);
code = code.replace(search2, replace2);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('File validation updated');
