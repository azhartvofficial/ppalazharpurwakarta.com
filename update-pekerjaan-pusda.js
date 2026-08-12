const fs = require('fs');
let code = fs.readFileSync('src/app/pusda/page.tsx', 'utf8');

const searchState = `  const [isWNA, setIsWNA] = useState(false);`;
const replaceState = `  const [isWNA, setIsWNA] = useState(false);
  const [isPekerjaanAyahLainnya, setIsPekerjaanAyahLainnya] = useState(false);
  const [isPekerjaanIbuLainnya, setIsPekerjaanIbuLainnya] = useState(false);
  
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
} else {
    console.log('searchState not found');
}

const searchJSXAyah = `              <div className="input-group">
                <label>Pekerjaan Ayah</label>
                <input type="text" name="pekerjaan_ayah" required value={formData.pekerjaan_ayah} onChange={handleInputChange} />
                {errors.pekerjaan_ayah && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.pekerjaan_ayah}</div>}
              </div>`;

const replaceJSXAyah = `              <div className="input-group">
                <label>Pekerjaan Ayah</label>
                {!isPekerjaanAyahLainnya ? (
                  <select 
                    name="pekerjaan_ayah" 
                    required 
                    value={formData.pekerjaan_ayah} 
                    onChange={(e) => {
                      if (e.target.value === "Lainnya") {
                        setIsPekerjaanAyahLainnya(true);
                        setFormData(f => ({...f, pekerjaan_ayah: ""}));
                      } else {
                        handleInputChange(e);
                      }
                    }}
                  >
                    <option value="">Pilih Pekerjaan Ayah</option>
                    {jobOptions.map(job => <option key={job} value={job}>{job}</option>)}
                    <option value="Lainnya">Lainnya (Ketik Manual)</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" name="pekerjaan_ayah" required value={formData.pekerjaan_ayah} onChange={handleInputChange} placeholder="Ketik pekerjaan ayah..." style={{ flex: 1 }} autoFocus />
                    <button type="button" onClick={() => { setIsPekerjaanAyahLainnya(false); setFormData(f => ({...f, pekerjaan_ayah: ""})); }} style={{ padding: '0 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>Batal</button>
                  </div>
                )}
                {errors.pekerjaan_ayah && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.pekerjaan_ayah}</div>}
              </div>`;

if (code.includes(searchJSXAyah)) {
    code = code.replace(searchJSXAyah, replaceJSXAyah);
} else {
    console.log('searchJSXAyah not found');
}


const searchJSXIbu = `              <div className="input-group">
                <label>Pekerjaan Ibu</label>
                <input type="text" name="pekerjaan_ibu" required value={formData.pekerjaan_ibu} onChange={handleInputChange} />
                {errors.pekerjaan_ibu && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.pekerjaan_ibu}</div>}
              </div>`;

const replaceJSXIbu = `              <div className="input-group">
                <label>Pekerjaan Ibu</label>
                {!isPekerjaanIbuLainnya ? (
                  <select 
                    name="pekerjaan_ibu" 
                    required 
                    value={formData.pekerjaan_ibu} 
                    onChange={(e) => {
                      if (e.target.value === "Lainnya") {
                        setIsPekerjaanIbuLainnya(true);
                        setFormData(f => ({...f, pekerjaan_ibu: ""}));
                      } else {
                        handleInputChange(e);
                      }
                    }}
                  >
                    <option value="">Pilih Pekerjaan Ibu</option>
                    {jobOptions.map(job => <option key={job} value={job}>{job}</option>)}
                    <option value="Lainnya">Lainnya (Ketik Manual)</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" name="pekerjaan_ibu" required value={formData.pekerjaan_ibu} onChange={handleInputChange} placeholder="Ketik pekerjaan ibu..." style={{ flex: 1 }} autoFocus />
                    <button type="button" onClick={() => { setIsPekerjaanIbuLainnya(false); setFormData(f => ({...f, pekerjaan_ibu: ""})); }} style={{ padding: '0 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>Batal</button>
                  </div>
                )}
                {errors.pekerjaan_ibu && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.pekerjaan_ibu}</div>}
              </div>`;

if (code.includes(searchJSXIbu)) {
    code = code.replace(searchJSXIbu, replaceJSXIbu);
} else {
    console.log('searchJSXIbu not found');
}

fs.writeFileSync('src/app/pusda/page.tsx', code);
console.log('Done pusda');
