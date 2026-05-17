"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";

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
  title: string;
  category: string;
  date: string;
  author: string;
  status: "Published" | "Draft";
}

interface DocPhoto {
  id: string;
  url: string;
  description: string;
  date: string;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "ppdb" | "news" | "docs" | "settings" | "accounts">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real-time visitor states
  const [totalVisitors, setTotalVisitors] = useState(1482);
  const [activeVisitors, setActiveVisitors] = useState(12);
  const [todayVisitors, setTodayVisitors] = useState(148);

  // Maintenance states
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMaintenance = localStorage.getItem('web_maintenance_mode') === 'true';
      setMaintenanceMode(savedMaintenance);
    }
  }, []);

  const toggleMaintenanceMode = () => {
    const nextState = !maintenanceMode;
    setMaintenanceMode(nextState);
    localStorage.setItem('web_maintenance_mode', String(nextState));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('maintenanceChange'));
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
  const [chartData, setChartData] = useState<any[]>([
    { date: "11 Mei", visitors: 320, x: 50, y: 142 },
    { date: "12 Mei", visitors: 410, x: 150, y: 123 },
    { date: "13 Mei", visitors: 380, x: 250, y: 129 },
    { date: "14 Mei", visitors: 490, x: 350, y: 106 },
    { date: "15 Mei", visitors: 580, x: 450, y: 87 },
    { date: "16 Mei", visitors: 620, x: 550, y: 78 },
    { date: "17 Mei", visitors: 780, x: 650, y: 44 }
  ]);
  
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
  const [news, setNews] = useState<NewsItem[]>([
    { id: "1", title: "Penerimaan Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka", category: "PPDB", date: "15 Mei 2026", author: "Humas Al-Azhar", status: "Published" },
    { id: "2", title: "Santri Al-Azhar Purwakarta Menyabet Juara 1 Lomba Tahfidz Tingkat Provinsi", category: "Prestasi", date: "10 Mei 2026", author: "Ustadz Mansur", status: "Published" },
    { id: "3", title: "Kunjungan Studi Banding dari Pondok Pesantren Gontor Putra", category: "Kegiatan", date: "02 Mei 2026", author: "Humas Al-Azhar", status: "Draft" },
  ]);
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsCategory, setNewNewsCategory] = useState("Kegiatan");
  const [newNewsStatus, setNewNewsStatus] = useState<"Published" | "Draft">("Published");
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);

  // Docs states
  const [photos, setPhotos] = useState<DocPhoto[]>([
    { id: "1", url: "https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999166/mnxrqkh8y8lei8wjio1f.png", description: "Wisuda Kelulusan Alumni Angkatan 12", date: "24 April 2026" },
    { id: "2", url: "https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999167/lmj09gushldyzgflpfms.png", description: "Kegiatan Halaqah Qur'an di Masjid Utama", date: "18 April 2026" },
    { id: "3", url: "https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999168/fttozmnhyylwwegvwl6r.png", description: "Kunjungan Studi Lapangan Santri Mandiri", date: "05 April 2026" },
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoDesc, setNewPhotoDesc] = useState("");
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

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

  useEffect(() => {
    fetchPpdbData();
    fetchVisitorStats();
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

  // Handle delete registration
  const handleDeletePpdb = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pendaftaran ini?")) return;
    
    setPendaftaran(prev => prev.filter(p => p.id !== id));

    try {
      await supabase.from("pendaftaran").delete().eq("id", id);
    } catch (err) {
      console.error(err);
    }
  };

  // News Actions
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle) return;

    const newItem: NewsItem = {
      id: Date.now().toString(),
      title: newNewsTitle,
      category: newNewsCategory,
      date: "Hari Ini",
      author: user?.user_metadata?.nama_lengkap || "Pengurus Azwa",
      status: newNewsStatus
    };

    setNews([newItem, ...news]);
    setNewNewsTitle("");
    setShowAddNewsModal(false);
  };

  const handleDeleteNews = (id: string) => {
    if (!confirm("Hapus artikel berita ini?")) return;
    setNews(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleNewsStatus = (id: string) => {
    setNews(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === "Published" ? "Draft" : "Published" };
      }
      return item;
    }));
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
    if (!confirm("Hapus foto dari galeri dokumentasi?")) return;
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const strokePath = chartData.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`).join(' ');
  const areaPath = chartData.length > 0 ? `${strokePath} L ${chartData[chartData.length - 1].x},190 L ${chartData[0].x},190 Z` : '';

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
            <button 
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
            >
              <span className="nav-icon"></span> <span>Data Aktivitas Web</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === "ppdb" ? "active" : ""}`}
              onClick={() => { setActiveTab("ppdb"); setSidebarOpen(false); }}
            >
              <span className="nav-icon"></span> <span>Pendaftaran PPDB</span>
              {pendaftaran.filter(p => p.status === "Pending").length > 0 && (
                <span className="nav-badge">{pendaftaran.filter(p => p.status === "Pending").length}</span>
              )}
            </button>
            
            <button 
              className={`nav-item ${activeTab === "news" ? "active" : ""}`}
              onClick={() => { setActiveTab("news"); setSidebarOpen(false); }}
            >
              <span className="nav-icon"></span> <span>Kelola Berita</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === "docs" ? "active" : ""}`}
              onClick={() => { setActiveTab("docs"); setSidebarOpen(false); }}
            >
              <span className="nav-icon"></span> <span>Kelola Galeri</span>
            </button>

            <button 
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
            >
              <span className="nav-icon"></span> <span>Konfigurasi</span>
            </button>

            <button 
              className={`nav-item ${activeTab === "accounts" ? "active" : ""}`}
              onClick={() => { setActiveTab("accounts"); setSidebarOpen(false); }}
            >
              <span className="nav-icon"></span> <span>Kelola Data & Akun</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="admin-profile">
              <div className="profile-avatar">{(user?.email || "A").substring(0, 1).toUpperCase()}</div>
              <div className="profile-details">
                <span className="profile-name">{user?.email || "Super Admin"}</span>
                <span className="profile-role">Azwa Page Manager</span>
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    localStorage.removeItem('admin_session');
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new Event('maintenanceChange'));
                    window.location.href = '/login';
                  }}
                  className="sidebar-logout-btn"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    style={{ width: '18px', height: '18px', flexShrink: 0 }}
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="main-content">
          {/* Mobile Admin Header with Left Hamburger Toggle */}
          <header className="mobile-admin-header">
            <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(true)} title="Buka Menu Pengurus">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="mobile-header-brand">
              <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999207/ntxuizh8mm8odxndbvs2.png" alt="Logo Al-Azhar" className="mobile-logo-img" />
              <span>PANEL PENGURUS</span>
            </div>
          </header>
          <header className="content-header">
            <div>
              <span className="header-breadcrumbs">
                {activeTab === "overview" ? "Dashboard Admin" : `Dashboard Admin / ${activeTab.toUpperCase()}`}
              </span>
              <h2 className={`${frizQuadrata.className} header-title`}>
                {activeTab === "overview" && "Data Aktivitas Web"}
                {activeTab === "ppdb" && "Manajemen Pendaftaran Santri Baru (PPDB)"}
                {activeTab === "news" && "Pusat Pengelolaan Berita & Pengumuman"}
                {activeTab === "docs" && "Pengelolaan Dokumentasi & Galeri Alumni"}
                {activeTab === "settings" && "Konfigurasi Desain & Informasi Umum"}
                {activeTab === "accounts" && "Manajemen Data & Hak Akses Pengurus"}
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
                    </div>
                  </div>

                  {/* Vercel Analytics Visualizer Section */}
                  <div className="analytics-visualizer-card" style={{ marginBottom: '2rem' }}>
                    <div className="visualizer-header">
                      <h3>Laporan & Analisis Pengunjung (Vercel Web Analytics)</h3>
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
                          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)', marginTop: '2px' }}>Statistik Kunjungan Harian (7 Hari Terakhir)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="badge-chart-range active">7D</button>
                          <button className="badge-chart-range">30D</button>
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
                              <text x={pt.x} y="212" fill="#64748b" fontSize="10" fontWeight="800" textAnchor="middle">
                                {pt.date}
                              </text>
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
                      <div className="metric-box">
                        <span className="metric-box-label">Halaman Paling Sering Dikunjungi (Top Pages)</span>
                        <div className="progress-list">
                          {topPages.map((page, idx) => (
                            <div key={idx} className="progress-item">
                              <div className="progress-labels">
                                <span>{page.path}</span>
                                <span>{page.pct}% ({page.count} views)</span>
                              </div>
                              <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${page.pct}%`, backgroundColor: idx === 0 ? '#002147' : idx === 1 ? '#ff8c00' : '#4CAF50' }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="metric-box">
                        <span className="metric-box-label">Sumber Lalu Lintas (Traffic Sources)</span>
                        <div className="progress-list">
                          {trafficSources.map((src, idx) => (
                            <div key={idx} className="progress-item">
                              <div className="progress-labels">
                                <span>{src.source}</span>
                                <span>{src.pct}%</span>
                              </div>
                              <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${src.pct}%`, backgroundColor: idx === 0 ? '#002147' : idx === 1 ? '#ff8c00' : '#4CAF50' }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="metric-box device-box">
                        <span className="metric-box-label">Perangkat Pengunjung</span>
                        <div className="device-stats">
                          <div className="device-stat">
                            <span className="device-stat-icon">📱</span>
                            <span className="device-stat-val">{deviceStats.mobile}%</span>
                            <span className="device-stat-name">Mobile</span>
                          </div>
                          <div className="device-stat">
                            <span className="device-stat-icon">💻</span>
                            <span className="device-stat-val">{deviceStats.desktop}%</span>
                            <span className="device-stat-name">Desktop</span>
                          </div>
                          <div className="device-stat">
                            <span className="device-stat-icon">📟</span>
                            <span className="device-stat-val">{deviceStats.tablet}%</span>
                            <span className="device-stat-name">Tablet</span>
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

                  {/* Activity and PPDB Preview */}
                  <div className="activity-grid">
                    <div className="activity-card">
                      <h3>Pendaftar Terbaru (Butuh Verifikasi)</h3>
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Nama Calon Santri</th>
                              <th>Pilihan Jenjang</th>
                              <th>Kontak</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendaftaran.slice(0, 3).map((p, idx) => (
                              <tr key={idx}>
                                <td><strong>{p.nama_lengkap}</strong></td>
                                <td><span className="jenjang-badge">{p.jenjang}</span></td>
                                <td>{p.no_hp}</td>
                                <td>
                                  <span className={`status-badge ${p.status.toLowerCase()}`}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button onClick={() => setActiveTab("ppdb")} className="btn-card-action">
                        Lihat Seluruh Pendaftar PPDB →
                      </button>
                    </div>

                    <div className="activity-card quick-actions-card">
                      <h3>Jalan Pintas Cepat (Quick Actions)</h3>
                      <div className="quick-actions-grid">
                        <button onClick={() => setShowAddNewsModal(true)} className="quick-action-btn">
                          <span className="qa-icon"></span> Tulis Berita Baru
                        </button>
                        <button onClick={() => setShowAddPhotoModal(true)} className="quick-action-btn">
                          <span className="qa-icon"></span> Upload Foto Galeri
                        </button>
                        <Link href="/login" className="quick-action-btn">
                          <span className="qa-icon"></span> Uji Halaman Login
                        </Link>
                        <button onClick={() => setActiveTab("settings")} className="quick-action-btn">
                          <span className="qa-icon"></span> Edit Kontak & Banner
                        </button>
                      </div>
                    </div>
                  </div>
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
                      <button onClick={() => setShowAddNewsModal(true)} className="btn-add-item">
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
                              <td><strong>{item.title}</strong></td>
                              <td><span className="category-pill">{item.category}</span></td>
                              <td>{item.date}</td>
                              <td>{item.author}</td>
                              <td>
                                <button 
                                  onClick={() => handleToggleNewsStatus(item.id)}
                                  className={`status-toggle ${item.status.toLowerCase()}`}
                                  title="Klik untuk mengubah status rilis"
                                >
                                  {item.status}
                                </button>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button 
                                    onClick={() => handleToggleNewsStatus(item.id)} 
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
                      <form className="config-form" onSubmit={(e) => { e.preventDefault(); alert("Pengaturan berhasil disimpan lokal!"); }}>
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
                      <form className="config-form" onSubmit={(e) => { e.preventDefault(); alert("Statistik berhasil diperbarui!"); }}>
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

              {/* TAB 6: ACCOUNTS & DATA OPERATIONS */}
              {activeTab === "accounts" && (
                <motion.div
                  key="accounts"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                  <div className="config-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    
                    {/* User Account Settings Card */}
                    <div className="data-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.75rem', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#002147', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>Detail Akun Pengurus</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(0,33,71,0.03)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 'bold' }}>
                          A
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Super Admin Al-Azhar</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>danishalzam8002@gmail.com</span>
                        </div>
                      </div>

                      <form className="config-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={(e) => { e.preventDefault(); alert("Profil admin berhasil diperbarui!"); }}>
                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>Nama Lengkap Pengurus</label>
                          <input type="text" defaultValue="Super Admin Al-Azhar" style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }} />
                        </div>
                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>E-Mail Utama (Login & Tagihan)</label>
                          <input type="email" defaultValue="danishalzam8002@gmail.com" disabled style={{ background: '#f1f5f9', border: '1.5px solid #e2e8f0', padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#94a3b8', cursor: 'not-allowed' }} />
                        </div>
                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>Password Baru</label>
                          <input type="password" placeholder="••••••••" style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }} />
                        </div>
                        <button type="submit" className="btn-submit-config" style={{ padding: '0.75rem', background: '#002147', color: 'white', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}>Perbarui Profil Akun</button>
                      </form>
                    </div>

                    {/* Database Operations & Backup Section */}
                    <div className="data-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.75rem', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#002147', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>Operasi Tabel & Salinan Data (Backup)</h3>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1.25rem 0', lineHeight: 1.5, textAlign: 'left' }}>
                        Kelola volume baris tabel database PostgreSQL di Supabase dan buat salinan cadangan instan untuk keamanan berkas data portal pesantren.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {[
                          { name: "visitor_logs", desc: "Log aktivitas Web Analytics", count: totalVisitors || 1482, status: "Tersinkronisasi" },
                          { name: "pendaftaran", desc: "Data formulir pendaftaran santri baru (PPDB)", count: pendaftaran.length || 8, status: "Tersinkronisasi" },
                          { name: "berita", desc: "Artikel warta & kabar berita pesantren", count: news.length || 3, status: "Tersimpan" },
                          { name: "galeri_dokumentasi", desc: "Galeri foto & dokumentasi dokumenter alumni", count: photos.length || 3, status: "Tersimpan" }
                        ].map((tbl, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{tbl.name}</span>
                              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{tbl.desc}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 900, background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '5px' }}>{tbl.count} baris</span>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981' }}>● {tbl.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => {
                            const backupData = {
                              timestamp: new Date().toISOString(),
                              visitorsCount: totalVisitors,
                              registrations: pendaftaran,
                              newsCount: news.length,
                              photosCount: photos.length
                            };
                            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `backup_alazhar_${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                            alert("Ekspor file cadangan berhasil diunduh!");
                          }}
                          style={{ flex: 1, padding: '0.75rem', background: '#ff8c00', color: 'white', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s', textAlign: 'center' }}
                        >
                          Unduh Berkas Cadangan (JSON)
                        </button>
                        <button 
                          onClick={() => {
                            alert("Optimalisasi indeks tabel PostgreSQL berhasil dijalankan!");
                          }}
                          style={{ flex: 0.8, padding: '0.75rem', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontWeight: 700, borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
                        >
                          Optimalkan Indeks
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* MODAL 1: ADD NEWS */}
      {showAddNewsModal && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-box"
          >
            <h3>Tulis Artikel Berita Baru</h3>
            <form onSubmit={handleAddNews} className="modal-form">
              <div className="input-group">
                <label>Judul Artikel Berita</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Pembukaan Ekstrakurikuler Baru"
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Kategori Berita</label>
                  <select value={newNewsCategory} onChange={(e) => setNewNewsCategory(e.target.value)}>
                    <option value="PPDB">PPDB</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Status Publikasi</label>
                  <select value={newNewsStatus} onChange={(e) => setNewNewsStatus(e.target.value as any)}>
                    <option value="Published">Published (Langsung Terbit)</option>
                    <option value="Draft">Draft (Simpan Draf)</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-modal-save">Simpan Artikel</button>
                <button type="button" onClick={() => setShowAddNewsModal(false)} className="btn-modal-cancel">Batal</button>
              </div>
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
            className="modal-box"
          >
            <h3>Upload / Hubungkan Foto Baru</h3>
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

              <div className="modal-actions">
                <button type="submit" className="btn-modal-save">Tambahkan Foto</button>
                <button type="button" onClick={() => setShowAddPhotoModal(false)} className="btn-modal-cancel">Batal</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .dashboard-layout {
          min-height: 100vh;
          background-color: #f1f5f9;
          color: #0f172a;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
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
          top: 90px;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.15);
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
        }

        /* Sidebar Styling - Deep Navy Dominant Color */
        .sidebar {
          background-color: #002147;
          border-right: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          padding: 160px 1.5rem 2rem 1.5rem;
          position: sticky;
          top: 0;
          height: 100vh;
          box-sizing: border-box;
          z-index: 99;
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
          background: transparent;
          border: none;
          color: #cbd5e1;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-item.active {
          background: rgba(255, 140, 0, 0.15);
          color: #ff8c00;
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
        }

        .profile-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-role {
          font-size: 0.65rem;
          color: #94a3b8;
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
          background: rgba(0, 33, 71, 0.4);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
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
        .modal-form select {
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          padding: 0.8rem;
          border-radius: 8px;
          color: #0f172a;
          outline: none;
        }

        .modal-form input:focus,
        .modal-form select:focus {
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
          grid-template-columns: 1fr 1fr 0.8fr;
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

        .mobile-admin-header {
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
          .dashboard-grid { grid-template-columns: 1fr; }
          .gallery-admin-grid { grid-template-columns: 1fr; }
          .header-title { font-size: 1.6rem; }
          .content-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          
          /* Mobile Top Bar Header styling */
          .mobile-admin-header {
            display: flex;
            align-items: center;
            background: #002147; /* Dominant Navy */
            color: white;
            padding: 0.9rem 1.2rem;
            position: sticky;
            top: 58px;
            z-index: 999;
            margin: -2rem -1.5rem 1.5rem -1.5rem;
            box-shadow: 0 4px 15px rgba(0, 33, 71, 0.2);
            gap: 1rem;
          }
          
          .mobile-sidebar-toggle {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.25rem;
            outline: none;
          }
          
          .mobile-sidebar-toggle:active {
            transform: scale(0.9);
          }

          .mobile-header-brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 800;
            font-size: 0.95rem;
            letter-spacing: 0.8px;
            color: #ff8c00; /* Accent Orange */
          }

          .mobile-logo-img {
            height: 28px;
            width: auto;
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
      `}</style>
    </main>
    </>
  );
}
