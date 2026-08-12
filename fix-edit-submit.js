const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search = `      const payload = {
        ...addPusatDataForm,
        alamat: JSON.stringify(alamatObj),
        pas_foto, kk_url, akte_url, ijazah_url, sktm_url,
        status: 'Terima', // Admin bypasses pending status
        accepted_at: new Date().toISOString()
      };

      const { error } = await supabase.from('pusat_data_siswa').insert([payload]);
      if (error) throw error;
      
      openAlert("Data siswa berhasil ditambahkan!");`;

const replace = `      if (isEditingPusatData && editPusatDataId) {
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
          status: 'Terima', // Admin bypasses pending status
          accepted_at: new Date().toISOString()
        };
        const { error } = await supabase.from('pusat_data_siswa').insert([payload]);
        if (error) throw error;
        openAlert("Data siswa berhasil ditambahkan!");
      }`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('src/app/admin/page.tsx', code);
    console.log('Fixed edit submit');
} else {
    console.log('Search block not found');
}
