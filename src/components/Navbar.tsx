"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminRole, setAdminRole] = useState("Admin");
  const [isSantriLoggedIn, setIsSantriLoggedIn] = useState(false);
  const [santriName, setSantriName] = useState("");
  const [santriGender, setSantriGender] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);
  const lastOutsideClickTime = useRef<number>(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      
      // Close profile dropdown if clicked outside
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
      
      // Close mobile menu if clicked outside (and not on the toggle button itself)
      // Menggunakan logika "double tap" / "double click"
      if (
        navMenuRef.current && 
        !navMenuRef.current.contains(target) && 
        !(target as Element).closest('.menu-toggle')
      ) {
        const now = Date.now();
        if (now - lastOutsideClickTime.current < 500) {
          // Jika jarak klik kurang dari 500ms, tutup menu
          setMenuOpen(false);
          lastOutsideClickTime.current = 0;
        } else {
          // Jika baru klik sekali, catat waktunya
          lastOutsideClickTime.current = now;
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const isLoginPage = typeof window !== 'undefined' && (
    window.location.pathname.includes('/login') || 
    window.location.pathname.includes('/admin')
  );

  useEffect(() => {
    const checkMaintenanceAndSession = () => {
      if (typeof window !== 'undefined') {
        const isMaintenance = localStorage.getItem('web_maintenance_mode') === 'true';
        const sessionStr = localStorage.getItem('admin_session');
        const session = sessionStr ? JSON.parse(sessionStr) : null;
        
        const santriSessionStr = localStorage.getItem('santri_session');
        const santriSession = santriSessionStr ? JSON.parse(santriSessionStr) : null;
        
        setMaintenanceActive(isMaintenance);
        setIsAdminLoggedIn(!!session);
        if (session) {
          const email = session.user?.email || session.email;
          const metadataName = session.user?.user_metadata?.name || session.user?.user_metadata?.nama || session.user?.user_metadata?.full_name;
          
          if (metadataName) {
            setAdminName(metadataName);
          } else if (email) {
            // Set email as fallback first
            setAdminName(email);
            // Try fetching real name from DB
            supabase.from('admin_accounts')
              .select('name')
              .eq('email', email)
              .single()
              .then(({ data }) => {
                if (data && data.name) {
                  setAdminName(data.name);
                }
              }, () => {});
          } else {
            setAdminName("Admin");
          }
          
          const role = session.user?.user_metadata?.role || session.role || session.user?.role || "Admin";
          setAdminRole(role);
        }
        
        setIsSantriLoggedIn(!!santriSession);
        if (santriSession) {
          const name = santriSession.user?.user_metadata?.nama || santriSession.user?.email || "Santri";
          setSantriName(name);
          const gender = santriSession.user?.user_metadata?.jenis_kelamin || santriSession.user?.user_metadata?.gender || santriSession.gender || "Laki-laki";
          setSantriGender(gender);
        }
      }
    };

    checkMaintenanceAndSession();

    window.addEventListener('storage', checkMaintenanceAndSession);
    window.addEventListener('maintenanceChange', checkMaintenanceAndSession);
    return () => {
      window.removeEventListener('storage', checkMaintenanceAndSession);
      window.removeEventListener('maintenanceChange', checkMaintenanceAndSession);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) setActiveDropdown(null);
    else setActiveDropdown(name);
  };

  // Force refresh - 2026-05-17
  console.log("Navbar rendering with switch effect...");

  const [loginHover, setLoginHover] = useState(false);
  const [isLogoActive, setIsLogoActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLogoActive(prev => !prev);
    }, 20000); // Ultra santai: ganti setiap 20 detik
    return () => clearInterval(interval);
  }, []);

  const getShortenedName = (name: any) => {
    if (!name || typeof name !== 'string') return "User";
    let displayName = name.includes('@') ? name.split('@')[0] : name;
    
    // Split by space, dot, underscore, dash
    const parts = displayName.split(/[\s._-]/).filter(p => p.length > 0);
    
    if (parts.length > 0) {
      // If the first part is less than 3 chars (e.g. "M", "M.", "Al"), take the second part as well
      if (parts[0].length < 3 && parts.length > 1) {
        displayName = parts[0] + ' ' + parts[1];
      } else {
        displayName = parts[0];
      }
    }
    
    // Capitalize properly
    displayName = displayName.split(' ').map(w => w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');

    if (displayName.length > 14) {
      displayName = displayName.substring(0, 12) + "..";
    }
    return displayName;
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* Top Utility Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-links">
            <Link href="/login">Azwa Page</Link>
            <Link href="/login/santri">Santri Page</Link>
            <Link href="/pusda">Pusda Azhar</Link>
          </div>
          <div className="top-utils">
            <div className="lang-switcher-v2">
              <span className={`lang-label ${language === 'ID' ? 'active' : ''}`}>ID</span>
              <button
                className={`lang-toggle-pill ${language === 'EN' ? 'is-en' : ''}`}
                onClick={() => setLanguage(language === 'ID' ? 'EN' : 'ID')}
                aria-label="Toggle Language"
              >
                <div className="toggle-thumb"></div>
              </button>
              <span className={`lang-label ${language === 'EN' ? 'active' : ''}`}>EN</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-nav">
        <div className="container nav-container">
          <Link href="/" className="logo" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
            <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999207/ntxuizh8mm8odxndbvs2.png" alt="Logo Al Azhar" className="logo-img" />
            <div className="logo-box">
              <span className="logo-main">PESANTREN AL-AZHAR</span>
              <span className="logo-sub">PURWAKARTA</span>
              <span className="logo-tagline">TAKHOSSUS TAHFIDZ QUR'AN DAN BAHASA ARAB</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div ref={navMenuRef} className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link href="/" className="nav-item" onClick={() => setMenuOpen(false)}>{t('beranda')}</Link>

            <div
              className="nav-item-dropdown"
              onMouseEnter={() => !menuOpen && setActiveDropdown('profil')}
              onMouseLeave={() => !menuOpen && setActiveDropdown(null)}
            >
              <button
                className="dropdown-trigger"
                onClick={() => toggleDropdown('profil')}
              >
                {t('profil')} <span className="chevron">▾</span>
              </button>
              <div className={`dropdown-menu ${activeDropdown === 'profil' ? 'show' : ''}`}>
                <Link href="/profil/alazhapurwakarta" onClick={() => setMenuOpen(false)}>{t('sejarah')}</Link>
                <Link href="/profil/sistem-pendidikan" onClick={() => setMenuOpen(false)}>{t('sistem')}</Link>
                <Link href="/profil/pendiri" onClick={() => setMenuOpen(false)}>{t('pendiri')}</Link>
              </div>
            </div>

            <Link href="/azhar-tv" className="nav-item" onClick={() => setMenuOpen(false)}>{t('tv')}</Link>
            <Link 
              href="/#jenjang" 
              className="nav-item" 
              onClick={(e) => {
                setMenuOpen(false);
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('jenjang')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {t('sekolah')}
            </Link>
            <Link href="/fasilitas" className="nav-item" onClick={() => setMenuOpen(false)}>{t('fasilitas')}</Link>
            <Link href="/azhar-learn" className="nav-item" onClick={() => setMenuOpen(false)}>{t('learn')}</Link>

            <Link href="/pendaftaran" className="nav-cta-special" onClick={() => setMenuOpen(false)}>
              {t('daftar')}
            </Link>

            <div
              className="nav-item-dropdown"
              onMouseEnter={() => !menuOpen && setActiveDropdown('informasi')}
              onMouseLeave={() => !menuOpen && setActiveDropdown(null)}
            >
              <button
                className="dropdown-trigger"
                onClick={() => toggleDropdown('informasi')}
              >
                {t('info')} <span className="chevron">▾</span>
              </button>
              <div className={`dropdown-menu ${activeDropdown === 'informasi' ? 'show' : ''}`}>
                <Link href="/informasi" onClick={() => setMenuOpen(false)}>{t('informasi_pendaftaran') || 'Informasi Pendaftaran'}</Link>
                <Link href="/jelajahi/beasiswa" onClick={() => setMenuOpen(false)}>{t('jalur_beasiswa') || 'Jalur Beasiswa'}</Link>
              </div>
            </div>

          </div>

          {/* Mobile Utility + Toggle */}
          <div className="nav-mobile-actions">


            <div className="menu-toggle-wrapper">
              <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="menu-text" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#002147', marginRight: '5px' }}>MENU</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
                  <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
                  <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Floating Action Button */}
      {(() => {
        const isDashboard = pathname === '/admin' || pathname === '/santri';
        let buttonContent = null;
        let onClickAction = null;
        let btnClass = "floating-action-btn";

        if (isAdminLoggedIn || isSantriLoggedIn) {
          if (isDashboard) {
            buttonContent = (
              <>
                <span className="logout-text">Logout</span>
                <div className="logout-icon-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
              </>
            );
            onClickAction = () => {
              setShowLogoutModal(true);
            };
          } else {
            const displayName = getShortenedName(isAdminLoggedIn ? adminName : santriName);
            buttonContent = (
              <>
                <span className="logout-text" style={{textTransform: 'none'}}>👋 Ahlan {displayName}</span>
              </>
            );
            btnClass += " btn-blue";
            onClickAction = () => {
              window.location.href = isAdminLoggedIn ? '/admin' : '/santri';
            };
          }
        } else {
          buttonContent = (
            <>
              <span className="logout-text">Login di sini</span>
              <div className="logout-icon-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </div>
            </>
          );
          onClickAction = () => {
            window.location.href = '/login';
          };
        }

        return (
          <>
            <div className="floating-action-wrapper">
              <button className={btnClass} onClick={onClickAction}>
                {buttonContent}
              </button>
            </div>

            {/* Custom Logout Confirmation Modal */}
            <AnimatePresence>
              {showLogoutModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }}
                >
                  <motion.div 
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
                    style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                  >
                    <div style={{ width: '80px', height: '80px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
                        <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19 12H9"/>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#dc2626', margin: '0 0 0.5rem 0' }}>Konfirmasi Logout</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.5 }}>
                      Apakah Anda yakin ingin logout dari sesi Anda?
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={() => setShowLogoutModal(false)} 
                        style={{ flex: 1, padding: '1rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Batal
                      </button>
                      <button 
                        onClick={async () => {
                          await supabase.auth.signOut();
                          localStorage.removeItem('admin_session');
                          localStorage.removeItem('santri_session');
                          window.dispatchEvent(new Event('storage'));
                          window.dispatchEvent(new Event('maintenanceChange'));
                          window.location.href = '/login';
                        }} 
                        style={{ flex: 1, padding: '1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}
                      >
                        Ya, Logout
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );
      })()}

      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .goog-te-menu-value {
          display: none !important;
        }
        .goog-tooltip {
          display: none !important;
        }
        .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* Premium Floating Glassmorphic Profile Dropdown Panel */
        .navbar-profile-dropdown-panel {
          position: absolute !important;
          margin: 0 !important;
          top: calc(100% + 15px);
          right: 0;
          width: 250px;
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(25px) !important;
          -webkit-backdrop-filter: blur(25px) !important;
          border: 1px solid rgba(255, 255, 255, 0.6) !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 50px rgba(0, 33, 71, 0.15) !important;
          padding: 1.1rem !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 0.75rem !important;
          z-index: 100000 !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }

        /* Top linear gradient border for premium aesthetic */
        .navbar-profile-dropdown-panel::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 4px !important;
          background: linear-gradient(90deg, var(--primary), var(--secondary)) !important;
          z-index: 100001 !important;
          border-radius: 16px 16px 0 0 !important;
        }

        .dropdown-user-header {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          width: 100% !important;
        }

        .dropdown-avatar-bubble {
          width: 38px !important;
          height: 38px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, var(--primary) 0%, #002147 100%) !important;
          color: white !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 0.95rem !important;
          font-weight: 800 !important;
          flex-shrink: 0 !important;
          box-shadow: 0 4px 10px rgba(0, 33, 71, 0.12) !important;
          border: 1.5px solid rgba(255, 255, 255, 0.8) !important;
        }

        .dropdown-user-info {
          display: flex !important;
          flex-direction: column !important;
          text-align: left !important;
          gap: 0.15rem !important;
        }

        .dropdown-user-info strong {
          font-size: 0.8rem !important;
          color: var(--primary) !important;
          font-weight: 800 !important;
        }

        .dropdown-user-info span {
          font-size: 0.72rem !important;
          color: #64748b !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        .dropdown-divider {
          height: 1px !important;
          background: rgba(0, 33, 71, 0.08) !important;
          margin: 0.15rem 0 !important;
        }

        .dropdown-action-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          width: 100% !important;
          padding: 0.65rem 0.95rem !important;
          font-size: 0.78rem !important;
          font-weight: 800 !important;
          border-radius: 8px !important;
          text-decoration: none !important;
          transition: all 0.25s ease !important;
          box-sizing: border-box !important;
        }

        .dropdown-action-btn.panel-btn {
          background: rgba(0, 33, 71, 0.04) !important;
          border: 1px solid rgba(0, 33, 71, 0.08) !important;
          color: var(--primary) !important;
        }

        .dropdown-action-btn.panel-btn:hover {
          background: var(--primary) !important;
          color: white !important;
          border-color: var(--primary) !important;
          box-shadow: 0 4px 12px rgba(0, 33, 71, 0.1) !important;
        }

        .dropdown-logout-btn-new {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          width: 100% !important;
          padding: 0.65rem 0.95rem !important;
          background: rgba(239, 68, 68, 0.08) !important;
          border: 1px solid rgba(239, 68, 68, 0.15) !important;
          color: #ef4444 !important;
          font-size: 0.78rem !important;
          font-weight: 800 !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          transition: all 0.25s ease !important;
          box-sizing: border-box !important;
        }

        .dropdown-logout-btn-new:hover {
          background: #ef4444 !important;
          color: white !important;
          border-color: #ef4444 !important;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15) !important;
        }

        @media (max-width: 992px) {
          .navbar-profile-dropdown-panel {
            width: 220px !important;
            right: -5px !important;
            top: calc(100% + 10px) !important;
            padding: 0.85rem !important;
          }

          .dropdown-user-header {
            gap: 8px !important;
          }

          .dropdown-avatar-bubble {
            width: 32px !important;
            height: 32px !important;
            font-size: 0.85rem !important;
          }

          .dropdown-user-info strong {
            font-size: 0.68rem !important;
          }

          .dropdown-user-info span {
            font-size: 0.60rem !important;
            max-width: 130px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }
        }
      `}</style>

      <style jsx>{`
        /* Premium Compact Navbar Admin Profile Bubble */
        .navbar-profile-bubble-container {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 33, 71, 0.05);
          border: 1.5px solid var(--primary);
          padding: 4px 10px 4px 6px;
          border-radius: 50px;
          transition: all 0.25s ease;
          max-width: 220px;
          box-sizing: border-box;
          user-select: none;
        }

        .navbar-profile-bubble-container:hover {
          background: rgba(0, 33, 71, 0.09);
          border-color: #ff8c00;
          box-shadow: 0 2px 8px rgba(255, 140, 0, 0.12);
        }

        .navbar-avatar-bubble {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .scroll-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #ff8c00;
          color: white;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
          border: none;
          z-index: 998;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Floating Global Action Button */
        .floating-action-wrapper {
          position: fixed;
          right: 0;
          bottom: 100px;
          z-index: 9999;
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

        .floating-action-btn {
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
        
        .floating-action-btn:hover {
          background: rgba(220, 38, 38, 0.9);
          box-shadow: -4px 4px 20px rgba(220, 38, 38, 0.4);
        }

        .floating-action-btn:active {
          transform: scale(0.95);
          background: rgba(185, 28, 28, 0.95);
        }

        .floating-action-btn.btn-blue {
          background: rgba(0, 33, 71, 0.85); /* Dark Navy */
          box-shadow: -4px 4px 15px rgba(0, 33, 71, 0.25);
        }
        .floating-action-btn.btn-blue:hover {
          background: rgba(0, 33, 71, 0.95);
          box-shadow: -4px 4px 20px rgba(0, 33, 71, 0.4);
        }

        .logout-text {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .navbar-profile-details {
          display: flex;
          flex-direction: column;
          text-align: left;
          min-width: 0;
          line-height: 1.1;
        }

        .navbar-profile-name {
          font-size: 0.65rem;
          font-weight: 800;
          color: #002147;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .navbar-profile-role {
          font-size: 0.5rem;
          color: #ff8c00;
          font-weight: 900;
          letter-spacing: 0.3px;
        }

        /* Old local dropdown styles removed in favor of gorgeous new global styles above */

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: var(--transition);
        }

        .top-bar {
          background: var(--primary);
          padding: 8px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: var(--transition);
        }

        .navbar.scrolled .top-bar {
          display: none !important;
        }

        .top-bar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .top-utils {
          display: flex;
          align-items: center;
        }

        .lang-switcher-v2 {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .lang-label {
          font-size: 0.65rem;
          font-weight: 700;
          opacity: 0.4;
          transition: all 0.3s ease;
          color: white;
        }

        .lang-label.active {
          opacity: 1;
          color: var(--secondary);
        }

        .lang-toggle-pill {
          width: 38px;
          height: 18px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .toggle-thumb {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 3px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .lang-toggle-pill.is-en .toggle-thumb {
          left: 21px;
          background: var(--secondary);
        }

        .lang-toggle-pill.is-en {
          background: rgba(230, 126, 34, 0.2);
          border-color: rgba(230, 126, 34, 0.4);
        }

        .top-links {
          display: flex;
          gap: 0.75rem;
          font-size: 0.68rem;
        }

        .top-links a:hover {
          color: white;
        }

        .main-nav {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          box-shadow: var(--shadow);
          transition: var(--transition);
        }

        .navbar.scrolled .main-nav {
          padding: 0.7rem 0;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px !important; /* Lebih lebar sesuai permintaan */
          margin: 0 auto;
          width: 95%;
        }

        .logo {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          flex-wrap: nowrap !important;
          gap: 15px;
          text-decoration: none;
          white-space: nowrap;
        }

        .logo-img {
          height: 65px;
          width: auto;
          display: block;
          transition: var(--transition);
        }

        .navbar.scrolled .logo-img {
          height: 55px;
        }

        .logo-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1.1;
          width: fit-content;
          flex-shrink: 0;
        }

        .logo-main {
          color: var(--primary);
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
          font-family: var(--font-custom), sans-serif;
        }

        .logo-sub {
          color: var(--secondary);
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 2px;
        }

        .logo-tagline {
          font-size: 0.45rem;
          color: var(--primary);
          font-weight: 600;
          margin-top: 2px;
          opacity: 0.8;
          letter-spacing: 0.2px;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          margin-left: 4rem; /* Jarak ekstra dari logo */
        }

        .nav-item {
          color: var(--primary) !important;
          font-weight: 700;
          font-size: 0.82rem;
          letter-spacing: 0.3px;
          transition: var(--transition);
        }

        .nav-item:hover {
          color: var(--secondary) !important;
        }

        /* Dropdown Styles */
        .nav-item-dropdown {
          position: relative;
        }

        .dropdown-trigger {
          background: none;
          border: none;
          color: var(--primary) !important;
          font-weight: 700;
          font-size: 0.92rem; /* Slightly larger for prominence */
          letter-spacing: 0.3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: var(--transition);
        }

        .nav-item:hover, .dropdown-trigger:hover {
          color: var(--secondary) !important;
          cursor: pointer;
        }

        .nav-item:active, .dropdown-trigger:active {
          color: var(--secondary) !important;
          transform: scale(0.95);
          transition: all 0.1s ease;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%; /* Moved closer to prevent closing */
          left: -20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          min-width: 260px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
          border-radius: 16px;
          padding: 1rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px) scale(0.95);
          transition: all 0.2s ease-out;
          display: flex;
          flex-direction: column;
          z-index: 100;
          border: 1px solid rgba(255, 255, 255, 0.5);
          overflow: visible; /* Changed from hidden to show bridge */
        }

        /* Invisible bridge to prevent menu closing */
        .dropdown-menu::after {
          content: '';
          position: absolute;
          top: -20px;
          left: 0;
          width: 100%;
          height: 25px;
          background: transparent;
        }

        .dropdown-menu::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          z-index: 2;
          border-radius: 16px 16px 0 0;
        }

        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .dropdown-menu a {
          padding: 1rem 1.5rem;
          color: var(--primary);
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .dropdown-menu a:last-child {
          margin-bottom: 0;
        }

        .dropdown-menu a:hover {
          background: rgba(230, 126, 34, 0.08);
          color: var(--secondary);
          padding-left: 1.8rem;
          transform: translateX(5px);
        }

        .dropdown-menu a::after {
          content: '→';
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }

        .dropdown-menu a:hover::after {
          opacity: 1;
          transform: translateX(0);
        }

        .dropdown-menu a:active {
          transform: scale(0.96);
          background: rgba(230, 126, 34, 0.15);
          transition: all 0.1s ease;
        }

        /* Special Pendaftaran Button */
        .nav-cta-special {
          background: var(--secondary);
          color: white !important;
          padding: 0.6rem 1.4rem;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          transition: var(--transition);
          box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);
        }

        /* Sleek Admin Badge CSS */
        .nav-admin-profile-pill {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .admin-badge-graphic {
          transition: all 0.3s ease;
        }

        .admin-badge-graphic:hover {
          background: rgba(0, 33, 71, 0.15) !important;
          border-color: var(--secondary) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 33, 71, 0.1);
        }

        .admin-badge-graphic:active {
          transform: scale(0.95);
        }

        /* Admin CTA Button */
        .nav-cta-admin {
          background: rgba(0, 33, 71, 0.06);
          border: 1.5px solid var(--primary);
          color: var(--primary) !important;
          padding: 0.55rem 1.3rem;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          transition: var(--transition);
          text-decoration: none;
        }

        .nav-cta-admin:hover {
          background: var(--primary);
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 33, 71, 0.15);
        }

        /* Premium Login Button */
        .nav-mobile-actions {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-left: auto;
        }

        .nav-login-premium {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .login-switch-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 38px;
          overflow: visible;
        }

        .login-graphic {
          background: rgba(230, 126, 34, 0.1); /* Light orange tint, no white */
          border: 2px solid var(--secondary);
          padding: 0.4rem 1.1rem;
          border-radius: 50px;
          display: flex;
          flex-direction: row !important; /* Force side-by-side */
          flex-wrap: nowrap !important;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 800;
          font-size: 0.8rem;
          color: var(--primary) !important; /* Navy text, no white */
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .login-icon-svg {
          width: 16px;
          height: 16px;
          color: var(--primary) !important; /* Navy icon, no white */
          flex-shrink: 0;
          display: block;
        }

        .nav-login-img {
          max-height: 32px;
          max-width: 115px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .nav-login-premium:hover {
          transform: translateY(-2px);
        }

        .nav-login-premium:active {
          transform: scale(0.95);
        }

        /* Mobile Menu Toggles */
        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          z-index: 1001;
          width: 44px;
          height: 44px; /* Fixed touch target */
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .menu-toggle:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .bar {
          width: 26px;
          height: 2px;
          background: var(--primary);
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 4px;
        }

        .bar.active:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .bar.active:nth-child(2) { opacity: 0; }
        .bar.active:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        @media (max-width: 1200px) {
          .nav-links { gap: 0.8rem; }
          .nav-item { font-size: 0.75rem; }
          .dropdown-trigger { font-size: 0.82rem; }
        }

        @media (max-width: 992px) {
          .navbar-profile-bubble-container {
            padding: 3px 6px 3px 4px !important;
            gap: 4px !important;
            max-width: 95px !important;
          }

          .navbar-profile-name {
            font-size: 0.58rem !important;
            max-width: 45px !important;
          }

          .navbar-profile-role {
            font-size: 0.45rem !important;
          }

          .top-bar {
            display: none !important;
          }

          .main-nav {
            padding: 0.5rem 0;
            backdrop-filter: none !important;
            background: rgba(255, 255, 255, 0.98) !important;
          }
          
          .nav-container {
            padding: 0 0.6rem !important;
            display: flex;
            align-items: center;
          }

          @keyframes pulse-glow-left {
            0% {
              box-shadow: 0 8px 24px rgba(0, 33, 71, 0.3), 0 0 8px rgba(230, 126, 34, 0.3);
              transform: translateY(0);
            }
            100% {
              box-shadow: 0 12px 32px rgba(0, 33, 71, 0.45), 0 0 20px rgba(230, 126, 34, 0.6);
              transform: translateY(-5px);
            }
          }

          @keyframes dot-pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
          }

          .menu-toggle {
            display: flex !important;
            position: relative !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            width: auto !important;
            height: auto !important;
            z-index: 99999 !important;
            justify-content: center !important;
            align-items: center !important;
            flex-direction: row;
            padding: 0 !important;
          }

          .menu-toggle:hover {
            transform: scale(1.05) !important;
          }

          .menu-toggle:active {
            transform: scale(0.95) !important;
          }

          :global(.menu-helper-bubble) {
            display: none !important;
          }

          :global(.helper-pulse-dot) {
            display: none !important;
          }

          .bar {
            background: #002147 !important;
            height: 3px !important;
            width: 22px !important;
            border-radius: 4px !important;
            margin: 0 !important;
            transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          .bar.active:nth-child(1) { transform: translateY(7px) rotate(45deg) !important; }
          .bar.active:nth-child(2) { opacity: 0 !important; }
          .bar.active:nth-child(3) { transform: translateY(-7px) rotate(-45deg) !important; }

          .nav-links {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            height: auto !important;
            max-height: calc(100vh - 80px) !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: none !important;
            border-top: 1px solid #f1f5f9 !important;
            border-bottom: 2px solid #f1f5f9 !important;
            border-radius: 0 0 20px 20px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1.5rem !important;
            gap: 0.6rem !important;
            box-shadow: 0 20px 30px rgba(0, 33, 71, 0.1) !important;
            transform: scaleY(0) !important;
            transform-origin: top !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: all 0.3s ease !important;
            z-index: 99998 !important;
            overflow-y: auto !important;
            scrollbar-width: none;
          }

          .nav-links::-webkit-scrollbar {
            display: none;
          }

          .nav-links.active {
            transform: scaleY(1) !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          :global(.nav-item) { 
            display: flex !important;
            align-items: center !important;
            font-size: 0.9rem !important; 
            width: 100% !important; 
            text-align: left !important;
            padding: 0.6rem 1.2rem !important;
            border-bottom: none !important;
            border-radius: 12px !important;
            background: rgba(0, 33, 71, 0.03) !important;
            color: var(--primary) !important;
            transition: all 0.3s ease !important;
          }
          
          :global(.nav-item:hover) {
            background: rgba(230, 126, 34, 0.08) !important;
            color: var(--secondary) !important;
            padding-left: 1.5rem !important;
          }

          .dropdown-trigger {
            font-size: 0.9rem !important;
            width: 100% !important;
            text-align: left !important;
            padding: 0.6rem 1.2rem !important;
            border-bottom: none !important;
            border-radius: 12px !important;
            background: rgba(0, 33, 71, 0.03) !important;
            color: var(--primary) !important;
            justify-content: space-between !important;
          }

          .nav-item-dropdown { width: 100%; }
          .dropdown-menu {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            box-shadow: none;
            display: none;
            padding: 0.5rem 1rem;
            background: #f8f9fa;
            width: 100%;
            min-width: unset;
            border-radius: 12px !important;
            border: 1px solid rgba(0, 0, 0, 0.04) !important;
            margin-top: 4px !important;
          }
          .dropdown-menu.show { display: flex; }
          
          :global(.nav-cta-special) {
            display: flex !important;
            align-items: center !important;
            font-size: 0.9rem !important;
            width: 100% !important;
            margin: 0.3rem 0 !important;
            justify-content: flex-start !important;
            padding: 0.6rem 1.2rem !important;
            border-radius: 12px !important;
            background: var(--secondary) !important;
            color: white !important;
            box-shadow: 0 4px 15px rgba(230, 126, 34, 0.2) !important;
          }

          .nav-mobile-actions {
            margin-left: auto;
            gap: 0.5rem;
          }

          .login-switch-container {
            width: 100px;
            height: 32px;
          }

          .login-graphic {
            padding: 0.3rem 0.8rem;
            gap: 5px;
            font-size: 0.65rem;
          }

          .login-icon-svg {
            width: 12px;
            height: 12px;
          }

          .nav-login-img {
            max-height: 24px;
            max-width: 80px;
          }

          .logo-img {
            height: 45px !important;
          }

          .logo-main {
            font-size: 0.9rem !important;
          }

          .logo-sub {
            font-size: 0.7rem !important;
            letter-spacing: 1px !important;
          }

          .logo-tagline {
            font-size: 0.38rem !important;
          }
        }

        /* Maintenance Overlay CSS */
        .maintenance-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 33, 71, 0.85); /* Deep navy tint */
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          z-index: 9999999; /* Higher than everything */
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          color: white;
        }

        .maintenance-glass-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 3rem 2rem;
          border-radius: 28px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
          animation: fadeInUp 0.8s ease;
        }

        .maintenance-logo {
          height: 90px;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
        }

        .maintenance-title {
          font-family: var(--font-custom), 'Inter', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--secondary); /* Vibrant Orange */
          letter-spacing: 2px;
          margin-bottom: 1rem;
        }

        .maintenance-gear-container {
          margin: 1.5rem 0;
        }

        .maintenance-gear-icon {
          display: inline-block;
          font-size: 3.5rem;
        }

        .maintenance-gear-icon.spinning {
          animation: gear-spin 4s linear infinite;
        }

        @keyframes gear-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .maintenance-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 2rem;
        }

        .maintenance-status-badge {
          display: inline-block;
          background: rgba(239, 68, 68, 0.2);
          border: 1.5px solid #ef4444;
          color: #fca5a5;
          padding: 0.4rem 1.2rem;
          font-weight: 800;
          font-size: 0.75rem;
          border-radius: 50px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .maintenance-admin-btn {
          display: inline-block;
          padding: 0.8rem 2.2rem;
          background: #ff8c00;
          color: white !important;
          font-weight: 900;
          font-size: 0.82rem;
          border-radius: 50px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(255, 140, 0, 0.3);
        }

        .maintenance-admin-btn:hover {
          transform: translateY(-3px);
          background: #e67e00;
          box-shadow: 0 15px 30px rgba(255, 140, 0, 0.5);
        }

        /* Admin profile pill */
        .nav-admin-profile-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 33, 71, 0.08);
          border: 2px solid var(--primary);
          padding: 6px 12px;
          border-radius: 50px;
          color: var(--primary);
          font-weight: 800;
          font-size: 0.8rem;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0, 33, 71, 0.08);
          transition: all 0.3s ease;
        }

        .nav-admin-profile-pill:hover {
          background: rgba(0, 33, 71, 0.12);
          transform: translateY(-1px);
        }

        .admin-avatar {
          font-size: 0.9rem;
        }

        .admin-name {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-logout-btn {
          background: none;
          border: none;
          font-size: 0.95rem;
          cursor: pointer;
          padding: 2px;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-logout-btn:hover {
          transform: scale(1.2);
          filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.4));
        }

        @media (max-width: 992px) {
          .nav-admin-profile-pill {
            padding: 4px 8px;
            font-size: 0.72rem;
            border-width: 1.5px;
          }
          
          .admin-name {
            max-width: 75px;
          }

          .mobile-bottom-nav {
            display: flex !important;
          }
          
          .nav-login-premium {
            display: none !important;
          }

          .navbar-profile-dropdown-wrapper {
            display: none !important;
          }
        }
        @media (max-width: 1024px) {
          .nav-login-premium {
            display: none !important;
          }
          .navbar-profile-dropdown-wrapper {
            display: none !important;
          }

        }


        /* Mobile Bottom Nav */
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: #ffffff;
          z-index: 9999;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
          padding: 6px 5px;
          padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .navbar.scrolled .mobile-bottom-nav {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          box-shadow: 0 -4px 20px rgba(0, 33, 71, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 2px;
          text-decoration: none;
          color: #64748b;
          font-size: 0.6rem;
          font-weight: bold;
          transition: all 0.2s ease;
          width: 20%;
        }

        .bottom-nav-item span {
          display: block;
          text-align: center;
          width: 100%;
        }

        .bottom-nav-item:active, .bottom-nav-item:hover {
          color: #002147;
          transform: translateY(-2px);
        }

        .bottom-nav-icon {
          display: block;
          margin: 0 auto;
          width: 20px;
          height: 20px;
          color: #002147;
          stroke-width: 2.5;
        }

        /* Custom Font for Navbar Items (bauserif) */
        .nav-item, :global(.nav-item), 
        .dropdown-trigger, :global(.dropdown-trigger), 
        .dropdown-menu a, :global(.dropdown-menu a), 
        .nav-cta-special, :global(.nav-cta-special), 
        .bottom-nav-item span, :global(.bottom-nav-item span) {
          font-family: var(--font-bauserif), serif !important;
          font-weight: 800 !important;
          color: var(--primary) !important;
        }
      `}</style>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <Link href="/" className="bottom-nav-item">
          <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </Link>
        <Link 
          href="/#jenjang" 
          className="bottom-nav-item"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              document.getElementById('jenjang')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>Jenjang</span>
        </Link>
        <Link href="/pendaftaran" className="bottom-nav-item">
          <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span>Daftar</span>
        </Link>
        <Link href="/berita" className="bottom-nav-item">
          <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
          <span>Berita</span>
        </Link>
        <Link href={isAdminLoggedIn ? "/admin" : (isSantriLoggedIn ? "/santri" : "/login")} className="bottom-nav-item" title={isAdminLoggedIn ? adminName : (isSantriLoggedIn ? santriName : "Login")}>
          {isAdminLoggedIn || isSantriLoggedIn ? (
            <div className="bottom-nav-icon" style={{ borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px', border: `2px solid ${isAdminLoggedIn ? '#22c55e' : '#002147'}` }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          ) : (
            <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          )}
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '2px', 
            fontSize: (isSantriLoggedIn && (santriGender.toLowerCase() === 'perempuan' || santriGender.toLowerCase() === 'p')) ? '0.55rem' : undefined
          }}>
            {isAdminLoggedIn ? (adminRole.toLowerCase() === 'wali' ? 'Wali' : 'Admin') : (isSantriLoggedIn ? ((santriGender.toLowerCase() === 'perempuan' || santriGender.toLowerCase() === 'p') ? 'Santriwati' : 'Santri') : "Login")}
            {(isAdminLoggedIn || isSantriLoggedIn) && (
              <svg viewBox="0 0 24 24" fill="none" stroke={isAdminLoggedIn ? '#22c55e' : '#002147'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </span>
        </Link>
      </div>

      {maintenanceActive && !isAdminLoggedIn && !isLoginPage && (
        <div className="maintenance-overlay">
          <div className="maintenance-glass-card">
            <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999207/ntxuizh8mm8odxndbvs2.png" alt="Logo Al Azhar" className="maintenance-logo" />
            <h1 className="maintenance-title">SISTEM MAINTENANCE</h1>
            <div className="maintenance-gear-container">
              <span className="maintenance-gear-icon spinning">⚙️</span>
            </div>
            <p className="maintenance-text">
              Mohon maaf atas ketidaknyamanannya. Website Resmi Pondok Pesantren Al-Azhar Purwakarta sedang dalam pemeliharaan sistem berkala untuk meningkatkan kualitas layanan.
            </p>
            <div className="maintenance-status-badge">🚨 Offline Sementara</div>
            <div style={{ marginTop: '2rem' }}>
              <Link href="/login" className="maintenance-admin-btn">
                🔑 Masuk Sebagai Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
