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

            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
              <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
              <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
            </button>
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
          }
          
          .nav-container {
            padding: 0 1.5rem;
            display: flex;
            align-items: center;
          }

          .menu-toggle { display: flex; }
          .nav-links {
            position: fixed;
            top: 0;
            right: 0;
            width: 80%;
            height: 100vh;
            background: white;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start; /* Rata kiri */
            padding: 6rem 2.5rem;
            gap: 1rem;
            box-shadow: -10px 0 30px rgba(0,0,0,0.1);
            transform: translateX(100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            z-index: 1000;
          }

          .nav-links.active {
            transform: translateX(0);
            opacity: 1;
            visibility: visible;
          }

          .nav-item { 
            font-size: 1rem; 
            width: 100%; 
            text-align: left;
            padding: 0.8rem 0;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .dropdown-trigger {
            font-size: 1.1rem;
            width: 100%;
            text-align: left;
            padding: 0.8rem 0;
            border-bottom: 1px solid #f0f0f0;
            justify-content: flex-start;
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
          }
          .dropdown-menu.show { display: flex; }
          
          .nav-cta-special, .nav-login-premium {
            width: 100%;
            margin: 0;
            justify-content: flex-start;
          }
          
          .nav-cta-special {
            width: fit-content;
            margin: 0.5rem 0;
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
      `}</style>
    </nav>
  );
}
