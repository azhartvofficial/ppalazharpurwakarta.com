"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";
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

  const [selectedJenjang, setSelectedJenjang] = useState("MA Unggulan Al-Azhar");

  useEffect(() => {
    if (selectedJenjang === "MA Unggulan Al-Azhar") setFormData(f => ({...f, kelas: "Kelas 10 (Sepuluh) MA"}));
    else if (selectedJenjang === "SMP Islam Al-Azhar") setFormData(f => ({...f, kelas: "Kelas 7 (Tujuh) SMP"}));
    else if (selectedJenjang === "SDIT Al-Azhar") setFormData(f => ({...f, kelas: "Kelas 1 (Satu) SD"}));
  }, [selectedJenjang]);

  const getKelasOptions = () => {
    if (selectedJenjang === "MA Unggulan Al-Azhar") return [
      { val: "10", label: "Kelas 10 (Sepuluh) MA" },
      { val: "11", label: "Kelas 11 (Sebelas) MA" },
      { val: "12", label: "Kelas 12 (Dua Belas) MA" }
    ];
    if (selectedJenjang === "SMP Islam Al-Azhar") return [
      { val: "7", label: "Kelas 7 (Tujuh) SMP" },
      { val: "8", label: "Kelas 8 (Delapan) SMP" },
      { val: "9", label: "Kelas 9 (Sembilan) SMP" }
    ];
    if (selectedJenjang === "SDIT Al-Azhar") return [
      { val: "1", label: "Kelas 1 (Satu) SD" },
      { val: "2", label: "Kelas 2 (Dua) SD" },
      { val: "3", label: "Kelas 3 (Tiga) SD" },
      { val: "4", label: "Kelas 4 (Empat) SD" },
      { val: "5", label: "Kelas 5 (Lima) SD" },
      { val: "6", label: "Kelas 6 (Enam) SD" }
    ];
    return [];
  };
  // Alamat & Wilayah States
  const [isWNA, setIsWNA] = useState(false);
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
  ];
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);

  const [selectedProvId, setSelectedProvId] = useState("");
  const [selectedProvName, setSelectedProvName] = useState("");
  const [selectedRegId, setSelectedRegId] = useState("");
  const [selectedRegName, setSelectedRegName] = useState("");
  const [selectedDistId, setSelectedDistId] = useState("");
  const [selectedDistName, setSelectedDistName] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [selectedVillageName, setSelectedVillageName] = useState("");
  
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
    fetch("/api/wilayah/provinces.json")
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err));

    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then(res => res.json())
      .then(data => {
        const sorted = data.map((c: any) => c.name.common).sort();
        setCountries(sorted);
      })
      .catch(() => setCountries(["Indonesia", "Malaysia", "Singapura", "Brunei Darussalam", "Arab Saudi", "Mesir", "Turki"]));
  }, []);

  // Fetch Regencies when Province changes
  useEffect(() => {
    if (selectedProvId) {
      fetch(`/api/wilayah/regencies/${selectedProvId}.json`)
        .then(res => res.json())
        .then(data => {
          setRegencies(data);
          setSelectedRegId("");
          setSelectedRegName("");
          setDistricts([]);
          setSelectedDistId("");
          setSelectedDistName("");
          setVillages([]);
          setSelectedVillageId("");
          setSelectedVillageName("");
        })
        .catch(err => console.error(err));
    } else {
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
    }
  }, [selectedProvId]);

  // Fetch Districts when Regency changes
  useEffect(() => {
    if (selectedRegId) {
      fetch(`/api/wilayah/districts/${selectedRegId}.json`)
        .then(res => res.json())
        .then(data => {
          setDistricts(data);
          setSelectedDistId("");
          setSelectedDistName("");
          setVillages([]);
          setSelectedVillageId("");
          setSelectedVillageName("");
        })
        .catch(err => console.error(err));
    } else {
      setDistricts([]);
      setVillages([]);
    }
  }, [selectedRegId]);

  // Fetch Villages when District changes
  useEffect(() => {
    if (selectedDistId) {
      fetch(`/api/wilayah/villages/${selectedDistId}.json`)
        .then(res => res.json())
        .then(data => {
          setVillages(data);
          setSelectedVillageId("");
          setSelectedVillageName("");
        })
        .catch(err => console.error(err));
    } else {
      setVillages([]);
    }
  }, [selectedDistId]);

  const [pasFotoFile, setPasFotoFile] = useState<File | null>(null);
  const [pasFotoPreview, setPasFotoPreview] = useState<string | null>(null);
  const [kkFile, setKkFile] = useState<File | null>(null);
  const [akteFile, setAkteFile] = useState<File | null>(null);
  const [ijazahFile, setIjazahFile] = useState<File | null>(null);
  const [sktmFile, setSktmFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrors(prev => {
      if (Object.keys(prev).length === 0) return prev;
      const newErrors = { ...prev };
      if (formData.nama_lengkap) delete newErrors.nama_lengkap;
      if (formData.tempat_tanggal_lahir) delete newErrors.tempat_tanggal_lahir;
      if (formData.nik && formData.nik.trim().length === 16) delete newErrors.nik;
      if (formData.nisn && formData.nisn.trim().length === 10) delete newErrors.nisn;
      if (formData.nama_ayah) delete newErrors.nama_ayah;
      if (formData.pekerjaan_ayah) delete newErrors.pekerjaan_ayah;
      if (formData.nama_ibu) delete newErrors.nama_ibu;
      if (formData.pekerjaan_ibu) delete newErrors.pekerjaan_ibu;
      if (formData.no_hp_wali) delete newErrors.no_hp_wali;
      if (detailAlamat) delete newErrors.detailAlamat;
      if (pasFotoFile) delete newErrors.pasFotoFile;
      if (selectedProvId) delete newErrors.provinsi;
      if (selectedRegId) delete newErrors.kota;
      if (selectedDistId) delete newErrors.kecamatan;
      if (selectedVillageId) delete newErrors.kelurahan;
      if (selectedCountryName) delete newErrors.negara;
      if (selectedJenjang) delete newErrors.jenjang;
      return newErrors;
    });
  }, [formData, detailAlamat, pasFotoFile, selectedProvId, selectedRegId, selectedDistId, selectedCountryName, selectedJenjang]);

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (["nama_lengkap", "tempat_tanggal_lahir", "nama_ayah", "pekerjaan_ayah", "nama_ibu", "pekerjaan_ibu"].includes(e.target.name)) {
      value = capitalizeWords(value);
    }
    setFormData({ ...formData, [e.target.name]: value });
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

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size > 4 * 1024 * 1024) {
        alert('Gagal: Ukuran file PDF maksimal adalah 4 MB. Silakan kompres PDF Anda terlebih dahulu.');
        e.target.value = '';
        setter(null);
        return;
      }
      setter(file);
    }
  };

  
  const compressImage = async (file: File, label: string) => {
    if (!file.type.startsWith('image/')) return file;
    setCompressionStatus("Mengompresi " + label + "...");
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (progress: number) => {
        setCompressionProgress(progress);
      }
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error(error);
      return file;
    }
  };

  const uploadFile = async (file: File, folderType: string, targetFolderId?: string, forceEndpoint?: string) => {
    const fileExt = file.name.split('.').pop();
    const safeName = formData.nama_lengkap.replace(/\s+/g, '').toUpperCase();
    const fileName = `( ${folderType}_${safeName} ).${fileExt}`;
    
    const apiFormData = new FormData();
    apiFormData.append('file', file);
    apiFormData.append('filename', fileName);
    if (targetFolderId) apiFormData.append('targetFolderId', targetFolderId);

    const endpoint = forceEndpoint ? forceEndpoint : (folderType === 'PASFOTO' ? '/api/upload-cloudinary' : '/api/upload');
    
    const res = await fetch(endpoint, {
      method: 'POST',
      body: apiFormData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengunggah file');
      
    return data.url;
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
    const newErrors: {[key: string]: string} = {};

    if (!formData.nama_lengkap) newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    if (!formData.tempat_tanggal_lahir) newErrors.tempat_tanggal_lahir = "Tempat, tanggal lahir wajib diisi";
    if (!formData.nik) newErrors.nik = "NIK wajib diisi";
    if (!formData.nisn) newErrors.nisn = "NISN wajib diisi";
    if (!formData.nama_ayah) newErrors.nama_ayah = "Nama Ayah wajib diisi";
    if (!formData.pekerjaan_ayah) newErrors.pekerjaan_ayah = "Pekerjaan Ayah wajib diisi";
    if (!formData.nama_ibu) newErrors.nama_ibu = "Nama Ibu wajib diisi";
    if (!formData.pekerjaan_ibu) newErrors.pekerjaan_ibu = "Pekerjaan Ibu wajib diisi";
    if (!formData.no_hp_wali) newErrors.no_hp_wali = "No HP Wali wajib diisi";
    if (!detailAlamat) newErrors.detailAlamat = "Detail alamat wajib diisi";
    if (!pasFotoFile) newErrors.pasFotoFile = "Pas foto wajib diunggah";
    if (!isWNA) {
      if (!selectedProvId) newErrors.provinsi = "Provinsi wajib dipilih";
      if (!selectedRegId) newErrors.kota = "Kota/Kabupaten wajib dipilih";
      if (!selectedDistId) newErrors.kecamatan = "Kecamatan wajib dipilih";
      if (!selectedVillageId) newErrors.kelurahan = "Kelurahan/Desa wajib dipilih";
    } else {
      if (!selectedCountryName) newErrors.negara = "Negara wajib dipilih";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMsg("Mohon lengkapi semua kolom yang wajib diisi!");
      return;
    }
    setErrors({});

    if (formData.nik && formData.nik.trim().length !== 16) {
      setErrorMsg("Perhatian: Nomor Induk Kependudukan (NIK) harus berjumlah tepat 16 digit angka.");
      return;
    }
    
    if (formData.nisn && formData.nisn.trim().length !== 10) {
      setErrorMsg("Perhatian: Nomor Induk Siswa Nasional (NISN) harus berjumlah tepat 10 digit angka.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      setCompressionStatus("Memeriksa data...");
      // Check for duplicates
      const { data: duplicates, error: dupError } = await supabase
        .from('pusat_data_siswa')
        .select('id, nama_lengkap, nik, nisn, tempat_tanggal_lahir')
        .or(`nik.eq.${formData.nik},nisn.eq.${formData.nisn},tempat_tanggal_lahir.eq."${formData.tempat_tanggal_lahir}"`);

      if (dupError) {
        throw new Error("Gagal memeriksa data duplikat.");
      }

      if (duplicates && duplicates.length > 0) {
        const dup = duplicates[0];
        let reason = "";
        if (dup.nik === formData.nik) reason = "NIK";
        else if (dup.nisn === formData.nisn) reason = "NISN";
        else reason = "TTL (Tempat, Tanggal Lahir)";
        
        throw new Error(`Pendaftaran ditolak: Data dengan ${reason} yang sama sudah terdaftar sebelumnya.`);
      }

      // Upload files
      let pas_foto = "";
      let kk_url = null;
      let akte_url = null;
      let ijazah_url = null;
      let sktm_url = null;
      
      setCompressionStatus("Menyiapkan file...");
      setCompressionProgress(0);

      const compressedPasFoto = await compressImage(pasFotoFile!, "Pas Foto");
      const compressedKk = kkFile ? await compressImage(kkFile, "Kartu Keluarga") : null;
      const compressedAkte = akteFile ? await compressImage(akteFile, "Akte Kelahiran") : null;
      const compressedIjazah = ijazahFile ? await compressImage(ijazahFile, "Ijazah") : null;
      const compressedSktm = sktmFile ? await compressImage(sktmFile, "SKTM") : null;

      setCompressionStatus("Mengunggah file ke server...");
      setCompressionProgress(100);

      // 1. Create Folder
      let targetFolderId = "";
      try {
        const folderRes = await fetch('/api/create-student-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kelas: `Kelas ${formData.kelas}`,
            gender: formData.gender,
            nama_lengkap: formData.nama_lengkap
          })
        });
        const folderData = await folderRes.json();
        if (!folderRes.ok) throw new Error(folderData.error);
        targetFolderId = folderData.folderId;
      } catch (err) {
        console.error("Gagal membuat folder:", err);
      }

      // 2. Upload Files
      pas_foto = await uploadFile(compressedPasFoto, "PASFOTO", targetFolderId, '/api/upload-cloudinary');
      try {
        await uploadFile(compressedPasFoto, "PASFOTO", targetFolderId, '/api/upload');
      } catch (e) {
        console.error("Gagal mengarsip pas foto ke GDrive", e);
      }

      if (compressedKk) kk_url = await uploadFile(compressedKk, "KK", targetFolderId);
      if (compressedAkte) akte_url = await uploadFile(compressedAkte, "AKTE", targetFolderId);
      if (compressedIjazah) ijazah_url = await uploadFile(compressedIjazah, "IJAZAH", targetFolderId);
      if (compressedSktm) sktm_url = await uploadFile(compressedSktm, "SKTM", targetFolderId);

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
        kelurahan: selectedVillageName,
        detail: detailAlamat,
        kode_pos: kodePos,
        full_text: `${detailAlamat}, Kel/Desa. ${selectedVillageName}, Kec. ${selectedDistName}, Kota/Kab. ${selectedRegName}, Prov. ${selectedProvName}${kodePos ? ' - ' + kodePos : ''}`
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
      // Prevent failure if email_santri is not in DB
      

      const { error } = await supabase.from('pusat_data_siswa').insert([payload]);
      
      if (error) throw error;

      setSubmitSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat mengunggah data.");
    } finally {
      setCompressionStatus("");
      setCompressionProgress(0);
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <main className="pusda-layout">
        <Navbar />
        <div className="pusda-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .checkmark-circle {
              stroke-dasharray: 166;
              stroke-dashoffset: 166;
              stroke-width: 2;
              stroke-miterlimit: 10;
              stroke: #4CAF50;
              fill: none;
              animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
            }
            .checkmark {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              display: block;
              stroke-width: 3;
              stroke: #fff;
              stroke-miterlimit: 10;
              margin: 0 auto 1.5rem auto;
              box-shadow: inset 0px 0px 0px #4CAF50;
              animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
            }
            .checkmark-check {
              transform-origin: 50% 50%;
              stroke-dasharray: 48;
              stroke-dashoffset: 48;
              animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
            }
            @keyframes stroke {
              100% { stroke-dashoffset: 0; }
            }
            @keyframes scale {
              0%, 100% { transform: none; }
              50% { transform: scale3d(1.1, 1.1, 1); }
            }
            @keyframes fill {
              100% { box-shadow: inset 0px 0px 0px 50px #4CAF50; }
            }
          `}} />
          <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <h2 style={{ color: '#002147', fontWeight: 900, marginBottom: '1rem' }}>Data Berhasil Dikirim!</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 }}>Terima kasih, data identitas santri dan dokumen pendukung telah berhasil disimpan dengan aman di Pusat Data Santri Al-Azhar (PUSDA AZHAR).</p>
            <button onClick={() => window.location.href = '/'} style={{ padding: '1rem 2rem', background: '#002147', color: 'white', fontWeight: 800, border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0a3a70'} onMouseLeave={(e) => e.currentTarget.style.background = '#002147'}>
              Kembali Halaman Beranda
            </button>
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

        <form onSubmit={handleSubmit} noValidate className="pusda-form">
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
                {errors.pasFotoFile && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.pasFotoFile}</div>}
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label>Nama Lengkap Santri</label>
                <input type="text" name="nama_lengkap" required value={formData.nama_lengkap} onChange={handleInputChange} placeholder="Sesuai Akte Kelahiran" />
                {errors.nama_lengkap && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.nama_lengkap}</div>}
              </div>
              <div className="input-group">
                <label>Email Peserta Didik (Opsional)</label>
                <input type="email" name="email_santri" value={formData.email_santri} onChange={handleInputChange} placeholder="Email aktif (opsional)" />
                {errors.email_santri && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.email_santri}</div>}
              </div>
              <div className="input-group">
                <label>Jenjang Pendidikan</label>
                <select value={selectedJenjang} onChange={(e) => setSelectedJenjang(e.target.value)}>
                  <option value="MA Unggulan Al-Azhar">MA Unggulan Al-Azhar</option>
                  <option value="SMP Islam Al-Azhar">SMP Islam Al-Azhar</option>
                  <option value="SDIT Al-Azhar">SDIT Al-Azhar</option>
                </select>
                {errors.jenjang && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.jenjang}</div>}
              </div>
              <div className="input-group">
                <label>Kelas saat ini</label>
                <select name="kelas" required value={formData.kelas} onChange={handleInputChange}>
                  {getKelasOptions().map(k => (
                    <option key={k.val} value={k.label}>{k.label}</option>
                  ))}
                </select>
                {errors.kelas && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.kelas}</div>}
              </div>
              <div className="input-group">
                <label>Program Pendidikan</label>
                <select name="program_pendidikan" required value={formData.program_pendidikan} onChange={handleInputChange}>
                  <option value="Mondok">Mondok (Pesantren)</option>
                  <option value="Non Mondok">Non Mondok (Pulang Pergi)</option>
                </select>
                {errors.program_pendidikan && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.program_pendidikan}</div>}
              </div>
              <div className="input-group">
                <label>Gender / Jenis Kelamin</label>
                <select name="gender" required value={formData.gender} onChange={handleInputChange}>
                  <option value="Putra">Putra (Laki-laki)</option>
                  <option value="Putri">Putri (Perempuan)</option>
                </select>
                {errors.gender && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.gender}</div>}
              </div>
              <div className="input-group">
                <label>Tempat, Tanggal Lahir</label>
                <input type="text" name="tempat_tanggal_lahir" required value={formData.tempat_tanggal_lahir} onChange={handleInputChange} placeholder="Cth: Purwakarta, 17 Agustus 2010" />
                {errors.tempat_tanggal_lahir && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.tempat_tanggal_lahir}</div>}
              </div>
              <div className="input-group">
                <label>Nomor Induk Kependudukan (NIK)</label>
                <input type="number" name="nik" required value={formData.nik} onChange={handleInputChange} placeholder="16 digit angka" />
                {errors.nik && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.nik}</div>}
              </div>
              <div className="input-group">
                <label>Nomor Induk Siswa Nasional (NISN)</label>
                <input type="number" name="nisn" required value={formData.nisn} onChange={handleInputChange} placeholder="10 digit angka" />
                {errors.nisn && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.nisn}</div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title"><span>2</span> Data Orang Tua & Kontak</h2>
            <div className="grid-2">
              <div className="input-group">
                <label>Nama Ayah Kandung</label>
                <input type="text" name="nama_ayah" required value={formData.nama_ayah} onChange={handleInputChange} />
                {errors.nama_ayah && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.nama_ayah}</div>}
              </div>
              <div className="input-group">
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
              </div>
              <div className="input-group">
                <label>Nama Ibu Kandung</label>
                <input type="text" name="nama_ibu" required value={formData.nama_ibu} onChange={handleInputChange} />
                {errors.nama_ibu && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.nama_ibu}</div>}
              </div>
              <div className="input-group">
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
              </div>
              <div className="input-group">
                <label>No HP/WhatsApp Wali (Aktif)</label>
                <input type="tel" name="no_hp_wali" required value={formData.no_hp_wali} onChange={handleInputChange} placeholder="08..." />
                {errors.no_hp_wali && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.no_hp_wali}</div>}
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
                {errors.provinsi && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.provinsi}</div>}
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
                {errors.kota && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.kota}</div>}
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
                {errors.kecamatan && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.kecamatan}</div>}
                  </div>
                  <div className="input-group">
                    <label>Kelurahan / Desa</label>
                    <select 
                      required={!isWNA} 
                      value={selectedVillageId}
                      disabled={!selectedDistId}
                      onChange={(e) => {
                        setSelectedVillageId(e.target.value);
                        setSelectedVillageName(e.target.options[e.target.selectedIndex].text);
                      }}
                    >
                      <option value="">-- Pilih Kelurahan/Desa --</option>
                      {villages.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                {errors.kelurahan && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.kelurahan}</div>}
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
                {errors.detailAlamat && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.detailAlamat}</div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title"><span>3</span> Unggah Dokumen Berkas</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>Silakan unggah dokumen pendukung dalam format PDF atau Gambar (JPG/PNG). Berkas ini akan langsung masuk ke arsip pusat data.</p>
            
            <div className="doc-uploads">
              <div className="doc-upload-item">
                <label>Kartu Keluarga (KK) <span>*Wajib</span></label>
                <input type="file" accept=".pdf,image/*" required onChange={(e) => handleDocumentChange(e, setKkFile)} />
              </div>
              <div className="doc-upload-item">
                <label>Akte Kelahiran <span>*Wajib</span></label>
                <input type="file" accept=".pdf,image/*" required onChange={(e) => handleDocumentChange(e, setAkteFile)} />
              </div>
              <div className="doc-upload-item">
                <label>Ijazah Terakhir <span>*Wajib</span></label>
                <input type="file" accept=".pdf,image/*" required onChange={(e) => handleDocumentChange(e, setIjazahFile)} />
              </div>
              <div className="doc-upload-item">
                <label>Surat Keterangan Tidak Mampu (SKTM) <span>*Opsional</span></label>
                <input type="file" accept=".pdf,image/*" onChange={(e) => handleDocumentChange(e, setSktmFile)} />
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
              <span className="loading-text">
                {compressionStatus ? `${compressionStatus} (${compressionProgress}%)` : "Sedang Mengenkripsi & Mengunggah Data..."}
              </span>
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
          background: url('https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999215/vdc4p1otuifswwdjx7zt.jpg') center/cover;
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
