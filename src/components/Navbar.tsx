"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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
        
        setMaintenanceActive(isMaintenance);
        setIsAdminLoggedIn(!!session);
        if (session) {
          const email = session.user?.email || session.email || "Admin";
          setAdminName(email);
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

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* Top Utility Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-links">
            <Link href="/login">Azwa Page</Link>
            <Link href="/login/santri">Santri Page</Link>
            <Link href="/azhar-learn">Azhar Learn</Link>
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
          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
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
            <Link href="/sekolah" className="nav-item" onClick={() => setMenuOpen(false)}>{t('sekolah')}</Link>
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
            {isAdminLoggedIn ? (
              <div className="navbar-profile-dropdown-wrapper" style={{ position: 'relative' }}>
                <div 
                  className="navbar-profile-bubble-container"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="navbar-avatar-bubble">
                    {adminName.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="navbar-profile-details">
                    <span className="navbar-profile-name">
                      {adminName.includes('@') ? adminName.split('@')[0] : adminName}
                    </span>
                    <span className="navbar-profile-role">PENGURUS</span>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px', marginLeft: '2px', flexShrink: 0, color: 'var(--primary)', transition: 'transform 0.2s', transform: profileDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {/* Glassmorphic Dropdown Panel */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div 
                      className="navbar-profile-dropdown-panel"
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                      <div className="dropdown-user-info">
                        <strong>Al-Azhar Purwakarta</strong>
                        <span>{adminName}</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      
                      <Link href="/admin" className="dropdown-action-btn panel-btn" onClick={() => setProfileDropdownOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                          <rect x="3" y="3" width="7" height="9" />
                          <rect x="14" y="3" width="7" height="5" />
                          <rect x="14" y="12" width="7" height="9" />
                          <rect x="3" y="16" width="7" height="5" />
                        </svg>
                        <span>Dashboard Admin</span>
                      </Link>

                      <button 
                        onClick={async () => {
                          setProfileDropdownOpen(false);
                          await supabase.auth.signOut();
                          localStorage.removeItem('admin_session');
                          window.dispatchEvent(new Event('storage'));
                          window.dispatchEvent(new Event('maintenanceChange'));
                          window.location.href = '/login';
                        }}
                        className="dropdown-logout-btn-new"
                      >
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          style={{ width: '14px', height: '14px', flexShrink: 0 }}
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="nav-login-premium" onClick={() => setMenuOpen(false)}>
                <div className="login-switch-container">
                  <AnimatePresence mode="wait">
                    {isLogoActive ? (
                      <motion.img
                        key="logo"
                        src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999181/gn0jliybqazmk5nelrwf.png"
                        alt="Login"
                        className="nav-login-img"
                        initial={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ 
                          duration: 3.5,
                          ease: [0.22, 1, 0.36, 1] /* Quintic ease out for ultra smoothness */
                        }}
                      />
                    ) : (
                      <motion.div
                        key="text"
                        className="login-graphic"
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '8px',
                          background: 'rgba(230, 126, 34, 0.1)',
                          border: '2px solid var(--secondary)',
                          padding: '6px 16px',
                          borderRadius: '50px',
                          color: 'var(--primary)',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer'
                        }}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ 
                          duration: 3.5,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                      >
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          style={{ width: '16px', height: '16px', flexShrink: 0, color: 'var(--primary)' }}
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>{t('login')}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            )}

            <div className="menu-toggle-wrapper">
              <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
                <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
                <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>

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

        /* Glassmorphic Navbar Profile Dropdown Panel */
        .navbar-profile-dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 230px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 33, 71, 0.08);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 33, 71, 0.12);
          padding: 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          z-index: 100000;
          box-sizing: border-box;
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

        .dropdown-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 0.55rem;
          font-size: 0.72rem;
          font-weight: 800;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .dropdown-action-btn.panel-btn {
          background: rgba(0, 33, 71, 0.04);
          border: 1px solid rgba(0, 33, 71, 0.08);
          color: #002147;
        }

        .dropdown-action-btn.panel-btn:hover {
          background: #002147;
          color: white;
          border-color: #002147;
          box-shadow: 0 4px 12px rgba(0, 33, 71, 0.1);
        }

        .dropdown-logout-btn-new {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 0.55rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #ef4444;
          font-size: 0.72rem;
          font-weight: 800;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .dropdown-logout-btn-new:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }

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
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
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
            position: fixed !important;
            bottom: 25px !important;
            left: 15px !important;
            right: auto !important;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important;
            border: 2px solid rgba(255, 255, 255, 0.4) !important;
            box-shadow: 0 8px 32px rgba(0, 33, 71, 0.3), 0 0 15px rgba(230, 126, 34, 0.45) !important;
            border-radius: 50% !important;
            width: 60px !important;
            height: 60px !important;
            z-index: 99999 !important;
            justify-content: center !important;
            align-items: center !important;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            animation: pulse-glow-left 2s infinite alternate !important;
            flex-direction: column;
            gap: 5px;
            padding: 0 !important;
          }

          .menu-toggle:hover {
            transform: scale(1.1) !important;
            background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%) !important;
          }

          .menu-toggle:active {
            transform: scale(0.9) !important;
          }

          :global(.menu-helper-bubble) {
            position: fixed !important;
            bottom: 36px !important;
            left: 85px !important;
            right: auto !important;
            background: rgba(0, 33, 71, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            color: white !important;
            padding: 8px 16px !important;
            border-radius: 50px !important;
            font-size: 0.72rem !important;
            font-weight: 800 !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 8px !important;
            z-index: 99999 !important;
            box-shadow: 0 4px 15px rgba(0, 33, 71, 0.25) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            white-space: nowrap !important;
            pointer-events: none !important;
          }

          :global(.helper-pulse-dot) {
            width: 8px;
            height: 8px;
            background: #4CAF50;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
            animation: dot-pulse 1.5s infinite;
          }

          .bar {
            background: white !important;
            height: 3px !important;
            width: 22px !important;
            border-radius: 4px !important;
            margin: 0 !important;
            transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          .bar.active:nth-child(1) { transform: translateY(8px) rotate(45deg) !important; }
          .bar.active:nth-child(2) { opacity: 0 !important; }
          .bar.active:nth-child(3) { transform: translateY(-8px) rotate(-45deg) !important; }

          .nav-links {
            position: fixed !important;
            bottom: 100px !important;
            left: 15px !important;
            right: auto !important;
            top: auto !important;
            width: calc(100% - 30px) !important;
            max-width: 360px !important;
            margin: 0 !important;
            margin-left: 0 !important;
            height: auto !important;
            max-height: calc(100vh - 150px) !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(25px) !important;
            -webkit-backdrop-filter: blur(25px) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
            border-radius: 24px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1.5rem !important;
            gap: 0.6rem !important;
            box-shadow: 0 20px 50px rgba(0, 33, 71, 0.25) !important;
            transform: scale(0.7) translateY(50px) translateX(-50px) !important;
            transform-origin: bottom left !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            z-index: 99998 !important;
            overflow-y: auto !important;
            scrollbar-width: none;
          }

          .nav-links::-webkit-scrollbar {
            display: none;
          }

          .nav-links.active {
            transform: scale(1) translateY(0) translateX(0) !important;
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
        }
      `}</style>

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
