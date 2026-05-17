"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import localFont from "next/font/local";
import Image from "next/image";

const frizQuadrata = localFont({
  src: "../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

const GlobalAlumni = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const unis = [
    { name: "Al-Azhar Kairo", path: "/Logo/Log Kampus/AL-AZHAR.png", location: "Kairo, Mesir", type: "Luar Negeri", color: "#2d5a27" },
    { name: "IAIN Kendari", path: "/Logo/Log Kampus/IAIN KENDARI.png", location: "Kendari, Indonesia", type: "Dalam Negeri", color: "#006400" },
    { name: "IPB University", path: "/Logo/Log Kampus/IPB.png", location: "Bogor, Indonesia", type: "Dalam Negeri", color: "#004d99" },
    { name: "Islamabad Pakistan", path: "/Logo/Log Kampus/ISLAMABAD PAKISTAN.png", location: "Islamabad, Pakistan", type: "Luar Negeri", color: "#01411c" },
    { name: "ITB Bandung", path: "/Logo/Log Kampus/ITB.png", location: "Bandung, Indonesia", type: "Dalam Negeri", color: "#003366" },
    { name: "LIPIA Jakarta", path: "/Logo/Log Kampus/LIPIA.png", location: "Jakarta, Indonesia", type: "Dalam Negeri", color: "#002147" },
    { name: "UDB Surakarta", path: "/Logo/Log Kampus/UDB.png", location: "Surakarta, Indonesia", type: "Dalam Negeri", color: "#800000" },
    { name: "UIM Madinah", path: "/Logo/Log Kampus/UIM.png", location: "Madinah, Arab Saudi", type: "Luar Negeri", color: "#004b23" },
    { name: "UIN Sunan Gunung Djati", path: "/Logo/Log Kampus/UIN BDG.png", location: "Bandung, Indonesia", type: "Dalam Negeri", color: "#0056b3" },
    { name: "UIN Syarif Hidayatullah", path: "/Logo/Log Kampus/UIN JKT.png", location: "Jakarta, Indonesia", type: "Dalam Negeri", color: "#007bff" },
    { name: "UMY Yogyakarta", path: "/Logo/Log Kampus/UMY.png", location: "Yogyakarta, Indonesia", type: "Dalam Negeri", color: "#a52a2a" },
    { name: "Universitas Airlangga", path: "/Logo/Log Kampus/UNAIR.png", location: "Surabaya, Indonesia", type: "Dalam Negeri", color: "#004085" },
    { name: "Universitas Padjadjaran", path: "/Logo/Log Kampus/UNPAD.png", location: "Sumedang, Indonesia", type: "Dalam Negeri", color: "#856404" },
    { name: "UPI Bandung", path: "/Logo/Log Kampus/UPI.png", location: "Bandung, Indonesia", type: "Dalam Negeri", color: "#721c24" },
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="global-alumni-section">
      <div className="container">
        <div className="section-header-premium">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="top-subtitle">KAMPUS ALUMNI</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`title-main ${frizQuadrata.className}`}
          >
            Wujudkan mimpi dan jadilah <br className="mobile-only" /> 
            bagian dari <br className="desktop-only" />
            perjalanan <br className="mobile-only" />
            <span>Al-Azhar Mendunia</span>
          </motion.h2>
        </div>

        <div className="orbit-wrapper">
          <motion.div 
            className="main-orbit"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {unis.map((uni, idx) => {
              const angle = (idx / unis.length) * 360;
              const radius = 260; 
              return (
                <div 
                  key={idx} 
                  className="orbit-node-wrapper"
                  style={{
                    transform: `rotate(${angle}deg) translate(${radius}px)`,
                  }}
                >
                  <motion.div 
                    className="uni-node" 
                    title={uni.name}
                    initial={{ rotate: -angle }}
                    animate={{ rotate: -angle - 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    <Image 
                      src={uni.path} 
                      alt={uni.name} 
                      width={85} 
                      height={85} 
                      className="uni-img" 
                      loading="lazy"
                    />
                  </motion.div>
                </div>
              );
            })}
            
            <div className="orbit-line"></div>
          </motion.div>

          <div className="center-hub">
            <Image 
              src="/Logo/Logo Pondok Pesantren.png" 
              alt="Logo Pesantren Al-Azhar" 
              width={160} 
              height={160} 
              className="hub-logo-img"
            />
          </div>
        </div>

        <div className="alumni-slider-wrapper">
          <div className="alumni-slider" ref={scrollRef}>
            {unis.map((uni, index) => (
              <motion.div 
                key={index} 
                className="uni-info-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="card-accent" style={{ background: uni.color }}></div>
                <div className="card-top">
                  <div className="mini-logo">
                    <img src={uni.path} alt={uni.name} />
                  </div>
                  <span className={`cat-tag ${uni.type === 'Luar Negeri' ? 'intl' : 'local'}`}>
                    {uni.type}
                  </span>
                </div>
                <div className="card-body">
                  <h3 className="uni-title">{uni.name}</h3>
                  <div className="loc-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>{uni.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="footer-text">
          <p>"Menjadikan Hafidz yang Sarjana dan Sarjana yang Hafidz"</p>
        </div>
      </div>

      <style jsx>{`
        .global-alumni-section {
          padding: 2rem 0 4rem 0;
          background: #ffffff;
          overflow: hidden;
          position: relative;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          text-align: center;
        }

        .section-header-premium {
          text-align: center;
          margin-bottom: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .top-subtitle {
          display: inline-block;
          padding: 0.3rem 1rem;
          background: #f5f5f5;
          color: #666;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.2rem;
        }

        .mobile-only { display: none; }
        .desktop-only { display: block; }

        @media (max-width: 768px) {
          .mobile-only { display: block; }
          .desktop-only { display: none; }
        }

        .title-main {
          font-size: 3rem !important;
          line-height: 1.15;
          margin-bottom: 1rem;
          font-weight: 400 !important;
          font-style: normal;
          letter-spacing: -0.5px;
          text-align: center;
          color: #002147;
        }

        .title-main span {
          font-size: 1.5rem;
          display: block;
          color: #ff8c00;
          margin-top: 0.5rem;
          font-weight: 700 !important;
          font-family: sans-serif;
        }

        .orbit-wrapper {
          position: relative;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.5rem 0;
        }

        .main-orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orbit-line {
          position: absolute;
          width: 520px;
          height: 520px;
          border: 1px dashed rgba(0, 33, 71, 0.1);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          top: 50%;
          left: 50%;
        }

        .orbit-node-wrapper {
          position: absolute;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .uni-node {
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .uni-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .uni-node:hover {
          transform: scale(1.4) !important;
          z-index: 10;
        }

        .center-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          box-shadow: 0 10px 40px rgba(0, 33, 71, 0.1);
          border: none;
        }

        .hub-logo-img {
          width: 85%;
          height: 85%;
          object-fit: contain;
        }

        .alumni-slider-wrapper {
          position: relative;
          margin: 6rem -1rem 0 -1rem;
          padding: 0 1rem;
        }

        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          background: white;
          border: 1.5px solid rgba(0, 33, 71, 0.1);
          border-radius: 50%;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #002147;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .nav-btn:hover { background: #002147; color: white; }
        .nav-btn.prev { left: -10px; }
        .nav-btn.next { right: -10px; }

        .alumni-slider {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding: 1rem 0.5rem 0.5rem 0.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .alumni-slider::-webkit-scrollbar { display: none; }

        .uni-info-card {
          min-width: 260px;
          max-width: 260px;
          scroll-snap-align: start;
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          text-align: left;
          box-shadow: 0 8px 30px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .uni-info-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 45px rgba(0, 33, 71, 0.1);
        }

        .card-accent { position: absolute; top: 0; left: 0; width: 100%; height: 4px; }
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .mini-logo { width: 45px; height: 45px; }
        .mini-logo img { width: 100%; height: 100%; object-fit: contain; }
        .cat-tag { font-size: 0.6rem; font-weight: 800; padding: 0.3rem 0.7rem; border-radius: 6px; text-transform: uppercase; }
        .cat-tag.local { background: #f0f7ff; color: #003366; }
        .cat-tag.intl { background: #fff7ed; color: #ff8c00; }
        .uni-title { font-size: 1.05rem; font-weight: 800; color: #002147; margin: 0 0 0.5rem 0; line-height: 1.3; height: 2.6rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .loc-box { display: flex; align-items: center; gap: 0.4rem; color: #64748b; font-size: 0.8rem; }

        .footer-text { margin-top: 0.5rem; color: #64748b; font-style: italic; font-size: 1.1rem; }

        @media (max-width: 768px) {
          .orbit-wrapper { height: 450px; transform: scale(0.65); }
          .title-main { font-size: 2rem !important; }
          .global-alumni-section { padding: 2rem 0 2rem 0; }
          .uni-info-card { min-width: 220px; max-width: 220px; }
          .nav-btn { display: none; }
        }

        @media (max-width: 480px) {
          .orbit-wrapper { height: 400px; transform: scale(0.5); }
          .title-main { font-size: 1.6rem !important; }
        }
      `}</style>
    </section>
  );
};

export default GlobalAlumni;
