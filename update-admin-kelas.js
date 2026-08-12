const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const searchStr1 = `    if (addPusatDataJenjang === "MA Unggulan Al-Azhar") setAddPusatDataForm(f => ({...f, kelas: "10"}));
    else if (addPusatDataJenjang === "SMP Islam Al-Azhar") setAddPusatDataForm(f => ({...f, kelas: "7"}));
    else if (addPusatDataJenjang === "SDIT Al-Azhar") setAddPusatDataForm(f => ({...f, kelas: "1"}));`;

const replaceStr1 = `    if (addPusatDataJenjang === "MA Unggulan Al-Azhar") setAddPusatDataForm(f => ({...f, kelas: "Kelas 10 (Sepuluh) MA"}));
    else if (addPusatDataJenjang === "SMP Islam Al-Azhar") setAddPusatDataForm(f => ({...f, kelas: "Kelas 7 (Tujuh) SMP"}));
    else if (addPusatDataJenjang === "SDIT Al-Azhar") setAddPusatDataForm(f => ({...f, kelas: "Kelas 1 (Satu) SD"}));`;

code = code.replace(searchStr1, replaceStr1);

const searchStr2 = `  const getAddPusatDataKelasOptions = () => {
    if (addPusatDataJenjang === "MA Unggulan Al-Azhar") return [10, 11, 12];
    if (addPusatDataJenjang === "SMP Islam Al-Azhar") return [7, 8, 9];
    if (addPusatDataJenjang === "SDIT Al-Azhar") return [1, 2, 3, 4, 5, 6];
    return [];
  };`;

const replaceStr2 = `  const getAddPusatDataKelasOptions = () => {
    if (addPusatDataJenjang === "MA Unggulan Al-Azhar") return [
      { val: "10", label: "Kelas 10 (Sepuluh) MA" },
      { val: "11", label: "Kelas 11 (Sebelas) MA" },
      { val: "12", label: "Kelas 12 (Dua Belas) MA" }
    ];
    if (addPusatDataJenjang === "SMP Islam Al-Azhar") return [
      { val: "7", label: "Kelas 7 (Tujuh) SMP" },
      { val: "8", label: "Kelas 8 (Delapan) SMP" },
      { val: "9", label: "Kelas 9 (Sembilan) SMP" }
    ];
    if (addPusatDataJenjang === "SDIT Al-Azhar") return [
      { val: "1", label: "Kelas 1 (Satu) SD" },
      { val: "2", label: "Kelas 2 (Dua) SD" },
      { val: "3", label: "Kelas 3 (Tiga) SD" },
      { val: "4", label: "Kelas 4 (Empat) SD" },
      { val: "5", label: "Kelas 5 (Lima) SD" },
      { val: "6", label: "Kelas 6 (Enam) SD" }
    ];
    return [];
  };`;

code = code.replace(searchStr2, replaceStr2);

const searchStr3 = `{getAddPusatDataKelasOptions().map(k => (
                        <option key={k} value={k}>Kelas {k}</option>
                      ))}`;
const replaceStr3 = `{getAddPusatDataKelasOptions().map(k => (
                        <option key={k.val} value={k.label}>{k.label}</option>
                      ))}`;

code = code.replace(searchStr3, replaceStr3);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Admin options updated');
