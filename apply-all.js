const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Text Replacement "Diterima Admin" to "Tanggal Penerimaan"
code = code.replace('>Diterima Admin</span>', '>Tanggal Penerimaan</span>');

// 2. State & Handler
const searchStr1 = 'const [showAddPusatDataModal, setShowAddPusatDataModal] = useState(false);';
const replaceStr1 = searchStr1 + `
  const [isEditingPusatData, setIsEditingPusatData] = useState(false);
  const [editPusatDataId, setEditPusatDataId] = useState<string | null>(null);

  const handleEditPusatData = (data: any) => {
    setIsEditingPusatData(true);
    setEditPusatDataId(data.id);
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
  };
`;
code = code.replace(searchStr1, replaceStr1);

// 3. Edit Button in Modal
// The original code has exactly this block:
const searchStrModal = `                <img src={selectedPusatData.pas_foto} alt="Pas Foto" style={{ width: '150px', height: '150px', borderRadius: '16px', objectFit: 'cover', border: '3px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>Kelas {selectedPusatData.kelas}</span>
                <a href={selectedPusatData.pas_foto} download target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} title="Unduh Pas Foto">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                  </svg>
                  Unduh
                </a>
              </div>`;

const replaceStrModal = `                <img src={selectedPusatData.pas_foto} alt="Pas Foto" style={{ width: '150px', height: '150px', borderRadius: '16px', objectFit: 'cover', border: '3px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>Kelas {selectedPusatData.kelas}</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a href={selectedPusatData.pas_foto} download target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} title="Unduh Pas Foto">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                    Unduh
                  </a>
                  <button onClick={() => handleEditPusatData(selectedPusatData)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fef08a', color: '#a16207', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, border: 'none', cursor: 'pointer' }} title="Edit Data">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                    Edit
                  </button>
                </div>
              </div>`;

code = code.replace(searchStrModal, replaceStrModal);

// 4. Update file validation
const searchStr4 = `    if (!addPusatDataFiles.pas_foto) { openAlert("Pas foto wajib diunggah."); return; }
    if (!addPusatDataFiles.kk) { openAlert("Kartu Keluarga (KK) wajib diunggah."); return; }`;
const replaceStr4 = `    if (!isEditingPusatData) {
      if (!addPusatDataFiles.pas_foto) { openAlert("Pas foto wajib diunggah."); return; }
      if (!addPusatDataFiles.kk) { openAlert("Kartu Keluarga (KK) wajib diunggah."); return; }
    }`;
code = code.replace(searchStr4, replaceStr4);

// 5. Update DB logic
const searchStr5 = `      const payload = {
        ...addPusatDataForm,
        alamat: JSON.stringify(alamatObj),
        pas_foto, kk_url, akte_url, ijazah_url, sktm_url,
        status: 'Terima', // Admin bypasses pending status
        accepted_at: new Date().toISOString()
      };

      const { error } = await supabase.from('pusat_data_siswa').insert([payload]);
      if (error) throw error;
      
      openAlert("Data siswa berhasil ditambahkan!");
      setShowAddPusatDataModal(false);
      fetchPusatData();`;

const replaceStr5 = `      const payload: any = {
        ...addPusatDataForm,
        alamat: JSON.stringify(alamatObj)
      };

      if (pas_foto) payload.pas_foto = pas_foto;
      if (kk_url) payload.kk_url = kk_url;
      if (akte_url) payload.akte_url = akte_url;
      if (ijazah_url) payload.ijazah_url = ijazah_url;
      if (sktm_url) payload.sktm_url = sktm_url;

      if (isEditingPusatData) {
        setPendingSuperAdminAction(() => async () => {
          try {
            const { error } = await supabase.from('pusat_data_siswa').update(payload).eq('id', editPusatDataId);
            if (error) throw error;
            openAlert("Data siswa berhasil diperbarui!");
            setShowAddPusatDataModal(false);
            fetchPusatData();
          } catch (err: any) {
            openAlert("Terjadi kesalahan: " + err.message, true);
          }
        });
        setShowMasterPasswordPrompt(true);
      } else {
        payload.status = 'Terima';
        payload.accepted_at = new Date().toISOString();
        const { error } = await supabase.from('pusat_data_siswa').insert([payload]);
        if (error) throw error;
        
        openAlert("Data siswa berhasil ditambahkan!");
        setShowAddPusatDataModal(false);
        fetchPusatData();
      }`;
code = code.replace(searchStr5, replaceStr5);

// 6. Reset form on Tambah Data
const searchStr6 = `onClick={() => setShowAddPusatDataModal(true)}`;
const replaceStr6 = `onClick={() => {
                                setIsEditingPusatData(false);
                                setEditPusatDataId(null);
                                setAddPusatDataForm({
                                  nama_lengkap: "", email_santri: "", kelas: "10", program_pendidikan: "Mondok", gender: "Putra", tempat_tanggal_lahir: "", nik: "", nisn: "",
                                  nama_ayah: "", pekerjaan_ayah: "", nama_ibu: "", pekerjaan_ibu: "", no_hp_wali: "", alamat: ""
                                });
                                setShowAddPusatDataModal(true);
                              }}`;
code = code.replace(searchStr6, replaceStr6);

// 7. Modal title edit mode
const searchStr7 = `<h2>Tambah Data Siswa</h2>`;
const replaceStr7 = `<h2>{isEditingPusatData ? "Edit Data Siswa" : "Tambah Data Siswa"}</h2>`;
code = code.replace(searchStr7, replaceStr7);

// 8. Conditionally required labels
const searchStr8 = `<div><label>Pas Foto *</label><input type="file" required accept="image/*"`;
const replaceStr8 = `<div><label>Pas Foto {isEditingPusatData ? '(Opsional)' : '*'}</label><input type="file" required={!isEditingPusatData} accept="image/*"`;
code = code.replace(searchStr8, replaceStr8);

const searchStr9 = `<div><label>Kartu Keluarga (KK) *</label><input type="file" required accept=".pdf,image/*"`;
const replaceStr9 = `<div><label>Kartu Keluarga (KK) {isEditingPusatData ? '(Opsional)' : '*'}</label><input type="file" required={!isEditingPusatData} accept=".pdf,image/*"`;
code = code.replace(searchStr9, replaceStr9);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log("ALL REPLACEMENTS DONE SUCCESSFULLY");
