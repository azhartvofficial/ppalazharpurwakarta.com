const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Update handleEditPusatData
const searchHandle = `          const provId = currentProvinces.find(p => p.name?.trim().toUpperCase() === alamatObj.provinsi?.trim().toUpperCase())?.id;`;
const replaceHandle = `          setAddPusatDataProvId("OLD_PROV");
          setAddPusatDataProvName(alamatObj.provinsi);
          setAddPusatDataRegId("OLD_REG");
          setAddPusatDataRegName(alamatObj.kota);
          setAddPusatDataDistId("OLD_DIST");
          setAddPusatDataDistName(alamatObj.kecamatan);
          
          const provId = currentProvinces.find(p => p.name?.trim().toUpperCase() === alamatObj.provinsi?.trim().toUpperCase())?.id;`;

if (code.includes(searchHandle)) {
  code = code.replace(searchHandle, replaceHandle);
}

// 2. Update Province Select
const searchProvSelect = `<option value="">-- Pilih Provinsi --</option>
                                  {provinces.map(p => (`;
const replaceProvSelect = `<option value="">-- Pilih Provinsi --</option>
                                  {addPusatDataProvId === "OLD_PROV" && <option value="OLD_PROV">{addPusatDataProvName}</option>}
                                  {provinces.map(p => (`;

if (code.includes(searchProvSelect)) {
  code = code.replace(searchProvSelect, replaceProvSelect);
}

// 3. Update Regency Select
const searchRegSelect = `<option value="">-- Pilih Kota/Kabupaten --</option>
                                  {regencies.map(r => (`;
const replaceRegSelect = `<option value="">-- Pilih Kota/Kabupaten --</option>
                                  {addPusatDataRegId === "OLD_REG" && <option value="OLD_REG">{addPusatDataRegName}</option>}
                                  {regencies.map(r => (`;

if (code.includes(searchRegSelect)) {
  code = code.replace(searchRegSelect, replaceRegSelect);
}

// 4. Update District Select
const searchDistSelect = `<option value="">-- Pilih Kecamatan --</option>
                                  {districts.map(d => (`;
const replaceDistSelect = `<option value="">-- Pilih Kecamatan --</option>
                                  {addPusatDataDistId === "OLD_DIST" && <option value="OLD_DIST">{addPusatDataDistName}</option>}
                                  {districts.map(d => (`;

if (code.includes(searchDistSelect)) {
  code = code.replace(searchDistSelect, replaceDistSelect);
}

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Fallback updated');
