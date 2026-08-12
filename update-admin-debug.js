const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search = `          const provId = provinces.find(p => p.name?.trim().toUpperCase() === alamatObj.provinsi?.trim().toUpperCase())?.id;
          if (provId) {
            setAddPusatDataProvId(provId);`;

const replace = `          const provId = provinces.find(p => p.name?.trim().toUpperCase() === alamatObj.provinsi?.trim().toUpperCase())?.id;
          
          if (!provId && provinces.length === 0) {
            alert("Sistem belum selesai memuat daftar provinsi, silakan tunggu beberapa detik dan coba klik Edit lagi.");
            return;
          }
          if (!provId) {
            alert("Provinsi dari data (" + alamatObj.provinsi + ") tidak cocok dengan API Emsifa.");
          }

          if (provId) {
            setAddPusatDataProvId(provId);`;

code = code.replace(search, replace);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Debug alert added');
