const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search = `          const provId = provinces.find(p => p.name?.trim().toUpperCase() === alamatObj.provinsi?.trim().toUpperCase())?.id;
          
          if (!provId && provinces.length === 0) {
            alert("Sistem belum selesai memuat daftar provinsi, silakan tunggu beberapa detik dan coba klik Edit lagi.");
            return;
          }
          if (!provId) {
            alert("Provinsi dari data (" + alamatObj.provinsi + ") tidak cocok dengan API Emsifa.");
          }

          if (provId) {`;

const replace = `          let currentProvinces = provinces;
          if (currentProvinces.length === 0) {
            try {
              const res = await fetch("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json");
              currentProvinces = await res.json();
              setProvinces(currentProvinces);
            } catch(e) {}
          }
          
          const provId = currentProvinces.find(p => p.name?.trim().toUpperCase() === alamatObj.provinsi?.trim().toUpperCase())?.id;

          if (provId) {`;

if (code.includes('if (!provId && provinces.length === 0)')) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/app/admin/page.tsx', code);
  console.log('Fixed provinces fallback');
} else {
  console.log('Search string not found');
}
