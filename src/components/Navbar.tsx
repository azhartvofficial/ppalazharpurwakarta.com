"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

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
            <Link href="/login">{t('portalSantri')}</Link>
            <Link href="/login">{t('portalGuru')}</Link>
            <Link href="/azhar-learn">{t('lms')}</Link>
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

            {/* Access to Panel Pengurus with custom dashboard icon */}
            <Link href="/admin" className="nav-cta-admin" onClick={() => setMenuOpen(false)}>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ width: '14px', height: '14px', marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}
              >
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              <span>{language === 'ID' ? 'Panel Pengurus' : 'Admin Panel'}</span>
            </Link>

          </div>

          {/* Mobile Utility + Toggle */}
          <div className="nav-mobile-actions">
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

            <div className="menu-toggle-wrapper">
              <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
                <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
                <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
              </button>
              <AnimatePresence>
                {!menuOpen && (
                  <motion.div 
                    className="menu-helper-bubble"
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="helper-pulse-dot"></span>
                    <span>Buka Menu Lainnya</span>
                  </motion.div>
                )}
              </AnimatePresence>
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
          gap: 1.5rem;
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
          .main-nav {
            padding: 0.5rem 0;
            backdrop-filter: none !important;
            background: rgba(255, 255, 255, 0.98) !important;
          }
          
          .nav-container {
            padding: 0 1.5rem;
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
            left: 25px !important;
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
            left: 95px !important;
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
            left: 25px !important;
            right: auto !important;
            top: auto !important;
            width: calc(100% - 50px) !important;
            max-width: 360px !important;
            height: auto !important;
            max-height: calc(100vh - 150px) !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(25px) !important;
            -webkit-backdrop-filter: blur(25px) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
            border-radius: 24px !important;
            flex-direction: column !important;
            padding: 1.5rem !important;
            gap: 0.6rem !important;
            box-shadow: 0 20px 50px rgba(0, 33, 71, 0.25) !important;
            transform: scale(0.7) translateY(50px) translateX(-50px) !important;
            transform-origin: bottom left !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important; /* Spring elastic animation! */
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
          }     }

          .nav-item { 
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
          
          .nav-item:hover {
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
          
          .nav-cta-special, .nav-cta-admin, .nav-login-premium {
            width: 100% !important;
            margin: 0 !important;
            justify-content: center !important;
          }
          
          .nav-cta-special, .nav-cta-admin {
            width: 100% !important;
            margin: 0.3rem 0 !important;
          }     }

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
      `}</style>
    </nav>
  );
}
