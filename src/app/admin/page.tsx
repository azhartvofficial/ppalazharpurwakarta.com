"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';
import getCroppedImg from '@/lib/cropImage';

const frizQuadrata = localFont({
  src: "../../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

interface Pendaftar {
  id: string;
  created_at: string;
  nama_lengkap: string;
  email: string;
  no_hp: string;
  jenjang: string;
  status: string;
}

interface NewsItem {
  id: string;
  kategori: string;
  judul_utama: string;
  sumber_gambar: string;
  sumber_gambar_manual?: string;
  gambar_judul_url?: string;
  isi_berita: string;
  jenis_lampiran_2?: string;
  lampiran_2_url?: string;
  penulis: string;
  sumber_opsional?: string;
  status: "Published" | "Draft";
  created_at?: string;
}

interface DocPhoto {
  id: string;
  url: string;
  description: string;
  date: string;
}

interface LoginRequest {
  id: string;
  name: string;
  email: string;
  role: string;
  kepengurusan?: string;
  nama_santri?: string;
  jenjang_pendidikan?: string;
  pilihan_kelas?: string;
  program_pendidikan?: string;
  requestedAt: string;
  device: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Wali" | "Super Admin";
  status: "Aktif" | "Nonaktif";
  createdAt: string;
  lastLogin: string;
  kepengurusan?: string;
  lembaga?: string;
  kampus?: string;
  nama_santri?: string;
  jenjang_pendidikan?: string;
  pilihan_kelas?: string;
  program_pendidikan?: string;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "ppdb" | "news" | "docs" | "settings" | "accounts" | "pusatdata">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const modalStatesRef = useRef<any>({});
  
  const [activePriorityModal, setActivePriorityModal] = useState<"santri" | "pendaftaran" | "azlearn" | null>(null);

  // Real-time visitor states
  const [totalVisitors, setTotalVisitors] = useState(1482);
  const [activeVisitors, setActiveVisitors] = useState(12);
  const [todayVisitors, setTodayVisitors] = useState(148);

  // Maintenance states
  const [maintenanceMode, setMaintenanceMode] = useState(false);



  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => setMaintenanceMode(data.maintenanceMode))
        .catch(err => console.error("Error fetching maintenance settings:", err));
    }
  }, []);


  // Master Password State
  const [showMasterPasswordPrompt, setShowMasterPasswordPrompt] = useState(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState("");
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [pendingSuperAdminAction, setPendingSuperAdminAction] = useState<(() => void) | null>(null);

  const executePendingAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterPasswordInput === "azhar123") {
      if (pendingSuperAdminAction) {
        pendingSuperAdminAction();
      }
      setShowMasterPasswordPrompt(false);
      setMasterPasswordInput("");
      setPendingSuperAdminAction(null);
    } else {
      openAlert("Password Super Admin Salah!");
    }
  };

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
  }>({
    isOpen: false, title: "", message: "", onConfirm: () => {}, confirmText: "Ya", cancelText: "Batal", isDanger: false
  });

  const openConfirm = (title: string, message: string, onConfirm: () => void, isDanger: boolean = false, confirmText: string = "Ya", cancelText: string = "Batal") => {
    setConfirmModal({
      isOpen: true, title, message, onConfirm: () => { setConfirmModal(prev => ({ ...prev, isOpen: false })); onConfirm(); }, confirmText, cancelText, isDanger
    });
  };

  // Prompt Modal State
  const [promptModal, setPromptModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder: string;
    onConfirm: (val: string) => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false, title: "", message: "", placeholder: "", onConfirm: () => {}, confirmText: "Simpan", cancelText: "Batal"
  });
  const [promptValue, setPromptValue] = useState("");

  const openPrompt = (title: string, message: string, placeholder: string, onConfirm: (val: string) => void, confirmText: string = "Simpan", cancelText: string = "Batal") => {
    setPromptValue("");
    setPromptModal({
      isOpen: true, title, message, placeholder, onConfirm: (val) => { setPromptModal(prev => ({ ...prev, isOpen: false })); onConfirm(val); }, confirmText, cancelText
    });
  };

  // Alert Modal State
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isError: boolean;
  }>({
    isOpen: false, title: "", message: "", isError: false
  });

  const openAlert = (message: string, isError: boolean = false, title?: string) => {
    setAlertModal({
      isOpen: true,
      title: title || (isError ? "Terjadi Kesalahan" : "Pemberitahuan"),
      message,
      isError
    });
  };

  const toggleMaintenanceMode = async () => {
    const nextState = !maintenanceMode;
    
    // Konfirmasi
    const title = nextState ? "Aktifkan Maintenance Mode?" : "Matikan Maintenance Mode?";
    const message = nextState 
      ? "Apakah Anda yakin ingin mengaktifkan Maintenance Mode? Seluruh akses pengunjung dan akun lain akan diputus seketika."
      : "Apakah Anda yakin ingin mematikan Maintenance Mode? Akses website akan kembali normal.";

    openConfirm(title, message, () => {
      setPendingSuperAdminAction(() => async () => {
        try {
          await fetch('/api/settings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          body: JSON.stringify({ maintenanceMode: nextState }),
        });
        window.location.reload();
        } catch (err) {
          console.error("Error saving maintenance settings:", err);
          openAlert("Gagal menyimpan pengaturan Maintenance Mode.");
        }
      });
      setShowMasterPasswordPrompt(true);
    }, nextState);
  };

  const [topPages, setTopPages] = useState<any[]>([
    { path: "🏠 / (Beranda Utama)", pct: 68, count: 1008 },
    { path: "📝 /pendaftaran (PPDB)", pct: 22, count: 326 },
    { path: "📰 /berita (Kabar Pesantren)", pct: 10, count: 148 }
  ]);
  const [trafficSources, setTrafficSources] = useState<any[]>([
    { source: "Direct Link / WhatsApp", pct: 45 },
    { source: "🔍 Google Search", pct: 35 },
    { source: "🌐 Media Sosial (IG/FB)", pct: 20 }
  ]);
  const [deviceStats, setDeviceStats] = useState({ mobile: 74, desktop: 22, tablet: 4 });
  const [supabaseSyncActive, setSupabaseSyncActive] = useState(false);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [hoveredChartPoint, setHoveredChartPoint] = useState<number | null>(null);
  const [chartMaxVal, setChartMaxVal] = useState<number>(800);
  const [chartRange, setChartRange] = useState<"7D" | "30D">("7D");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    let newData: any[] = [];
    let maxVisits = 0;
    
    if (chartRange === "7D") {
      // 7 Hari Terakhir
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const seed = d.getDate() * (d.getMonth() + 1);
        const visitors = 300 + (seed % 500); 
        if (visitors > maxVisits) maxVisits = visitors;
        
        newData.push({
          date: `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })}`,
          visitors,
          x: 0,
          y: 0
        });
      }
    } else {
      // 30D (Dari awal bulan)
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(currentYear, currentMonth, i);
        let visitors = 0;
        
        if (i <= today.getDate()) {
          const seed = i * (currentMonth + 1);
          visitors = 300 + (seed % 600);
        }
        if (visitors > maxVisits) maxVisits = visitors;
        
        newData.push({
          date: `${i} ${d.toLocaleString('id-ID', { month: 'short' })}`,
          visitors,
          x: 0,
          y: 0
        });
      }
    }
    
    const safeMaxVal = maxVisits > 0 ? Math.ceil(maxVisits / 100) * 100 + 100 : 800;
    setChartMaxVal(safeMaxVal);
    
    const count = newData.length;
    const spanX = 600;
    
    newData = newData.map((pt, idx) => {
      const x = 50 + (count > 1 ? (idx / (count - 1)) * spanX : 0);
      const ratio = pt.visitors / safeMaxVal;
      const y = 190 - (ratio * 150);
      return { ...pt, x, y };
    });
    
    setChartData(newData);
  }, [chartRange]);
  
  // Auth states
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [demoMode, setDemoMode] = useState(true); // Default to demo mode so they can preview the gorgeous UI instantly!

  // Data states
  const [pendaftaran, setPendaftaran] = useState<Pendaftar[]>([]);
  const [loadingPpdb, setLoadingPpdb] = useState(false);
  const [errorPpdb, setErrorPpdb] = useState("");

  // News states
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [errorNews, setErrorNews] = useState("");

  // Form states
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newNewsCategory, setNewNewsCategory] = useState("Papan Pengumuman");
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsImageSource, setNewNewsImageSource] = useState<"Internal" | "Manual">("Internal");
  const [newNewsImageManualSource, setNewNewsImageManualSource] = useState("");
  const [newNewsImageFile, setNewNewsImageFile] = useState<File | null>(null);
  const [isUploadingNews, setIsUploadingNews] = useState(false);
  const [newNewsContent, setNewNewsContent] = useState("");
  const [newNewsClosingParagraph, setNewNewsClosingParagraph] = useState("");
  const [newNewsAttachmentType, setNewNewsAttachmentType] = useState<"" | "PDF" | "Gambar" | "Video Youtube" | "Link Lainnya">("");
  const [newNewsAttachmentUrl, setNewNewsAttachmentUrl] = useState("");
  const [newNewsAttachmentTitle, setNewNewsAttachmentTitle] = useState("");
  const [newNewsAttachmentFile, setNewNewsAttachmentFile] = useState<File | null>(null);
  const [newNewsAuthor, setNewNewsAuthor] = useState("");
  const [newNewsOptionalSources, setNewNewsOptionalSources] = useState("");
  const [newNewsStatus, setNewNewsStatus] = useState<"Published" | "Draft">("Published");
  
  // States for Image Compress & Upload
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);

  // Docs states
  const [photos, setPhotos] = useState<DocPhoto[]>([
    { id: "1", url: "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999166/mnxrqkh8y8lei8wjio1f.png", description: "Wisuda Kelulusan Alumni Angkatan 12", date: "24 April 2026" },
    { id: "2", url: "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999167/lmj09gushldyzgflpfms.png", description: "Kegiatan Halaqah Qur'an di Masjid Utama", date: "18 April 2026" },
    { id: "3", url: "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999168/fttozmnhyylwwegvwl6r.png", description: "Kunjungan Studi Lapangan Santri Mandiri", date: "05 April 2026" },
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoDesc, setNewPhotoDesc] = useState("");
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

  // Accounts sub-tab and login requests states
  const [accountsSubTab, setAccountsSubTab] = useState<"kelola_akun" | "permintaan_login">("kelola_akun");
  
  // Pusat Data Siswa states
  const [pusatDataSubTab, setPusatDataSubTab] = useState<"data_siswa" | "pengajuan_data" | "status_pendaftaran">("data_siswa");
  
  // Registration Settings states
  const [registrationSettings, setRegistrationSettings] = useState<any[]>([]);
  const [draftDates, setDraftDates] = useState<Record<number, { open_date: string, close_date: string }>>({});
  const [loadingRegistration, setLoadingRegistration] = useState(false);

  // Pusat Data Filters
  const [pusatDataSearchQuery, setPusatDataSearchQuery] = useState("");
  const [pusatDataFilterGender, setPusatDataFilterGender] = useState("Semua");
  const [pusatDataFilterKelas, setPusatDataFilterKelas] = useState("Semua");
  const [pusatDataFilterJenjang, setPusatDataFilterJenjang] = useState("Semua");
  const [pusatDataFilterProgram, setPusatDataFilterProgram] = useState("Semua");
  const [pusatDataFilterBerkas, setPusatDataFilterBerkas] = useState("Semua");
  const [pusatDataFilterProvinsi, setPusatDataFilterProvinsi] = useState("Semua");
  const [pusatDataFilterTanggal, setPusatDataFilterTanggal] = useState("");
  const [pusatDataFilterLembaga, setPusatDataFilterLembaga] = useState("Semua");
  const [pusatDataFilterKampus, setPusatDataFilterKampus] = useState("Semua");
  const [showAddPusatDataModal, setShowAddPusatDataModal] = useState(false);
  const [isEditingPusatData, setIsEditingPusatData] = useState(false);
  const [editPusatDataId, setEditPusatDataId] = useState<string | null>(null);
  const [addPusatDataExistingFiles, setAddPusatDataExistingFiles] = useState({
    pas_foto: "", kk_url: "", akte_url: "", ijazah_url: "", sktm_url: ""
  });

  const handleEditPusatData = async (data: any) => {
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
      alamat: "",
      lembaga: data.lembaga || "Pondok Pesantren",
      kampus: data.kampus || "Azhar 1"
    });
    try {
      const alamatObj = typeof data.alamat === 'string' ? JSON.parse(data.alamat) : data.alamat;
      setAddPusatDataDetail(alamatObj.detail || "");
      if (alamatObj.kode_pos) setAddPusatDataKodePos(alamatObj.kode_pos);
      setIsAddPekerjaanAyahLainnya(data.pekerjaan_ayah && !jobOptions.includes(data.pekerjaan_ayah));
      setIsAddPekerjaanIbuLainnya(data.pekerjaan_ibu && !jobOptions.includes(data.pekerjaan_ibu));
      if (alamatObj.is_wna !== undefined) setAddPusatDataIsWNA(alamatObj.is_wna);
      
      if (alamatObj.is_wna) {
        setAddPusatDataCountry(alamatObj.negara || "");
      } else {
        if (alamatObj.provinsi) {
          let currentProvinces = provinces;
          if (currentProvinces.length === 0) {
            try {
              const res = await fetch("/api/wilayah/provinces.json");
              currentProvinces = await res.json();
              setProvinces(currentProvinces);
            } catch(e) {}
          }
          
          setAddPusatDataProvId("OLD_PROV");
          setAddPusatDataProvName(alamatObj.provinsi);
          setAddPusatDataRegId("OLD_REG");
          setAddPusatDataRegName(alamatObj.kota);
          setAddPusatDataDistId("OLD_DIST");
          setAddPusatDataDistName(alamatObj.kecamatan);
          setAddPusatDataVillageId("OLD_VILL");
          setAddPusatDataVillageName(alamatObj.kelurahan || "");
          
          const provId = currentProvinces.find(p => p.name?.trim().toUpperCase() === alamatObj.provinsi?.trim().toUpperCase())?.id;

          if (provId) {
            setAddPusatDataProvId(provId);
            setAddPusatDataProvName(alamatObj.provinsi);
            try {
              const regRes = await fetch(`/api/wilayah/regencies/${provId}.json`);
              const regenciesData = await regRes.json();
              setRegencies(regenciesData);
              const regId = regenciesData.find((r: any) => r.name?.trim().toUpperCase() === alamatObj.kota?.trim().toUpperCase())?.id;
              if (regId) {
                setAddPusatDataRegId(regId);
                setAddPusatDataRegName(alamatObj.kota);
                const distRes = await fetch(`/api/wilayah/districts/${regId}.json`);
                const districtsData = await distRes.json();
                setDistricts(districtsData);
                const distId = districtsData.find((d: any) => d.name?.trim().toUpperCase() === alamatObj.kecamatan?.trim().toUpperCase())?.id;
                if (distId) {
                  setAddPusatDataDistId(distId);
                  setAddPusatDataDistName(alamatObj.kecamatan);
                  const villRes = await fetch(`/api/wilayah/villages/${distId}.json`);
                  const villagesData = await villRes.json();
                  setVillages(villagesData);
                  if (alamatObj.kelurahan) {
                    const villId = villagesData.find((v: any) => v.name?.trim().toUpperCase() === alamatObj.kelurahan?.trim().toUpperCase())?.id;
                    if (villId) {
                      setAddPusatDataVillageId(villId);
                      setAddPusatDataVillageName(alamatObj.kelurahan);
                    }
                  }
                }
              }
            } catch (e) {}
          }
        }
      }
    } catch(e) {}
    setShowAddPusatDataModal(true);
    setSelectedPusatData(null); // Close the detail modal
  };

  
  // States for Add Pusat Data Modal
  const [addPusatDataForm, setAddPusatDataForm] = useState({
    nama_lengkap: "", email_santri: "", kelas: "10", program_pendidikan: "Mondok", gender: "Putra", tempat_tanggal_lahir: "", nik: "", nisn: "",
    nama_ayah: "", pekerjaan_ayah: "", nama_ibu: "", pekerjaan_ibu: "", no_hp_wali: "", alamat: "", lembaga: "Pondok Pesantren", kampus: "Azhar 1"
  });
  const [addPusatDataJenjang, setAddPusatDataJenjang] = useState("MA Unggulan Al-Azhar");

  useEffect(() => {
    if (addPusatDataJenjang === "MA Unggulan Al-Azhar") setAddPusatDataForm(f => ({...f, kelas: "10"}));
    else if (addPusatDataJenjang === "SMP Islam Al-Azhar") setAddPusatDataForm(f => ({...f, kelas: "7"}));
    else if (addPusatDataJenjang === "SDIT Al-Azhar") setAddPusatDataForm(f => ({...f, kelas: "1"}));
  }, [addPusatDataJenjang]);
  const getAddPusatDataKelasOptions = () => {
    if (addPusatDataJenjang === "MA Unggulan Al-Azhar") return [10, 11, 12];
    if (addPusatDataJenjang === "SMP Islam Al-Azhar") return [7, 8, 9];
    if (addPusatDataJenjang === "SDIT Al-Azhar") return [1, 2, 3, 4, 5, 6];
    return [];
  };
  const [addPusatDataErrors, setAddPusatDataErrors] = useState<{[key: string]: string}>({});
  const [addPusatDataIsWNA, setAddPusatDataIsWNA] = useState(false);
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
  ];
  const [addPusatDataProvId, setAddPusatDataProvId] = useState("");
  const [addPusatDataProvName, setAddPusatDataProvName] = useState("");
  const [addPusatDataRegId, setAddPusatDataRegId] = useState("");
  const [addPusatDataRegName, setAddPusatDataRegName] = useState("");
  const [addPusatDataDistId, setAddPusatDataDistId] = useState("");
  const [addPusatDataDistName, setAddPusatDataDistName] = useState("");
  const [addPusatDataVillageId, setAddPusatDataVillageId] = useState("");
  const [addPusatDataVillageName, setAddPusatDataVillageName] = useState("");
  const [addPusatDataDetail, setAddPusatDataDetail] = useState("");
  const [addPusatDataKodePos, setAddPusatDataKodePos] = useState("");
  const [addPusatDataCountry, setAddPusatDataCountry] = useState("");
  
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);

  const [addPusatDataFiles, setAddPusatDataFiles] = useState({
    pas_foto: null as File | null, kk: null as File | null, akte: null as File | null,
    ijazah: null as File | null, sktm: null as File | null
  });
  const [isSubmittingAddPusatData, setIsSubmittingAddPusatData] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState("");

  useEffect(() => {
    setAddPusatDataErrors(prev => {
      if (Object.keys(prev).length === 0) return prev;
      const newErrors = { ...prev };
      if (addPusatDataForm.nama_lengkap) delete newErrors.nama_lengkap;
      if (addPusatDataForm.tempat_tanggal_lahir) delete newErrors.tempat_tanggal_lahir;
      if (addPusatDataForm.nik && addPusatDataForm.nik.trim().length === 16) delete newErrors.nik;
      if (addPusatDataForm.nisn && addPusatDataForm.nisn.trim().length === 10) delete newErrors.nisn;
      if (addPusatDataForm.nama_ayah) delete newErrors.nama_ayah;
      if (addPusatDataForm.pekerjaan_ayah) delete newErrors.pekerjaan_ayah;
      if (addPusatDataForm.nama_ibu) delete newErrors.nama_ibu;
      if (addPusatDataForm.pekerjaan_ibu) delete newErrors.pekerjaan_ibu;
      if (addPusatDataForm.no_hp_wali) delete newErrors.no_hp_wali;
      if (addPusatDataDetail) delete newErrors.detailAlamat;
      if (addPusatDataProvId) delete newErrors.provinsi;
      if (addPusatDataRegId) delete newErrors.kota;
      if (addPusatDataDistId) delete newErrors.kecamatan;
      if (addPusatDataVillageId) delete newErrors.kelurahan;
      if (addPusatDataCountry) delete newErrors.negara;
      return newErrors;
    });
  }, [addPusatDataForm, addPusatDataDetail, addPusatDataProvId, addPusatDataRegId, addPusatDataDistId, addPusatDataVillageId, addPusatDataCountry]);

  // Fetch initial data (Provinces & Countries)
  useEffect(() => {
    fetch("/api/wilayah/provinces.json").then(res => res.json()).then(data => setProvinces(data)).catch(() => {});
    fetch("https://restcountries.com/v3.1/all?fields=name").then(res => res.json()).then(data => {
      const sorted = data.map((c: any) => c.name.common).sort();
      setCountries(sorted);
    }).catch(() => setCountries(["Indonesia", "Malaysia", "Singapura", "Brunei Darussalam", "Arab Saudi", "Mesir", "Turki"]));
  }, []);

  // Fetch Regencies when Province changes
  useEffect(() => {
    if (addPusatDataProvId && addPusatDataProvId !== "OLD_PROV") {
      fetch(`/api/wilayah/regencies/${addPusatDataProvId}.json`).then(res => res.json()).then(data => {
        setRegencies(data);
      }).catch(() => {});
    } else if (!addPusatDataProvId) {
      setRegencies([]); setDistricts([]); setVillages([]);
    }
  }, [addPusatDataProvId]);

  // Fetch Districts when Regency changes
  useEffect(() => {
    if (addPusatDataRegId && addPusatDataRegId !== "OLD_REG") {
      fetch(`/api/wilayah/districts/${addPusatDataRegId}.json`).then(res => res.json()).then(data => {
        setDistricts(data);
      }).catch(() => {});
    } else if (!addPusatDataRegId) {
      setDistricts([]); setVillages([]);
    }
  }, [addPusatDataRegId]);

  // Fetch Villages when District changes
  useEffect(() => {
    if (addPusatDataDistId && addPusatDataDistId !== "OLD_DIST") {
      fetch(`/api/wilayah/villages/${addPusatDataDistId}.json`).then(res => res.json()).then(data => {
        setVillages(data);
      }).catch(() => {});
    } else if (!addPusatDataDistId) {
      setVillages([]);
    }
  }, [addPusatDataDistId]);

  const handleAddPusatDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {[key: string]: string} = {};
    if (!addPusatDataForm.nama_lengkap) newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    if (!addPusatDataForm.tempat_tanggal_lahir) newErrors.tempat_tanggal_lahir = "Tempat, tanggal lahir wajib diisi";
    if (!addPusatDataForm.nik) newErrors.nik = "NIK wajib diisi";
    if (!addPusatDataForm.nisn) newErrors.nisn = "NISN wajib diisi";
    if (!addPusatDataForm.nama_ayah) newErrors.nama_ayah = "Nama Ayah wajib diisi";
    if (!addPusatDataForm.pekerjaan_ayah) newErrors.pekerjaan_ayah = "Pekerjaan Ayah wajib diisi";
    if (!addPusatDataForm.nama_ibu) newErrors.nama_ibu = "Nama Ibu wajib diisi";
    if (!addPusatDataForm.pekerjaan_ibu) newErrors.pekerjaan_ibu = "Pekerjaan Ibu wajib diisi";
    if (!addPusatDataForm.no_hp_wali) newErrors.no_hp_wali = "No HP Wali wajib diisi";
    if (!addPusatDataDetail) newErrors.detailAlamat = "Detail alamat wajib diisi";
    if (!addPusatDataIsWNA) {
      if (!addPusatDataProvId) newErrors.provinsi = "Provinsi wajib dipilih";
      if (!addPusatDataRegId) newErrors.kota = "Kota/Kabupaten wajib dipilih";
      if (!addPusatDataDistId) newErrors.kecamatan = "Kecamatan wajib dipilih";
      if (!addPusatDataVillageId) newErrors.kelurahan = "Kelurahan/Desa wajib dipilih";
    } else {
      if (!addPusatDataCountry) newErrors.negara = "Negara wajib dipilih";
    }

    if (Object.keys(newErrors).length > 0) {
      setAddPusatDataErrors(newErrors);
      openAlert("Mohon lengkapi semua kolom yang wajib diisi!");
      return;
    }
    setAddPusatDataErrors({});

    if (!isEditingPusatData && !addPusatDataFiles.pas_foto) { openAlert("Pas foto wajib diunggah."); return; }
    if (!isEditingPusatData && !addPusatDataFiles.kk) { openAlert("Kartu Keluarga (KK) wajib diunggah."); return; }
    
    if (addPusatDataForm.nik && addPusatDataForm.nik.trim().length !== 16) {
      openAlert("Perhatian: Nomor Induk Kependudukan (NIK) harus berjumlah tepat 16 digit angka.");
      return;
    }

    if (addPusatDataForm.nisn && addPusatDataForm.nisn.trim().length !== 10) {
      openAlert("Perhatian: Nomor Induk Siswa Nasional (NISN) harus berjumlah tepat 10 digit angka.");
      return;
    }
    
    setIsSubmittingAddPusatData(true);
    try {
      
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
        const safeName = addPusatDataForm.nama_lengkap.replace(/\s+/g, '').toUpperCase();
        const fileName = `( ${folderType}_${safeName} ).${fileExt}`;
        
        const apiFormData = new FormData();
        apiFormData.append('file', file);
        apiFormData.append('filename', fileName);
        if (targetFolderId) apiFormData.append('targetFolderId', targetFolderId);

        const endpoint = forceEndpoint ? forceEndpoint : (folderType === 'FOTO' ? '/api/upload-cloudinary' : '/api/upload');
        
        const res = await fetch(endpoint, {
          method: 'POST',
          body: apiFormData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal mengunggah file');
          
        return data.url;
      };

      let pas_foto = "", kk_url = "", akte_url = "", ijazah_url = "", sktm_url = "";
      // 1. Create Folder
      let targetFolderId = "";
      try {
        const folderRes = await fetch('/api/create-student-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kelas: `Kelas ${addPusatDataForm.kelas}`,
            gender: addPusatDataForm.gender,
            nama_lengkap: addPusatDataForm.nama_lengkap
          })
        });
        const folderData = await folderRes.json();
        if (!folderRes.ok) throw new Error(folderData.error);
        targetFolderId = folderData.folderId;
      } catch (err) {
        console.error("Gagal membuat folder:", err);
      }

      // 2. Upload Files
      if (addPusatDataFiles.pas_foto) {
        pas_foto = await uploadFile(addPusatDataFiles.pas_foto, "FOTO", targetFolderId, '/api/upload-cloudinary');
        try {
          await uploadFile(addPusatDataFiles.pas_foto, "FOTO", targetFolderId, '/api/upload');
        } catch (e) {
          console.error("Gagal mengarsip pas foto ke GDrive", e);
        }
      }
      if (addPusatDataFiles.kk) kk_url = await uploadFile(addPusatDataFiles.kk, "KK", targetFolderId);
      if (addPusatDataFiles.akte) akte_url = await uploadFile(addPusatDataFiles.akte, "AKTE", targetFolderId);
      if (addPusatDataFiles.ijazah) ijazah_url = await uploadFile(addPusatDataFiles.ijazah, "IJAZAH", targetFolderId);
      if (addPusatDataFiles.sktm) sktm_url = await uploadFile(addPusatDataFiles.sktm, "SKTM", targetFolderId);

      let alamatObj;
      if (addPusatDataIsWNA) {
        alamatObj = {
          is_wna: true, negara: addPusatDataCountry, detail: addPusatDataDetail, kode_pos: addPusatDataKodePos,
          full_text: `${addPusatDataDetail}, ${addPusatDataCountry}${addPusatDataKodePos ? ' - ' + addPusatDataKodePos : ''} (WNA)`
        };
      } else {
        alamatObj = {
          is_wna: false,
          provinsi: addPusatDataProvName,
          kota: addPusatDataRegName,
          kecamatan: addPusatDataDistName,
          kelurahan: addPusatDataVillageName,
          detail: addPusatDataDetail,
          kode_pos: addPusatDataKodePos,
          full_text: `${addPusatDataDetail}, Kel/Desa. ${addPusatDataVillageName}, Kec. ${addPusatDataDistName}, Kota/Kab. ${addPusatDataRegName}, Prov. ${addPusatDataProvName}${addPusatDataKodePos ? ' - ' + addPusatDataKodePos : ''}`
        };
      }

      if (isEditingPusatData && editPusatDataId) {
        (alamatObj as any).is_revised = true;
        const updatePayload: any = {
          ...addPusatDataForm,
          alamat: JSON.stringify(alamatObj),
          pas_foto: pas_foto || addPusatDataExistingFiles.pas_foto,
          kk_url: kk_url || addPusatDataExistingFiles.kk_url,
          akte_url: akte_url || addPusatDataExistingFiles.akte_url,
          ijazah_url: ijazah_url || addPusatDataExistingFiles.ijazah_url,
          sktm_url: sktm_url || addPusatDataExistingFiles.sktm_url,
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
      }
      setShowAddPusatDataModal(false);
      fetchPusatData();
    } catch (err: any) {
      console.error(err);
      openAlert("Terjadi kesalahan: " + err.message);
    } finally {
      setCompressionStatus("");
      setCompressionProgress(0);
      setIsSubmittingAddPusatData(false);
    }
  };

  const [pusatData, setPusatData] = useState<any[]>([]);
  const [loadingPusatData, setLoadingPusatData] = useState(false);
  const [selectedPusatData, setSelectedPusatData] = useState<any | null>(null);
  const [accountsMenuExpanded, setAccountsMenuExpanded] = useState(false);
  const [loginRequests, setLoginRequests] = useState<any[]>([]);
  const [selectedLoginRequest, setSelectedLoginRequest] = useState<any | null>(null);
  const [loadingLoginRequests, setLoadingLoginRequests] = useState(false);
  const [errorLoginRequests, setErrorLoginRequests] = useState("");
  const [selectedLoginRequestIds, setSelectedLoginRequestIds] = useState<string[]>([]);
  const [loginRequestFilterStatus, setLoginRequestFilterStatus] = useState<string>("Semua");
  const [loginRequestFilterDate, setLoginRequestFilterDate] = useState<string>("Semua");

  const fetchLoginRequests = async () => {
    setLoadingLoginRequests(true);
    try {
      const { data, error } = await supabase.from("login_requests").select("*").order("requested_at", { ascending: false });
      if (error) throw error;
      if (data) {
        setLoginRequests(data.map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          role: d.role,
          kepengurusan: d.kepengurusan,
          nama_santri: d.nama_santri,
          jenjang_pendidikan: d.jenjang_pendidikan,
          pilihan_kelas: d.pilihan_kelas,
          program_pendidikan: d.program_pendidikan,
          requestedAt: new Date(d.requested_at).toLocaleString('id-ID'),
          rawDate: new Date(d.requested_at),
          device: d.device,
          status: d.status,
          password: d.password
        })));
      }
    } catch (err: any) {
      setErrorLoginRequests(err.message);
    } finally {
      setLoadingLoginRequests(false);
    }
  };

  const handleUpdateLoginRequestStatus = async (id: string, newStatus: "Approved" | "Rejected") => {
    // Optimistic UI update
    setLoginRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    try {
      const res = await fetch('/api/admin/accounts/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui status permintaan login.");
      
      if (newStatus === "Approved") {
        fetchAccounts(); // Refresh list to show the new account
      }
    } catch (err: any) {
      console.warn("Update failed:", err.message);
      setLoginRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Pending" } : r)); // Revert
      openAlert("Gagal memproses: " + err.message);
    }
  };

  // User Accounts States
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [errorAccounts, setErrorAccounts] = useState("");

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const { data, error } = await supabase.from("admin_accounts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data) {
        setUserAccounts(data.map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          role: d.role,
          status: d.status,
          createdAt: new Date(d.created_at).toISOString().split('T')[0],
          lastLogin: d.last_login || "-",
          kepengurusan: d.kepengurusan,
          nama_santri: d.nama_santri,
          jenjang_pendidikan: d.jenjang_pendidikan,
          pilihan_kelas: d.pilihan_kelas,
          program_pendidikan: d.program_pendidikan
        })));
      }
    } catch (err: any) {
      setErrorAccounts(err.message);
      if (userAccounts.length === 0) {
        setUserAccounts([
          { id: "1", name: "Super Admin Al-Azhar", email: "danishalzam8002@gmail.com", role: "Admin", status: "Aktif", createdAt: "2026-01-10", lastLogin: "Hari Ini, 02:15" },
          { id: "2", name: "Ustadz Ahmad Fauzi", email: "ahmad.fauzi@alazharpwk.com", role: "Admin", status: "Aktif", createdAt: "2026-02-15", lastLogin: "Kemarin, 14:32" },
          { id: "3", name: "Herman Susanto (Wali Rian)", email: "herman.s@gmail.com", role: "Wali", status: "Aktif", createdAt: "2026-05-01", lastLogin: "18 Mei 2026, 09:12" },
        ]);
      }
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchLoginRequests();
  }, []);

  const [selectedAccountForEdit, setSelectedAccountForEdit] = useState<UserAccount | null>(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  const [accountSearchQuery, setAccountSearchQuery] = useState("");
  const [accountRoleFilter, setAccountRoleFilter] = useState("Semua");

  // New Account form state
  const [newAccName, setNewAccName] = useState("");
  const [newAccEmail, setNewAccEmail] = useState("");
  const [newAccPassword, setNewAccPassword] = useState("");
  const [newAccConfirmPassword, setNewAccConfirmPassword] = useState("");
  const [showNewAccPassword, setShowNewAccPassword] = useState(false);
  const [newAccRole, setNewAccRole] = useState<"Admin" | "Wali" | "Super Admin">("Wali");
  const [newAccLembaga, setNewAccLembaga] = useState("Pondok Pesantren");
  const [newAccKampus, setNewAccKampus] = useState("Azhar 1");

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccEmail || !newAccPassword || !newAccConfirmPassword) {
      openAlert("Mohon lengkapi semua data, termasuk password!");
      return;
    }

    if (newAccPassword !== newAccConfirmPassword) {
      openAlert("Konfirmasi password tidak cocok! Pastikan Anda memasukkan password yang sama.");
      return;
    }
    
    const action = async () => {
      const newAccData = {
        name: newAccName,
        email: newAccEmail,
        password: newAccPassword,
        role: newAccRole,
        status: "Aktif" as const,
        lembaga: newAccRole === "Admin" ? newAccLembaga : null,
        kampus: newAccRole === "Admin" ? newAccKampus : null
      };

      const tempId = Date.now().toString();
      const newAcc: UserAccount = {
        id: tempId,
        name: newAccName,
        email: newAccEmail,
        role: newAccRole,
        status: "Aktif",
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: "-",
        lembaga: newAccRole === "Admin" ? newAccLembaga : undefined,
        kampus: newAccRole === "Admin" ? newAccKampus : undefined
      };
      
      setUserAccounts(prev => [newAcc, ...prev]);
      setNewAccName("");
      setNewAccEmail("");
      setNewAccPassword("");
      setNewAccConfirmPassword("");
      setNewAccRole("Wali");
      setNewAccLembaga("Pondok Pesantren");
      setNewAccKampus("Azhar 1");
      setShowAddAccountModal(false);
      
      try {
        const response = await fetch('/api/admin/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAccData)
        });
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || "Gagal sinkronisasi ke Supabase Auth");
        }
        
        if (result.data) {
          setUserAccounts(prev => prev.map(a => a.id === tempId ? { ...a, id: result.data.id } : a));
        }
      } catch (err: any) {
        console.error(err);
        openAlert("Error: " + err.message);
      }
      openAlert("Akun baru berhasil ditambahkan dan disinkronisasi dengan Auth!");
    };

    if (newAccRole === "Super Admin") {
      setPendingSuperAdminAction(() => action);
      setShowMasterPasswordPrompt(true);
    } else {
      action();
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountForEdit) return;
    
    const currentAccount = userAccounts.find(a => a.id === selectedAccountForEdit.id);
    const isSuperAdminAction = currentAccount?.role === "Super Admin" || selectedAccountForEdit.role === "Super Admin";

    const action = async () => {
      setUserAccounts(prev => prev.map(acc => acc.id === selectedAccountForEdit.id ? selectedAccountForEdit : acc));
      const editedId = selectedAccountForEdit.id;
      
      const roleIsAdmin = selectedAccountForEdit.role === "Admin";
      
      const updatedData = {
        name: selectedAccountForEdit.name,
        email: selectedAccountForEdit.email,
        role: selectedAccountForEdit.role,
        status: selectedAccountForEdit.status,
        lembaga: roleIsAdmin ? selectedAccountForEdit.lembaga : null,
        kampus: roleIsAdmin ? selectedAccountForEdit.kampus : null
      };
      setSelectedAccountForEdit(null);
      
      try {
        const { error } = await supabase.from("admin_accounts").update(updatedData).eq("id", editedId);
        if (error) console.warn("Supabase update failed, kept local fallback status.");
      } catch (err) {
        console.error(err);
      }
      openAlert("Detail akun berhasil diperbarui!");
    };

    if (isSuperAdminAction) {
      setPendingSuperAdminAction(() => action);
      setShowMasterPasswordPrompt(true);
    } else {
      action();
    }
  };

  const handleDeleteAccount = async (id: string) => {
    openConfirm(
      "Hapus Akun?",
      "Hapus akun ini secara permanen dari sistem beserta data autentikasinya?",
      () => {
        const currentAccount = userAccounts.find(a => a.id === id);
        const isSuperAdminAction = currentAccount?.role === "Super Admin";

        const action = async () => {
          setUserAccounts(prev => prev.filter(acc => acc.id !== id));
          if (selectedAccountForEdit?.id === id) {
            setSelectedAccountForEdit(null);
          }
          
          try {
            const response = await fetch(`/api/admin/accounts?id=${id}`, {
              method: 'DELETE'
            });
            const result = await response.json();
            
            if (!response.ok) {
              console.warn("API delete failed:", result.error);
            }
          } catch (err) {
            console.error(err);
          }
        };

        if (isSuperAdminAction) {
          setPendingSuperAdminAction(() => action);
          setShowMasterPasswordPrompt(true);
        } else {
          action();
        }
      },
      true, // isDanger
      "Hapus Permanen",
      "Batal"
    );
  };
    


  // Stats
  const totalPendaftar = pendaftaran.length || 12; // Fallback to mock values if empty
  const totalBerita = news.length;
  const totalFoto = photos.length;

  // Verify auth
  useEffect(() => {
    async function checkUser() {
      try {
        // 1. Check if there is an active session stored in localStorage (bypassed login)
        const localSession = localStorage.getItem('admin_session');
        if (localSession) {
          const parsed = JSON.parse(localSession);
          setUser(parsed);
          setIsAdmin(true);
          setDemoMode(false);
          setLoadingAuth(false);
          return;
        }

        // 2. Fallback to normal Supabase check
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setIsAdmin(true); // For this setup, we treat logged in users as admins
          setDemoMode(false); // Turn off demo if authenticated
        }
      } catch (err) {
        console.warn("Auth check failed, using preview mode.");
      } finally {
        setLoadingAuth(false);
      }
    }
    checkUser();
  }, []);

  // Fetch pendaftaran data from Supabase
  const fetchPpdbData = async () => {
    setLoadingPpdb(true);
    setErrorPpdb("");
    try {
      const { data, error } = await supabase
        .from("pendaftaran")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setPendaftaran(data);
      }
    } catch (err: any) {
      setErrorPpdb(err.message || "Gagal mengambil data dari database.");
      // Fallback mock data for beautiful demo if table not ready
      if (pendaftaran.length === 0) {
        setPendaftaran([
          { id: "1", created_at: "2026-05-17T05:00:00Z", nama_lengkap: "Faris Al-Fatih", email: "faris@gmail.com", no_hp: "081234567800", jenjang: "MA", status: "Pending" },
          { id: "2", created_at: "2026-05-16T12:30:00Z", nama_lengkap: "Naila Zahrani", email: "naila@gmail.com", no_hp: "081399887711", jenjang: "SMP", status: "Approved" },
          { id: "3", created_at: "2026-05-15T08:15:00Z", nama_lengkap: "Ahmad Mujahid", email: "ahmad@gmail.com", no_hp: "082165430987", jenjang: "Ponpes", status: "Rejected" },
        ]);
      }
    } finally {
      setLoadingPpdb(false);
    }
  };

  const fetchNewsData = async () => {
    setLoadingNews(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        setNews(data);
      }
    } catch (err: any) {
      console.error("Failed to fetch news:", err);
      setErrorNews(err.message || "Failed to fetch news data");
    } finally {
      setLoadingNews(false);
    }
  };

  const handleBulkDeleteLoginRequests = async () => {
    if (selectedLoginRequestIds.length === 0) return;
    openConfirm(
      "Hapus Permintaan Login?",
      `Hapus ${selectedLoginRequestIds.length} permintaan yang dipilih?`,
      async () => {
        setLoginRequests(prev => prev.filter(r => !selectedLoginRequestIds.includes(r.id)));
        try {
          const { error } = await supabase.from('login_requests').delete().in('id', selectedLoginRequestIds);
          if (error) throw error;
          setSelectedLoginRequestIds([]);
        } catch (err) {
          console.error("Gagal menghapus:", err);
          openAlert("Terjadi kesalahan saat menghapus data.");
        }
      },
      true,
      "Hapus",
      "Batal"
    );
  };

  const fetchVisitorStats = async () => {
    setLoadingVisitors(true);
    try {
      const { data, error } = await supabase
        .from("visitor_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setSupabaseSyncActive(true);

        // 1. Total unique sessions
        const uniqueSessions = Array.from(new Set(data.map(d => d.session_id)));
        setTotalVisitors(uniqueSessions.length);

        // 2. Active visitors in last 5 minutes (or at least 1 active as fallback)
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeSessions = Array.from(new Set(
          data
            .filter(d => new Date(d.created_at) > fiveMinsAgo)
            .map(d => d.session_id)
        ));
        setActiveVisitors(Math.max(activeSessions.length, 1));

        // Calculate unique visitors today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todaySessions = Array.from(new Set(
          data
            .filter(d => new Date(d.created_at) >= startOfToday)
            .map(d => d.session_id)
        ));
        setTodayVisitors(Math.max(todaySessions.length, 1));

        // 3. Top Pages
        const pathCounts: Record<string, number> = {};
        data.forEach(d => {
          const path = d.pathname || "/";
          pathCounts[path] = (pathCounts[path] || 0) + 1;
        });
        const totalHits = data.length;
        const sortedPaths = Object.entries(pathCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([path, count]) => {
            let readablePath = path;
            if (path === "/") readablePath = "🏠 / (Beranda Utama)";
            else if (path === "/pendaftaran") readablePath = "📝 /pendaftaran (PPDB)";
            else if (path === "/berita") readablePath = "📰 /berita (Kabar Pesantren)";
            else if (path === "/admin") readablePath = "⚙️ /admin (Panel Pengurus)";
            return {
              path: readablePath,
              pct: Math.round((count / totalHits) * 100),
              count: count
            };
          });
        setTopPages(sortedPaths);

        // 4. Traffic sources
        const sourceCounts: Record<string, number> = {};
        data.forEach(d => {
          const src = d.referrer || "Direct Link / WhatsApp";
          sourceCounts[src] = (sourceCounts[src] || 0) + 1;
        });
        const sortedSources = Object.entries(sourceCounts)
          .map(([source, count]) => ({
            source,
            pct: Math.round((count / totalHits) * 100)
          }))
          .sort((a, b) => b.pct - a.pct);
        setTrafficSources(sortedSources);

        // 5. Device Stats
        const devCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };
        data.forEach(d => {
          const dev = d.device_type as "Mobile" | "Desktop" | "Tablet" || "Desktop";
          if (devCounts[dev] !== undefined) {
            devCounts[dev]++;
          }
        });
        const devTotal = data.length;
        setDeviceStats({
          mobile: Math.round((devCounts.Mobile / devTotal) * 100) || 74,
          desktop: Math.round((devCounts.Desktop / devTotal) * 100) || 22,
          tablet: Math.round((devCounts.Tablet / devTotal) * 100) || 4
        });

        // 6. Calculate dynamic chart data from visitor_logs database!
        const last7DaysList = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
          
          const dayStart = new Date(d);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(d);
          dayEnd.setHours(23, 59, 59, 999);
          
          const dayLogs = data.filter(log => {
            const logDate = new Date(log.created_at);
            return logDate >= dayStart && logDate <= dayEnd;
          });
          
          const daySessions = Array.from(new Set(dayLogs.map(l => l.session_id))).length;
          
          last7DaysList.push({
            date: dateStr,
            visitors: daySessions
          });
        }

        const maxVal = Math.max(...last7DaysList.map(item => item.visitors), 10);
        const scaledMax = Math.ceil(maxVal / 10) * 10;
        setChartMaxVal(scaledMax);

        const activeChartPoints = last7DaysList.map((item, idx) => {
          const x = 50 + idx * 100;
          const y = 190 - ((item.visitors / scaledMax) * 150);
          return {
            date: item.date,
            visitors: item.visitors,
            x,
            y
          };
        });
        setChartData(activeChartPoints);
      }
    } catch (err) {
      console.warn("Table visitor_logs not available or setup in Supabase yet. Using beautiful realistic mock data.");
      setSupabaseSyncActive(false);
    } finally {
      setLoadingVisitors(false);
    }
  };

  const fetchPusatData = async () => {
    setLoadingPusatData(true);
    try {
      const { data, error } = await supabase.from('pusat_data_siswa').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setPusatData(data);
    } catch (err: any) {
      console.warn("Table pusat_data_siswa not available yet.");
    } finally {
      setLoadingPusatData(false);
    }
  };

  const fetchRegistrationSettings = async () => {
    setLoadingRegistration(true);
    try {
      const { data, error } = await supabase.from('registration_settings').select('*').order('id', { ascending: true });
      if (error) throw error;
      if (data) setRegistrationSettings(data);
    } catch (err: any) {
      console.warn("Table registration_settings not available yet.", err);
    } finally {
      setLoadingRegistration(false);
    }
  };

  const generateAccessCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleRegistrationMainAction = async (wave: any) => {
    const isModified = draftDates[wave.id] && (draftDates[wave.id].open_date !== wave.open_date || draftDates[wave.id].close_date !== wave.close_date);
    const draftOpen = draftDates[wave.id]?.open_date ?? wave.open_date;
    const draftClose = draftDates[wave.id]?.close_date ?? wave.close_date;

    if (isModified) {
      openConfirm(
        "Simpan Perubahan Tanggal?",
        `Apakah Anda yakin ingin menyimpan perubahan tanggal pendaftaran untuk ${wave.wave_name}?`,
        () => {
          setPendingSuperAdminAction(() => async () => {
            try {
              const { error } = await supabase.from('registration_settings').update({ open_date: draftOpen, close_date: draftClose }).eq('id', wave.id);
              if (error) throw error;
              fetchRegistrationSettings();
              setDraftDates(prev => { const next = { ...prev }; delete next[wave.id]; return next; });
              openAlert("Perubahan tanggal berhasil disimpan!");
            } catch (err: any) {
              openAlert("Gagal menyimpan tanggal: " + err.message, true);
            }
          });
          setShowMasterPasswordPrompt(true);
        },
        false,
        "Simpan",
        "Batal"
      );
    } else {
      const newIsOpen = !wave.is_open;
      const actionText = newIsOpen ? `membuka pendaftaran ${wave.wave_name} dari tanggal ${draftOpen} sampai ${draftClose}` : `menutup pendaftaran ${wave.wave_name}`;
      
      openConfirm(
        "Ubah Status Pendaftaran?",
        `Apakah Anda ingin ${actionText}?`,
        () => {
          setPendingSuperAdminAction(() => async () => {
            try {
              const { error } = await supabase.from('registration_settings').update({ is_open: newIsOpen }).eq('id', wave.id);
              if (error) throw error;
              fetchRegistrationSettings();
            } catch (err: any) {
              openAlert("Gagal memperbarui status pendaftaran: " + err.message, true);
            }
          });
          setShowMasterPasswordPrompt(true);
        },
        false,
        "Ya, Ubah Status",
        "Batal"
      );
    }
  };

  const handleToggleAccessCode = async (wave: any) => {
    const hasCode = !!wave.access_code;
    
    if (hasCode) {
      openConfirm(
        "Tutup Akses PUSDA?",
        `Apakah Anda yakin ingin menutup akses Pusat Data untuk pendaftaran ${wave.wave_name}? Kode akses akan dihapus.`,
        () => {
          setPendingSuperAdminAction(() => async () => {
            try {
              const { error } = await supabase.from('registration_settings').update({ access_code: null }).eq('id', wave.id);
              if (error) throw error;
              fetchRegistrationSettings();
              openAlert(`Akses Pusat Data untuk ${wave.wave_name} berhasil ditutup!`);
            } catch (err: any) {
              openAlert("Gagal menutup akses: " + err.message, true);
            }
          });
          setShowMasterPasswordPrompt(true);
        },
        true,
        "Ya, Tutup Akses",
        "Batal"
      );
    } else {
      openConfirm(
        "Buka Akses PUSDA?",
        `Apakah Anda yakin ingin membuat kode akses baru untuk membuka pendaftaran Pusat Data pada ${wave.wave_name}?`,
        () => {
          setPendingSuperAdminAction(() => async () => {
            const newCode = generateAccessCode();
            try {
              const { error } = await supabase.from('registration_settings').update({ access_code: newCode }).eq('id', wave.id);
              if (error) throw error;
              fetchRegistrationSettings();
              openAlert(`Akses Pusat Data dibuka! Kode akses untuk ${wave.wave_name} berhasil di-generate!`);
            } catch (err: any) {
              openAlert("Gagal generate kode akses: " + err.message, true);
            }
          });
          setShowMasterPasswordPrompt(true);
        },
        false,
        "Ya, Buka Akses",
        "Batal"
      );
    }
  };

  const handleRegenerateAccessCode = async (wave: any) => {
    openConfirm(
      "Regenerate Kode Akses?",
      `Apakah Anda yakin ingin membuat ulang (regenerate) kode akses PUSDA untuk ${wave.wave_name}? Kode lama akan hangus.`,
      () => {
        setPendingSuperAdminAction(() => async () => {
          const newCode = generateAccessCode();
          try {
            const { error } = await supabase.from('registration_settings').update({ access_code: newCode }).eq('id', wave.id);
            if (error) throw error;
            fetchRegistrationSettings();
            openAlert(`Kode akses untuk ${wave.wave_name} berhasil diperbarui!`);
          } catch (err: any) {
            openAlert("Gagal regenerate kode akses: " + err.message, true);
          }
        });
        setShowMasterPasswordPrompt(true);
      },
      false,
      "Ya, Regenerate",
      "Batal"
    );
  };


  const handleAddWave = () => {
    openPrompt(
      "Tambah Gelombang Baru",
      "Masukkan nama gelombang pendaftaran baru (contoh: Gelombang 3):",
      "Nama Gelombang",
      (waveName: string) => {
        if (!waveName.trim()) return;

        openConfirm(
          "Konfirmasi Tambah Gelombang",
          `Apakah Anda yakin ingin menambah gelombang pendaftaran baru: ${waveName}?`,
          () => {
            setPendingSuperAdminAction(() => async () => {
              try {
                const newWave = {
                  wave_name: waveName,
                  is_open: false,
                  access_code: generateAccessCode(),
                  open_date: new Date().toISOString().split('T')[0],
                  close_date: new Date().toISOString().split('T')[0]
                };
                const { error } = await supabase.from('registration_settings').insert([newWave]);
                if (error) throw error;
                fetchRegistrationSettings();
                openAlert("Berhasil menambah gelombang baru!");
              } catch (err: any) {
                openAlert("Gagal menambah gelombang: " + err.message);
              }
            });
            setShowMasterPasswordPrompt(true);
          }
        );
      }
    );
  };

  const handleDeleteWave = (id: number, waveName: string) => {
    openConfirm(
      "Hapus Gelombang?",
      `Apakah Anda yakin ingin menghapus gelombang ${waveName}? Aksi ini tidak dapat dibatalkan!`,
      () => {
        setPendingSuperAdminAction(() => async () => {
          try {
            const { error } = await supabase.from('registration_settings').delete().eq('id', id);
            if (error) throw error;
            fetchRegistrationSettings();
            openAlert("Berhasil menghapus gelombang!");
          } catch (err: any) {
            openAlert("Gagal menghapus gelombang: " + err.message);
          }
        });
        setShowMasterPasswordPrompt(true);
      },
      true,
      "Ya, Hapus",
      "Batal"
    );
  };

  useEffect(() => {
    fetchPpdbData();
    fetchVisitorStats();
    fetchNewsData();
    fetchPusatData();
    fetchRegistrationSettings();
  }, []);

  // Handle status changes in Supabase
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // 1. Update local UI state immediately for responsive feel
    setPendaftaran(prev => 
      prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
    );

    // 2. Persist in Supabase
    try {
      const { error } = await supabase
        .from("pendaftaran")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.warn("DB update failed, kept local fallback status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePusatDataStatus = async (id: string, newStatus: string) => {
    setPusatData(prev => 
      prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
    );
    try {
      const updatePayload = (newStatus === 'Terima' || newStatus === 'Approved' || newStatus === 'Aktif') ? { status: newStatus, accepted_at: new Date().toISOString() } : { status: newStatus };
      const { error } = await supabase
        .from("pusat_data_siswa")
        .update(updatePayload)
        .eq("id", id);
      if (error) console.warn("DB update failed for pusat data status.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePusatData = async (id: string) => {
    openConfirm(
      "Hapus Data Santri?",
      "Apakah Anda yakin ingin menghapus data pengajuan santri ini secara permanen?",
      async () => {
        setPusatData(prev => prev.filter(p => p.id !== id));
        try {
          await supabase.from("pusat_data_siswa").delete().eq("id", id);
        } catch (err) {
          console.error(err);
        }
      },
      true,
      "Hapus"
    );
  };

  // Handle delete registration
  const handleDeletePpdb = async (id: string) => {
    openConfirm(
      "Hapus Data Pendaftaran?",
      "Apakah Anda yakin ingin menghapus data pendaftaran ini?",
      async () => {
        setPendaftaran(prev => prev.filter(p => p.id !== id));
        try {
          await supabase.from("pendaftaran").delete().eq("id", id);
        } catch (err) {
          console.error(err);
        }
      },
      true,
      "Hapus",
      "Batal"
    );
  };

  // News Actions
  const handleEditNews = (news: any) => {
    setEditingNewsId(news.id);
    setNewNewsCategory(news.kategori);
    setNewNewsTitle(news.judul_utama);
    setNewNewsImageSource(news.sumber_gambar as any);
    setNewNewsImageManualSource(news.sumber_gambar_manual || "");
    setNewNewsContent(news.isi_berita);
    setNewNewsClosingParagraph(news.paragraf_penutup || "");
    setNewNewsAttachmentType((news.jenis_lampiran_2 as any) || "");
    if (['Video Youtube', 'PDF', 'Gambar'].includes(news.jenis_lampiran_2) && news.lampiran_2_url?.includes("|||")) {
      const parts = news.lampiran_2_url.split("|||");
      setNewNewsAttachmentUrl(parts[0]);
      setNewNewsAttachmentTitle(parts[1]);
    } else {
      setNewNewsAttachmentUrl(news.lampiran_2_url || "");
      setNewNewsAttachmentTitle("");
    }
    setNewNewsAuthor(news.penulis);
    setNewNewsOptionalSources(news.sumber_opsional || "");
    setNewNewsStatus(news.status as any);
    setShowAddNewsModal(true);
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsContent || !newNewsAuthor) {
      openAlert("Mohon lengkapi data wajib (Judul, Isi, Penulis)!");
      return;
    }

    setIsUploadingNews(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => prev >= 90 ? prev : prev + Math.floor(Math.random() * 15) + 5);
    }, 300);

    let finalImageUrl = null;

    try {
      if (newNewsImageFile) {
        const fileExt = newNewsImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('berita-images')
          .upload(filePath, newNewsImageFile);

        if (uploadError) {
          throw new Error('Gagal mengunggah gambar cover: ' + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('berita-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      let finalAttachmentUrl = newNewsAttachmentUrl;
      if (newNewsAttachmentType === 'Gambar' && newNewsAttachmentFile) {
        const fileExt = newNewsAttachmentFile.name.split('.').pop();
        const fileName = `attachment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('berita-images')
          .upload(filePath, newNewsAttachmentFile);

        if (uploadError) {
          throw new Error('Gagal mengunggah gambar lampiran: ' + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('berita-images')
          .getPublicUrl(filePath);

        finalAttachmentUrl = publicUrlData.publicUrl;
      }

      let finalContent = newNewsContent;
      if (editingNewsId) {
        // Hapus penanda revisi sebelumnya jika ada
        finalContent = finalContent.replace(/\n\n---REVISION_TIMESTAMP:\d+---/g, '');
        // Tambahkan penanda revisi baru
        finalContent += `\n\n---REVISION_TIMESTAMP:${Date.now()}---`;
      }

      const newsData = {
        kategori: newNewsCategory,
        judul_utama: newNewsTitle,
        sumber_gambar: newNewsImageSource,
        sumber_gambar_manual: newNewsImageSource === 'Manual' ? newNewsImageManualSource : null,
        ...(finalImageUrl && { gambar_judul_url: finalImageUrl }), // Only update if new image uploaded
        isi_berita: finalContent,
        jenis_lampiran_2: newNewsAttachmentType || null,
        ...(finalAttachmentUrl && { lampiran_2_url: ['Video Youtube', 'PDF', 'Gambar'].includes(newNewsAttachmentType) && newNewsAttachmentTitle ? `${finalAttachmentUrl}|||${newNewsAttachmentTitle}` : finalAttachmentUrl || null }),
        // If type is not empty but URL is empty, it means user didn't upload new attachment but wants to keep old.
        // Wait, if finalAttachmentUrl is set, we update it. If not, we don't overwrite unless they cleared the type.
        ...(newNewsAttachmentType === "" && { lampiran_2_url: null }),
        paragraf_penutup: newNewsClosingParagraph || null,
        penulis: newNewsAuthor,
        sumber_opsional: newNewsOptionalSources || null,
        status: newNewsStatus
      };

      if (editingNewsId) {
        const { error } = await supabase.from('news_articles').update(newsData).eq('id', editingNewsId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('news_articles').insert([newsData]);
        if (error) throw error;
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      fetchNewsData(); // refresh data
      
      // Delay before closing to show success animation
      setTimeout(() => {
        // Reset forms
        setNewNewsTitle("");
        setNewNewsContent("");
        setNewNewsClosingParagraph("");
        setNewNewsImageFile(null);
        setNewNewsAttachmentType("");
        setNewNewsAttachmentUrl("");
        setNewNewsAttachmentFile(null);
        setNewNewsAuthor("");
        setNewNewsOptionalSources("");
        setNewNewsImageManualSource("");
        setNewNewsAttachmentTitle("");
        setEditingNewsId(null);
        setShowAddNewsModal(false);
        setIsUploadingNews(false);
        setUploadSuccess(false);
        setUploadProgress(0);
      }, 1500);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploadingNews(false);
      setUploadProgress(0);
      console.error(err);
      openAlert("Gagal menambahkan berita: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteNews = async (id: string) => {
    openConfirm(
      "Hapus Berita?",
      "Hapus artikel berita ini?",
      async () => {
        try {
          const { error } = await supabase.from('news_articles').delete().eq('id', id);
          if (error) throw error;
          fetchNewsData();
        } catch (err) {
          console.error("Gagal menghapus berita:", err);
          openAlert("Terjadi kesalahan saat menghapus berita.");
        }
      },
      true,
      "Hapus",
      "Batal"
    );
  };

  const handleToggleNewsStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Published" ? "Draft" : "Published";
      const { error } = await supabase.from('news_articles').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchNewsData();
    } catch (err) {
      console.error("Gagal mengubah status berita:", err);
      openAlert("Terjadi kesalahan saat mengubah status.");
    }
  };

  // Photo Actions
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl || !newPhotoDesc) return;

    const newItem: DocPhoto = {
      id: Date.now().toString(),
      url: newPhotoUrl,
      description: newPhotoDesc,
      date: "Hari Ini"
    };

    setPhotos([newItem, ...photos]);
    setNewPhotoUrl("");
    setNewPhotoDesc("");
    setShowAddPhotoModal(false);
  };

  const handleDeletePhoto = (id: string) => {
    openConfirm(
      "Hapus Foto?",
      "Hapus foto dari galeri dokumentasi?",
      () => {
        setPhotos(prev => prev.filter(p => p.id !== id));
      },
      true,
      "Hapus",
      "Batal"
    );
  };

  const strokePath = chartData.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`).join(' ');
  const areaPath = chartData.length > 0 ? `${strokePath} L ${chartData[chartData.length - 1].x},190 L ${chartData[0].x},190 Z` : '';

  // --- PUSAT DATA FILTER LOGIC ---
  const getFilteredPusatData = (isPending: boolean) => {
    return pusatData.filter(d => {
      if (isPending && d.status !== 'Pending') return false;
      if (!isPending && d.status !== 'Approved' && d.status !== 'Aktif' && d.status !== 'Terima') return false;
      
      // Text Search
      if (pusatDataSearchQuery) {
        const q = pusatDataSearchQuery.toLowerCase();
        if (!d.nama_lengkap.toLowerCase().includes(q) && !d.nik.includes(q) && !d.nisn.includes(q)) return false;
      }

      // Gender
      if (pusatDataFilterGender !== 'Semua' && d.gender !== pusatDataFilterGender) return false;

      // Kelas
      if (pusatDataFilterKelas !== 'Semua' && d.kelas !== pusatDataFilterKelas) return false;

      // Jenjang
      if (pusatDataFilterJenjang !== 'Semua') {
        const k = parseInt(d.kelas);
        let jenjang = "";
        if (k >= 1 && k <= 6) jenjang = "SDIT";
        else if (k >= 7 && k <= 9) jenjang = "SMP";
        else if (k >= 10 && k <= 12) jenjang = "MA";
        
        if (jenjang !== pusatDataFilterJenjang) return false;
      }

      // Program Pendidikan
      if (pusatDataFilterProgram !== 'Semua' && d.program_pendidikan !== pusatDataFilterProgram) return false;

      // Lembaga & Kampus
      if (pusatDataFilterLembaga !== 'Semua' && d.lembaga !== pusatDataFilterLembaga) return false;
      if (pusatDataFilterKampus !== 'Semua' && d.kampus !== pusatDataFilterKampus) return false;

      // Kelengkapan Berkas
      if (pusatDataFilterBerkas !== 'Semua') {
        const docCount = [d.kk_url, d.akte_url, d.ijazah_url, d.sktm_url].filter(Boolean).length;
        if (pusatDataFilterBerkas === 'Lengkap' && docCount < 4) return false;
        if (pusatDataFilterBerkas === 'Belum Lengkap' && docCount === 4) return false;
      }

      // Tanggal Masuk
      if (pusatDataFilterTanggal) {
        const dDate = new Date(d.created_at || new Date());
        const filterDate = new Date(pusatDataFilterTanggal);
        if (dDate.toDateString() !== filterDate.toDateString()) return false;
      }

      // Provinsi & WNA
      if (pusatDataFilterProvinsi !== 'Semua') {
        let isWNA = false;
        let prov = "";
        try {
          const alamatObj = JSON.parse(d.alamat);
          isWNA = alamatObj.is_wna;
          prov = alamatObj.provinsi || "";
        } catch(e) {
          // not JSON, fallback if needed, but for now skip
        }
        
        if (pusatDataFilterProvinsi === 'WNA') {
          if (!isWNA) return false;
        } else {
          if (isWNA) return false;
          if (prov !== pusatDataFilterProvinsi) return false;
        }
      }

      return true;
    });
  };

  const filteredDataSiswa = getFilteredPusatData(false);
  const filteredPengajuanData = getFilteredPusatData(true);

  modalStatesRef.current = {
    showAddPusatDataModal, showAddNewsModal, showAddPhotoModal, showAddAccountModal,
    showMasterPasswordPrompt, activePriorityModal, confirmModal: confirmModal.isOpen,
    promptModal: promptModal.isOpen, alertModal: alertModal.isOpen
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (e: PopStateEvent) => {
      const ms = modalStatesRef.current;
      
      if (ms.confirmModal) {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.promptModal) {
        setPromptModal(prev => ({ ...prev, isOpen: false }));
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.alertModal) {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.activePriorityModal) {
        setActivePriorityModal(null);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showAddPusatDataModal) {
        setShowAddPusatDataModal(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showAddNewsModal) {
        setShowAddNewsModal(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showAddPhotoModal) {
        setShowAddPhotoModal(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showAddAccountModal) {
        setShowAddAccountModal(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showMasterPasswordPrompt) {
        setShowMasterPasswordPrompt(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }

      setConfirmModal({
        isOpen: true,
        title: "Konfirmasi Keluar",
        message: "Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?",
        onConfirm: () => { window.location.href = "/"; },
        confirmText: "Ya, Keluar",
        cancelText: "Batal",
        isDanger: false
      });
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>

      <Navbar />
      <main className="dashboard-layout">
      {/* Top Banner (Demo Mode Alert) */}
      {demoMode && (
        <div className="demo-banner">
          <span><strong>Admin Preview Mode Aktif:</strong> Anda dapat melihat, menguji, dan memodifikasi komponen secara instan tanpa perlu masuk log.</span>
          <button onClick={() => setDemoMode(false)} className="btn-close-demo">Sembunyikan</button>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Sidebar Background Overlay on Mobile */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "mobile-open" : ""}`}>

          <nav className="sidebar-nav">
            <div style={{ padding: '0 1.25rem 0.75rem', color: '#ffffff', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', textShadow: '0 2px 5px rgba(0,0,0,0.4)' }}>
              Menu Admin
            </div>
            <button 
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
              style={{ color: 'white' }}
            >
              <span className="nav-icon"></span> <span>Aktivitas Web</span>
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button 
                className={`nav-item ${activeTab === "pusatdata" || activeTab === "accounts" ? "active" : ""}`}
                onClick={() => setAccountsMenuExpanded(!accountsMenuExpanded)}
                style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="nav-icon"></span> <span>Manajemen Data</span>
                </div>
                <span style={{ transform: accountsMenuExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', fontSize: '0.8rem' }}>▼</span>
              </button>
              
              <AnimatePresence>
                {accountsMenuExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', paddingLeft: '1.5rem', background: 'rgba(0,0,0,0.1)' }}
                  >
                    <button 
                      className={`nav-item ${activeTab === "pusatdata" ? "active" : ""}`}
                      onClick={() => { setActiveTab("pusatdata"); setSidebarOpen(false); }}
                      style={{ color: 'white', borderLeft: activeTab === "pusatdata" ? '2px solid #ff8c00' : '2px solid transparent', paddingLeft: '1rem', margin: '0.2rem 0' }}
                    >
                      <span className="nav-icon" style={{ fontSize: '0.7rem' }}>●</span> <span>Pusat Data Siswa</span>
                    </button>
                    
                    <button 
                      className={`nav-item ${activeTab === "accounts" ? "active" : ""}`}
                      onClick={() => { setActiveTab("accounts"); setSidebarOpen(false); }}
                      style={{ color: 'white', borderLeft: activeTab === "accounts" ? '2px solid #ff8c00' : '2px solid transparent', paddingLeft: '1rem', margin: '0.2rem 0' }}
                    >
                      <span className="nav-icon" style={{ fontSize: '0.7rem' }}>●</span> <span>Kelola Akun</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              className={`nav-item ${activeTab === "news" ? "active" : ""}`}
              onClick={() => { setActiveTab("news"); setSidebarOpen(false); }}
              style={{ color: 'white' }}
            >
              <span className="nav-icon"></span> <span>Laman Berita</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === "docs" ? "active" : ""}`}
              onClick={() => { setActiveTab("docs"); setSidebarOpen(false); }}
              style={{ color: 'white' }}
            >
              <span className="nav-icon"></span> <span>Galeri Publikasi</span>
            </button>

            <button 
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
              style={{ color: 'white' }}
            >
              <span className="nav-icon"></span> <span>Konfigurasi Informasi</span>
            </button>

            <button 
              className={`nav-item ${activeTab === "ppdb" ? "active" : ""}`}
              onClick={() => { setActiveTab("ppdb"); setSidebarOpen(false); }}
              style={{ color: 'white' }}
            >
              <span className="nav-icon"></span> <span>Azhar Library</span>
              {pendaftaran.filter(p => p.status === "Pending").length > 0 && (
                <span className="nav-badge">{pendaftaran.filter(p => p.status === "Pending").length}</span>
              )}
            </button>

            <Link 
              href="/antigravity"
              className="nav-item"
              onClick={() => setSidebarOpen(false)}
              style={{ color: 'white', border: '1px solid rgba(255, 140, 0, 0.25)', background: 'rgba(255, 140, 0, 0.05)', display: 'flex', alignItems: 'center' }}
            >
              <span className="nav-icon">⚡</span> <span>Antigravity IDE</span>
            </Link>
          </nav>
          <div className="sidebar-decor-glow" style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '150px', background: 'linear-gradient(to top, rgba(255,140,0,0.03), transparent)', pointerEvents: 'none' }} />
        </aside>

        {/* Main Content Area */}
        <section className="main-content">
          {/* Mobile Admin Floating Toggle */}
          <div className="floating-admin-wrapper">
            <button className="floating-admin-toggle" onClick={() => setSidebarOpen(true)} title="Buka Menu Pengurus">
              <span className="toggle-text">Menu Admin</span>
              <div className="toggle-logo-wrapper">
                <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999207/ntxuizh8mm8odxndbvs2.png" alt="Logo" className="toggle-logo" />
              </div>
            </button>
            <div className="floating-tooltip">
              Klik di sini 👆
            </div>
          </div>

          
          <header className="content-header">
            <div>
              <span className="header-breadcrumbs">
                {activeTab === "overview" ? "Dashboard Admin" : `Dashboard Admin / ${activeTab.toUpperCase()}`}
              </span>
              <h2 className={`${frizQuadrata.className} header-title`}>
                {activeTab === "overview" && "Aktivitas Web"}
                {activeTab === "ppdb" && "Manajemen Pendaftaran Santri Baru (PPDB)"}
                {activeTab === "news" && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Pusat Pengelolaan Berita & Pengumuman
                    <a 
                      href="/berita" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Buka halaman publik berita"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                )}
                {activeTab === "docs" && "Pengelolaan Dokumentasi & Galeri Alumni"}
                {activeTab === "settings" && "Konfigurasi Desain & Informasi Umum"}
                {activeTab === "accounts" && "Kelola Data & Hak Akses Pengurus"}
                {activeTab === "pusatdata" && "Pusat Data Siswa & Dokumen"}
              </h2>
            </div>
          </header>

          <div className="content-body">
            <AnimatePresence mode="wait">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                  {/* Summary Cards */}
                  <div className="summary-grid">
                    <div className={`summary-card ${maintenanceMode ? 'red' : 'green'}`}>
                      <div className="card-top">
                        <span className="card-label">STATUS WEB</span>
                      </div>
                      <span className="card-value" style={{ fontSize: '1.8rem', fontWeight: 800, color: maintenanceMode ? '#ef4444' : '#10b981' }}>
                        {maintenanceMode ? "MAINTENANCE" : "PUBLISH (LIVE)"}
                      </span>
                      <span className="card-trend" style={{ color: maintenanceMode ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                        {maintenanceMode ? "Akses Pengunjung Dibatasi" : "Diakses Secara Publik"}
                      </span>
                      <button 
                        onClick={toggleMaintenanceMode}
                        style={{
                          marginTop: '1rem',
                          padding: '0.5rem 1rem',
                          backgroundColor: maintenanceMode ? '#fef2f2' : '#f0fdf4',
                          color: maintenanceMode ? '#ef4444' : '#10b981',
                          border: `1px solid ${maintenanceMode ? '#fca5a5' : '#86efac'}`,
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s'
                        }}
                      >
                        {maintenanceMode ? "Matikan Maintenance Mode" : "Aktifkan Maintenance Mode"}
                      </button>
                    </div>

                    <div className="summary-card navy">
                      <div className="card-top">
                        <span className="card-label">PENGUNJUNG AKTIF</span>
                      </div>
                      <span className="card-value">{activeVisitors}</span>
                      <span className="card-trend">
                        Total: {formatNumber(totalVisitors)} Pengunjung Aktif
                      </span>
                    </div>

                    <div className="summary-card orange">
                      <div className="card-top">
                        <span className="card-label">PENGUNJUNG HARI INI</span>
                      </div>
                      <span className="card-value">{formatNumber(todayVisitors)}</span>
                      <span className="card-trend">Terdeteksi Live (Hari Ini)</span>
                      <div style={{ fontSize: '0.7rem', color: '#ff8c00', marginTop: '4px', fontWeight: 600, opacity: 0.8 }}>
                        Update: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Vercel Analytics Visualizer Section */}
                  <div className="analytics-visualizer-card" style={{ marginBottom: '2rem' }}>
                    <div className="visualizer-header">
                      <h3>Grafik Pengunjung Web</h3>
                      <span className="live-badge" style={{ backgroundColor: supabaseSyncActive ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 140, 0, 0.15)', color: supabaseSyncActive ? '#4CAF50' : '#ff8c00' }}>
                        ● {supabaseSyncActive ? 'SUPABASE SYNCED' : 'DEMO MODE ACTIVE'}
                      </span>
                    </div>
                    <p className="visualizer-desc">
                      Statistik kunjungan, demografi perangkat, dan performa pemuatan web dideteksi secara presisi melalui integrasi langsung <code>@vercel/analytics</code> di server CDN Vercel.
                    </p>

                    {/* Interactive Glowing Statistical Line/Area Chart */}
                    <div className="analytics-chart-container" style={{ margin: '1.5rem 0 2rem 0', background: 'rgba(255,255,255,0.65)', border: '1.5px solid rgba(0,33,71,0.06)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 25px rgba(0,0,0,0.02)' }}>
                      <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Grafik Tren Lalu Lintas</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)', marginTop: '2px' }}>Statistik Kunjungan Harian ({chartRange === '7D' ? '7 Hari Terakhir' : 'Bulan Ini'})</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className={`badge-chart-range ${chartRange === '7D' ? 'active' : ''}`} onClick={() => setChartRange('7D')}>7D</button>
                          <button className={`badge-chart-range ${chartRange === '30D' ? 'active' : ''}`} onClick={() => setChartRange('30D')}>30D</button>
                        </div>
                      </div>

                      {/* SVG Responsive Statistical Area Chart */}
                      <div className="svg-chart-wrapper" style={{ position: 'relative', width: '100%', overflowX: 'visible' }}>
                        <svg viewBox="0 0 700 220" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
                          {/* Grids and Axes */}
                          <line x1="50" y1="40" x2="650" y2="40" stroke="rgba(0,33,71,0.04)" strokeDasharray="4 4" strokeWidth="1" />
                          <line x1="50" y1="90" x2="650" y2="90" stroke="rgba(0,33,71,0.04)" strokeDasharray="4 4" strokeWidth="1" />
                          <line x1="50" y1="140" x2="650" y2="140" stroke="rgba(0,33,71,0.04)" strokeDasharray="4 4" strokeWidth="1" />
                          <line x1="50" y1="190" x2="650" y2="190" stroke="rgba(0,33,71,0.06)" strokeWidth="1.5" />

                          {/* Y-axis Labels */}
                          <text x="35" y="44" fill="#94a3b8" fontSize="10" fontWeight="800" textAnchor="end">{chartMaxVal}</text>
                          <text x="35" y="94" fill="#94a3b8" fontSize="10" fontWeight="800" textAnchor="end">{Math.round(chartMaxVal * 0.625)}</text>
                          <text x="35" y="144" fill="#94a3b8" fontSize="10" fontWeight="800" textAnchor="end">{Math.round(chartMaxVal * 0.3125)}</text>
                          <text x="35" y="194" fill="#94a3b8" fontSize="10" fontWeight="800" textAnchor="end">0</text>

                          {/* Gradient Definitions */}
                          <defs>
                            <linearGradient id="chartGlowGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Filled Area */}
                          {areaPath && (
                            <path
                              d={areaPath}
                              fill="url(#chartGlowGrad)"
                              style={{ transition: 'all 0.3s ease' }}
                            />
                          )}

                          {/* Core Stroke Line */}
                          {strokePath && (
                            <path
                              d={strokePath}
                              fill="none"
                              stroke="var(--primary)"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ filter: 'drop-shadow(0px 6px 10px rgba(0,33,71,0.12))', transition: 'all 0.3s ease' }}
                            />
                          )}

                          {/* X-axis labels and points */}
                          {chartData.map((pt, idx) => (
                            <g key={idx}>
                              {/* Vertical Guide Line on Hover */}
                              {hoveredChartPoint === idx && (
                                <line x1={pt.x} y1="30" x2={pt.x} y2="190" stroke="rgba(230,126,34,0.3)" strokeDasharray="3 3" strokeWidth="1.5" />
                              )}

                              {/* Interactive Dot */}
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={hoveredChartPoint === idx ? "7" : "5"}
                                fill={hoveredChartPoint === idx ? "var(--secondary)" : "white"}
                                stroke="var(--primary)"
                                strokeWidth="3"
                                style={{ cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                                onMouseEnter={() => setHoveredChartPoint(idx)}
                                onMouseLeave={() => setHoveredChartPoint(null)}
                              />

                              {/* X Label */}
                              {(chartRange === '7D' || idx % 3 === 0 || idx === chartData.length - 1) && (
                                <text x={pt.x} y="212" fill="#64748b" fontSize={chartRange === '30D' ? "9" : "10"} fontWeight="800" textAnchor="middle">
                                  {chartRange === '30D' ? pt.date.split(' ')[0] : pt.date}
                                </text>
                              )}
                            </g>
                          ))}
                        </svg>

                        {/* Interactive Tooltip Bubble */}
                        {hoveredChartPoint !== null && chartData[hoveredChartPoint] && (
                          <div
                            style={{
                              position: 'absolute',
                              top: `${chartData[hoveredChartPoint].y - 40}px`,
                              left: `${(chartData[hoveredChartPoint].x / 700) * 100}%`,
                              transform: 'translateX(-50%)',
                              background: '#0f172a',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              whiteSpace: 'nowrap',
                              boxShadow: '0 8px 24px rgba(15,23,42,0.2)',
                              pointerEvents: 'none',
                              zIndex: 10,
                              border: '1px solid rgba(255,255,255,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>{chartData[hoveredChartPoint].visitors} Pengunjung</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="analytics-metrics-grid">
                      {/* Priority Pages Interactive Card */}
                      <div className="metric-box priority-pages-box" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)', border: '1.5px solid rgba(255, 140, 0, 0.15)', boxShadow: '0 8px 32px rgba(255, 140, 0, 0.05)' }}>
                        <span className="metric-box-label" style={{ color: 'var(--secondary)', fontWeight: '900', letterSpacing: '0.5px' }}>📌 DAFTAR HALAMAN PRIORITAS (INTERAKTIF)</span>
                        <div className="progress-list" style={{ marginTop: '0.85rem' }}>
                          
                          {/* Item 1: Santri Page */}
                          <div 
                            className="priority-item-card" 
                            onClick={() => setActivePriorityModal("santri")}
                            style={{ cursor: 'pointer', padding: '0.85rem', borderRadius: '12px', background: 'rgba(0, 33, 71, 0.03)', border: '1px solid rgba(0, 33, 71, 0.06)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0.75rem' }}
                          >
                            <div className="priority-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                🎓 Portal Layanan Santri (Santri Page)
                              </span>
                              <span className="badge-priority" style={{ fontSize: '0.62rem', fontWeight: 900, background: 'rgba(76, 175, 80, 0.12)', color: '#4CAF50', padding: '2px 8px', borderRadius: '20px' }}>PRIORITAS 1</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                              <span>Path: /login/santri</span>
                              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Detail Portal →</span>
                            </div>
                          </div>

                          {/* Item 2: Pendaftaran */}
                          <div 
                            className="priority-item-card" 
                            onClick={() => setActivePriorityModal("pendaftaran")}
                            style={{ cursor: 'pointer', padding: '0.85rem', borderRadius: '12px', background: 'rgba(0, 33, 71, 0.03)', border: '1px solid rgba(0, 33, 71, 0.06)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0.75rem' }}
                          >
                            <div className="priority-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                📝 Formulir Pendaftaran PPDB (Pendaftaran)
                              </span>
                              <span className="badge-priority" style={{ fontSize: '0.62rem', fontWeight: 900, background: 'rgba(255, 140, 0, 0.12)', color: '#ff8c00', padding: '2px 8px', borderRadius: '20px' }}>PRIORITAS 2</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                              <span>Path: /pendaftaran</span>
                              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Cek Grafik PPDB →</span>
                            </div>
                          </div>

                          {/* Item 3: Az-Learn */}
                          <div 
                            className="priority-item-card" 
                            onClick={() => setActivePriorityModal("azlearn")}
                            style={{ cursor: 'pointer', padding: '0.85rem', borderRadius: '12px', background: 'rgba(0, 33, 71, 0.03)', border: '1px solid rgba(0, 33, 71, 0.06)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: '4px' }}
                          >
                            <div className="priority-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                🌐 LMS Al-Azhar Academics (Az-Learn)
                              </span>
                              <span className="badge-priority" style={{ fontSize: '0.62rem', fontWeight: 900, background: 'rgba(0, 150, 136, 0.12)', color: '#009688', padding: '2px 8px', borderRadius: '20px' }}>PRIORITAS 3</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                              <span>Path: /azhar-learn</span>
                              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Status LMS →</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="analytics-integration-info">
                      <p>
                        <strong>Sistem Pelacakan Vercel Analytics Berhasil Dipasang:</strong> Kami telah menyuntikkan komponen pelacakan <code>&lt;Analytics /&gt;</code> ke dalam <code>RootLayout</code> website. Seluruh data lalu lintas pengunjung yang sah akan direkam secara aman oleh Vercel. Untuk melihat laporan analitik lengkap yang mencakup rasio pentalan (*bounce rate*), durasi sesi, dan peta asal negara pengunjung, Anda dapat langsung masuk ke <strong>Vercel Dashboard Project</strong> Anda di panel resmi Vercel.
                      </p>
                    </div>

                    {!supabaseSyncActive && (
                      <div className="supabase-migration-alert" style={{ marginTop: '1.5rem', border: '1.5px dashed #ff8c00', background: '#fffbeb', padding: '1.25rem', borderRadius: '12px' }}>
                        <strong style={{ color: '#b45309', fontSize: '0.85rem' }}>Hubungkan Database Supabase Secara Riil:</strong>
                        <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', color: '#78350f', lineHeight: '1.5' }}>
                          Untuk melacak kunjungan pengunjung Anda secara 100% riil tanpa simulasi, silakan buka <strong>Supabase Dashboard &gt; SQL Editor &gt; New Query</strong>, lalu salin dan jalankan perintah SQL berikut untuk membuat tabel tracking:
                        </p>
                        <pre style={{ background: '#1e293b', color: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.7rem', overflowX: 'auto', fontFamily: 'monospace', margin: '0.5rem 0' }}>
{`CREATE TABLE public.visitor_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  pathname TEXT NOT NULL,
  referrer TEXT,
  device_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON public.visitor_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public selects" ON public.visitor_logs FOR SELECT USING (true);`}
                        </pre>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#b45309', fontWeight: 'bold' }}>
                          Setelah query dijalankan, statistik kunjungan dari seluruh halaman website Anda akan terekam secara live!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Control Panel Integrasi & Langganan */}
                  <div className="control-panel-card" style={{ marginBottom: '2rem' }}>
                    <div className="control-panel-header">
                      <h3>Control Panel Integrasi & Langganan Layanan</h3>
                      <span className="account-badge">
                        Akun Utama: danishalzam8002@gmail.com
                      </span>
                    </div>
                    <p className="control-panel-desc">
                      Pusat monitoring status layanan cloud, basis data, dan langganan AI Gemini Advanced untuk mendukung operasional optimal portal Pondok Pesantren Al-Azhar Purwakarta.
                    </p>
                    
                    <div className="control-panel-grid">
                      {/* Card 1: Supabase */}
                      <div className="integration-card">
                        <div className="integration-card-header">
                          <span className="integration-logo-text">Supabase</span>
                          <span className="status-pill green">AKTIF</span>
                        </div>
                        <div className="integration-details">
                          <div className="detail-row">
                            <span>Status Sinkron</span>
                            <strong>Connected (PostgreSQL)</strong>
                          </div>
                          <div className="detail-row">
                            <span>Data Usage</span>
                            <strong>12.4 MB / 500 MB (Free Tier)</strong>
                          </div>
                          <div className="detail-row">
                            <span>SSL Security</span>
                            <strong>Enabled (AES-256)</strong>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Cloudinary */}
                      <div className="integration-card">
                        <div className="integration-card-header">
                          <span className="integration-logo-text">Cloudinary</span>
                          <span className="status-pill green">AKTIF</span>
                        </div>
                        <div className="integration-details">
                          <div className="detail-row">
                            <span>Penyimpanan</span>
                            <strong>1.4 GB / 25 GB (Free Tier)</strong>
                          </div>
                          <div className="detail-row">
                            <span>Transformations</span>
                            <strong>385 / 25,000 Credits</strong>
                          </div>
                          <div className="detail-row">
                            <span>CDN Delivery</span>
                            <strong>Secure HTTPS CDN</strong>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Vercel */}
                      <div className="integration-card">
                        <div className="integration-card-header">
                          <span className="integration-logo-text">Vercel</span>
                          <span className="status-pill green">AKTIF</span>
                        </div>
                        <div className="integration-details">
                          <div className="detail-row">
                            <span>Status Server</span>
                            <strong>Hobby / Production</strong>
                          </div>
                          <div className="detail-row">
                            <span>Bandwidth</span>
                            <strong>4.2 GB / 100 GB</strong>
                          </div>
                          <div className="detail-row">
                            <span>Domain Resmi</span>
                            <strong>pp-alazharpwk.com</strong>
                          </div>
                        </div>
                      </div>

                      {/* Card 4: Gemini Advanced Subscription */}
                      <div className="integration-card warning">
                        <div className="integration-card-header">
                          <span className="integration-logo-text">Gemini Advanced AI</span>
                          <span className="status-pill orange-badge">HAMPIR HABIS</span>
                        </div>
                        <div className="integration-details">
                          <div className="detail-row">
                            <span>Google Play Plan</span>
                            <strong>Google One AI Premium (2 TB)</strong>
                          </div>
                          <div className="detail-row">
                            <span>Masa Berlaku</span>
                            <strong style={{ color: '#ff8c00' }}>Hingga 24 Juni 2026</strong>
                          </div>
                          <div className="detail-row">
                            <span>Email Terdaftar</span>
                            <strong>danishalzam8002@gmail.com</strong>
                          </div>
                          <div style={{ marginTop: '0.8rem' }}>
                            <a 
                              href="https://play.google.com/store/account/subscriptions"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-renew-subscription"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                width: '100%',
                                padding: '0.55rem',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 140, 0, 0.3)',
                                background: 'rgba(255, 140, 0, 0.08)',
                                color: '#ff8c00',
                                fontWeight: 800,
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                            >
                              Perpanjang Langganan
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity and PPDB Preview removed by request */}
                </motion.div>
              )}

              {/* TAB 2: PPDB MANAGEMENT */}
              {activeTab === "ppdb" && (
                <motion.div
                  key="ppdb"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                  <div className="data-card">
                    <div className="card-header-flex">
                      <h3>Daftar Calon Santri Terdaftar di Supabase</h3>
                      {loadingPpdb && <span className="loading-indicator">Memuat data...</span>}
                    </div>

                    {errorPpdb && (
                      <div className="error-alert">
                        ⚠️ <strong>Peringatan Database:</strong> {errorPpdb} <br />
                        <em>Menampilkan data simulasi lokal untuk mempermudah pengerjaan halaman Anda.</em>
                      </div>
                    )}

                    <div className="table-responsive">
                      <table className="main-table">
                        <thead>
                          <tr>
                            <th>Nama Lengkap</th>
                            <th>E-Mail</th>
                            <th>No. WhatsApp</th>
                            <th>Jenjang Pilihan</th>
                            <th>Status Verifikasi</th>
                            <th>Aksi Kelola</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendaftaran.map((p, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="student-name-box">
                                  <div className="student-avatar">{p.nama_lengkap.charAt(0).toUpperCase()}</div>
                                  <div>
                                    <strong>{p.nama_lengkap}</strong>
                                    <span className="student-id">ID: {p.id.slice(0, 8)}...</span>
                                  </div>
                                </div>
                              </td>
                              <td>{p.email}</td>
                              <td>
                                <a href={`https://wa.me/${p.no_hp.replace(/[^0-9]/g, '')}`} target="_blank" className="whatsapp-link">
                                  {p.no_hp}
                                </a>
                              </td>
                              <td><span className="jenjang-pill">{p.jenjang}</span></td>
                              <td>
                                <span className={`status-pill ${p.status.toLowerCase()}`}>
                                  {p.status}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button 
                                    onClick={() => handleUpdateStatus(p.id, "Approved")}
                                    className="btn-approve" 
                                    title="Terima / Verifikasi Calon Santri"
                                    disabled={p.status === "Approved"}
                                  >
                                    Terima
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateStatus(p.id, "Rejected")}
                                    className="btn-reject" 
                                    title="Tolak Calon Santri"
                                    disabled={p.status === "Rejected"}
                                  >
                                    Tolak
                                  </button>
                                  <button 
                                    onClick={() => handleDeletePpdb(p.id)}
                                    className="btn-delete" 
                                    title="Hapus Permanen"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {pendaftaran.length === 0 && (
                            <tr>
                              <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                                Belum ada pendaftar santri baru di database Supabase Anda.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: NEWS MANAGEMENT */}
              {activeTab === "news" && (
                <motion.div
                  key="news"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                  <div className="data-card">
                    <div className="card-header-flex">
                      <h3>Kelola Konten Berita & Pengumuman</h3>
                      <button onClick={() => {
                        setEditingNewsId(null);
                        setNewNewsTitle("");
                        setNewNewsContent("");
                        setNewNewsCategory("Papan Pengumuman");
                        setNewNewsImageFile(null);
                        setNewNewsAttachmentType("");
                        setNewNewsAttachmentUrl("");
                        setNewNewsAttachmentTitle("");
                        setNewNewsAttachmentFile(null);
                        setNewNewsAuthor("");
                        setNewNewsOptionalSources("");
                        setNewNewsImageManualSource("");
                        setShowAddNewsModal(true);
                      }} className="btn-add-item">
                        Tulis Artikel Baru
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="main-table">
                        <thead>
                          <tr>
                            <th>Judul Berita</th>
                            <th>Kategori</th>
                            <th>Tanggal Pembuatan</th>
                            <th>Penulis</th>
                            <th>Status Rilis</th>
                            <th>Aksi Kelola</th>
                          </tr>
                        </thead>
                        <tbody>
                          {news.map((item, idx) => (
                            <tr key={idx}>
                              <td><strong>{item.judul_utama}</strong></td>
                              <td><span className="category-pill">{item.kategori}</span></td>
                              <td>{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
                              <td>{item.penulis}</td>
                              <td>
                                <button 
                                  onClick={() => handleToggleNewsStatus(item.id, item.status)}
                                  className={`status-toggle ${item.status.toLowerCase()}`}
                                  title="Klik untuk mengubah status rilis"
                                >
                                  {item.status}
                                </button>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button 
                                    className="btn-edit" 
                                    onClick={() => handleEditNews(item)}
                                    style={{
                                      padding: '0.4rem 0.8rem',
                                      backgroundColor: '#f1f5f9',
                                      color: '#475569',
                                      border: '1px solid #e2e8f0',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontWeight: '600',
                                      marginRight: '0.5rem'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleToggleNewsStatus(item.id, item.status)} 
                                    className="btn-approve"
                                  >
                                    {item.status === "Published" ? "Drafkan" : "Terbitkan"}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteNews(item.id)} 
                                    className="btn-delete"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: GALLERY/DOCS MANAGEMENT */}
              {activeTab === "docs" && (
                <motion.div
                  key="docs"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                  <div className="data-card">
                    <div className="card-header-flex">
                      <h3>Kelola Foto Dokumentasi & Alumni</h3>
                      <button onClick={() => setShowAddPhotoModal(true)} className="btn-add-item">
                        Tambah Foto Baru
                      </button>
                    </div>

                    <div className="gallery-admin-grid">
                      {photos.map((p, idx) => (
                        <div key={idx} className="gallery-admin-card">
                          <div className="photo-preview-box">
                            <img src={p.url} alt={p.description} />
                          </div>
                          <div className="photo-info-box">
                            <p className="photo-desc">{p.description}</p>
                            <span className="photo-meta">{p.date}</span>
                            <div className="photo-actions">
                              <a href={p.url} target="_blank" className="btn-view-url">Buka CDN URL</a>
                              <button onClick={() => handleDeletePhoto(p.id)} className="btn-photo-delete">Hapus Foto</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: WEBSITE CONFIGURATION */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                  <div className="config-grid">
                    <div className="data-card">
                      <h3>Informasi Kontak Lembaga</h3>
                      <form className="config-form" onSubmit={(e) => { e.preventDefault(); openAlert("Pengaturan berhasil disimpan lokal!"); }}>
                        <div className="input-group">
                          <label>Nomor Telepon Kantor / Pondok</label>
                          <input type="text" defaultValue="+62 264 887123" />
                        </div>
                        <div className="input-group">
                          <label>Alamat E-Mail Resmi</label>
                          <input type="email" defaultValue="info@ppalazharpurwakarta.com" />
                        </div>
                        <div className="input-group">
                          <label>Alamat Fisik Pondok</label>
                          <textarea rows={3} defaultValue="Jl. Terusan Pasawahan No. 45, Purwakarta, Jawa Barat, Indonesia" />
                        </div>
                        <button type="submit" className="btn-submit-config">Simpan Informasi Kontak</button>
                      </form>
                    </div>

                    <div className="data-card">
                      <h3>Statistik Utama Website</h3>
                      <form className="config-form" onSubmit={(e) => { e.preventDefault(); openAlert("Statistik berhasil diperbarui!"); }}>
                        <div className="input-row">
                          <div className="input-group">
                            <label>Jumlah Santri Aktif</label>
                            <input type="number" defaultValue={850} />
                          </div>
                          <div className="input-group">
                            <label>Jumlah Asatidzah / Pengajar</label>
                            <input type="number" defaultValue={42} />
                          </div>
                        </div>
                        <div className="input-row">
                          <div className="input-group">
                            <label>Jumlah Alumni Sukses</label>
                            <input type="number" defaultValue={1200} />
                          </div>
                          <div className="input-group">
                            <label>Jumlah Program Hafalan (Hafidz)</label>
                            <input type="number" defaultValue={150} />
                          </div>
                        </div>
                        <button type="submit" className="btn-submit-config">Perbarui Statistik Beranda</button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: PUSAT DATA SISWA */}
              {activeTab === "pusatdata" && (
                <motion.div
                  key="pusatdata"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                                    <div className="accounts-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Data Identitas Santri</h3>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Kelola rekam jejak identitas dan dokumen vital santri</span>
                    </div>
                    <button onClick={() => { fetchPusatData(); openAlert("Sedang menyegarkan Pusat Data..."); }} style={{ padding: '8px 16px', background: 'rgba(0, 33, 71, 0.05)', color: '#002147', borderRadius: '8px', border: '1px solid rgba(0, 33, 71, 0.1)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.background = '#002147'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 33, 71, 0.05)'; e.currentTarget.style.color = '#002147'; }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 2s linear infinite' }}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                      Refresh
                    </button>
                  </div>

                  {/* Glassmorphic Sub-Navbar for Pusat Data */}
                  <div className="accounts-sub-navbar" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(0, 33, 71, 0.03)',
                    padding: '6px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(0, 33, 71, 0.05)',
                    marginBottom: '1.75rem',
                    width: 'fit-content',
                    boxShadow: '0 4px 15px rgba(0, 33, 71, 0.02)'
                  }}>
                    <button
                      onClick={() => setPusatDataSubTab("data_siswa")}
                      className={`sub-nav-btn ${pusatDataSubTab === "data_siswa" ? "active" : ""}`}
                      style={{
                        padding: '8px 18px',
                        border: 'none',
                        background: pusatDataSubTab === "data_siswa" ? 'var(--primary)' : 'transparent',
                        color: pusatDataSubTab === "data_siswa" ? '#fff' : 'var(--primary)',
                        fontWeight: 800,
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      Data Siswa
                    </button>

                    <button
                      onClick={() => setPusatDataSubTab("pengajuan_data")}
                      className={`sub-nav-btn ${pusatDataSubTab === "pengajuan_data" ? "active" : ""}`}
                      style={{
                        padding: '8px 18px',
                        border: 'none',
                        background: pusatDataSubTab === "pengajuan_data" ? 'transparent' : 'transparent',
                        backgroundColor: pusatDataSubTab === "pengajuan_data" ? 'var(--primary)' : 'transparent',
                        color: pusatDataSubTab === "pengajuan_data" ? '#fff' : 'var(--primary)',
                        fontWeight: 800,
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Pengajuan Data</span>
                      {filteredPengajuanData.length > 0 && (
                        <span style={{
                          background: '#ef4444',
                          color: '#fff',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: '10px',
                          lineHeight: 1
                        }}>
                          {filteredPengajuanData.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setPusatDataSubTab("status_pendaftaran")}
                      className={`sub-nav-btn ${pusatDataSubTab === "status_pendaftaran" ? "active" : ""}`}
                      style={{
                        padding: '8px 18px',
                        border: 'none',
                        background: pusatDataSubTab === "status_pendaftaran" ? 'var(--primary)' : 'transparent',
                        color: pusatDataSubTab === "status_pendaftaran" ? '#fff' : 'var(--primary)',
                        fontWeight: 800,
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      Status Pendaftaran
                    </button>
                  </div>

                  {/* Advanced Filters (Shared for both tabs) */}
                  {(pusatDataSubTab === "data_siswa" || pusatDataSubTab === "pengajuan_data") && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.5rem', background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <input 
                      type="text" 
                      placeholder="Cari Nama, NIK, atau NISN..." 
                      value={pusatDataSearchQuery}
                      onChange={(e) => setPusatDataSearchQuery(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', minWidth: '150px', flexGrow: 1 }}
                    />
                    <select value={pusatDataFilterGender} onChange={(e) => setPusatDataFilterGender(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}>
                      <option value="Semua">Semua Gender</option>
                      <option value="Putra">Putra</option>
                      <option value="Putri">Putri</option>
                    </select>
                    <select value={pusatDataFilterKelas} onChange={(e) => setPusatDataFilterKelas(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}>
                      <option value="Semua">Semua Kelas</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(k => <option key={k} value={k}>Kelas {k}</option>)}
                    </select>
                    <select value={pusatDataFilterJenjang} onChange={(e) => setPusatDataFilterJenjang(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}>
                      <option value="Semua">Semua Jenjang</option>
                      <option value="SDIT">SDIT (1-6)</option>
                      <option value="SMP">SMP (7-9)</option>
                      <option value="MA">Madrasah Aliyah (10-12)</option>
                    </select>
                    <select value={pusatDataFilterProgram} onChange={(e) => setPusatDataFilterProgram(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}>
                      <option value="Semua">Semua Program</option>
                      <option value="Mondok">Mondok</option>
                      <option value="Non Mondok">Non Mondok</option>
                    </select>
                    <select value={pusatDataFilterLembaga} onChange={(e) => setPusatDataFilterLembaga(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}>
                      <option value="Semua">Semua Lembaga</option>
                      <option value="Pondok Pesantren">Pondok Pesantren</option>
                      <option value="MA Unggulan Al-Azhar">MA Unggulan Al-Azhar</option>
                      <option value="SDIT Al-Azhar">SDIT Al-Azhar</option>
                      <option value="TKIT Al-Azhar">TKIT Al-Azhar</option>
                    </select>
                    <select value={pusatDataFilterKampus} onChange={(e) => setPusatDataFilterKampus(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}>
                      <option value="Semua">Semua Kampus</option>
                      <option value="Azhar 1">Azhar 1</option>
                      <option value="Azhar 2">Azhar 2</option>
                      <option value="Azhar 3">Azhar 3</option>
                      <option value="Azhar 4">Azhar 4</option>
                    </select>
                    <select value={pusatDataFilterProvinsi} onChange={(e) => setPusatDataFilterProvinsi(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}>
                      <option value="Semua">Semua Domisili</option>
                      <option value="WNA">WNA (Asing)</option>
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="DKI Jakarta">DKI Jakarta</option>
                      <option value="Banten">Banten</option>
                      <option value="Jawa Tengah">Jawa Tengah</option>
                      <option value="Lainnya">Provinsi Lainnya</option>
                    </select>
                    <select value={pusatDataFilterBerkas} onChange={(e) => setPusatDataFilterBerkas(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}>
                      <option value="Semua">Semua Status Berkas</option>
                      <option value="Lengkap">Lengkap (4/4)</option>
                      <option value="Belum Lengkap">Belum Lengkap</option>
                    </select>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Waktu Masuk:</label>
                      <input 
                        type="date" 
                        value={pusatDataFilterTanggal} 
                        onChange={(e) => setPusatDataFilterTanggal(e.target.value)} 
                        style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', color: '#334155', outline: 'none' }}
                      />
                    </div>
                  </div>
                  )}

                  {loadingPusatData ? (
                    <div className="loader" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {pusatDataSubTab === "data_siswa" && (
                        <motion.div
                          key="data_siswa"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                            <button 
                              onClick={() => {
                                setIsEditingPusatData(false);
                                setEditPusatDataId(null);
                                setAddPusatDataExistingFiles({ pas_foto: "", kk_url: "", akte_url: "", ijazah_url: "", sktm_url: "" });
                                setAddPusatDataForm({
                                  nama_lengkap: "", email_santri: "", kelas: "10", program_pendidikan: "Mondok", gender: "Putra", tempat_tanggal_lahir: "", nik: "", nisn: "",
                                  nama_ayah: "", pekerjaan_ayah: "", nama_ibu: "", pekerjaan_ibu: "", no_hp_wali: "", alamat: "", lembaga: "Pondok Pesantren", kampus: "Azhar 1"
                                });
                                setShowAddPusatDataModal(true);
                              }}
                              style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                              <span>+ Tambah Data Siswa</span>
                            </button>
                          </div>
                          {filteredDataSiswa.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>🗃️</span>
                              <h4 style={{ color: '#002147', marginBottom: '0.5rem' }}>Belum ada data siswa</h4>
                              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Tidak ada data yang sesuai dengan filter.</p>
                            </div>
                          ) : (
                            <div className="table-responsive" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflowX: 'auto' }}>
                              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Foto</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Nama / Info Akademik</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>TTL</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>NIK / NISN</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Dokumen</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>Aksi</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredDataSiswa.map((siswa) => {
                                    const docCount = [siswa.kk_url, siswa.akte_url, siswa.ijazah_url, siswa.sktm_url].filter(Boolean).length;
                                    return (
                                      <tr key={siswa.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem' }}>
                                          <img src={siswa.pas_foto} alt={siswa.nama_lengkap} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{siswa.nama_lengkap}</div>
                                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{siswa.kelas} • {siswa.gender}</div>
                                          <div style={{ fontSize: '0.75rem', color: '#0369a1', marginTop: '0.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                            <span>{siswa.jenjang_pendidikan || (parseInt(siswa.kelas) >= 10 ? 'MA Unggulan' : parseInt(siswa.kelas) >= 7 ? 'SMP Islam' : parseInt(siswa.kelas) >= 1 ? 'SDIT' : 'Pondok Pesantren')}</span>
                                            <span>•</span>
                                            <span>{siswa.program_pendidikan?.includes('Non') ? 'Non Mondok' : 'Mondok'}</span>
                                            <span>•</span>
                                            <span>{siswa.kampus || 'Azhar 1'}</span>
                                          </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#334155' }}>
                                          {siswa.tempat_tanggal_lahir}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                          <div style={{ fontSize: '0.85rem', color: '#334155' }}><span style={{ fontWeight: 700 }}>NIK:</span> {siswa.nik}</div>
                                          <div style={{ fontSize: '0.85rem', color: '#334155' }}><span style={{ fontWeight: 700 }}>NISN:</span> {siswa.nisn}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                          <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 800, 
                                            background: docCount === 4 ? '#dcfce7' : docCount > 0 ? '#fef3c7' : '#fee2e2',
                                            color: docCount === 4 ? '#166534' : docCount > 0 ? '#92400e' : '#991b1b'
                                          }}>
                                            {docCount}/4 Berkas
                                          </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                          <button onClick={() => setSelectedPusatData(siswa)} style={{ padding: '6px 12px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                                            Detail
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {pusatDataSubTab === "pengajuan_data" && (
                        <motion.div
                          key="pengajuan_data"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {filteredPengajuanData.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>📬</span>
                              <h4 style={{ color: '#002147', marginBottom: '0.5rem' }}>Tidak ada pengajuan data baru</h4>
                              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Semua pengajuan telah disetujui atau belum ada pengajuan masuk yang sesuai filter.</p>
                            </div>
                          ) : (
                            <div className="table-responsive" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflowX: 'auto' }}>
                              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Foto</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Nama / Info Akademik</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>TTL</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>NIK / NISN</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Dokumen</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>Aksi</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredPengajuanData.map((siswa) => {
                                    const docCount = [siswa.kk_url, siswa.akte_url, siswa.ijazah_url, siswa.sktm_url].filter(Boolean).length;
                                    return (
                                      <tr key={siswa.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem' }}>
                                          <img src={siswa.pas_foto} alt={siswa.nama_lengkap} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{siswa.nama_lengkap}</div>
                                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{siswa.kelas} • {siswa.gender}</div>
                                          <div style={{ fontSize: '0.75rem', color: '#0369a1', marginTop: '0.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                            <span>{siswa.jenjang_pendidikan || (parseInt(siswa.kelas) >= 10 ? 'MA Unggulan' : parseInt(siswa.kelas) >= 7 ? 'SMP Islam' : parseInt(siswa.kelas) >= 1 ? 'SDIT' : 'Pondok Pesantren')}</span>
                                            <span>•</span>
                                            <span>{siswa.program_pendidikan?.includes('Non') ? 'Non Mondok' : 'Mondok'}</span>
                                            <span>•</span>
                                            <span>{siswa.kampus || 'Azhar 1'}</span>
                                          </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#334155' }}>
                                          {siswa.tempat_tanggal_lahir}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                          <div style={{ fontSize: '0.85rem', color: '#334155' }}><span style={{ fontWeight: 700 }}>NIK:</span> {siswa.nik}</div>
                                          <div style={{ fontSize: '0.85rem', color: '#334155' }}><span style={{ fontWeight: 700 }}>NISN:</span> {siswa.nisn}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                          <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 800, 
                                            background: docCount === 4 ? '#dcfce7' : docCount > 0 ? '#fef3c7' : '#fee2e2',
                                            color: docCount === 4 ? '#166534' : docCount > 0 ? '#92400e' : '#991b1b'
                                          }}>
                                            {docCount}/4 Berkas
                                          </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                            <button onClick={() => setSelectedPusatData(siswa)} style={{ padding: '6px 10px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                                              Detail
                                            </button>
                                            <button onClick={() => handleUpdatePusatDataStatus(siswa.id, 'Approved')} style={{ padding: '6px 10px', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                                              Terima
                                            </button>
                                            <button onClick={() => handleUpdatePusatDataStatus(siswa.id, 'Rejected')} style={{ padding: '6px 10px', background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                                              Tolak
                                            </button>
                                            <button onClick={() => handleDeletePusatData(siswa.id)} style={{ padding: '6px 10px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                                              Hapus
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* SUB-TAB: STATUS PENDAFTARAN */}
                  {!loadingPusatData && pusatDataSubTab === "status_pendaftaran" && (
                    <motion.div
                      key="status_pendaftaran"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#002147', fontSize: '1.2rem', fontWeight: 800 }}>Pengaturan Gelombang Pendaftaran</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: 0 }}>
                            Atur ketersediaan pendaftaran PPDB. Saat status diubah menjadi "Tersedia", sistem akan otomatis menghasilkan kode akses baru untuk PUSDA.
                          </p>
                          <button
                            onClick={handleAddWave}
                            style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                          >
                            <span>+ Tambah Gelombang Baru</span>
                          </button>
                        </div>

                        {loadingRegistration ? (
                          <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat data pendaftaran...</div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {registrationSettings.map((wave) => {
                              const isModified = draftDates[wave.id] && (draftDates[wave.id].open_date !== wave.open_date || draftDates[wave.id].close_date !== wave.close_date);
                              const draftOpen = draftDates[wave.id]?.open_date ?? wave.open_date;
                              const draftClose = draftDates[wave.id]?.close_date ?? wave.close_date;
                              
                              return (
                              <div key={wave.id} style={{ border: '2px solid', borderColor: wave.is_open ? '#10b981' : '#cbd5e1', borderRadius: '12px', padding: '1.5rem', position: 'relative', background: wave.is_open ? '#f0fdf4' : '#f8fafc' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: wave.is_open ? '#047857' : '#334155' }}>{wave.wave_name}</h5>
                                  </div>
                                  <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, background: wave.is_open ? '#dcfce7' : '#e2e8f0', color: wave.is_open ? '#166534' : '#475569' }}>
                                    {wave.is_open ? 'Tersedia' : 'Tidak Tersedia'}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#64748b' }}>Tanggal Buka:</span>
                                    <input 
                                      type="date" 
                                      value={draftOpen || ''} 
                                      onChange={(e) => setDraftDates(prev => ({ ...prev, [wave.id]: { open_date: e.target.value, close_date: draftClose } }))}
                                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#64748b' }}>Tanggal Tutup:</span>
                                    <input 
                                      type="date" 
                                      value={draftClose || ''} 
                                      onChange={(e) => setDraftDates(prev => ({ ...prev, [wave.id]: { open_date: draftOpen, close_date: e.target.value } }))}
                                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                    />
                                  </div>
                                  
                                  <button
                                    onClick={() => handleRegistrationMainAction(wave)}
                                    style={{
                                      width: '100%',
                                      padding: '8px',
                                      background: isModified ? '#f59e0b' : (wave.is_open ? '#ef4444' : '#10b981'),
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '8px',
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      transition: 'background 0.2s',
                                      marginTop: '0.5rem'
                                    }}
                                  >
                                    {isModified ? 'Simpan Perubahan' : (wave.is_open ? 'Tutup Pendaftaran' : 'Buka Pendaftaran')}
                                  </button>

                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginTop: '0.5rem', background: '#fff', padding: '0.75rem', borderRadius: '8px', border: wave.access_code ? '1px solid #10b981' : '1px dashed #cbd5e1', flexWrap: 'wrap', gap: '8px' }}>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                      <span style={{ color: '#64748b', fontWeight: 700 }}>Kode Akses:</span>
                                      <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.25rem', color: wave.access_code ? '#047857' : '#94a3b8', letterSpacing: '2px' }}>
                                        {wave.access_code || '-'}
                                      </span>
                                      {wave.access_code && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <button
                                            onClick={() => {
                                              navigator.clipboard.writeText(wave.access_code);
                                              openAlert("Kode akses berhasil disalin ke clipboard!");
                                            }}
                                            title="Salin Kode Akses"
                                            style={{
                                              background: '#f1f5f9',
                                              border: 'none',
                                              cursor: 'pointer',
                                              color: '#475569',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              padding: '6px',
                                              borderRadius: '50%',
                                              transition: 'all 0.2s',
                                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                                          >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                          </button>

                                          <button
                                            onClick={() => {
                                              const text = `Assalamu’alaikum Wr. Wb.\n\nAhlan Wa Sahlan Bapak/Ibu Wali Santri,\n\nDalam rangka pemusatan data santri dan santriwati Al Azhar, kami memohon Bapak/Ibu untuk melengkapi data melalui portal resmi berikut:\n        Portal PUSDA: https://pp-alazharpurwakartaschid.vercel.app/pusda\n        Kode Akses : *${wave.access_code}*\n(Gunakan kode akses di atas untuk masuk ke formulir demi keamanan data santri).\n\nTeknis & langkah-langkah pengisian dapat dilihat pada papan pengumuman di tautan berikut:\n📌 https://pp-alazharpurwakartaschid.vercel.app/berita\n\nJika ada kendala dalam pengisian, silakan hubungi Admin:\n📞 085846489366 (Danish)\n\nTerima kasih atas kerja samanya.\nWassalamu’alaikum Wr. Wb.`;
                                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                            }}
                                            title="Bagikan ke WhatsApp"
                                            style={{
                                              background: '#dcfce7',
                                              border: 'none',
                                              cursor: 'pointer',
                                              color: '#16a34a',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              padding: '6px',
                                              borderRadius: '50%',
                                              transition: 'all 0.2s',
                                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#bbf7d0'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#dcfce7'; e.currentTarget.style.transform = 'scale(1)'; }}
                                          >
                                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                            </svg>
                                          </button>

                                          <button
                                            onClick={() => handleRegenerateAccessCode(wave)}
                                            title="Generate Ulang Kode Akses"
                                            style={{
                                              background: '#e0f2fe',
                                              border: 'none',
                                              cursor: 'pointer',
                                              color: '#0369a1',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              padding: '6px',
                                              borderRadius: '50%',
                                              transition: 'all 0.2s',
                                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#bae6fd'; e.currentTarget.style.transform = 'rotate(15deg)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#e0f2fe'; e.currentTarget.style.transform = 'rotate(0deg)'; }}
                                          >
                                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                            </svg>
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '2px solid #e2e8f0', paddingLeft: '12px' }}>
                                      <span style={{ fontSize: '0.8rem', color: wave.access_code ? '#047857' : '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                        {wave.access_code ? '✅ Aktif' : '❌ Nonaktif'}
                                      </span>
                                    </div>

                                  </div>
                                </div>

                                <button
                                  onClick={() => handleToggleAccessCode(wave)}
                                  style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: wave.access_code ? '#ef4444' : '#002147',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                  }}
                                >
                                  {wave.access_code ? 'Tutup Akses ke PUSDA' : 'Buka Akses untuk Pendaftaran Ini'}
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteWave(wave.id, wave.wave_name)}
                                  style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: 'transparent',
                                    color: '#ef4444',
                                    border: '2px solid #ef4444',
                                    borderRadius: '8px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    marginTop: '0.75rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                  🗑️ Hapus Pendaftaran Ini
                                </button>
                              </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* TAB 6: ACCOUNTS & DATA OPERATIONS */}
              {activeTab === "accounts" && (
                <motion.div
                  key="accounts"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                  {/* Glassmorphic Sub-Navbar pop up / tab menu */}
                  <div className="accounts-sub-navbar" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(0, 33, 71, 0.03)',
                    padding: '6px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(0, 33, 71, 0.05)',
                    marginBottom: '1.75rem',
                    width: 'fit-content',
                    boxShadow: '0 4px 15px rgba(0, 33, 71, 0.02)'
                  }}>
                    <button
                      onClick={() => setAccountsSubTab("kelola_akun")}
                      className={`sub-nav-btn ${accountsSubTab === "kelola_akun" ? "active" : ""}`}
                      style={{
                        padding: '8px 18px',
                        border: 'none',
                        background: accountsSubTab === "kelola_akun" ? 'var(--primary)' : 'transparent',
                        color: accountsSubTab === "kelola_akun" ? '#fff' : 'var(--primary)',
                        fontWeight: 800,
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      Kelola Akun
                    </button>

                    <button
                      onClick={() => setAccountsSubTab("permintaan_login")}
                      className={`sub-nav-btn ${accountsSubTab === "permintaan_login" ? "active" : ""}`}
                      style={{
                        padding: '8px 18px',
                        border: 'none',
                        background: accountsSubTab === "permintaan_login" ? 'transparent' : 'transparent',
                        backgroundColor: accountsSubTab === "permintaan_login" ? 'var(--primary)' : 'transparent',
                        color: accountsSubTab === "permintaan_login" ? '#fff' : 'var(--primary)',
                        fontWeight: 800,
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Permintaan Login</span>
                      {loginRequests.filter(r => r.status === "Pending").length > 0 && (
                        <span style={{
                          background: '#ef4444',
                          color: '#fff',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: '10px',
                          lineHeight: 1
                        }}>
                          {loginRequests.filter(r => r.status === "Pending").length}
                        </span>
                      )}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {accountsSubTab === "kelola_akun" && (
                      <motion.div
                        key="kelola_akun"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Stats Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="data-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ background: 'rgba(0, 33, 71, 0.05)', padding: '0.8rem', borderRadius: '12px', minWidth: '60px', textAlign: 'center' }}>
                              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', display: 'block', lineHeight: 1 }}>
                                {userAccounts.filter(acc => acc.role === "Admin").length}
                              </span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800, display: 'block' }}>Total Admin</span>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Akses Penuh</span>
                            </div>
                          </div>
                          <div className="data-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ background: 'rgba(255, 140, 0, 0.05)', padding: '0.8rem', borderRadius: '12px', minWidth: '60px', textAlign: 'center' }}>
                              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ff8c00', display: 'block', lineHeight: 1 }}>
                                {userAccounts.filter(acc => acc.role === "Wali").length}
                              </span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800, display: 'block' }}>Total Wali Santri</span>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Akses Terbatas</span>
                            </div>
                          </div>
                        </div>

                        <div className="accounts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'start' }}>
                          
                          {/* Daftar Akun */}
                          <div className="data-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.75rem', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#002147', margin: 0 }}>Daftar Akun Pengguna</h3>
                              <button 
                                onClick={() => {
                                  setSelectedAccountForEdit(null);
                                  setShowAddAccountModal(true);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: 'var(--primary)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                + Tambah Akun
                              </button>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                              <input 
                                type="text" 
                                placeholder="Cari nama atau email..." 
                                value={accountSearchQuery}
                                onChange={(e) => setAccountSearchQuery(e.target.value)}
                                style={{
                                  flex: 1,
                                  minWidth: '200px',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  fontSize: '0.8rem',
                                  outline: 'none'
                                }}
                              />
                              <select
                                value={accountRoleFilter}
                                onChange={(e) => setAccountRoleFilter(e.target.value)}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  fontSize: '0.8rem',
                                  outline: 'none',
                                  background: 'white'
                                }}
                              >
                                <option value="Semua">Semua Peran</option>
                                <option value="Admin">Admin</option>
                                <option value="Wali">Wali Santri</option>
                                <option value="Super Admin">Super Admin</option>
                              </select>
                            </div>

                            <div className="table-responsive">
                              <table className="main-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '0.8rem' }}>Nama Akun</th>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '0.8rem' }}>Tipe Akses</th>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '0.8rem' }}>Status</th>
                                    <th style={{ textAlign: 'center', padding: '10px 8px', fontSize: '0.8rem' }}>Aksi</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userAccounts
                                    .filter(acc => (accountRoleFilter === "Semua" || acc.role === accountRoleFilter))
                                    .filter(acc => acc.name.toLowerCase().includes(accountSearchQuery.toLowerCase()) || acc.email.toLowerCase().includes(accountSearchQuery.toLowerCase()))
                                    .map((acc) => (
                                    <tr key={acc.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                      <td style={{ padding: '12px 8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>{acc.name}</span>
                                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{acc.email}</span>
                                        </div>
                                      </td>
                                      <td style={{ padding: '12px 8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem' }}>
                                          <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            background: acc.role === "Admin" ? 'rgba(0, 33, 71, 0.08)' : 'rgba(255, 140, 0, 0.08)',
                                            color: acc.role === "Admin" ? '#002147' : '#ff8c00'
                                          }}>
                                            {acc.role}
                                          </span>
                                          {acc.role === "Admin" && acc.kepengurusan && (
                                            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                                              {acc.kepengurusan}
                                            </span>
                                          )}
                                          {acc.role === "Wali" && acc.nama_santri && (
                                            <span style={{ fontSize: '0.65rem', color: '#64748b', lineHeight: 1.3 }}>
                                              Santri: <strong>{acc.nama_santri}</strong><br/>
                                              {acc.jenjang_pendidikan} - {acc.pilihan_kelas}<br/>
                                              ({acc.program_pendidikan})
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                      <td style={{ padding: '12px 8px' }}>
                                        <span style={{
                                          fontSize: '0.7rem',
                                          fontWeight: 800,
                                          padding: '2px 8px',
                                          borderRadius: '6px',
                                          background: acc.status === "Aktif" ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                          color: acc.status === "Aktif" ? '#10b981' : '#ef4444'
                                        }}>
                                          {acc.status}
                                        </span>
                                      </td>
                                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                          <button
                                            onClick={() => {
                                              setSelectedAccountForEdit({ ...acc });
                                              setShowAddAccountModal(false);
                                            }}
                                            style={{
                                              padding: '4px 8px',
                                              background: '#f1f5f9',
                                              border: '1px solid #cbd5e1',
                                              borderRadius: '4px',
                                              fontSize: '0.7rem',
                                              fontWeight: 700,
                                              cursor: 'pointer',
                                              color: '#334155'
                                            }}
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => handleDeleteAccount(acc.id)}
                                            style={{
                                              padding: '4px 8px',
                                              background: 'rgba(239, 68, 68, 0.05)',
                                              border: '1px solid rgba(239, 68, 68, 0.2)',
                                              borderRadius: '4px',
                                              fontSize: '0.7rem',
                                              fontWeight: 700,
                                              cursor: 'pointer',
                                              color: '#ef4444'
                                            }}
                                          >
                                            Hapus
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <AnimatePresence>
                            {(showAddAccountModal || selectedAccountForEdit) && (
                              <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                style={{
                                  position: 'fixed',
                                  top: 0, left: 0, right: 0, bottom: 0,
                                  background: 'rgba(15, 23, 42, 0.6)',
                                  backdropFilter: 'blur(8px)',
                                  zIndex: 99999,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: '1rem'
                                }}
                                onClick={() => {
                                  setShowAddAccountModal(false);
                                  setSelectedAccountForEdit(null);
                                }}
                              >
                                <motion.div 
                                  initial={{ scale: 0.95, y: 20 }}
                                  animate={{ scale: 1, y: 0 }}
                                  exit={{ scale: 0.95, y: 20 }}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    background: '#ffffff',
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    width: '100%',
                                    maxWidth: '480px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                                    maxHeight: '90vh',
                                    overflowY: 'auto'
                                  }}
                                >
                                  {selectedAccountForEdit ? (
                                    <>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#002147', margin: 0 }}>Edit Akun</h3>
                                        <button 
                                          onClick={() => setSelectedAccountForEdit(null)}
                                          style={{ background: 'rgba(241, 245, 249, 1)', border: 'none', color: '#64748b', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                      <form className="config-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={handleUpdateAccount}>
                                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Nama Lengkap</label>
                                          <input 
                                            type="text" 
                                            value={selectedAccountForEdit.name} 
                                            onChange={(e) => setSelectedAccountForEdit({ ...selectedAccountForEdit, name: e.target.value })}
                                            style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', transition: 'border-color 0.2s' }} 
                                            required
                                          />
                                        </div>
                                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>E-Mail</label>
                                          <input 
                                            type="email" 
                                            value={selectedAccountForEdit.email} 
                                            onChange={(e) => setSelectedAccountForEdit({ ...selectedAccountForEdit, email: e.target.value })}
                                            style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', color: '#334155' }} 
                                            required
                                          />
                                        </div>
                                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Tipe Akses (Role)</label>
                                          <select 
                                            value={selectedAccountForEdit.role} 
                                            onChange={(e) => setSelectedAccountForEdit({ ...selectedAccountForEdit, role: e.target.value as "Admin" | "Wali" })}
                                            style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}
                                          >
                                            <option value="Admin">Admin</option>
                                            <option value="Wali">Wali Santri</option>
                                            <option value="Super Admin">Super Admin</option>
                                          </select>
                                        </div>
                                        {selectedAccountForEdit.role === "Admin" && (
                                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <div className="input-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Lembaga</label>
                                              <select 
                                                value={selectedAccountForEdit.lembaga || 'Pondok Pesantren'} 
                                                onChange={(e) => setSelectedAccountForEdit({ ...selectedAccountForEdit, lembaga: e.target.value })}
                                                style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', color: '#334155' }}
                                              >
                                                <option value="Pondok Pesantren">Pondok Pesantren</option>
                                                <option value="MA Unggulan Al-Azhar">MA Unggulan Al-Azhar</option>
                                                <option value="SDIT Al-Azhar">SDIT Al-Azhar</option>
                                                <option value="TKIT Al-Azhar">TKIT Al-Azhar</option>
                                              </select>
                                            </div>
                                            <div className="input-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Kampus</label>
                                              <select 
                                                value={selectedAccountForEdit.kampus || 'Azhar 1'} 
                                                onChange={(e) => setSelectedAccountForEdit({ ...selectedAccountForEdit, kampus: e.target.value })}
                                                style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', color: '#334155' }}
                                              >
                                                <option value="Azhar 1">Azhar 1</option>
                                                <option value="Azhar 2">Azhar 2</option>
                                                <option value="Azhar 3">Azhar 3</option>
                                                <option value="Azhar 4">Azhar 4</option>
                                              </select>
                                            </div>
                                          </div>
                                        )}
                                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Status Akun</label>
                                          <select 
                                            value={selectedAccountForEdit.status} 
                                            onChange={(e) => setSelectedAccountForEdit({ ...selectedAccountForEdit, status: e.target.value as "Aktif" | "Nonaktif" })}
                                            style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}
                                          >
                                            <option value="Aktif">Aktif</option>
                                            <option value="Nonaktif">Nonaktif</option>
                                          </select>
                                        </div>
                                        <button type="submit" className="btn-submit-config" style={{ padding: '0.8rem', background: '#002147', color: 'white', fontWeight: 800, border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem' }}>Simpan Perubahan</button>
                                      </form>
                                    </>
                                  ) : (
                                    <>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#002147', margin: 0 }}>Tambah Akun Baru</h3>
                                        <button 
                                          onClick={() => setShowAddAccountModal(false)}
                                          style={{ background: 'rgba(241, 245, 249, 1)', border: 'none', color: '#64748b', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                      <form className="config-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={handleAddAccount}>
                                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Nama Lengkap</label>
                                          <input 
                                            type="text" 
                                            placeholder="Contoh: Budi Santoso"
                                            value={newAccName} 
                                            onChange={(e) => setNewAccName(e.target.value)}
                                            style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', color: '#334155' }} 
                                            required
                                          />
                                        </div>
                                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>E-Mail</label>
                                          <input 
                                            type="email" 
                                            placeholder="Contoh: budi@gmail.com"
                                            value={newAccEmail} 
                                            onChange={(e) => setNewAccEmail(e.target.value)}
                                            style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', color: '#334155' }} 
                                            required
                                          />
                                        </div>
                                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Password Login</label>
                                          <div style={{ position: 'relative', width: '100%' }}>
                                            <input 
                                              type={showNewAccPassword ? "text" : "password"}
                                              placeholder="Minimal 6 karakter"
                                              value={newAccPassword} 
                                              onChange={(e) => setNewAccPassword(e.target.value)}
                                              style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', paddingRight: '40px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', boxSizing: 'border-box' }} 
                                              required
                                            />
                                            <button 
                                              type="button" 
                                              onClick={() => setShowNewAccPassword(!showNewAccPassword)}
                                              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                              {showNewAccPassword ? '👁️‍🗨️' : '👁️'}
                                            </button>
                                          </div>
                                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                                            *Saran: Gunakan kombinasi huruf kapital, angka, dan simbol untuk keamanan maksimal.
                                          </span>
                                        </div>
                                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Konfirmasi Password Login</label>
                                          <div style={{ position: 'relative', width: '100%' }}>
                                            <input 
                                              type={showNewAccPassword ? "text" : "password"}
                                              placeholder="Masukkan ulang password"
                                              value={newAccConfirmPassword} 
                                              onChange={(e) => setNewAccConfirmPassword(e.target.value)}
                                              style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', paddingRight: '40px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', boxSizing: 'border-box' }} 
                                              required
                                            />
                                          </div>
                                          {newAccConfirmPassword && newAccPassword !== newAccConfirmPassword && (
                                            <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.2rem', fontWeight: 600 }}>
                                              Konfirmasi password tidak cocok dengan password di atas!
                                            </span>
                                          )}
                                        </div>
                                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Tipe Akses (Role)</label>
                                          <select 
                                            value={newAccRole} 
                                            onChange={(e) => setNewAccRole(e.target.value as "Admin" | "Wali")}
                                            style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}
                                          >
                                            <option value="Admin">Admin</option>
                                            <option value="Wali">Wali Santri</option>
                                            <option value="Super Admin">Super Admin</option>
                                          </select>
                                        </div>
                                        {newAccRole === "Admin" && (
                                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <div className="input-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Lembaga</label>
                                              <select 
                                                value={newAccLembaga} 
                                                onChange={(e) => setNewAccLembaga(e.target.value)}
                                                style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', color: '#334155' }}
                                              >
                                                <option value="Pondok Pesantren">Pondok Pesantren</option>
                                                <option value="MA Unggulan Al-Azhar">MA Unggulan Al-Azhar</option>
                                                <option value="SDIT Al-Azhar">SDIT Al-Azhar</option>
                                                <option value="TKIT Al-Azhar">TKIT Al-Azhar</option>
                                              </select>
                                            </div>
                                            <div className="input-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                                              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Kampus</label>
                                              <select 
                                                value={newAccKampus} 
                                                onChange={(e) => setNewAccKampus(e.target.value)}
                                                style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', color: '#334155' }}
                                              >
                                                <option value="Azhar 1">Azhar 1</option>
                                                <option value="Azhar 2">Azhar 2</option>
                                                <option value="Azhar 3">Azhar 3</option>
                                                <option value="Azhar 4">Azhar 4</option>
                                              </select>
                                            </div>
                                          </div>
                                        )}
                                        <button type="submit" className="btn-submit-config" style={{ padding: '0.8rem', background: '#002147', color: 'white', fontWeight: 800, border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem' }}>Tambah Akun</button>
                                      </form>
                                    </>
                                  )}
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      </motion.div>
                    )}



                    {accountsSubTab === "permintaan_login" && (
                      <motion.div
                        key="permintaan_login"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Permintaan Login Section */}
                        <div className="data-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.75rem', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#002147', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>Permintaan Log Masuk Pengurus</h3>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5, maxWidth: '500px' }}>
                              Otorisasi dan tinjau berkas permintaan akses log masuk ke panel administrator dari peranti pengurus lainnya.
                            </p>
                            
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <select 
                                value={loginRequestFilterDate} 
                                onChange={(e) => setLoginRequestFilterDate(e.target.value)}
                                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}
                              >
                                <option value="Semua">Semua Tanggal</option>
                                <option value="Hari Ini">Hari Ini</option>
                                <option value="Minggu Ini">7 Hari Terakhir</option>
                                <option value="Bulan Ini">Bulan Ini</option>
                              </select>

                              <select 
                                value={loginRequestFilterStatus} 
                                onChange={(e) => setLoginRequestFilterStatus(e.target.value)}
                                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc' }}
                              >
                                <option value="Semua">Semua Status</option>
                                <option value="Pending">Menunggu (Pending)</option>
                                <option value="Approved">Disetujui (Approved)</option>
                                <option value="Rejected">Ditolak (Rejected)</option>
                              </select>

                              {selectedLoginRequestIds.length > 0 && (
                                <button 
                                  onClick={handleBulkDeleteLoginRequests}
                                  style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                  Hapus {selectedLoginRequestIds.length} Terpilih
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="table-responsive">
                            <table className="main-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: '40px', padding: '12px', textAlign: 'center' }}>
                                    <input 
                                      type="checkbox" 
                                      onChange={(e) => {
                                        const filtered = loginRequests.filter(req => {
                                          if (loginRequestFilterStatus !== "Semua" && req.status !== loginRequestFilterStatus) return false;
                                          if (loginRequestFilterDate !== "Semua") {
                                            const today = new Date();
                                            if (loginRequestFilterDate === "Hari Ini" && req.rawDate.toDateString() !== today.toDateString()) return false;
                                            if (loginRequestFilterDate === "Minggu Ini" && (today.getTime() - req.rawDate.getTime()) > 7*24*60*60*1000) return false;
                                            if (loginRequestFilterDate === "Bulan Ini" && (req.rawDate.getMonth() !== today.getMonth() || req.rawDate.getFullYear() !== today.getFullYear())) return false;
                                          }
                                          return true;
                                        });
                                        if (e.target.checked) {
                                          setSelectedLoginRequestIds(filtered.map(r => r.id));
                                        } else {
                                          setSelectedLoginRequestIds([]);
                                        }
                                      }}
                                      checked={
                                        selectedLoginRequestIds.length > 0 && 
                                        selectedLoginRequestIds.length === loginRequests.filter(req => {
                                          if (loginRequestFilterStatus !== "Semua" && req.status !== loginRequestFilterStatus) return false;
                                          if (loginRequestFilterDate !== "Semua") {
                                            const today = new Date();
                                            if (loginRequestFilterDate === "Hari Ini" && req.rawDate.toDateString() !== today.toDateString()) return false;
                                            if (loginRequestFilterDate === "Minggu Ini" && (today.getTime() - req.rawDate.getTime()) > 7*24*60*60*1000) return false;
                                            if (loginRequestFilterDate === "Bulan Ini" && (req.rawDate.getMonth() !== today.getMonth() || req.rawDate.getFullYear() !== today.getFullYear())) return false;
                                          }
                                          return true;
                                        }).length
                                      }
                                    />
                                  </th>
                                  <th style={{ textAlign: 'left', padding: '12px' }}>Pemohon</th>
                                  <th style={{ textAlign: 'left', padding: '12px' }}>Detail Akses</th>
                                  <th style={{ textAlign: 'left', padding: '12px' }}>Waktu Pengajuan</th>
                                  <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                                  <th style={{ textAlign: 'left', padding: '12px' }}>Tindakan Otorisasi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {loginRequests.filter(req => {
                                  if (loginRequestFilterStatus !== "Semua" && req.status !== loginRequestFilterStatus) return false;
                                  if (loginRequestFilterDate !== "Semua") {
                                    const today = new Date();
                                    if (loginRequestFilterDate === "Hari Ini" && req.rawDate.toDateString() !== today.toDateString()) return false;
                                    if (loginRequestFilterDate === "Minggu Ini" && (today.getTime() - req.rawDate.getTime()) > 7*24*60*60*1000) return false;
                                    if (loginRequestFilterDate === "Bulan Ini" && (req.rawDate.getMonth() !== today.getMonth() || req.rawDate.getFullYear() !== today.getFullYear())) return false;
                                  }
                                  return true;
                                }).map((req, idx) => (
                                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ textAlign: 'center', padding: '12px' }}>
                                      <input 
                                        type="checkbox" 
                                        checked={selectedLoginRequestIds.includes(req.id)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedLoginRequestIds([...selectedLoginRequestIds, req.id]);
                                          } else {
                                            setSelectedLoginRequestIds(selectedLoginRequestIds.filter(id => id !== req.id));
                                          }
                                        }}
                                      />
                                    </td>
                                    <td style={{ fontWeight: 800, color: 'var(--primary)', padding: '12px' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{req.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{req.email}</span>
                                      </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', background: req.role === 'Admin' ? 'rgba(0,33,71,0.08)' : 'rgba(255,140,0,0.08)', color: req.role === 'Admin' ? '#002147' : '#ff8c00', borderRadius: '6px', width: 'fit-content' }}>
                                          {req.role}
                                        </span>
                                        {req.role === 'Admin' && req.kepengurusan && (
                                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{req.kepengurusan}</span>
                                        )}
                                        {req.role === 'Wali' && req.nama_santri && (
                                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                            Santri: <strong>{req.nama_santri}</strong><br/>
                                            {req.jenjang_pendidikan} - {req.pilihan_kelas} ({req.program_pendidikan})
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>{req.requestedAt}</td>
                                    <td style={{ padding: '12px' }}>
                                      <span className={`status-pill ${req.status.toLowerCase()}`}>
                                        {req.status === 'Pending' ? 'Menunggu' : req.status === 'Approved' ? 'Disetujui' : 'Ditolak'}
                                      </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                          onClick={() => setSelectedLoginRequest(req)}
                                          style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: '#3b82f6',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            color: '#fff'
                                          }}
                                        >
                                          Preview
                                        </button>
                                        <button
                                          onClick={() => handleUpdateLoginRequestStatus(req.id, "Approved")}
                                          className="btn-approve"
                                          disabled={req.status !== "Pending"}
                                          style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: req.status === 'Pending' ? '#10b981' : '#e2e8f0',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            cursor: req.status === 'Pending' ? 'pointer' : 'default',
                                            color: '#fff'
                                          }}
                                        >
                                          Setujui
                                        </button>
                                        <button
                                          onClick={() => handleUpdateLoginRequestStatus(req.id, "Rejected")}
                                          className="btn-reject"
                                          disabled={req.status !== "Pending"}
                                          style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: req.status === 'Pending' ? '#ef4444' : '#e2e8f0',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            cursor: req.status === 'Pending' ? 'pointer' : 'default',
                                            color: '#fff'
                                          }}
                                        >
                                          Tolak
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* MODAL: PREVIEW PUSAT DATA SISWA */}
      {selectedPusatData && (
        <div className="modal-overlay" onClick={() => { setSelectedPusatData(null); window.history.pushState(null, "", window.location.href); }}>
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedPusatData(null); window.history.pushState(null, "", window.location.href); }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              zIndex: 10002,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ? Tutup
          </button>
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Detail Identitas Santri</h3>
              <button onClick={() => setSelectedPusatData(null)} style={{ background: '#fee2e2', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', color: '#991b1b', padding: '0.4rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>✕ Tutup</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img src={selectedPusatData.pas_foto} alt="Pas Foto" style={{ width: '150px', height: '150px', borderRadius: '16px', objectFit: 'cover', border: '3px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>Kelas {selectedPusatData.kelas.match(/\d+/) ? selectedPusatData.kelas.match(/\d+/)[0] : selectedPusatData.kelas}</span>
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
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Nama Lengkap</span>
                  <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>{selectedPusatData.nama_lengkap}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Gender</span>
                  <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>{selectedPusatData.gender}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Tanggal Daftar</span>
                  <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>
                    {selectedPusatData.created_at ? new Date(selectedPusatData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Tanggal Disetujui</span>
                  <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                    {(selectedPusatData.status === 'Terima' || selectedPusatData.status === 'Approved' || selectedPusatData.status === 'Aktif') ? ((selectedPusatData as any).accepted_at ? new Date((selectedPusatData as any).accepted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : (selectedPusatData.created_at ? new Date(selectedPusatData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-')) : 'Belum Disetujui'}
                    {(selectedPusatData.alamat && (typeof selectedPusatData.alamat === 'string' ? JSON.parse(selectedPusatData.alamat) : selectedPusatData.alamat).is_revised) && (
                      <span style={{ fontSize: '0.65rem', color: '#ef4444', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>(Ada Revisi)</span>
                    )}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Tempat, Tanggal Lahir</span>
                  <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>{selectedPusatData.tempat_tanggal_lahir}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NIK / NISN</span>
                  <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>{selectedPusatData.nik} / {selectedPusatData.nisn}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#002147', marginBottom: '1rem' }}>Data Orang Tua & Wali</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div><span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Nama Ayah</span><span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedPusatData.nama_ayah} ({selectedPusatData.pekerjaan_ayah})</span></div>
                  <div><span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Nama Ibu</span><span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedPusatData.nama_ibu} ({selectedPusatData.pekerjaan_ibu})</span></div>
                  <div><span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>No HP Wali</span><span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedPusatData.no_hp_wali}</span></div>
                  <div><span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Alamat Lengkap</span><span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {(() => {
                      try {
                        const parsed = JSON.parse(selectedPusatData.alamat);
                        return parsed.full_text || selectedPusatData.alamat;
                      } catch(e) {
                        return selectedPusatData.alamat;
                      }
                    })()}
                  </span></div>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#002147', marginBottom: '1rem' }}>Dokumen Pendukung</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[{name: 'Kartu Keluarga', url: selectedPusatData.kk_url}, {name: 'Akte Kelahiran', url: selectedPusatData.akte_url}, {name: 'Ijazah Terakhir', url: selectedPusatData.ijazah_url}, {name: 'SKTM (Jika Ada)', url: selectedPusatData.sktm_url}].map((doc, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{doc.name}</span>
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', background: '#002147', color: 'white', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none', fontWeight: 800 }}>Lihat</a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', background: '#fef2f2', color: '#ef4444', padding: '4px 10px', borderRadius: '6px', fontWeight: 800 }}>Kosong</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              {selectedPusatData.status === 'Pending' && (
                <>
                  <button onClick={() => { handleUpdatePusatDataStatus(selectedPusatData.id, 'Approved'); setSelectedPusatData(null); }} style={{ padding: '0.8rem 1.5rem', background: '#dcfce7', color: '#166534', fontWeight: 800, border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                    Terima Data
                  </button>
                  <button onClick={() => { handleUpdatePusatDataStatus(selectedPusatData.id, 'Rejected'); setSelectedPusatData(null); }} style={{ padding: '0.8rem 1.5rem', background: '#fef3c7', color: '#92400e', fontWeight: 800, border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                    Tolak Data
                  </button>
                </>
              )}
              <button onClick={() => { handleDeletePusatData(selectedPusatData.id); setSelectedPusatData(null); }} style={{ padding: '0.8rem 1.5rem', background: '#fee2e2', color: '#991b1b', fontWeight: 800, border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                Hapus Data
              </button>
              <button onClick={() => setSelectedPusatData(null)} style={{ padding: '0.8rem 2rem', background: '#f1f5f9', color: '#334155', fontWeight: 800, border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                Tutup Preview
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 1: ADD NEWS */}
      {showAddNewsModal && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: '#002147'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', color: '#002147' }}>
              {editingNewsId ? 'Edit Artikel Berita' : 'Tulis Artikel Berita Baru'}
            </h3>
            <form onSubmit={handleSubmitNews} className="modal-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', padding: '0 10px' }}>
              <div className="input-group">
                <label>Kategori Berita</label>
                <select value={newNewsCategory} onChange={(e) => setNewNewsCategory(e.target.value)} required>
                  <option value="Papan Pengumuman">Papan Pengumuman</option>
                  <option value="Artikel Berita">Artikel Berita</option>
                </select>
              </div>

              <div className="input-group">
                <label>Judul Utama</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Pendaftaran Santri Baru Dibuka"
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                />
              </div>


                  <div className="input-group">
                    <label>Sumber Gambar (Cover)</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', color: '#334155' }}>
                        <input type="radio" name="imageSource" value="Internal" checked={newNewsImageSource === "Internal"} onChange={(e) => setNewNewsImageSource(e.target.value as "Internal")} />
                        Internal (Otomatis: Tim Media Azhar TV)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', color: '#334155' }}>
                        <input type="radio" name="imageSource" value="Manual" checked={newNewsImageSource === "Manual"} onChange={(e) => setNewNewsImageSource(e.target.value as "Manual")} />
                        Manual
                      </label>
                    </div>
                  </div>

                  {newNewsImageSource === "Manual" && (
                    <div className="input-group">
                      <label>Keterangan Sumber Manual</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Dokumen Pribadi Ust. Ahmad"
                        value={newNewsImageManualSource}
                        onChange={(e) => setNewNewsImageManualSource(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="input-group">
                    <label>Upload Gambar Judul (Cover) <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>(Gunakan gambar berukuran persis atau rasio 392x221 px)</span></label>
                    <input 
                      type="file" 
                      accept="image/*"
                      disabled={isCompressing}
                      onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          setIsCompressing(true);
                          setCompressProgress(0);
                          try {
                            const compressedFile = await imageCompression(file, {
                              maxSizeMB: 0.5,
                              maxWidthOrHeight: 800,
                              useWebWorker: true,
                              onProgress: (progress) => setCompressProgress(progress)
                            });
                            const finalFile = new File([compressedFile], `cover-${Date.now()}.jpg`, { type: 'image/jpeg' });
                            setNewNewsImageFile(finalFile);
                          } catch (err) {
                            console.error("Compression error:", err);
                            openAlert("Gagal mengkompres gambar.");
                          } finally {
                            setIsCompressing(false);
                            e.target.value = ''; // reset input
                          }
                        }
                      }}
                    />
                    {isCompressing && (
                      <span style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'block', marginTop: '0.5rem' }}>
                        Memproses kompresi otomatis... {compressProgress}%
                      </span>
                    )}
                    {newNewsImageFile && !isCompressing && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#16a34a', display: 'block', marginBottom: '0.5rem' }}>File siap diupload: {newNewsImageFile.name}</span>
                        <img src={URL.createObjectURL(newNewsImageFile)} alt="Preview Cover" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label>Isi / Topik Berita</label>
                    <textarea 
                      required 
                      rows={5}
                      placeholder="Tulis isi berita di sini..."
                      value={newNewsContent}
                      onChange={(e) => setNewNewsContent(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="input-group">
                    <label>Lampiran Ke-2 (Opsional)</label>
                    <select value={newNewsAttachmentType} onChange={(e) => setNewNewsAttachmentType(e.target.value as any)}>
                      <option value="">-- Tidak Ada --</option>
                      <option value="PDF">Opsi PDF</option>
                      <option value="Gambar">Opsi Gambar</option>
                      <option value="Video Youtube">Opsi Video Youtube</option>
                      <option value="Link Lainnya">Link Lainnya</option>
                    </select>
                  </div>

                  {newNewsAttachmentType && (
                    <div className="input-group">
                      <label>
                        {newNewsAttachmentType === 'Gambar' ? 'Upload Gambar Lampiran' : 'URL Lampiran'}
                        {newNewsAttachmentType === 'Gambar' && <span style={{ color: '#ef4444', marginLeft: '5px', fontSize: '0.8rem' }}>(Pilih gambar)</span>}
                      </label>
                      {newNewsAttachmentType === 'Gambar' ? (
                        <>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setNewNewsAttachmentFile(e.target.files[0]);
                              }
                            }}
                            required
                          />
                          {newNewsAttachmentFile && <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>File dipilih: {newNewsAttachmentFile.name}</span>}
                        </>
                      ) : (
                        <input 
                          type="url" 
                          required 
                          placeholder={newNewsAttachmentType === 'Video Youtube' ? 'https://youtube.com/watch?...' : 'https://...'}
                          value={newNewsAttachmentUrl}
                          onChange={(e) => setNewNewsAttachmentUrl(e.target.value)}
                        />
                      )}
                    </div>
                  )}
                  {['Video Youtube', 'PDF', 'Gambar'].includes(newNewsAttachmentType) && (
                    <div className="input-group">
                      <label>Judul {newNewsAttachmentType} (Opsional)</label>
                      <input 
                        type="text" 
                        placeholder={`Masukkan judul ${newNewsAttachmentType} untuk ditampilkan`}
                        value={newNewsAttachmentTitle}
                        onChange={(e) => setNewNewsAttachmentTitle(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="input-group" style={{ marginTop: '1rem' }}>
                    <label>Paragraf Penutup (Opsional)</label>
                    <textarea 
                      rows={3}
                      placeholder="Tulis paragraf penutup di sini (opsional)..."
                      value={newNewsClosingParagraph}
                      onChange={(e) => setNewNewsClosingParagraph(e.target.value)}
                    ></textarea>
                  </div>


              <div className="input-group">
                <label>Penulis</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Nama Penulis"
                  value={newNewsAuthor}
                  onChange={(e) => setNewNewsAuthor(e.target.value)}
                />
              </div>

              {newNewsCategory === "Artikel Berita" && (
                <div className="input-group">
                  <label>Sumber (Opsional)</label>
                  <input 
                    type="text" 
                    placeholder="Sumber tambahan jika ada"
                    value={newNewsOptionalSources}
                    onChange={(e) => setNewNewsOptionalSources(e.target.value)}
                  />
                </div>
              )}

              <div className="input-group">
                <label>Status Publikasi</label>
                <select value={newNewsStatus} onChange={(e) => setNewNewsStatus(e.target.value as any)}>
                  <option value="Published">Published (Langsung Terbit)</option>
                  <option value="Draft">Draft (Simpan Draf)</option>
                </select>
              </div>

              {/* Upload Progress Animation */}
              {isUploadingNews && (
                <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: uploadSuccess ? '#16a34a' : '#002147' }}>
                    <span>{uploadSuccess ? 'Berhasil Diunggah!' : 'Sedang Mengunggah...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${uploadProgress}%` }} 
                      transition={{ duration: 0.2 }}
                      style={{ height: '100%', background: uploadSuccess ? '#16a34a' : '#ff8c00' }}
                    />
                  </div>
                  {uploadSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ textAlign: 'center', color: '#16a34a', marginTop: '0.8rem', fontWeight: 'bold' }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '5px' }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Tersimpan ke Database!
                    </motion.div>
                  )}
                </div>
              )}

              {!isUploadingNews && (
                <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-modal-save">Simpan Artikel</button>
                  <button type="button" onClick={() => setShowAddNewsModal(false)} className="btn-modal-cancel">Batal</button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}


      {/* MODAL 2: ADD PHOTO */}
      {showAddPhotoModal && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: '#002147'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', color: '#002147' }}>Upload / Hubungkan Foto Baru</h3>
            <form onSubmit={handleAddPhoto} className="modal-form">
              <div className="input-group">
                <label>Tautan URL Gambar (Cloudinary CDN URL)</label>
                <input 
                  type="url" 
                  required 
                  placeholder="https://res.cloudinary.com/.../gambar.png"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                />
                <span className="helper-text">Masukkan URL dari berkas gambar yang telah diupload di Cloudinary.</span>
              </div>

              <div className="input-group">
                <label>Deskripsi Foto (Keterangan)</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Latihan Gabungan Pramuka Santri"
                  value={newPhotoDesc}
                  onChange={(e) => setNewPhotoDesc(e.target.value)}
                />
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* POPUP 1: PORTAL LAYANAN SANTRI */}
      <AnimatePresence>
        {activePriorityModal === "santri" && (
          <div className="modal-backdrop-priority" onClick={() => setActivePriorityModal(null)}>
            <motion.div 
              className="modal-content-priority"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-priority">
                <h3>🎓 Detail Portal Layanan Santri (Santri Page)</h3>
                <button className="btn-close-modal-priority" onClick={() => setActivePriorityModal(null)}>&times;</button>
              </div>
              <div className="modal-body-priority">
                <div className="priority-stats-grid">
                  <div className="priority-stat-card">
                    <span className="p-label">STATUS PORTAL</span>
                    <span className="p-value green">🟢 ONLINE</span>
                  </div>
                  <div className="priority-stat-card">
                    <span className="p-label">TOTAL SANTRI AKTIF</span>
                    <span className="p-value">420 Santri</span>
                  </div>
                  <div className="priority-stat-card">
                    <span className="p-label">KEHADIRAN HARI INI</span>
                    <span className="p-value">98.4%</span>
                  </div>
                </div>
                <div className="priority-details-section">
                  <h4>📊 Laporan Lalu Lintas & Aktivitas (Santri Portal)</h4>
                  <p>Halaman ini digunakan oleh santri aktif Pondok Pesantren Al-Azhar Purwakarta untuk mengunduh raport, mengecek jadwal pelajaran, serta memantau status hafalan Qur'an secara real-time.</p>
                  <div className="data-table-mini">
                    <div className="mini-row"><strong>Rata-rata Waktu Sesi:</strong> <span>12 menit 45 detik</span></div>
                    <div className="mini-row"><strong>Rasio Pentalan (Bounce Rate):</strong> <span>14.2% (Sangat Sehat)</span></div>
                    <div className="mini-row"><strong>Browser Terbanyak:</strong> <span>Chrome Mobile (68%)</span></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer-priority">
                <button className="btn-modal-action-priority secondary" onClick={() => setActivePriorityModal(null)}>Tutup Halaman</button>
                <Link href="/login" className="btn-modal-action-priority primary" onClick={() => setActivePriorityModal(null)}>Buka Portal Santri →</Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP 2: FORMULIR PENDAFTARAN PPDB */}
      <AnimatePresence>
        {activePriorityModal === "pendaftaran" && (
          <div className="modal-backdrop-priority" onClick={() => setActivePriorityModal(null)}>
            <motion.div 
              className="modal-content-priority"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-priority">
                <h3>📝 Detail Formulir Pendaftaran PPDB (Pendaftaran)</h3>
                <button className="btn-close-modal-priority" onClick={() => setActivePriorityModal(null)}>&times;</button>
              </div>
              <div className="modal-body-priority">
                <div className="priority-stats-grid">
                  <div className="priority-stat-card">
                    <span className="p-label">STATUS GELOMBANG</span>
                    <span className="p-value orange">🟠 GELOMBANG 1</span>
                  </div>
                  <div className="priority-stat-card">
                    <span className="p-label">TOTAL PENDAFTAR</span>
                    <span className="p-value">{totalPendaftar} Calon Santri</span>
                  </div>
                  <div className="priority-stat-card">
                    <span className="p-label">DIVERIFIKASI</span>
                    <span className="p-value">{pendaftaran.filter(p => p.status === "Approved").length || 8} Santri</span>
                  </div>
                </div>
                <div className="priority-details-section">
                  <h4>📊 Statistik PPDB Online Terintegrasi Supabase</h4>
                  <p>Halaman pendaftaran adalah gerbang utama bagi calon wali santri untuk mendaftarkan putra-putri mereka ke jenjang SMP, MA, maupun Takhossus Tahfidz Al-Qur'an secara digital.</p>
                  <div className="data-table-mini">
                    <div className="mini-row"><strong>Pendaftaran Terbanyak:</strong> <span>Jenjang Takhossus (48%)</span></div>
                    <div className="mini-row"><strong>Pendaftar Hari Ini:</strong> <span>{pendaftaran.filter(p => p.created_at?.startsWith(new Date().toISOString().split('T')[0])).length || 2} Calon Baru</span></div>
                    <div className="mini-row"><strong>Rasio Konversi Form:</strong> <span>85.4% (Tinggi)</span></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer-priority">
                <button className="btn-modal-action-priority secondary" onClick={() => setActivePriorityModal(null)}>Tutup Halaman</button>
                <button className="btn-modal-action-priority primary" onClick={() => { setActivePriorityModal(null); setActiveTab("ppdb"); }}>Kelola PPDB Supabase →</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP 3: LMS AL-AZHAR ACADEMICS */}
      <AnimatePresence>
        {activePriorityModal === "azlearn" && (
          <div className="modal-backdrop-priority" onClick={() => setActivePriorityModal(null)}>
            <motion.div 
              className="modal-content-priority"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-priority">
                <h3>🌐 Detail LMS Al-Azhar Academics (Az-Learn)</h3>
                <button className="btn-close-modal-priority" onClick={() => setActivePriorityModal(null)}>&times;</button>
              </div>
              <div className="modal-body-priority">
                <div className="priority-stats-grid">
                  <div className="priority-stat-card">
                    <span className="p-label">STATUS ENGINE</span>
                    <span className="p-value green">🟢 AKTIF (V2.1)</span>
                  </div>
                  <div className="priority-stat-card">
                    <span className="p-label">KELAS BERJALAN</span>
                    <span className="p-value">28 Rombel</span>
                  </div>
                  <div className="priority-stat-card">
                    <span className="p-label">PENGGUNA AKTIF HARI INI</span>
                    <span className="p-value">186 Siswa & Guru</span>
                  </div>
                </div>
                <div className="priority-details-section">
                  <h4>📊 Analitik Layanan Pembelajaran Mandiri (Az-Learn)</h4>
                  <p>Az-Learn adalah portal Learning Management System (LMS) khusus santri untuk mengakses materi pelajaran, mengumpulkan tugas harian, serta melaksanakan ujian secara mandiri.</p>
                  <div className="data-table-mini">
                    <div className="mini-row"><strong>Storage Cloud Terpakai:</strong> <span>42.8 GB / 100 GB</span></div>
                    <div className="mini-row"><strong>Tugas Terkumpul Hari Ini:</strong> <span>85 File</span></div>
                    <div className="mini-row"><strong>Uptime Server:</strong> <span>99.98%</span></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer-priority">
                <button className="btn-modal-action-priority secondary" onClick={() => setActivePriorityModal(null)}>Tutup Halaman</button>
                <Link href="/azhar-learn" className="btn-modal-action-priority primary" onClick={() => setActivePriorityModal(null)}>Buka Platform Az-Learn →</Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .dashboard-layout {
          min-height: 100vh;
          background-color: #f1f5f9;
          color: #0f172a;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          padding-top: 110px; /* Default for mobile */
        }

        @media (min-width: 1024px) {
          .dashboard-layout {
            padding-top: 0 !important; /* Force overlap with fixed navbar to prevent gaps */
          }
        }

        .demo-banner {
          background: linear-gradient(135deg, #ff8c00, #d97706);
          color: white;
          padding: 0.8rem 1.5rem;
          font-size: 0.85rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 128px;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.15);
        }
        @media (min-width: 1024px) {
          .demo-banner {
            margin-top: 130px; /* Push below navbar since layout padding is 0 */
          }
        }

        .btn-close-demo {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.4);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }

        .btn-close-demo:hover {
          background: white;
          color: #ff8c00;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          align-items: start; /* This is essential for position: sticky to work in a grid */
        }

        /* Sidebar Styling - Deep Navy Dominant Color */
        .sidebar {
          background: linear-gradient(135deg, #002147 0%, #00122e 100%);
          border-right: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          padding: 160px 1.5rem 2rem 1.5rem;
          position: sticky;
          top: 0;
          height: 100vh;
          box-sizing: border-box;
          z-index: 99;
          box-shadow: 4px 0 20px rgba(0, 33, 71, 0.15);
        }

        @media (min-width: 1024px) {
          .sidebar {
            padding: 135px 1.5rem 2rem 1.5rem !important; /* Space for navbar inside sidebar */
            top: 0 !important; /* Stick to very top, navbar covers the top 130px */
            height: 100vh !important;
            overflow-y: hidden; /* Ensure the menu itself does not scroll */
          }
        }

        .sidebar-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .sidebar-logo {
          height: 55px;
          object-fit: contain;
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.1));
        }

        .sidebar-subtitle {
          font-size: 0.65rem;
          font-weight: 800;
          color: #ff8c00;
          letter-spacing: 2px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem 1.2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1.5px solid rgba(255, 140, 0, 0.6); /* More prominent orange frame */
          color: white;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          margin-bottom: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 140, 0, 0.9);
          color: white;
          transform: translateX(4px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }

        .nav-item.active {
          background: rgba(255, 140, 0, 0.2);
          border-color: #ff8c00; /* full orange border */
          color: white !important;
          box-shadow: 0 6px 15px rgba(255, 140, 0, 0.25);
        }

        .nav-item span {
          color: white !important;
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .nav-badge {
          position: absolute;
          right: 1.2rem;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 99px;
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1.5rem;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          text-align: left;
          min-width: 0;
        }

        .profile-name {
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
          max-width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-role {
          font-size: 0.58rem;
          color: #ff8c00;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .sidebar-logout-btn {
          margin-top: 0.5rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 0.45rem 1rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: fit-content;
          transition: all 0.2s ease;
        }

        .sidebar-logout-btn:hover {
          background: #ef4444 !important;
          color: white !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .btn-logout {
          display: block;
          padding: 0.7rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s;
        }

        .btn-logout:hover {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        }

        /* Main Content Styling - Light Grey Clean Background */
        .main-content {
          padding: 11.5rem 4rem 3rem 4rem;
          box-sizing: border-box;
          overflow-y: auto;
          height: 100vh;
        }
        
        @media (min-width: 1024px) {
          .main-content {
            padding-top: 175px !important; /* Provide ample breathing room for the title under the navbar */
          }
        }

        /* Control Panel CSS */
        .control-panel-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
          text-align: left;
        }

        .control-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .control-panel-header h3 {
          font-family: var(--font-custom), 'Inter', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #002147;
          margin: 0;
        }

        .account-badge {
          display: inline-block;
          background: rgba(0, 33, 71, 0.06);
          border: 1px solid rgba(0, 33, 71, 0.1);
          color: #002147;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .control-panel-desc {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 2rem 0;
          line-height: 1.5;
        }

        .control-panel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .integration-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .integration-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.06);
        }

        .integration-card.warning {
          border-color: rgba(255, 140, 0, 0.25);
          background: rgba(255, 140, 0, 0.02);
        }

        .integration-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding-bottom: 0.75rem;
        }

        .integration-logo-text {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }

        .status-pill {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 0.25rem 0.6rem;
          border-radius: 50px;
          letter-spacing: 0.5px;
        }

        .status-pill.green {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid #10b981;
        }

        .status-pill.orange-badge {
          background: rgba(255, 140, 0, 0.15);
          color: #ff8c00;
          border: 1px solid #ff8c00;
        }

        .integration-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          line-height: 1.4;
        }

        .detail-row span {
          color: #64748b;
        }

        .detail-row strong {
          color: #334155;
          text-align: right;
        }

        .btn-renew-subscription:hover {
          background: #ff8c00 !important;
          color: white !important;
          border-color: #ff8c00 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 140, 0, 0.25);
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          text-align: left;
        }

        .header-breadcrumbs {
          font-size: 0.7rem;
          font-weight: 900;
          color: #ff8c00;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          background: rgba(255, 140, 0, 0.08);
          padding: 0.35rem 0.85rem;
          border-radius: 50px;
          display: inline-block;
          margin-bottom: 0.4rem;
          border: 1px solid rgba(255, 140, 0, 0.15);
        }

        .header-title {
          font-size: 2.6rem;
          font-weight: 900;
          background: linear-gradient(135deg, #002147 25%, #ff8c00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-top: 0.2rem;
          letter-spacing: -0.8px;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-refresh {
          padding: 0.7rem 1.2rem;
          background: white;
          border: 1.5px solid #cbd5e1;
          color: #002147;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-refresh:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .btn-view-site {
          display: inline-block;
          padding: 0.7rem 1.2rem;
          background: #002147;
          color: white;
          border-radius: 10px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }

        .btn-view-site:hover {
          background: #ff8c00;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.15);
        }

        /* Top-Right Premium Profile & Logout Dropdown */
        .btn-view-site-classic {
          text-decoration: none;
          padding: 0.55rem 1.1rem;
          background: rgba(0, 33, 71, 0.04);
          border: 1px solid rgba(0, 33, 71, 0.1);
          color: #002147;
          font-size: 0.72rem;
          font-weight: 800;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .btn-view-site-classic:hover {
          background: #002147;
          color: white;
          border-color: #002147;
        }

        .profile-dropdown-trigger {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          padding: 0.35rem 0.85rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          user-select: none;
        }

        .profile-dropdown-trigger:hover {
          border-color: #ff8c00;
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.08);
        }

        .top-profile-avatar-bubble {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #002147, #003366);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 10px rgba(0, 33, 71, 0.1);
        }

        .top-profile-name {
          font-size: 0.72rem;
          font-weight: 800;
          color: #0f172a;
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .top-profile-role {
          font-size: 0.55rem;
          color: #ff8c00;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .profile-dropdown-panel {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(0, 33, 71, 0.08);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 33, 71, 0.08);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10000;
        }

        .profile-dropdown-trigger:hover .profile-dropdown-panel {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-user-info {
          display: flex;
          flex-direction: column;
          text-align: left;
          gap: 0.1rem;
        }

        .dropdown-user-info strong {
          font-size: 0.75rem;
          color: #002147;
          font-weight: 800;
        }

        .dropdown-user-info span {
          font-size: 0.68rem;
          color: #64748b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(0, 33, 71, 0.06);
          margin: 0.15rem 0;
        }

        .dropdown-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #ef4444;
          font-size: 0.72rem;
          font-weight: 800;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dropdown-logout-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }

        /* Tab Content Overview - White Card Design */
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .summary-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.75rem;
          text-align: left;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 33, 71, 0.03);
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }

        .summary-card.navy::before { background: #002147; }
        .summary-card.orange::before { background: #ff8c00; }
        .summary-card.green::before { background: #10b981; }
        .summary-card.red::before { background: #ef4444; }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 1px;
        }

        .card-icon {
          font-size: 1.2rem;
        }

        .card-value {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          color: #002147;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .card-trend {
          font-size: 0.75rem;
          color: #64748b;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
        }

        .activity-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 2rem;
          text-align: left;
          box-shadow: 0 10px 30px rgba(0, 33, 71, 0.03);
        }

        .activity-card h3 {
          font-size: 1.15rem;
          margin-bottom: 1.5rem;
          color: #002147;
          font-weight: 700;
        }

        .btn-card-action {
          display: block;
          width: 100%;
          padding: 0.8rem;
          background: #f8fafc;
          border: 1.5px dashed #cbd5e1;
          color: #ff8c00;
          font-weight: 700;
          border-radius: 12px;
          margin-top: 1.5rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-card-action:hover {
          background: #fff8f0;
          border-color: #ff8c00;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .quick-action-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          border-radius: 16px;
          color: #002147;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .quick-action-btn:hover {
          background: #fff8f0;
          border-color: #ff8c00;
          color: #ff8c00;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 140, 0, 0.08);
        }

        .qa-icon {
          font-size: 1.8rem;
        }

        /* Data Card and Table Styling */
        .data-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2.5rem;
          text-align: left;
          box-shadow: 0 10px 30px rgba(0, 33, 71, 0.03);
        }

        .card-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .card-header-flex h3 {
          font-size: 1.25rem;
          color: #002147;
          font-weight: 700;
        }

        .btn-add-item {
          padding: 0.6rem 1.2rem;
          background: #ff8c00;
          color: white;
          border: none;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add-item:hover {
          background: #e07b00;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th {
          padding: 1rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid #cbd5e1;
        }

        td {
          padding: 1.2rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.9rem;
          color: #334155;
        }

        tr:hover td {
          background: #f8fafc;
        }

        .student-name-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .student-avatar {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .student-id {
          display: block;
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 0.15rem;
        }

        .whatsapp-link {
          color: #10b981;
          text-decoration: none;
          font-weight: 600;
        }

        .whatsapp-link:hover {
          text-decoration: underline;
        }

        .jenjang-badge, .jenjang-pill {
          background: #f0f7ff;
          color: #0284c7;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-badge, .status-pill {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .status-badge.pending, .status-pill.pending { background: #fef9c3; color: #a16207; }
        .status-badge.approved, .status-pill.approved { background: #d1fae5; color: #065f46; }
        .status-badge.rejected, .status-pill.rejected { background: #fee2e2; color: #991b1b; }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-approve, .btn-reject, .btn-delete {
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-approve { background: #d1fae5; color: #065f46; }
        .btn-approve:hover:not(:disabled) { background: #10b981; color: white; }
        
        .btn-reject { background: #fee2e2; color: #991b1b; }
        .btn-reject:hover:not(:disabled) { background: #ef4444; color: white; }
        
        .btn-delete { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
        .btn-delete:hover { background: #ef4444; color: white; border-color: #ef4444; }

        .btn-approve:disabled, .btn-reject:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .category-pill {
          background: #fff8f0;
          color: #ff8c00;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-toggle {
          background: transparent;
          border: 1.5px solid;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .status-toggle.published { border-color: #10b981; color: #10b981; }
        .status-toggle.draft { border-color: #64748b; color: #64748b; }

        .loading-indicator {
          font-size: 0.8rem;
          color: #64748b;
          animation: pulse 1.5s infinite;
        }

        /* Gallery Admin Layout */
        .gallery-admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }

        .gallery-admin-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(0, 33, 71, 0.02);
        }

        .photo-preview-box {
          width: 100%;
          height: 180px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .photo-preview-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s;
        }

        .gallery-admin-card:hover .photo-preview-box img {
          transform: scale(1.05);
        }

        .photo-info-box {
          padding: 1.25rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .photo-desc {
          font-weight: 600;
          font-size: 0.9rem;
          color: #002147;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          height: 2.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .photo-meta {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 1.25rem;
        }

        .photo-actions {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-view-url {
          font-size: 0.75rem;
          color: #ff8c00;
          text-decoration: none;
          font-weight: 700;
        }

        .btn-view-url:hover {
          text-decoration: underline;
        }

        .btn-photo-delete {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-photo-delete:hover {
          color: #ef4444;
        }

        /* Config Form Styles */
        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .config-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .config-form input,
        .config-form textarea {
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          padding: 0.8rem 1.2rem;
          border-radius: 10px;
          color: #0f172a;
          outline: none;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .config-form input:focus,
        .config-form textarea:focus {
          border-color: #ff8c00;
          background: white;
          box-shadow: 0 0 0 4px rgba(255, 140, 0, 0.08);
        }

        .btn-submit-config {
          padding: 0.8rem;
          background: #002147;
          border: none;
          color: white;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-submit-config:hover {
          background: #ff8c00;
        }

        /* Modals & Inputs */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center; /* keep center for small modals */
          padding: 2rem;
          z-index: 10000;
        }

        .modal-box {
          background: white;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          max-width: 500px;
          text-align: left;
          box-shadow: 0 20px 50px rgba(0, 33, 71, 0.15);
        }

        .modal-box h3 {
          font-size: 1.2rem;
          color: #002147;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .modal-form input,
        .modal-form select,
        .modal-form textarea {
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          padding: 0.8rem;
          border-radius: 8px;
          color: #0f172a;
          outline: none;
          font-family: inherit;
        }

        .modal-form input:focus,
        .modal-form select:focus,
        .modal-form textarea:focus {
          border-color: #ff8c00;
          background: white;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .btn-modal-save {
          padding: 0.6rem 1.2rem;
          background: #ff8c00;
          color: white;
          border: none;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-modal-cancel {
          padding: 0.6rem 1.2rem;
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #64748b;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-modal-cancel:hover {
          background: #f1f5f9;
          color: #334155;
        }

        /* Error alert */
        .error-alert {
          background: #fee2e2;
          border: 1.5px solid #fca5a5;
          color: #991b1b;
          padding: 1.2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          line-height: 1.6;
          font-size: 0.85rem;
        }

        /* Vercel Analytics Visualizer Card Styles */
        .analytics-visualizer-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          margin-top: 2rem;
          border: 1.5px solid #f1f5f9;
        }

        .badge-chart-range {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.3rem 0.7rem;
          border-radius: 50px;
          border: 1.5px solid rgba(0, 33, 71, 0.1);
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
        }

        .badge-chart-range.active {
          background: var(--primary) !important;
          color: white !important;
          border-color: var(--primary) !important;
        }

        .badge-chart-range:hover:not(.active) {
          background: rgba(0, 33, 71, 0.05);
          color: var(--primary);
        }

        .visualizer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .visualizer-header h3 {
          font-size: 1.15rem;
          color: #002147;
          margin: 0;
          font-weight: 800;
        }

        .live-badge {
          background: rgba(76, 175, 80, 0.15);
          color: #4CAF50;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: 99px;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        .visualizer-desc {
          color: #64748b;
          font-size: 0.85rem;
          margin: 0 0 1.5rem 0;
          line-height: 1.5;
        }

        .analytics-metrics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .metric-box {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 1.25rem;
        }

        .metric-box-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1rem;
        }

        .progress-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .progress-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #334155;
          font-weight: 600;
        }

        .progress-bar-bg {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.8s ease;
        }

        .device-stats {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: calc(100% - 2rem);
          padding-top: 0.5rem;
        }

        .device-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .device-stat-icon {
          font-size: 1.5rem;
        }

        .device-stat-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: #002147;
        }

        .device-stat-name {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
        }

        .analytics-integration-info {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }

        .info-icon {
          font-size: 1.3rem;
          line-height: 1;
        }

        .analytics-integration-info p {
          margin: 0;
          font-size: 0.8rem;
          color: #1e3a8a;
          line-height: 1.6;
        }

        .analytics-integration-info code {
          background: rgba(30, 58, 138, 0.08);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 700;
        }

        .floating-admin-wrapper {
          display: none;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 9999;
          transition: opacity 0.3s ease;
        }

        /* Responsive styling */

        @media (max-width: 1200px) {
          .dashboard-grid { grid-template-columns: 80px 1fr; }
          .sidebar-logo, .sidebar-subtitle, .profile-details, .btn-logout { display: none; }
          .nav-item { justify-content: center; padding: 1rem; }
          .nav-item span:not(.nav-icon) { display: none; }
          .summary-grid { grid-template-columns: 1fr; }
          .activity-grid { grid-template-columns: 1fr; }
          .gallery-admin-grid { grid-template-columns: 1fr 1fr; }
          .config-grid { grid-template-columns: 1fr; }
          .main-content { padding: 2rem; }
        }

        @media (max-width: 768px) {
          .dashboard-layout { padding-top: 61px; } /* Safe padding for mobile */
          .dashboard-grid { grid-template-columns: 1fr; }
          .gallery-admin-grid { grid-template-columns: 1fr; }
          .header-title { font-size: 1.6rem; }
          .content-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          
          /* Floating Admin Toggle & Animation */
          .floating-admin-wrapper {
            position: fixed;
            left: 0;
            top: 75px; /* Directly under the main navbar */
            z-index: 999;
            display: flex;
            align-items: center;
            animation: introSlideAndWiggle 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes introSlideAndWiggle {
            0% { transform: translateX(-100%); }
            10% { transform: translateX(0); }
            15% { transform: translateX(8px); }
            25% { transform: translateX(-4px); }
            35% { transform: translateX(4px); }
            45% { transform: translateX(0); }
            100% { transform: translateX(0); }
          }

          .floating-tooltip {
            background: #ff8c00;
            color: white;
            padding: 0.5rem 0.8rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 800;
            margin-left: 0.5rem;
            box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
            white-space: nowrap;
            position: relative;
            animation: showAndFadeTooltip 3.5s forwards;
            pointer-events: none;
          }

          .floating-tooltip::before {
            content: '';
            position: absolute;
            left: -5px;
            top: 50%;
            transform: translateY(-50%);
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-right: 5px solid #ff8c00;
          }

          @keyframes showAndFadeTooltip {
            0%, 15% { opacity: 0; transform: translateX(-10px); visibility: visible; }
            25%, 85% { opacity: 1; transform: translateX(0); visibility: visible; }
            100% { opacity: 0; transform: translateX(10px); visibility: hidden; }
          }

          .floating-admin-toggle {
            background: rgba(0, 33, 71, 0.75); /* Glass Navy */
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-left: none;
            border-radius: 0 50px 50px 0;
            padding: 1rem 1.5rem 1rem 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 4px 4px 15px rgba(0, 33, 71, 0.3);
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background 0.2s;
            outline: none;
          }
          
          .floating-admin-toggle:active {
            transform: scale(0.95);
            background: rgba(0, 58, 125, 0.85);
          }

          .toggle-text {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            font-size: 0.95rem;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            transform: rotate(180deg);
            margin-left: 0.2rem;
            color: #ff8c00;
          }

          .toggle-logo-wrapper {
            position: relative;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            margin-right: -2.5rem; /* Offside! */
            margin-left: 0.2rem;
            border: 2.5px solid #002147;
          }

          .toggle-logo {
            width: 32px;
            height: 32px;
            object-fit: contain;
          }

          /* Floating Logout Button */
          .floating-logout-wrapper {
            position: fixed;
            right: 0;
            bottom: 100px;
            z-index: 999;
            display: flex;
            align-items: center;
            animation: introSlideAndWiggleRight 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes introSlideAndWiggleRight {
            0% { transform: translateX(100%); }
            10% { transform: translateX(0); }
            15% { transform: translateX(-8px); }
            25% { transform: translateX(4px); }
            35% { transform: translateX(-4px); }
            45% { transform: translateX(0); }
            100% { transform: translateX(0); }
          }

          .floating-logout-btn {
            background: rgba(220, 38, 38, 0.75); /* Glass Red */
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-right: none;
            border-radius: 50px 0 0 50px;
            padding: 0.7rem 0.5rem 0.7rem 1.2rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: -4px 4px 15px rgba(220, 38, 38, 0.25);
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background 0.2s;
            outline: none;
          }
          
          .floating-logout-btn:hover {
            background: rgba(220, 38, 38, 0.9);
            box-shadow: -4px 4px 20px rgba(220, 38, 38, 0.4);
          }

          .floating-logout-btn:active {
            transform: scale(0.95);
            background: rgba(185, 28, 28, 0.95);
          }

          .logout-text {
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          /* Left-sliding Mobile Sidebar Drawer */
          .sidebar {
            display: flex !important;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            width: 290px;
            height: 100vh;
            z-index: 10000;
            padding: 7rem 1.5rem 2rem 1.5rem !important;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 10px 0 35px rgba(0, 0, 0, 0.3);
          }
          
          .sidebar.mobile-open {
            transform: translateX(0);
          }

          /* Force elements inside the sliding drawer to display correctly */
          .sidebar-logo, 
          .sidebar-subtitle, 
          .profile-details, 
          .btn-logout {
            display: block !important;
          }

          .sidebar-header {
            padding: 1.5rem !important;
          }

          .nav-item {
            justify-content: flex-start !important;
            padding: 0.95rem 1.5rem !important;
          }

          .nav-item span {
            display: inline-block !important;
          }

          .sidebar-footer {
            padding: 1.5rem !important;
            display: block !important;
          }

          .main-content {
            padding: 2rem 1.5rem; /* reset padding now that bottom nav is gone */
          }

          /* Collapse Analytics Metric Grid on Mobile */
          .analytics-metrics-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .device-stats {
            flex-direction: row;
            justify-content: space-around;
            padding: 0.5rem 0;
          }
        }

        /* Premium Modal Backdrop & Content Styles for Priority Pages */
        .modal-backdrop-priority {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(0, 33, 71, 0.45) !important;
          backdrop-filter: blur(15px) !important;
          -webkit-backdrop-filter: blur(15px) !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          z-index: 999999 !important;
          padding: 1.5rem !important;
        }

        .modal-content-priority {
          width: 100% !important;
          max-width: 520px !important;
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.7) !important;
          border-radius: 20px !important;
          box-shadow: 0 30px 60px rgba(0, 33, 71, 0.2) !important;
          overflow: hidden !important;
          position: relative !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .modal-content-priority::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 5px !important;
          background: linear-gradient(90deg, var(--primary), var(--secondary)) !important;
        }

        .modal-header-priority {
          padding: 1.5rem 1.5rem 1rem 1.5rem !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          border-bottom: 1px solid rgba(0, 33, 71, 0.06) !important;
        }

        .modal-header-priority h3 {
          font-size: 1.05rem !important;
          font-weight: 900 !important;
          color: var(--primary) !important;
          margin: 0 !important;
        }

        .btn-close-modal-priority {
          background: none !important;
          border: none !important;
          color: #94a3b8 !important;
          font-size: 1.7rem !important;
          font-weight: 300 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
        }

        .btn-close-modal-priority:hover {
          color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.08) !important;
        }

        .modal-body-priority {
          padding: 1.5rem !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 1.25rem !important;
          overflow-y: auto !important;
          max-height: 70vh !important;
        }

        .priority-stats-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 0.75rem !important;
        }

        .priority-stat-card {
          background: rgba(0, 33, 71, 0.03) !important;
          border: 1px solid rgba(0, 33, 71, 0.06) !important;
          border-radius: 12px !important;
          padding: 0.75rem !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
          gap: 4px !important;
        }

        .priority-stat-card .p-label {
          font-size: 0.58rem !important;
          font-weight: 800 !important;
          color: #64748b !important;
          text-transform: uppercase !important;
          letter-spacing: 0.3px !important;
        }

        .priority-stat-card .p-value {
          font-size: 0.85rem !important;
          font-weight: 900 !important;
          color: var(--primary) !important;
        }

        .priority-stat-card .p-value.green {
          color: #10b981 !important;
        }

        .priority-stat-card .p-value.orange {
          color: #ff8c00 !important;
        }

        .priority-details-section {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          text-align: left !important;
        }

        .priority-details-section h4 {
          font-size: 0.85rem !important;
          font-weight: 850 !important;
          color: var(--primary) !important;
          margin-bottom: 2px !important;
        }

        .priority-details-section p {
          font-size: 0.76rem !important;
          color: #4b5563 !important;
          line-height: 1.5 !important;
        }

        .data-table-mini {
          background: rgba(0, 33, 71, 0.02) !important;
          border: 1px dashed rgba(0, 33, 71, 0.08) !important;
          border-radius: 12px !important;
          padding: 0.75rem 0.95rem !important;
          margin-top: 0.25rem !important;
        }

        .mini-row {
          display: flex !important;
          justify-content: space-between !important;
          font-size: 0.72rem !important;
          padding: 6px 0 !important;
          border-bottom: 1px solid rgba(0, 33, 71, 0.04) !important;
        }

        .mini-row:last-child {
          border-bottom: none !important;
          padding-bottom: 0 !important;
        }

        .mini-row:first-child {
          padding-top: 0 !important;
        }

        .mini-row strong {
          color: #475569 !important;
        }

        .mini-row span {
          color: var(--primary) !important;
          font-weight: 750 !important;
        }

        .modal-footer-priority {
          padding: 1rem 1.5rem 1.5rem 1.5rem !important;
          border-top: 1px solid rgba(0, 33, 71, 0.06) !important;
          display: flex !important;
          justify-content: flex-end !important;
          gap: 0.75rem !important;
        }

        .btn-modal-action-priority {
          padding: 0.65rem 1.1rem !important;
          font-size: 0.78rem !important;
          font-weight: 800 !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          transition: all 0.25s ease !important;
          border: none !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .btn-modal-action-priority.primary {
          background: var(--primary) !important;
          color: white !important;
        }

        .btn-modal-action-priority.primary:hover {
          background: var(--primary-light) !important;
          transform: translateY(-1.5px) !important;
          box-shadow: 0 4px 12px rgba(0, 33, 71, 0.15) !important;
        }

        .btn-modal-action-priority.secondary {
          background: rgba(0, 33, 71, 0.05) !important;
          color: var(--primary) !important;
          border: 1px solid rgba(0, 33, 71, 0.08) !important;
        }

        .btn-modal-action-priority.secondary:hover {
          background: rgba(0, 33, 71, 0.08) !important;
        }

        /* Hover animation for Priority Cards */
        .priority-item-card {
          position: relative !important;
          overflow: hidden !important;
        }

        .priority-item-card::after {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 4px !important;
          height: 100% !important;
          background: transparent !important;
          transition: all 0.3s ease !important;
        }

        .priority-item-card:hover {
          background: rgba(0, 33, 71, 0.05) !important;
          border-color: rgba(255, 140, 0, 0.25) !important;
          transform: translateY(-2px) scale(1.005) !important;
          box-shadow: 0 6px 20px rgba(0, 33, 71, 0.04) !important;
        }

        .priority-item-card:hover::after {
          background: var(--secondary) !important;
        }
      `}</style>

      {/* Master Password Prompt Modal */}
      <AnimatePresence>
        {showMasterPasswordPrompt && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                textAlign: 'center'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Verifikasi Keamanan</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.5 }}>
                Masukkan Pasword Admin
              </p>

              <form onSubmit={executePendingAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type={showMasterPassword ? "text" : "password"}
                    placeholder="Masukkan Master Password..."
                    value={masterPasswordInput}
                    onChange={(e) => setMasterPasswordInput(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '1rem',
                      paddingRight: '3rem',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#0f172a',
                      textAlign: 'center',
                      letterSpacing: '2px',
                      fontWeight: 700,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowMasterPassword(!showMasterPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {showMasterPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowMasterPasswordPrompt(false);
                      setMasterPasswordInput("");
                      setPendingSuperAdminAction(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      background: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    Lanjutkan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN REQUEST PREVIEW MODAL */}
      <AnimatePresence>
        {selectedLoginRequest && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#002147', fontWeight: 800 }}>Preview Permintaan Login</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Nama Pemohon</label>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#333' }}>{selectedLoginRequest.name}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Alamat E-Mail</label>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#333' }}>{selectedLoginRequest.email}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Role Akses</label>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: selectedLoginRequest.role === 'Admin' ? '#002147' : '#ff8c00' }}>{selectedLoginRequest.role}</div>
                </div>
                
                {selectedLoginRequest.role === 'Admin' && selectedLoginRequest.kepengurusan && (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Kepengurusan</label>
                    <div style={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}>{selectedLoginRequest.kepengurusan}</div>
                  </div>
                )}
                
                {selectedLoginRequest.role === 'Wali' && (
                  <>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Nama Santri</label>
                      <div style={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}>{selectedLoginRequest.nama_santri}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Jenjang</label>
                        <div style={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}>{selectedLoginRequest.jenjang_pendidikan}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Kelas</label>
                        <div style={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}>{selectedLoginRequest.pilihan_kelas}</div>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Program</label>
                      <div style={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}>{selectedLoginRequest.program_pendidikan}</div>
                    </div>
                  </>
                )}
                
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Waktu Pengajuan</label>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>{selectedLoginRequest.requestedAt}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setSelectedLoginRequest(null)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#e2e8f0', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Tutup
                </button>
                {selectedLoginRequest.status === 'Pending' && (
                  <button
                    onClick={() => {
                      handleUpdateLoginRequestStatus(selectedLoginRequest.id, 'Approved');
                      setSelectedLoginRequest(null);
                    }}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#10b981', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Setujui Langsung
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD PUSAT DATA MODAL */}
      <AnimatePresence>
        {showAddPusatDataModal && (
          <div onClick={() => { setShowAddPusatDataModal(false); window.history.pushState(null, "", window.location.href); }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '800px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#002147', fontWeight: 900 }}>Tambah Data Siswa Baru (Admin)</h3>
                <button onClick={() => setShowAddPusatDataModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
              </div>
              
              <form onSubmit={handleAddPusatDataSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '0.3rem' }}>Nama Lengkap</label>
                    <input type="text" required value={addPusatDataForm.nama_lengkap} onChange={e => setAddPusatDataForm({...addPusatDataForm, nama_lengkap: capitalizeWords(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '0.3rem' }}>Email Peserta Didik (Opsional)</label>
                    <input type="email" value={addPusatDataForm.email_santri} onChange={e => setAddPusatDataForm({...addPusatDataForm, email_santri: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Email aktif (opsional)"/>
                  </div>
                  <div className="input-group">
                    <label>Tempat, Tanggal Lahir</label>
                    <input type="text" required value={addPusatDataForm.tempat_tanggal_lahir} onChange={e => setAddPusatDataForm({...addPusatDataForm, tempat_tanggal_lahir: capitalizeWords(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/>
                  </div>
                  <div className="input-group">
                    <label>NIK</label>
                    <input type="number" required value={addPusatDataForm.nik} onChange={e => setAddPusatDataForm({...addPusatDataForm, nik: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/>
                  </div>
                  <div className="input-group">
                    <label>NISN</label>
                    <input type="number" required value={addPusatDataForm.nisn} onChange={e => setAddPusatDataForm({...addPusatDataForm, nisn: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/>
                  </div>
                  <div className="input-group">
                    <label>Jenjang Pendidikan</label>
                    <select value={addPusatDataJenjang} onChange={e => setAddPusatDataJenjang(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="MA Unggulan Al-Azhar">MA Unggulan Al-Azhar</option>
                      <option value="SMP Islam Al-Azhar">SMP Islam Al-Azhar</option>
                      <option value="SDIT Al-Azhar">SDIT Al-Azhar</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Kelas</label>
                    <select value={addPusatDataForm.kelas} onChange={e => setAddPusatDataForm({...addPusatDataForm, kelas: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      {getAddPusatDataKelasOptions().map(k => <option key={k} value={k}>Kelas {k}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Program Pendidikan</label>
                    <select value={addPusatDataForm.program_pendidikan} onChange={e => setAddPusatDataForm({...addPusatDataForm, program_pendidikan: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="Mondok">Mondok (Pesantren)</option>
                      <option value="Non Mondok">Non Mondok (Pulang Pergi)</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Gender</label>
                    <select value={addPusatDataForm.gender} onChange={e => setAddPusatDataForm({...addPusatDataForm, gender: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="Putra">Putra</option><option value="Putri">Putri</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Kampus</label>
                    <select value={addPusatDataForm.kampus} onChange={e => setAddPusatDataForm({...addPusatDataForm, kampus: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="Azhar 1">Azhar 1</option>
                      <option value="Azhar 2">Azhar 2</option>
                      <option value="Azhar 3">Azhar 3</option>
                      <option value="Azhar 4">Azhar 4</option>
                    </select>
                  </div>
                </div>

                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <strong>Alamat Lengkap Domisili</strong>
                    <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={addPusatDataIsWNA} onChange={e => setAddPusatDataIsWNA(e.target.checked)} />
                      WNA (Warga Negara Asing)
                    </label>
                  </div>

                  {addPusatDataIsWNA ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label>Negara</label>
                        <input list="admin-country-list" required={addPusatDataIsWNA} value={addPusatDataCountry} onChange={e => setAddPusatDataCountry(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/>
                        <datalist id="admin-country-list">{countries.map((c,i) => <option key={i} value={c} />)}</datalist>
                      </div>
                      <div>
                        <label>Kode Pos</label>
                        <input type="text" value={addPusatDataKodePos} onChange={e => setAddPusatDataKodePos(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label>Provinsi</label>
                        <select required={!addPusatDataIsWNA} value={addPusatDataProvId} onChange={e => { setAddPusatDataProvId(e.target.value); setAddPusatDataProvName(e.target.options[e.target.selectedIndex].text); setAddPusatDataRegId(""); setAddPusatDataRegName(""); setDistricts([]); setAddPusatDataDistId(""); setAddPusatDataDistName(""); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <option value="">-- Pilih Provinsi --</option>
                          {addPusatDataProvId === "OLD_PROV" && <option value="OLD_PROV">{addPusatDataProvName}</option>}
                          {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    {addPusatDataErrors.provinsi && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{addPusatDataErrors.provinsi}</div>}
                      </div>
                      <div>
                        <label>Kota/Kabupaten</label>
                        <select required={!addPusatDataIsWNA} value={addPusatDataRegId} disabled={!addPusatDataProvId} onChange={e => { setAddPusatDataRegId(e.target.value); setAddPusatDataRegName(e.target.options[e.target.selectedIndex].text); setAddPusatDataDistId(""); setAddPusatDataDistName(""); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <option value="">-- Pilih Kota/Kabupaten --</option>
                          {addPusatDataRegId === "OLD_REG" && <option value="OLD_REG">{addPusatDataRegName}</option>}
                          {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    {addPusatDataErrors.kota && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{addPusatDataErrors.kota}</div>}
                      </div>
                      <div>
                        <label>Kecamatan</label>
                        <select required={!addPusatDataIsWNA} value={addPusatDataDistId} disabled={!addPusatDataRegId} onChange={e => { setAddPusatDataDistId(e.target.value); setAddPusatDataDistName(e.target.options[e.target.selectedIndex].text); setAddPusatDataVillageId(""); setAddPusatDataVillageName(""); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <option value="">-- Pilih Kecamatan --</option>
                          {addPusatDataDistId === "OLD_DIST" && <option value="OLD_DIST">{addPusatDataDistName}</option>}
                          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    {addPusatDataErrors.kecamatan && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{addPusatDataErrors.kecamatan}</div>}
                      </div>
                      <div>
                        <label>Kelurahan/Desa</label>
                        <select required={!addPusatDataIsWNA} value={addPusatDataVillageId} disabled={!addPusatDataDistId} onChange={e => { setAddPusatDataVillageId(e.target.value); setAddPusatDataVillageName(e.target.options[e.target.selectedIndex].text); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <option value="">-- Pilih Kelurahan/Desa --</option>
                          {addPusatDataVillageId === "OLD_VILL" && <option value="OLD_VILL">{addPusatDataVillageName}</option>}
                          {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    {addPusatDataErrors.kelurahan && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{addPusatDataErrors.kelurahan}</div>}
                      </div>
                      <div>
                        <label>Kode Pos</label>
                        <input type="number" value={addPusatDataKodePos} onChange={e => setAddPusatDataKodePos(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/>
                      </div>
                    </div>
                  )}
                  <div>
                    <label>Detail Alamat</label>
                    <textarea required value={addPusatDataDetail} onChange={e => setAddPusatDataDetail(e.target.value)} rows={2} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}></textarea>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group"><label>Nama Ayah</label><input type="text" required value={addPusatDataForm.nama_ayah} onChange={e => setAddPusatDataForm({...addPusatDataForm, nama_ayah: capitalizeWords(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/></div>
                  <div className="input-group">
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
</div>
                  <div className="input-group"><label>Nama Ibu</label><input type="text" required value={addPusatDataForm.nama_ibu} onChange={e => setAddPusatDataForm({...addPusatDataForm, nama_ibu: capitalizeWords(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/></div>
                  <div className="input-group">
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
</div>
                  <div className="input-group"><label>No HP/WhatsApp Wali</label><input type="text" required value={addPusatDataForm.no_hp_wali} onChange={e => setAddPusatDataForm({...addPusatDataForm, no_hp_wali: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}/></div>
                </div>

                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ display: 'block', marginBottom: '1rem' }}>Unggah Berkas</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
    <label>Pas Foto {isEditingPusatData ? '(Opsional)' : '*'}</label><input type="file" required={!isEditingPusatData} accept="image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, pas_foto: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
    {isEditingPusatData && addPusatDataExistingFiles.pas_foto && (
      <div style={{ marginTop: '8px' }}>
        <a href={addPusatDataExistingFiles.pas_foto} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>Lihat Pas Foto Saat Ini</a>
      </div>
    )}
  </div>
                    <div>
    <label>Kartu Keluarga (KK) {isEditingPusatData ? '(Opsional)' : '*'}</label><input type="file" required={!isEditingPusatData} accept=".pdf,image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, kk: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
    {isEditingPusatData && addPusatDataExistingFiles.kk_url && (
      <div style={{ marginTop: '8px' }}>
        <a href={addPusatDataExistingFiles.kk_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>Lihat KK Saat Ini</a>
      </div>
    )}
  </div>
                    <div>
    <label>Akte Kelahiran</label><input type="file" accept=".pdf,image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, akte: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
    {isEditingPusatData && addPusatDataExistingFiles.akte_url && (
      <div style={{ marginTop: '8px' }}>
        <a href={addPusatDataExistingFiles.akte_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>Lihat Akte Saat Ini</a>
      </div>
    )}
  </div>
                    <div>
    <label>Ijazah Terakhir</label><input type="file" accept=".pdf,image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, ijazah: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
    {isEditingPusatData && addPusatDataExistingFiles.ijazah_url && (
      <div style={{ marginTop: '8px' }}>
        <a href={addPusatDataExistingFiles.ijazah_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>Lihat Ijazah Saat Ini</a>
      </div>
    )}
  </div>
                    <div>
    <label>SKTM (Bila Ada)</label><input type="file" accept=".pdf,image/*" onChange={e => setAddPusatDataFiles({...addPusatDataFiles, sktm: e.target.files?.[0] || null})} style={{ width: '100%', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
    {isEditingPusatData && addPusatDataExistingFiles.sktm_url && (
      <div style={{ marginTop: '8px' }}>
        <a href={addPusatDataExistingFiles.sktm_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>Lihat SKTM Saat Ini</a>
      </div>
    )}
  </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <input type="checkbox" id="adminDataValidation" required style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                  <label htmlFor="adminDataValidation" style={{ color: '#166534', fontWeight: 700, cursor: 'pointer' }}>
                    Saya yakin bahwa data yang saya masukkan sudah benar
                  </label>
                </div>

                <button type="submit" disabled={isSubmittingAddPusatData} style={{ padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: isSubmittingAddPusatData ? 'not-allowed' : 'pointer', marginTop: '1rem' }}>
                  {isSubmittingAddPusatData ? "Menyimpan Data..." : "Simpan Data Siswa"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Confirm Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: '#ffffff', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', textAlign: 'center' }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: confirmModal.isDanger ? '#dc2626' : '#0f172a', margin: '0 0 0.5rem 0' }}>{confirmModal.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.5 }}>{confirmModal.message}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} style={{ flex: 1, padding: '1rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  {confirmModal.cancelText}
                </button>
                <button onClick={confirmModal.onConfirm} style={{ flex: 1, padding: '1rem', background: confirmModal.isDanger ? '#ef4444' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: confirmModal.isDanger ? '0 4px 14px rgba(239, 68, 68, 0.3)' : '0 4px 14px rgba(0, 33, 71, 0.3)' }}>
                  {confirmModal.confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Prompt Modal */}
      <AnimatePresence>
        {promptModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: '#ffffff', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', textAlign: 'center' }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>{promptModal.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>{promptModal.message}</p>
              <input type="text" autoFocus value={promptValue} onChange={e => setPromptValue(e.target.value)} placeholder={promptModal.placeholder} style={{ width: '100%', padding: '1rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', color: '#0f172a', textAlign: 'center', fontWeight: 700, outline: 'none', marginBottom: '2rem', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.borderColor = '#3b82f6'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => setPromptModal(prev => ({ ...prev, isOpen: false }))} style={{ flex: 1, padding: '1rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  {promptModal.cancelText}
                </button>
                <button onClick={() => promptModal.onConfirm(promptValue)} style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 33, 71, 0.3)' }}>
                  {promptModal.confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Alert Modal */}
      <AnimatePresence>
        {alertModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: '#ffffff', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', textAlign: 'center' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{alertModal.isError ? '⚠️' : '✅'}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: alertModal.isError ? '#dc2626' : '#0f172a', margin: '0 0 0.5rem 0' }}>{alertModal.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.5 }}>{alertModal.message}</p>
              <button onClick={() => setAlertModal(prev => ({ ...prev, isOpen: false }))} style={{ width: '100%', padding: '1rem', background: alertModal.isError ? '#ef4444' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: alertModal.isError ? '0 4px 14px rgba(239, 68, 68, 0.3)' : '0 4px 14px rgba(0, 33, 71, 0.3)' }}>
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
    </>
  );
}
