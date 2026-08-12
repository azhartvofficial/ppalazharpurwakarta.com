const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const searchStr = `<h2>Tambah Data Siswa</h2>`;
const replaceStr = `<h2>{isEditingPusatData ? "Edit Data Siswa" : "Tambah Data Siswa"}</h2>`;

code = code.replace(searchStr, replaceStr);

fs.writeFileSync('src/app/admin/page.tsx', code);
