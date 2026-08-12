const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const searchStr1 = `<div><label>Pas Foto *</label><input type="file" required accept="image/*"`;
const replaceStr1 = `<div><label>Pas Foto {isEditingPusatData ? '(Opsional)' : '*'}</label><input type="file" required={!isEditingPusatData} accept="image/*"`;

const searchStr2 = `<div><label>Kartu Keluarga (KK) *</label><input type="file" required accept=".pdf,image/*"`;
const replaceStr2 = `<div><label>Kartu Keluarga (KK) {isEditingPusatData ? '(Opsional)' : '*'}</label><input type="file" required={!isEditingPusatData} accept=".pdf,image/*"`;

code = code.replace(searchStr1, replaceStr1);
code = code.replace(searchStr2, replaceStr2);

fs.writeFileSync('src/app/admin/page.tsx', code);
