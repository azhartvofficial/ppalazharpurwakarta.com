const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search = `const alamatObj = JSON.parse(data.alamat);`;
const replace = `const alamatObj = typeof data.alamat === 'string' ? JSON.parse(data.alamat) : data.alamat;`;

if (code.includes(search)) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/app/admin/page.tsx', code);
  console.log('JSON.parse fix applied');
} else {
  console.log('Search string not found!');
}
