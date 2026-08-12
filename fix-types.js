const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
code = code.replace('addPusatDataExistingFiles.kk,', 'addPusatDataExistingFiles.kk_url,');
code = code.replace('addPusatDataExistingFiles.akte,', 'addPusatDataExistingFiles.akte_url,');
code = code.replace('addPusatDataExistingFiles.ijazah,', 'addPusatDataExistingFiles.ijazah_url,');
code = code.replace('addPusatDataExistingFiles.sktm,', 'addPusatDataExistingFiles.sktm_url,');
fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Fixed typings');
