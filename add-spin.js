const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

if (!code.includes('@keyframes spin {')) {
  const cssInsert = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }`;
  code = code.replace('<style>{`', '<style>{`' + cssInsert);
  fs.writeFileSync('src/app/admin/page.tsx', code);
  console.log('Keyframes added');
}
