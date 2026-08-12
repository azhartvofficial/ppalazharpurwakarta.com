const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const searchStr = `  const handleEditPusatData = (data: any) => {
    setIsEditingPusatData(true);
    setEditPusatDataId(data.id);
    setAddPusatDataExistingFiles({
      pas_foto: data.pas_foto || "",
      kk_url: data.kk_url || "",
      akte_url: data.akte_url || "",
      ijazah_url: data.ijazah_url || "",
      sktm_url: data.sktm_url || ""
    });
    setAddPusatDataForm({
      nama_lengkap: data.nama_lengkap || "",
      email_santri: data.email_santri || "",
      kelas: data.kelas || "",
      program_pendidikan: data.program_pendidikan || "",
      gender: data.gender || "",
      tempat_tanggal_lahir: data.tempat_tanggal_lahir || "",
      nik: data.nik || "",
      nisn: data.nisn || "",
      nama_ayah: data.nama_ayah || "",
      pekerjaan_ayah: data.pekerjaan_ayah || "",
      nama_ibu: data.nama_ibu || "",
      pekerjaan_ibu: data.pekerjaan_ibu || "",
      no_hp_wali: data.no_hp_wali || "",
      alamat: ""
    });
    try {
      const alamatObj = JSON.parse(data.alamat);
      setAddPusatDataDetail(alamatObj.detail || "");
      if (alamatObj.provinsi) setAddPusatDataProvId(alamatObj.provinsi);
      if (alamatObj.kota) setAddPusatDataRegId(alamatObj.kota);
      if (alamatObj.kecamatan) setAddPusatDataDistId(alamatObj.kecamatan);
    } catch(e) {}
    setShowAddPusatDataModal(true);
    setSelectedPusatData(null); // Close the detail modal
  };`;

const replaceStr = `  const handleEditPusatData = async (data: any) => {
    setIsEditingPusatData(true);
    setEditPusatDataId(data.id);
    setAddPusatDataExistingFiles({
      pas_foto: data.pas_foto || "",
      kk_url: data.kk_url || "",
      akte_url: data.akte_url || "",
      ijazah_url: data.ijazah_url || "",
      sktm_url: data.sktm_url || ""
    });
    setAddPusatDataForm({
      nama_lengkap: data.nama_lengkap || "",
      email_santri: data.email_santri || "",
      kelas: data.kelas || "",
      program_pendidikan: data.program_pendidikan || "",
      gender: data.gender || "",
      tempat_tanggal_lahir: data.tempat_tanggal_lahir || "",
      nik: data.nik || "",
      nisn: data.nisn || "",
      nama_ayah: data.nama_ayah || "",
      pekerjaan_ayah: data.pekerjaan_ayah || "",
      nama_ibu: data.nama_ibu || "",
      pekerjaan_ibu: data.pekerjaan_ibu || "",
      no_hp_wali: data.no_hp_wali || "",
      alamat: ""
    });
    try {
      const alamatObj = JSON.parse(data.alamat);
      setAddPusatDataDetail(alamatObj.detail || "");
      if (alamatObj.kode_pos) setAddPusatDataKodePos(alamatObj.kode_pos);
      if (alamatObj.is_wna !== undefined) setAddPusatDataIsWNA(alamatObj.is_wna);
      
      if (alamatObj.is_wna) {
        setAddPusatDataCountry(alamatObj.negara || "");
      } else {
        if (alamatObj.provinsi) {
          const provId = provinces.find(p => p.name === alamatObj.provinsi)?.id;
          if (provId) {
            setAddPusatDataProvId(provId);
            setAddPusatDataProvName(alamatObj.provinsi);
            try {
              const regRes = await fetch(\`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/\${provId}.json\`);
              const regenciesData = await regRes.json();
              setRegencies(regenciesData);
              const regId = regenciesData.find((r:any) => r.name === alamatObj.kota)?.id;
              
              if (regId) {
                setAddPusatDataRegId(regId);
                setAddPusatDataRegName(alamatObj.kota);
                try {
                  const distRes = await fetch(\`https://emsifa.github.io/api-wilayah-indonesia/api/districts/\${regId}.json\`);
                  const districtsData = await distRes.json();
                  setDistricts(districtsData);
                  const distId = districtsData.find((d:any) => d.name === alamatObj.kecamatan)?.id;
                  
                  if (distId) {
                    setAddPusatDataDistId(distId);
                    setAddPusatDataDistName(alamatObj.kecamatan);
                  }
                } catch(e) {}
              }
            } catch(e) {}
          }
        }
      }
    } catch(e) {}
    setShowAddPusatDataModal(true);
    setSelectedPusatData(null); // Close the detail modal
  };`;

if (code.includes('if (alamatObj.provinsi) setAddPusatDataProvId(alamatObj.provinsi);')) {
  code = code.replace(searchStr, replaceStr);
  fs.writeFileSync('src/app/admin/page.tsx', code);
  console.log('Address edit logic replaced');
} else {
  console.log('Search string not found');
}
