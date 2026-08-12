const fs = require('fs');
let code = fs.readFileSync('src/app/pusda/page.tsx', 'utf8');

const searchStr1 = `    if (selectedJenjang === "MA Unggulan Al-Azhar") setFormData(f => ({...f, kelas: "10"}));
    else if (selectedJenjang === "SMP Islam Al-Azhar") setFormData(f => ({...f, kelas: "7"}));
    else if (selectedJenjang === "SDIT Al-Azhar") setFormData(f => ({...f, kelas: "1"}));`;

const replaceStr1 = `    if (selectedJenjang === "MA Unggulan Al-Azhar") setFormData(f => ({...f, kelas: "Kelas 10 (Sepuluh) MA"}));
    else if (selectedJenjang === "SMP Islam Al-Azhar") setFormData(f => ({...f, kelas: "Kelas 7 (Tujuh) SMP"}));
    else if (selectedJenjang === "SDIT Al-Azhar") setFormData(f => ({...f, kelas: "Kelas 1 (Satu) SD"}));`;

code = code.replace(searchStr1, replaceStr1);
fs.writeFileSync('src/app/pusda/page.tsx', code);
console.log('Pusda initial options updated');
