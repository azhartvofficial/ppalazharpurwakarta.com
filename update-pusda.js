const fs = require('fs');
let code = fs.readFileSync('src/app/pusda/page.tsx', 'utf8');

const searchStr = `.or(\`nik.eq.\${formData.nik},nisn.eq.\${formData.nisn},and(nama_lengkap.eq."\${formData.nama_lengkap}",tempat_tanggal_lahir.eq."\${formData.tempat_tanggal_lahir}")\`);`;
const replaceStr = `.or(\`nik.eq.\${formData.nik},nisn.eq.\${formData.nisn},tempat_tanggal_lahir.eq."\${formData.tempat_tanggal_lahir}"\`);`;

code = code.replace(searchStr, replaceStr);

const searchStrReason = `        if (dup.nik === formData.nik) reason = "NIK";
        else if (dup.nisn === formData.nisn) reason = "NISN";
        else reason = "Nama dan TTL";`;
const replaceStrReason = `        if (dup.nik === formData.nik) reason = "NIK";
        else if (dup.nisn === formData.nisn) reason = "NISN";
        else reason = "TTL (Tempat, Tanggal Lahir)";`;

code = code.replace(searchStrReason, replaceStrReason);

fs.writeFileSync('src/app/pusda/page.tsx', code);
console.log("Pusda updated");
