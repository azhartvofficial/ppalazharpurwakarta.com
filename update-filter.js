const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search = `  const getFilteredPusatData = (isPending: boolean) => {
    return pusatData.filter(d => {
      if (isPending && d.status !== 'Pending') return false;
      if (!isPending && d.status === 'Pending') return false;`;

const replace = `  const getFilteredPusatData = (isPending: boolean) => {
    return pusatData.filter(d => {
      if (isPending && d.status !== 'Pending') return false;
      // Hanya tampilkan data yang sudah diterima/aktif di kolom Data Siswa
      if (!isPending && d.status !== 'Approved' && d.status !== 'Aktif' && d.status !== 'Terima') return false;`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('src/app/admin/page.tsx', code);
    console.log('Filter updated');
} else {
    console.log('Search string not found');
}
