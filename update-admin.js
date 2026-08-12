const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Text Replacement
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
const searchStr2 = `                <a href={selectedPusatData.pas_foto} download target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} title="Unduh Pas Foto">`;
const replaceStr2 = `                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a href={selectedPusatData.pas_foto} download target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} title="Unduh Pas Foto">`;

const searchStr3 = `                  </svg>
                  Unduh
                </a>
              </div>`;
const replaceStr3 = `                  </svg>
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

code = code.replace(searchStr2, replaceStr2);
code = code.replace(searchStr3, replaceStr3);

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

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Done replacement');
