const fs = require('fs');
let lines = fs.readFileSync('src/app/admin/page.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('if (alamatObj.kode_pos) setAddPusatDataKodePos(alamatObj.kode_pos);'));
if (start !== -1) {
    lines.splice(start + 1, 0, `      setIsAddPekerjaanAyahLainnya(data.pekerjaan_ayah && !jobOptions.includes(data.pekerjaan_ayah));
      setIsAddPekerjaanIbuLainnya(data.pekerjaan_ibu && !jobOptions.includes(data.pekerjaan_ibu));`);
    fs.writeFileSync('src/app/admin/page.tsx', lines.join('\n'));
    console.log('Fixed edit mode');
} else {
    console.log('Not found');
}
