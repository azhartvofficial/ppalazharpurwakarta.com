"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SapaKilat = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="sapa-kilat-section" ref={sectionRef}>
      <div className="container">
        {/* Vision Tagline now at Top */}
        <div className="bottom-vision">
          <span className={`motto-badge ${isVisible ? 'animate-reveal' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>Motto Lembaga</span>
          <div className={`tagline-vision ${isVisible ? 'animate-vision' : ''}`}>
            “Menjadikan Hafidz yang Sarjana <br /> dan Sarjana yang Hafidz”
          </div>
        </div>

        {/* Feature Cards now at Top */}
        <div className="features-row">
          <div className={`feature-item ${isVisible ? 'animate-reveal' : ''}`} style={{ animationDelay: '0.2s', opacity: isVisible ? 1 : 0 }}>
            <div className="cutout-wrapper">
              <img src="/Santri%201.png" className="feature-img-cutout" alt="Santri Tahfidz" />
            </div>
            <div className="feature-text">
              <h4>Tahfidzul Qur'an</h4>
              <p>Mencetak para penghafal Al-Qur'an yang fasih & mutqin menggunakan metode Azhary dengan, serta sanad keilmuan yang bersambung.</p>
            </div>
            <div className="card-hover-effect"></div>
          </div>
          <div className={`feature-item ${isVisible ? 'animate-reveal' : ''}`} style={{ animationDelay: '0.4s', opacity: isVisible ? 1 : 0 }}>
            <div className="cutout-wrapper">
              <img src="/Santri%202.png" className="feature-img-cutout larger-cutout" alt="Santri Bahasa" />
            </div>
            <div className="feature-text">
              <h4>Mahir Bahasa</h4>
              <p>Pembelajaran, Pembiasaan serta Penggunaan aktif Bahasa Arab & Bahasa Inggris sebagai kunci literasi dunia global.</p>
            </div>
            <div className="card-hover-effect"></div>
          </div>
          <div className={`feature-item ${isVisible ? 'animate-reveal' : ''}`} style={{ animationDelay: '0.6s', opacity: isVisible ? 1 : 0 }}>
            <div className="cutout-wrapper">
              <img src="/Santri%203.png" className="feature-img-cutout" alt="Santri Mandiri" />
            </div>
            <div className="feature-text">
              <h4>MANDIRI</h4>
              <p>Membentuk karakter MANDIRI ( Mahir, Amanah, Disipilin dan Inspiratif ) agar dapat bersaing dan siap terjun ke masyarakat</p>
            </div>
            <div className="card-hover-effect"></div>
          </div>
        </div>

        <div className="spacer-v2" style={{ height: '4rem' }}></div>

        <div className={`section-header-premium ${isVisible ? 'animate-reveal' : ''}`} style={{ animationDelay: '0.8s', opacity: isVisible ? 1 : 0 }}>
          <span className="top-subtitle">INGIN LEBIH TAU TENTANG AL-AZHAR??</span>
          <h2 className="main-title">Sapa Kilat Al-Azhar</h2>
          <div className="blue-divider"></div>
        </div>

        {/* Leadership Rows now at Bottom */}
        <div className="leadership-rows-container">
          
          {/* Row: Pimpinan Pondok */}
          <div className="leader-row">
            <div className={`leader-cutout ${isVisible ? 'animate-photo' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
              <Link href="/profil/pendiri" className="photo-link-wrapper">
                <div className="photo-container">
                  <img 
                    src="/Pimpinan%20Ponpes%20AL%20Azhar%20-%20Sapa%20Kilat.png" 
                    alt="Pimpinan Pondok" 
                    className="leader-img"
                  />
                  <div className="kenali-overlay">
                    <span>Kenali Pimpinan</span>
                  </div>
                  <div className="name-tag-wrapper">
                    <div className="role-badge">Pimpinan Pondok</div>
                    <div className="name-tag-main">
                      <div className="accent-bar"></div>
                      <span>DR. (c) KH. ANDI MAPPAENRE, LC, MM</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className={`leader-description ${isVisible ? 'animate-text' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
              <p>
                Pondok Pesantren Al-Azhar Purwakarta adalah lembaga pendidikan Islam yang memadukan kedalaman spiritual Al-Qur’an dengan keunggulan akademik modern. Sebagai lembaga Takhossus yang berfokus penuh pada mencetak generasi yang mahir dalam dua pilar utama ilmu Islam: Tahfidz Al-Qur’an dan penguasaan Bahasa Arab.
                <br /><br />
                Di bawah bimbingan DR. (c) KH. ANDI MAPPAENRE, LC, MM, serta jajaran tenaga pendidik yang ahli di bidangnya, pesantren ini menerapkan kurikulum yang menitik beratkan pada pembentukan karakter unggul melalui pembiasaan ibadah dan keteladanan akhlak. Kami percaya bahwa penguasaan bahasa Arab adalah kunci untuk mendalami ilmu-ilmu syar’i secara otentik, sementara hafalan Al-Qur’an menjadi pondasi keimanan yang kokoh.
              </p>
              <Link href="/profil/pendiri">
                <button className="outline-btn">SELENGKAPNYA <span style={{ marginLeft: '8px' }}>→</span></button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

        .sapa-kilat-section {
          padding: 5rem 0 1rem 0;
          background-color: #ffffff;
          background-image: 
            radial-gradient(circle at 2px 2px, rgba(0, 51, 204, 0.05) 1px, transparent 0);
          background-size: 40px 40px; /* Subtle dot pattern */
          position: relative;
          overflow: hidden;
        }

        .sapa-kilat-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          /* Batik Kawung Style Pattern */
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(0,51,204,0.04)' stroke-width='1'%3E%3Ccircle cx='30' cy='0' r='20'/%3E%3Ccircle cx='30' cy='60' r='20'/%3E%3Ccircle cx='0' cy='30' r='20'/%3E%3Ccircle cx='60' cy='30' r='20'/%3E%3Cpath d='M30 30L0 0M30 30L60 0M30 30L60 60M30 30L0 60'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 120px;
          opacity: 1;
          pointer-events: none;
        }

        .animate-vision {
          /* Always visible to prevent disappearing issues */
        }

        .tagline-vision {
          font-family: var(--font-custom), sans-serif;
          font-size: 2.2rem;
          color: var(--primary);
          line-height: 1.2;
          font-weight: 400;
          letter-spacing: -0.2px;
          background: linear-gradient(90deg, #002147, #0033cc, #ff8c00, #0033cc, #002147);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 8s linear infinite;
          display: inline-block;
        }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }

        .top-subtitle, .motto-badge {
          display: inline-block;
          padding: 0.3rem 1rem;
          background: #f5f5f5;
          color: #666;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          z-index: 1;
          border: none;
          margin-bottom: 0.8rem;
        }

        /* Dot Grid Wrapper for badges - REMOVED Pattern */
        .section-header-premium::before, .bottom-vision::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 40px;
          top: -10px;
          left: 0;
          z-index: 0;
        }

        .motto-badge {
          margin-bottom: 0.5rem;
        }

        .main-title {
          font-size: 3.5rem;
          color: #000;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .blue-divider {
          width: 80px;
          height: 4px;
          background: #0033cc;
          margin: 0 auto;
          border-radius: 2px;
        }

        .leadership-rows-container {
          display: flex;
          flex-direction: column;
          gap: 6rem;
          margin-bottom: 1rem;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }

        .leader-row {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .leader-cutout {
          flex: 0 0 380px;
          display: flex;
          justify-content: center;
        }

        .photo-link-wrapper {
          text-decoration: none;
          display: block;
          width: 100%;
        }

        .photo-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 30px;
        }

        .kenali-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0, 31, 63, 0.9) 0%, rgba(0, 51, 204, 0.2) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 80px;
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 8;
        }

        .kenali-overlay span {
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          background: var(--secondary);
          padding: 0.8rem 2rem;
          border-radius: 50px;
          box-shadow: 0 10px 20px rgba(255, 140, 0, 0.3);
          transform: translateY(30px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .photo-container:hover .kenali-overlay {
          opacity: 1;
        }

        .photo-container:hover .kenali-overlay span {
          transform: translateY(0);
        }

        .leader-img {
          width: 100%;
          height: 500px; 
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .photo-container:hover .leader-img {
          transform: scale(1.08);
        }

        .handwritten-name {
          position: absolute;
          bottom: 100px;
          left: 20px;
          font-family: 'Caveat', cursive;
          font-size: 3rem;
          color: rgba(255,255,255,0.8);
          z-index: 5;
          transform: rotate(-5deg);
          text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        }

        .name-tag-wrapper {
          position: absolute;
          bottom: 20px;
          left: 5px;
          right: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .role-badge {
          background: #0033cc;
          color: white;
          padding: 2px 15px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          margin-bottom: -10px;
          position: relative;
          z-index: 12;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .name-tag-main {
          background: #001f3f;
          color: white;
          width: 100%;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%);
        }

        .accent-bar {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 100%;
          width: 25px;
          background: #0033cc;
          transform: skewX(-20deg);
          margin-left: -10px;
        }

        .name-tag-main span {
          font-weight: 800;
          font-size: 0.82rem;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 2;
        }

        .leader-description {
          flex: 1;
        }

        .leader-description p {
          font-size: 0.92rem;
          line-height: 1.7;
          color: #444;
          margin-bottom: 2rem;
        }

        .animate-reveal {
          animation: revealUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        .section-header-premium {
          text-align: center;
          margin-bottom: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: revealUp 1s ease-out both;
          animation-delay: 0.8s;
        }

        @keyframes revealUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-photo {
          animation: slideInLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        .animate-text {
          animation: slideInRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
          animation-delay: 0.3s;
        }

        @keyframes slideInLeft {
          0% {
            transform: translateX(-50px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          0% {
            transform: translateX(50px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .bottom-vision {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 5rem; /* Even more distance to give room for cutouts */
        }

        .tagline-vision {
          font-family: var(--font-custom), sans-serif;
          font-size: 3.2rem;
          color: var(--primary);
          line-height: 1.1;
          font-weight: 400;
          letter-spacing: -0.5px;
        }

        .outline-btn {
          background: transparent;
          border: 2px solid #0033cc;
          color: #0033cc;
          padding: 12px 35px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .outline-btn:hover {
          background: #0033cc;
          color: white;
          box-shadow: 0 10px 20px rgba(0, 51, 204, 0.2);
        }

        .features-row {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 3rem 2rem;
          border-radius: 30px;
          box-shadow: 0 15px 45px rgba(0, 33, 71, 0.05);
          border: 2px solid rgba(0, 51, 204, 0.1);
          position: relative;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          flex: 1;
          overflow: visible; /* To allow accents to show */
        }

        .feature-item::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(0, 51, 204, 0.3), transparent, rgba(255, 140, 0, 0.3));
          border-radius: 32px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-item:hover::before {
          opacity: 1;
        }

        .feature-item:hover {
          transform: translateY(-15px) scale(1.03);
          border-color: #0033cc;
          box-shadow: 0 25px 60px rgba(0, 51, 204, 0.15), 0 0 20px rgba(255, 140, 0, 0.1);
        }

        .feature-icon-v2 {
          font-size: 3.2rem;
          background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%);
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          transition: all 0.4s ease;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid rgba(0, 51, 204, 0.1);
        }

        .feature-item:hover .feature-icon-v2 {
          background: linear-gradient(135deg, #0033cc 0%, #001f3f 100%);
          color: white;
          transform: rotate(-10deg) scale(1.1);
          box-shadow: 0 10px 20px rgba(0, 51, 204, 0.3);
        }

        .feature-text {
          text-align: center;
          padding-top: 80px; /* Aligned with other cards */
          position: relative;
          z-index: 5;
          /* White glow effect shifted slightly down */
          background: radial-gradient(circle at 50% 60%, rgba(255, 255, 255, 0.8) 0%, transparent 75%);
          padding-bottom: 1.5rem;
          border-radius: 20px;
        }

        .feature-item h4 {
          font-family: var(--font-custom), sans-serif;
          font-weight: 900;
          color: var(--primary);
          font-size: 1.4rem;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 10;
          text-shadow: 0 0 15px rgba(255,255,255,0.9); /* Additional glow */
        }

        .cutout-wrapper {
          position: absolute;
          top: -60px; /* Reverted to 'pas' position */
          left: 50%;
          transform: translateX(-50%);
          height: 280px; /* Reverted to 'pas' size */
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
          pointer-events: none;
        }

        .feature-img-cutout {
          height: 100%;
          width: auto;
          object-fit: contain;
          opacity: 1; /* Restored to 100% */
          filter: drop-shadow(0 15px 30px rgba(0,0,0,0.1));
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .larger-cutout {
          transform: scale(1.1);
        }

        .feature-item:hover .feature-img-cutout {
          transform: scale(1.1) translateY(-5px);
        }

        .feature-item:hover .larger-cutout {
          transform: scale(1.2) translateY(-5px);
        }

        .feature-text p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #333;
          font-weight: 600;
          position: relative;
          z-index: 10;
        }

        .card-hover-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(0, 51, 204, 0.05) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .feature-item:hover .card-hover-effect {
          opacity: 1;
        }

        @media (max-width: 992px) {
          .leader-row {
            flex-direction: column;
            text-align: center;
            gap: 3rem;
          }
          .leader-cutout { flex: 0 0 auto; width: 100%; max-width: 380px; }
          .main-title { font-size: 2.5rem; }
          .features-row { flex-direction: column; align-items: center; }
          .feature-item { width: 100%; max-width: 300px; }
        }
        @media (max-width: 768px) {
          .sapa-kilat-section {
            padding-top: 1.5rem;
          }
          .main-title { font-size: 2.2rem; }
          .tagline-vision { 
            font-size: 1.4rem; 
            max-width: 95%; 
            margin: 0 auto;
            line-height: 1.3;
          }
          .bottom-vision {
            margin-bottom: 3.5rem;
          }
          .features-row { 
            flex-direction: row; 
            align-items: stretch; 
            gap: 0.3rem; 
            padding: 0 5px;
            margin-top: 40px; /* Space for absolute cutouts */
          }
          .feature-item { 
            padding: 1rem 0.3rem 0.5rem 0.3rem; 
            min-width: 0;
            gap: 0.2rem;
            position: relative;
            overflow: visible;
          }

          .cutout-wrapper {
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            height: 150px;
            width: 100%;
            z-index: 1;
          }

          .feature-icon-v2 {
            width: 30px;
            height: 30px;
            font-size: 1rem;
            border-radius: 8px;
            position: relative;
            z-index: 5;
          }
          .feature-text {
            padding-top: 60px !important;
          }
          .feature-item h4 {
            font-size: 0.6rem;
            margin-bottom: 0.1rem;
            letter-spacing: 0;
            z-index: 10;
          }
          .feature-text p {
            font-size: 0.5rem;
            line-height: 1.1;
            z-index: 10;
            font-weight: 700;
          }

          /* New horizontal leadership row for mobile */
          .leader-row {
            flex-direction: row !important;
            text-align: left !important;
            gap: 1.5rem !important;
            align-items: flex-start !important;
          }
          .leader-cutout {
            flex: 0 0 140px !important;
          }
          .leader-img {
            height: 200px !important;
            border-radius: 15px !important;
          }
          .leader-description p {
            font-size: 0.8rem !important;
            line-height: 1.5 !important;
            margin-bottom: 1rem !important;
          }
          .name-tag-main span {
            font-size: 0.6rem !important;
          }
          .role-badge {
            font-size: 0.55rem !important;
            padding: 2px 10px !important;
          }
          .name-tag-wrapper {
            bottom: 10px !important;
          }
          .kenali-overlay {
            padding-bottom: 0 !important;
            justify-content: center !important;
          }
          .kenali-overlay span {
            font-size: 0.55rem !important;
            padding: 0.4rem 0.8rem !important;
            letter-spacing: 1px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SapaKilat;
