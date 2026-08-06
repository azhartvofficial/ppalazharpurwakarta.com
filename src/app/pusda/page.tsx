"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function PusdaPage() {
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email_santri: "",
    kelas: "10",
    program_pendidikan: "Mondok",
    gender: "Putra",
    tempat_tanggal_lahir: "",
    nik: "",
    nisn: "",
    nama_ayah: "",
    pekerjaan_ayah: "",
    nama_ibu: "",
    pekerjaan_ibu: "",
    no_hp_wali: "",
    alamat: "",
  });

  // Alamat & Wilayah States
  const [isWNA, setIsWNA] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);

  const [selectedProvId, setSelectedProvId] = useState("");
  const [selectedProvName, setSelectedProvName] = useState("");
  const [selectedRegId, setSelectedRegId] = useState("");
  const [selectedRegName, setSelectedRegName] = useState("");
  const [selectedDistId, setSelectedDistId] = useState("");
  const [selectedDistName, setSelectedDistName] = useState("");
  
  const [detailAlamat, setDetailAlamat] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");

  // Access Code States
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessCodeError, setAccessCodeError] = useState("");
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [wavesSettings, setWavesSettings] = useState<any[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Fetch initial data (Provinces & Countries & Registration Settings)
  useEffect(() => {
    const initFetch = async () => {
      // Fetch Registration Settings
      try {
        const { data, error } = await supabase.from('registration_settings').select('*');
        if (!error && data) {
          setWavesSettings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSettings(false);
      }
    };
    initFetch();
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err));

    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then(res => res.json())
      .then(data => {
        const sorted = data.map((c: any) => c.name.common).sort();
        setCountries(sorted);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch Regencies when Province changes
  useEffect(() => {
    if (selectedProvId) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvId}.json`)
        .then(res => res.json())
        .then(data => {
          setRegencies(data);
          setSelectedRegId("");
          setSelectedRegName("");
          setDistricts([]);
          setSelectedDistId("");
          setSelectedDistName("");
        })
        .catch(err => console.error(err));
    } else {
      setRegencies([]);
      setDistricts([]);
    }
  }, [selectedProvId]);

  // Fetch Districts when Regency changes
  useEffect(() => {
    if (selectedRegId) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegId}.json`)
        .then(res => res.json())
        .then(data => {
          setDistricts(data);
          setSelectedDistId("");
          setSelectedDistName("");
        })
        .catch(err => console.error(err));
    } else {
      setDistricts([]);
    }
  }, [selectedRegId]);

  const [pasFotoFile, setPasFotoFile] = useState<File | null>(null);
  const [pasFotoPreview, setPasFotoPreview] = useState<string | null>(null);
  const [kkFile, setKkFile] = useState<File | null>(null);
  const [akteFile, setAkteFile] = useState<File | null>(null);
  const [ijazahFile, setIjazahFile] = useState<File | null>(null);
  const [sktmFile, setSktmFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Harap unggah file gambar (.jpg atau .png)');
        return;
      }
      setPasFotoFile(file);
      setPasFotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File, folderType: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folderType}_${Date.now()}.${fileExt}`;
    const filePath = `pusat_data_santri/Kelas_${formData.kelas}/${formData.gender}/${formData.nama_lengkap.replace(/\s+/g, '_')}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('berita-images')
      .upload(filePath, file);

    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('berita-images')
      .getPublicUrl(filePath);
      
    return publicUrlData.publicUrl;
  };

  const handleAccessCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingAccess(true);
    setAccessCodeError("");
    
    // Check if any wave is open
    const openWaves = wavesSettings.filter(w => w.is_open);
    if (openWaves.length === 0) {
      setAccessCodeError("Saat ini tidak ada gelombang pendaftaran PPDB yang dibuka.");
      setCheckingAccess(false);
      return;
    }

    // Check if input matches any open wave's access code (case-insensitive)
    const matchedWave = openWaves.find(w => w.access_code?.toLowerCase() === accessCodeInput.toLowerCase());
    
    if (matchedWave) {
      setAccessGranted(true);
    } else {
      setAccessCodeError("Kode akses tidak valid atau salah. Silakan coba lagi.");
    }
    setCheckingAccess(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!pasFotoFile) {
      setErrorMsg("Pas Foto wajib diunggah!");
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasFotoFile) {
      setErrorMsg("Pas Foto wajib diunggah!");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Upload files
      let pas_foto = "";
      let kk_url = null;
      let akte_url = null;
      let ijazah_url = null;
      let sktm_url = null;

      pas_foto = await uploadFile(pasFotoFile, "PASFOTO");
      if (kkFile) kk_url = await uploadFile(kkFile, "KK");
      if (akteFile) akte_url = await uploadFile(akteFile, "AKTE");
      if (ijazahFile) ijazah_url = await uploadFile(ijazahFile, "IJAZAH");
      if (sktmFile) sktm_url = await uploadFile(sktmFile, "SKTM");

      // Build JSON Alamat
      const alamatObj = isWNA ? {
        is_wna: true,
        negara: selectedCountryName,
        detail: detailAlamat,
        kode_pos: kodePos,
        full_text: `${detailAlamat}, ${selectedCountryName}${kodePos ? ' - ' + kodePos : ''} (WNA)`
      } : {
        is_wna: false,
        provinsi: selectedProvName,
        kota: selectedRegName,
        kecamatan: selectedDistName,
        detail: detailAlamat,
        kode_pos: kodePos,
        full_text: `${detailAlamat}, Kec. ${selectedDistName}, Kota/Kab. ${selectedRegName}, Prov. ${selectedProvName}${kodePos ? ' - ' + kodePos : ''}`
      };

      // Save to database
      const payload = {
        ...formData,
        alamat: JSON.stringify(alamatObj),
        pas_foto,
        kk_url,
        akte_url,
        ijazah_url,
        sktm_url,
        status: 'Pending'
      };

      const { error } = await supabase.from('pusat_data_siswa').insert([payload]);
      
      if (error) throw error;

      setSubmitSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat mengunggah data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <main className="pusda-layout">
        <Navbar />
        <div className="pusda-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
          <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
            <h2 style={{ color: '#002147', fontWeight: 900, marginBottom: '1rem' }}>Data Berhasil Dikirim!</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 }}>Terima kasih, data identitas santri dan dokumen pendukung telah berhasil disimpan dengan aman di Pusat Data Santri Al-Azhar (PUSDA AZHAR).</p>
            <button onClick={() => window.location.reload()} style={{ padding: '1rem 2rem', background: '#4CAF50', color: 'white', fontWeight: 800, border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Input Data Siswa Lainnya</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pusda-layout">
      <Navbar />

      {!accessGranted && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,33,71,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '2rem' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '3rem 2rem', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1 }}>🔑</div>
            <h2 style={{ color: '#002147', fontWeight: 900, marginBottom: '0.5rem', fontSize: '1.5rem' }}>Akses PUSDA Terkunci</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
              Silakan masukkan 6 digit kode akses untuk masuk ke formulir Pusat Data Santri Al-Azhar (PUSDA AZHAR).
            </p>

            <form onSubmit={handleAccessCheck} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="XXXXXX"
                maxLength={6}
                value={accessCodeInput}
                onChange={(e) => setAccessCodeInput(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  letterSpacing: '5px',
                  fontWeight: 900,
                  border: '2px solid #cbd5e1',
                  borderRadius: '12px',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />
              {accessCodeError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, padding: '0.5rem', background: '#fef2f2', borderRadius: '8px' }}>
                  ⚠️ {accessCodeError}
                </div>
              )}
              <button 
                type="submit" 
                disabled={accessCodeInput.length < 6 || checkingAccess || loadingSettings}
                style={{
                  padding: '1rem',
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 800,
                  cursor: (accessCodeInput.length < 6 || checkingAccess || loadingSettings) ? 'not-allowed' : 'pointer',
                  opacity: (accessCodeInput.length < 6 || checkingAccess || loadingSettings) ? 0.7 : 1,
                  fontSize: '1rem',
                  marginTop: '0.5rem'
                }}
              >
                {checkingAccess ? 'Mengecek...' : 'Buka Formulir'}
              </button>
            </form>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>Belum memiliki kode akses atau ada kendala?</p>
              <a 
                href="https://wa.me/6283846489366" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#25D366', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  Hubungi Admin (+62 838-4648-9366)
                </div>
                <span style={{ fontSize: '0.75rem', background: '#25D366', color: '#fff', padding: '2px 8px', borderRadius: '10px', marginTop: '4px' }}>Klik di sini</span>
              </a>
            </div>
          </div>
        </div>
      )}
      
      <div className="pusda-hero">
        <div className="hero-content">
          <span className="hero-badge">Pusat Data Resmi</span>
          <h1 className="hero-title">Portal PUSDA <span>AZHAR</span></h1>
          <p className="hero-desc">Pusat Data Santri Terpadu. Isi identitas dan lengkapi dokumen santri dengan mudah, aman, dan tertata rapi.</p>
        </div>
      </div>

      <div className="pusda-container">
        
        <div className="info-cards">
          <div className="info-card">
            <span className="icon">🔒</span>
            <h3>Data Tersimpan Aman</h3>
            <p>Seluruh dokumen dan identitas dienkripsi dan disimpan di server terpusat milik pesantren.</p>
          </div>
          <div className="info-card">
            <span className="icon">📂</span>
            <h3>Arsip Terstruktur</h3>
            <p>Berkas otomatis diklasifikasikan berdasarkan kelas, gender, dan nama santri secara rapi.</p>
          </div>
          <div className="info-card">
            <span className="icon">⚡</span>
            <h3>Proses Instan</h3>
            <p>Sistem akan otomatis mengkompres pas foto Anda untuk meminimalisir penggunaan kuota.</p>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '10px', border: '1px solid #fca5a5', marginBottom: '2rem', fontWeight: 700 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="pusda-form">
          <div className="form-section">
            <h2 className="section-title"><span>1</span> Identitas Utama & Pas Foto</h2>
            
            <div className="foto-upload-area">
              <div className="foto-preview" onClick={() => fileInputRef.current?.click()}>
                {pasFotoPreview ? (
                  <img src={pasFotoPreview} alt="Preview" />
                ) : (
                  <div className="foto-placeholder">
                    <span style={{ fontSize: '2rem' }}>📸</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Klik untuk Unggah<br/>Pas Foto (Wajib)</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFotoChange} style={{ display: 'none' }} />
              <div className="foto-instructions">
                <ul>
                  <li>Format: JPG / PNG</li>
                  <li>Rekomendasi ukuran: 4x6 (Rasio 2:3)</li>
                  <li>Wajah terlihat jelas, pakaian sopan & rapi.</li>
                </ul>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-upload-foto">
                  Pilih Foto
                </button>
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label>Nama Lengkap Santri</label>
                <input type="text" name="nama_lengkap" required value={formData.nama_lengkap} onChange={handleInputChange} placeholder="Sesuai Akte Kelahiran" />
              </div>
              <div className="input-group">
                <label>Email Peserta Didik (Opsional)</label>
                <input type="email" name="email_santri" value={formData.email_santri} onChange={handleInputChange} placeholder="Email aktif (opsional)" />
              </div>
              <div className="input-group">
                <label>Kelas saat ini</label>
                <select name="kelas" required value={formData.kelas} onChange={handleInputChange}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(k => (
                    <option key={k} value={k}>Kelas {k}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Program Pendidikan</label>
                <select name="program_pendidikan" required value={formData.program_pendidikan} onChange={handleInputChange}>
                  <option value="Mondok">Mondok (Pesantren)</option>
                  <option value="Non Mondok">Non Mondok (Pulang Pergi)</option>
                </select>
              </div>
              <div className="input-group">
                <label>Gender / Jenis Kelamin</label>
                <select name="gender" required value={formData.gender} onChange={handleInputChange}>
                  <option value="Putra">Putra (Laki-laki)</option>
                  <option value="Putri">Putri (Perempuan)</option>
                </select>
              </div>
              <div className="input-group">
                <label>Tempat, Tanggal Lahir</label>
                <input type="text" name="tempat_tanggal_lahir" required value={formData.tempat_tanggal_lahir} onChange={handleInputChange} placeholder="Cth: Purwakarta, 17 Agustus 2010" />
              </div>
              <div className="input-group">
                <label>Nomor Induk Kependudukan (NIK)</label>
                <input type="number" name="nik" required value={formData.nik} onChange={handleInputChange} placeholder="16 digit angka" />
              </div>
              <div className="input-group">
                <label>Nomor Induk Siswa Nasional (NISN)</label>
                <input type="number" name="nisn" required value={formData.nisn} onChange={handleInputChange} placeholder="10 digit angka" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title"><span>2</span> Data Orang Tua & Kontak</h2>
            <div className="grid-2">
              <div className="input-group">
                <label>Nama Ayah Kandung</label>
                <input type="text" name="nama_ayah" required value={formData.nama_ayah} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Pekerjaan Ayah</label>
                <input type="text" name="pekerjaan_ayah" required value={formData.pekerjaan_ayah} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Nama Ibu Kandung</label>
                <input type="text" name="nama_ibu" required value={formData.nama_ibu} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Pekerjaan Ibu</label>
                <input type="text" name="pekerjaan_ibu" required value={formData.pekerjaan_ibu} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>No HP/WhatsApp Wali (Aktif)</label>
                <input type="tel" name="no_hp_wali" required value={formData.no_hp_wali} onChange={handleInputChange} placeholder="08..." />
              </div>
            </div>
            <div className="input-group" style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ fontSize: '1rem', color: '#0f172a' }}>Alamat Lengkap Domisili</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  <input type="checkbox" checked={isWNA} onChange={(e) => setIsWNA(e.target.checked)} style={{ width: 'auto' }} />
                  Saya merupakan WNA (Warga Negara Asing)
                </label>
              </div>

              {isWNA ? (
                <div className="grid-2" style={{ marginBottom: '1rem' }}>
                  <div className="input-group">
                    <label>Pilih Negara Asal</label>
                    <input 
                      list="country-list"
                      required={isWNA}
                      placeholder="Ketik untuk mencari negara..."
                      value={selectedCountryName}
                      onChange={(e) => setSelectedCountryName(e.target.value)}
                    />
                    <datalist id="country-list">
                      {countries.map((c, i) => <option key={i} value={c} />)}
                    </datalist>
                  </div>
                  <div className="input-group">
                    <label>Kode Pos (Opsional)</label>
                    <input type="text" value={kodePos} onChange={(e) => setKodePos(e.target.value)} placeholder="Kode Pos" />
                  </div>
                </div>
              ) : (
                <div className="grid-2" style={{ marginBottom: '1rem' }}>
                  <div className="input-group">
                    <label>Provinsi</label>
                    <select 
                      required={!isWNA} 
                      value={selectedProvId} 
                      onChange={(e) => {
                        setSelectedProvId(e.target.value);
                        setSelectedProvName(e.target.options[e.target.selectedIndex].text);
                      }}
                    >
                      <option value="">-- Pilih Provinsi --</option>
                      {provinces.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Kota / Kabupaten</label>
                    <select 
                      required={!isWNA} 
                      value={selectedRegId}
                      disabled={!selectedProvId}
                      onChange={(e) => {
                        setSelectedRegId(e.target.value);
                        setSelectedRegName(e.target.options[e.target.selectedIndex].text);
                      }}
                    >
                      <option value="">-- Pilih Kota/Kabupaten --</option>
                      {regencies.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Kecamatan</label>
                    <select 
                      required={!isWNA} 
                      value={selectedDistId}
                      disabled={!selectedRegId}
                      onChange={(e) => {
                        setSelectedDistId(e.target.value);
                        setSelectedDistName(e.target.options[e.target.selectedIndex].text);
                      }}
                    >
                      <option value="">-- Pilih Kecamatan --</option>
                      {districts.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Kode Pos (Opsional)</label>
                    <input type="number" value={kodePos} onChange={(e) => setKodePos(e.target.value)} placeholder="Contoh: 41151" />
                  </div>
                </div>
              )}
              
              <div className="input-group">
                <label>Detail Alamat (Desa/Kelurahan, Jalan, RT/RW, Gang)</label>
                <textarea 
                  required 
                  value={detailAlamat} 
                  onChange={(e) => setDetailAlamat(e.target.value)} 
                  rows={2} 
                  placeholder="Contoh: Desa Margasari, Jl. Pramuka RT 01/RW 02, Gg. Kenanga No. 15"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title"><span>3</span> Unggah Dokumen Berkas</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>Silakan unggah dokumen pendukung dalam format PDF atau Gambar (JPG/PNG). Berkas ini akan langsung masuk ke arsip pusat data.</p>
            
            <div className="doc-uploads">
              <div className="doc-upload-item">
                <label>Kartu Keluarga (KK) <span>*Wajib</span></label>
                <input type="file" accept=".pdf,image/*" required onChange={(e) => e.target.files && setKkFile(e.target.files[0])} />
              </div>
              <div className="doc-upload-item">
                <label>Akte Kelahiran <span>*Wajib</span></label>
                <input type="file" accept=".pdf,image/*" required onChange={(e) => e.target.files && setAkteFile(e.target.files[0])} />
              </div>
              <div className="doc-upload-item">
                <label>Ijazah Terakhir <span>*Wajib</span></label>
                <input type="file" accept=".pdf,image/*" required onChange={(e) => e.target.files && setIjazahFile(e.target.files[0])} />
              </div>
              <div className="doc-upload-item">
                <label>Surat Keterangan Tidak Mampu (SKTM) <span>*Opsional</span></label>
                <input type="file" accept=".pdf,image/*" onChange={(e) => e.target.files && setSktmFile(e.target.files[0])} />
              </div>
            </div>
          </div>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <input type="checkbox" id="pusdaValidationCheck" required style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }} />
            <label htmlFor="pusdaValidationCheck" style={{ color: '#166534', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}>
              Saya yakin bahwa data yang saya masukkan sudah benar
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-submit-pusda">
            {isSubmitting ? (
              <span className="loading-text">Sedang Mengenkripsi & Mengunggah Data...</span>
            ) : (
              "Kirim ke Pusat Data"
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .pusda-layout {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
          padding-bottom: 5rem;
        }

        .pusda-hero {
          background: linear-gradient(135deg, #002147 0%, #00122e 100%);
          padding: 8rem 1.5rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .pusda-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: url('https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999215/vdc4p1otuifswwdjx7zt.jpg') center/cover;
          opacity: 0.15;
          mix-blend-mode: overlay;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-badge {
          background: rgba(255,140,0,0.15);
          color: #ff8c00;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          display: inline-block;
          border: 1px solid rgba(255,140,0,0.3);
        }

        .hero-title {
          font-size: 3rem;
          color: white;
          font-weight: 900;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }
        
        .hero-title span {
          color: #ff8c00;
        }

        .hero-desc {
          color: #cbd5e1;
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .pusda-container {
          max-width: 900px;
          margin: -3rem auto 0;
          position: relative;
          z-index: 20;
          padding: 0 1.5rem;
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .info-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
          text-align: center;
          transition: transform 0.3s;
        }

        .info-card:hover {
          transform: translateY(-5px);
        }

        .info-card .icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 1rem;
        }

        .info-card h3 {
          font-size: 1rem;
          color: #002147;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .info-card p {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.5;
        }

        .pusda-form {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
          border: 1px solid #e2e8f0;
        }

        .form-section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-title span {
          background: #002147;
          color: white;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.9rem;
        }

        .foto-upload-area {
          display: flex;
          gap: 2rem;
          align-items: center;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 16px;
          border: 1.5px dashed #cbd5e1;
          margin-bottom: 2rem;
        }

        .foto-preview {
          width: 120px;
          height: 150px;
          background: white;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border 0.2s;
        }

        .foto-preview:hover {
          border-color: #002147;
        }

        .foto-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .foto-placeholder {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .foto-instructions ul {
          margin: 0 0 1rem 1.2rem;
          padding: 0;
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.6;
        }
        
        .btn-upload-foto {
          background: #002147;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }

        .input-group input, .input-group select, .input-group textarea {
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.9rem;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }

        .input-group input:focus, .input-group select:focus, .input-group textarea:focus {
          outline: none;
          border-color: #002147;
          background: white;
          box-shadow: 0 0 0 3px rgba(0,33,71,0.1);
        }

        .doc-uploads {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .doc-upload-item {
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .doc-upload-item label {
          font-size: 0.9rem;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          justify-content: space-between;
        }
        
        .doc-upload-item label span {
          color: #ef4444;
          font-size: 0.75rem;
        }

        .doc-upload-item input {
          font-size: 0.85rem;
        }

        .btn-submit-pusda {
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(135deg, #002147 0%, #003a7a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 20px rgba(0,33,71,0.2);
        }

        .btn-submit-pusda:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0,33,71,0.3);
        }

        .btn-submit-pusda:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: #475569;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .pusda-hero {
            padding: 7rem 1.5rem 3rem;
          }
          .hero-title { font-size: 2.2rem; }
          .info-cards, .grid-2, .doc-uploads {
            grid-template-columns: 1fr;
          }
          .foto-upload-area {
            flex-direction: column;
            text-align: center;
          }
          .foto-instructions ul { margin-left: 0; list-style-position: inside; }
        }
      `}</style>
    </main>
  );
}
