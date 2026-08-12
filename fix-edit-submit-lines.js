const fs = require('fs');
let lines = fs.readFileSync('src/app/admin/page.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('const payload = {'));
if (start !== -1) {
    const end = lines.findIndex((l, i) => i > start && l.includes('openAlert("Data siswa berhasil ditambahkan!");'));
    if (end !== -1) {
        lines.splice(start, end - start + 1, `      if (isEditingPusatData && editPusatDataId) {
        const updatePayload: any = {
          ...addPusatDataForm,
          alamat: JSON.stringify(alamatObj),
          pas_foto: pas_foto || addPusatDataExistingFiles.pas_foto,
          kk_url: kk_url || addPusatDataExistingFiles.kk,
          akte_url: akte_url || addPusatDataExistingFiles.akte,
          ijazah_url: ijazah_url || addPusatDataExistingFiles.ijazah,
          sktm_url: sktm_url || addPusatDataExistingFiles.sktm,
        };
        const { error } = await supabase.from('pusat_data_siswa').update(updatePayload).eq('id', editPusatDataId);
        if (error) throw error;
        openAlert("Data siswa berhasil diperbarui!");
      } else {
        const payload = {
          ...addPusatDataForm,
          alamat: JSON.stringify(alamatObj),
          pas_foto, kk_url, akte_url, ijazah_url, sktm_url,
          status: 'Terima',
          accepted_at: new Date().toISOString()
        };
        const { error } = await supabase.from('pusat_data_siswa').insert([payload]);
        if (error) throw error;
        openAlert("Data siswa berhasil ditambahkan!");
      }`);
        fs.writeFileSync('src/app/admin/page.tsx', lines.join('\n'));
        console.log('Fixed edit submit');
    }
}
