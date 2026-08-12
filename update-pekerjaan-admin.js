const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const searchState = `  const [addPusatDataIsWNA, setAddPusatDataIsWNA] = useState(false);`;
const replaceState = `  const [addPusatDataIsWNA, setAddPusatDataIsWNA] = useState(false);
  const [isAddPekerjaanAyahLainnya, setIsAddPekerjaanAyahLainnya] = useState(false);
  const [isAddPekerjaanIbuLainnya, setIsAddPekerjaanIbuLainnya] = useState(false);
  
  const jobOptions = [
    "Pegawai Negeri Sipil (PNS)",
    "TNI / Polri",
    "Karyawan BUMN / BUMD",
    "Karyawan Swasta",
    "Wiraswasta / Pengusaha",
    "Petani / Peternak / Nelayan",
    "Buruh / Pekerja Lepas",
    "Guru / Dosen",
    "Tenaga Medis (Dokter/Perawat/dll)",
    "Pedagang",
    "Pensiunan",
    "Mengurus Rumah Tangga",
    "Tidak Bekerja"
  ];`;

if (code.includes(searchState)) {
    code = code.replace(searchState, replaceState);
}

// In handleEditPusatData, we need to initialize the state based on whether the data matches jobOptions.
const searchEdit = `      setAddPusatDataKodePos(alamatObj.kode_pos || "");
      if (alamatObj.is_wna !== undefined) setAddPusatDataIsWNA(alamatObj.is_wna);`;
const replaceEdit = `      setAddPusatDataKodePos(alamatObj.kode_pos || "");
      if (alamatObj.is_wna !== undefined) setAddPusatDataIsWNA(alamatObj.is_wna);
      setIsAddPekerjaanAyahLainnya(data.pekerjaan_ayah && !jobOptions.includes(data.pekerjaan_ayah));
      setIsAddPekerjaanIbuLainnya(data.pekerjaan_ibu && !jobOptions.includes(data.pekerjaan_ibu));`;

if (code.includes(searchEdit)) {
    code = code.replace(searchEdit, replaceEdit);
}

const searchAdd = `  const handleAddPusatData = () => {
    setIsEditingPusatData(false);
    setEditPusatDataId(null);`;
const replaceAdd = `  const handleAddPusatData = () => {
    setIsEditingPusatData(false);
    setEditPusatDataId(null);
    setIsAddPekerjaanAyahLainnya(false);
    setIsAddPekerjaanIbuLainnya(false);`;

if (code.includes(searchAdd)) {
    code = code.replace(searchAdd, replaceAdd);
}

// Update the JSX
const searchJSXAyah = `<div className="input-group"><label>Pekerjaan Ayah</label><input type="text" required value={addPusatDataForm.pekerjaan_ayah} onChange={e => setAddPusatDataForm({...addPusatDataForm, pekerjaan_ayah: capitalizeWords(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/></div>`;
const replaceJSXAyah = `<div className="input-group">
  <label>Pekerjaan Ayah</label>
  {!isAddPekerjaanAyahLainnya ? (
    <select required value={addPusatDataForm.pekerjaan_ayah} onChange={e => {
      if (e.target.value === "Lainnya") {
        setIsAddPekerjaanAyahLainnya(true);
        setAddPusatDataForm({...addPusatDataForm, pekerjaan_ayah: ""});
      } else {
        setAddPusatDataForm({...addPusatDataForm, pekerjaan_ayah: e.target.value});
      }
    }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
      <option value="">Pilih Pekerjaan Ayah</option>
      {jobOptions.map(job => <option key={job} value={job}>{job}</option>)}
      <option value="Lainnya">Lainnya (Ketik Manual)</option>
    </select>
  ) : (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input type="text" required value={addPusatDataForm.pekerjaan_ayah} onChange={e => setAddPusatDataForm({...addPusatDataForm, pekerjaan_ayah: capitalizeWords(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ketik pekerjaan ayah..." autoFocus />
      <button type="button" onClick={() => { setIsAddPekerjaanAyahLainnya(false); setAddPusatDataForm({...addPusatDataForm, pekerjaan_ayah: ""}); }} style={{ padding: '0 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
    </div>
  )}
</div>`;

if (code.includes(searchJSXAyah)) {
    code = code.replace(searchJSXAyah, replaceJSXAyah);
}

const searchJSXIbu = `<div className="input-group"><label>Pekerjaan Ibu</label><input type="text" required value={addPusatDataForm.pekerjaan_ibu} onChange={e => setAddPusatDataForm({...addPusatDataForm, pekerjaan_ibu: capitalizeWords(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/></div>`;
const replaceJSXIbu = `<div className="input-group">
  <label>Pekerjaan Ibu</label>
  {!isAddPekerjaanIbuLainnya ? (
    <select required value={addPusatDataForm.pekerjaan_ibu} onChange={e => {
      if (e.target.value === "Lainnya") {
        setIsAddPekerjaanIbuLainnya(true);
        setAddPusatDataForm({...addPusatDataForm, pekerjaan_ibu: ""});
      } else {
        setAddPusatDataForm({...addPusatDataForm, pekerjaan_ibu: e.target.value});
      }
    }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
      <option value="">Pilih Pekerjaan Ibu</option>
      {jobOptions.map(job => <option key={job} value={job}>{job}</option>)}
      <option value="Lainnya">Lainnya (Ketik Manual)</option>
    </select>
  ) : (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input type="text" required value={addPusatDataForm.pekerjaan_ibu} onChange={e => setAddPusatDataForm({...addPusatDataForm, pekerjaan_ibu: capitalizeWords(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ketik pekerjaan ibu..." autoFocus />
      <button type="button" onClick={() => { setIsAddPekerjaanIbuLainnya(false); setAddPusatDataForm({...addPusatDataForm, pekerjaan_ibu: ""}); }} style={{ padding: '0 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
    </div>
  )}
</div>`;

if (code.includes(searchJSXIbu)) {
    code = code.replace(searchJSXIbu, replaceJSXIbu);
}

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Done admin');
