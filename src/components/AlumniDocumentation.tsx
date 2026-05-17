"use client";
import React from "react";
import { motion } from "framer-motion";
import localFont from "next/font/local";

const frizQuadrata = localFont({
  src: "../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

const AlumniDocumentation = () => {
  // Sample alumni documentation images
  const photos = [
    { url: "/Alumni 1.png", size: "large", rotate: -5, y: 0 },
    { url: "/Alumni 2.png", size: "medium", rotate: 8, y: 40 },
    { url: "/Alumni 3.png", size: "small", rotate: -12, y: -20 },
    { url: "/alumni 4.jpeg", size: "medium", rotate: 15, y: 10 },
    { url: "/Alumni 5.png", size: "large", rotate: -3, y: 50 },
    { url: "/Alumni 6.png", size: "small", rotate: 10, y: -40 },
    { url: "/Alumni 7.png", size: "medium", rotate: -7, y: 20 },
    { url: "/Alumni 8.png", size: "large", rotate: 5, y: -10 },
  ];

  return (
    <section className="docs-section">
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="top-badge">Dokumentasi Alumni</span>
        </motion.div>

        <motion.h2 
          className={`funny-title ${frizQuadrata.className}`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          " Tidak ada Proses yang Mudah untuk Hasil yang Indah "
        </motion.h2>

        <div className="absurd-grid">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              className={`photo-card ${photo.size}`}
              initial={{ opacity: 0, y: 50, rotate: photo.rotate * 2 }}
              whileInView={{ opacity: 1, y: photo.y, rotate: photo.rotate }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, zIndex: 20, rotate: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="photo-inner">
                <img src={photo.url} alt={`Alumni ${index}`} />
                <div className="photo-tape"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .docs-section {
          padding: 6rem 0;
          background: #fdfdfd;
          overflow: hidden;
          position: relative;
        }

        .top-badge {
          display: inline-block;
          padding: 0.3rem 1rem;
          background: #f5f5f5;
          color: #666;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }

        .funny-title {
          font-size: 2.8rem !important;
          color: #002147 !important;
          text-align: center !important;
          margin: 0 auto 4rem auto !important;
          letter-spacing: 1px !important;
          font-weight: 400 !important;
          width: 100% !important;
          display: block !important;
          line-height: 1.4 !important;
        }

        .absurd-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 3rem;
          padding: 2rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .photo-card {
          position: relative;
          background: white;
          padding: 10px;
          padding-bottom: 45px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          border: 1px solid #eee;
          transition: all 0.3s ease;
          width: 240px !important;
          height: 300px !important;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .photo-inner {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #f5f5f5;
        }

        .photo-card img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }

        .photo-tape {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%) rotate(-3deg);
          width: 70px;
          height: 25px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 2;
        }

        @media (max-width: 768px) {
          .funny-title { font-size: 2.2rem !important; }
          .absurd-grid { gap: 1.5rem; }
          .photo-card { width: 160px !important; height: 200px !important; padding: 5px; padding-bottom: 30px; }
          .photo-tape { width: 50px; height: 18px; }
        }
      `}</style>
    </section>
  );
};

export default AlumniDocumentation;
