const fs = require('fs');
let code = fs.readFileSync('src/app/pusda/page.tsx', 'utf8');

const searchStr1 = `  const getKelasOptions = () => {
    if (selectedJenjang === "MA Unggulan Al-Azhar") return [10, 11, 12];
    if (selectedJenjang === "SMP Islam Al-Azhar") return [7, 8, 9];
    if (selectedJenjang === "SDIT Al-Azhar") return [1, 2, 3, 4, 5, 6];
    return [];
  };`;

const replaceStr1 = `  const getKelasOptions = () => {
    if (selectedJenjang === "MA Unggulan Al-Azhar") return [
      { val: "10", label: "Kelas 10 (Sepuluh) MA" },
      { val: "11", label: "Kelas 11 (Sebelas) MA" },
      { val: "12", label: "Kelas 12 (Dua Belas) MA" }
    ];
    if (selectedJenjang === "SMP Islam Al-Azhar") return [
      { val: "7", label: "Kelas 7 (Tujuh) SMP" },
      { val: "8", label: "Kelas 8 (Delapan) SMP" },
      { val: "9", label: "Kelas 9 (Sembilan) SMP" }
    ];
    if (selectedJenjang === "SDIT Al-Azhar") return [
      { val: "1", label: "Kelas 1 (Satu) SD" },
      { val: "2", label: "Kelas 2 (Dua) SD" },
      { val: "3", label: "Kelas 3 (Tiga) SD" },
      { val: "4", label: "Kelas 4 (Empat) SD" },
      { val: "5", label: "Kelas 5 (Lima) SD" },
      { val: "6", label: "Kelas 6 (Enam) SD" }
    ];
    return [];
  };`;

code = code.replace(searchStr1, replaceStr1);

const searchStr2 = `{getKelasOptions().map(k => (
                    <option key={k} value={k}>Kelas {k}</option>
                  ))}`;
const replaceStr2 = `{getKelasOptions().map(k => (
                    <option key={k.val} value={k.label}>{k.label}</option>
                  ))}`;

code = code.replace(searchStr2, replaceStr2);

fs.writeFileSync('src/app/pusda/page.tsx', code);
console.log('Pusda options updated');
