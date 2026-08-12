const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search = `const provId = provinces.find(p => p.name === alamatObj.provinsi)?.id;`;
const replace = `const provId = provinces.find(p => p.name?.trim().toUpperCase() === alamatObj.provinsi?.trim().toUpperCase())?.id;`;
code = code.replace(search, replace);

const searchReg = `const regId = regenciesData.find((r:any) => r.name === alamatObj.kota)?.id;`;
const replaceReg = `const regId = regenciesData.find((r:any) => r.name?.trim().toUpperCase() === alamatObj.kota?.trim().toUpperCase())?.id;`;
code = code.replace(searchReg, replaceReg);

const searchDist = `const distId = districtsData.find((d:any) => d.name === alamatObj.kecamatan)?.id;`;
const replaceDist = `const distId = districtsData.find((d:any) => d.name?.trim().toUpperCase() === alamatObj.kecamatan?.trim().toUpperCase())?.id;`;
code = code.replace(searchDist, replaceDist);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Case insensitive match added');
