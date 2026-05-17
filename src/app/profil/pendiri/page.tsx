"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import localFont from "next/font/local";
import Image from "next/image";

const frizQuadrata = localFont({
  src: "../../../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

export default function PendiriPage() {
  return (
    <main className="pendiri-page">
      <Navbar />

      {/* Header Section */}
      <section className="header-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="header-content"
          >
            <span className="pre-title">PROFILE TOKOH</span>
            <h1 className={frizQuadrata.className}>Pendiri & Pimpinan Lembaga</h1>
            <div className="accent-divider"></div>
          </motion.div>
        </div>
      </section>

      {/* Row 1: Pimpinan Pondok */}
      <section className="tokoh-section">
        <div className="container">
          <div className="tokoh-grid">
            <motion.div 
              className="tokoh-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="tokoh-role">Pimpinan Pondok Pesantren</span>
              <h2 className={frizQuadrata.className}>DR. (c) KH. Andi Mappaenre, LC, MM</h2>
              <p className="tokoh-desc">
                Beliau adalah pengasuh utama yang membawa nafas modernitas ke dalam tradisi pesantren. 
                Lulusan Al-Azhar Kairo ini berfokus pada integrasi ilmu syar'i dengan wawasan global, 
                memastikan setiap santri tidak hanya hafal Al-Qur'an tetapi juga menguasai bahasa dunia.
              </p>
              <div className="quote-box">
                <p>"Mendidik bukan sekadar mentransfer ilmu, tapi menanamkan adab dan membentuk karakter pejuang."</p>
              </div>

              <div className="education-section">
                <h3>Latar Belakang Pendidikan</h3>
                <ul className="education-list">
                  <li>
                    <div className="edu-icon">🎓</div>
                    <div className="edu-details">
                      <strong>Program Doktoral (S3)</strong>
                      <span>UIN Sunan Gunung Djati Bandung (Sedang Berjalan)</span>
                    </div>
                  </li>
                  <li>
                    <div className="edu-icon">🎓</div>
                    <div className="edu-details">
                      <strong>Program Magister (S2)</strong>
                      <span>UIN Syarif Hidayatullah</span>
                    </div>
                  </li>
                  <li>
                    <div className="edu-icon">🎓</div>
                    <div className="edu-details">
                      <strong>Program Sarjana (S1)</strong>
                      <span>Universitas Al-Azhar Mesir</span>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div 
              className="tokoh-image"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="image-wrapper">
                <Image 
                  src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999220/hjozyz9pb8puevlg2ynu.png" 
                  alt="KH. Andi Mappaenre" 
                  width={450} 
                  height={550} 
                  className="img-fluid"
                />
              </div>
            </motion.div>
          </div>

          <div className="tokoh-spacer"></div>

          {/* Row 2: Ketua Yayasan (Reversed Grid) */}
          <div className="tokoh-grid reverse">
            <motion.div 
              className="tokoh-image"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="image-wrapper left-accent">
                <Image 
                  src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999180/hpw4kbe8jglic4kpdtbj.png" 
                  alt="Ketua Yayasan Andi Azhar" 
                  width={450} 
                  height={550} 
                  className="img-fluid"
                />
              </div>
            </motion.div>
            <motion.div 
              className="tokoh-text"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="tokoh-role">Ketua Yayasan Al-Azhar</span>
              <h2 className={frizQuadrata.className}>Ketua Yayasan</h2>
              <p className="tokoh-desc">
                Bertanggung jawab dalam pengembangan infrastruktur dan tata kelola lembaga. 
                Dengan manajemen yang profesional dan transparan, beliau memastikan keberlangsungan 
                dakwah dan pendidikan di Pesantren Al-Azhar Purwakarta tetap pada jalur visi yang luhur.
              </p>
              <div className="quote-box">
                <p>"Keikhlasan dalam berkhidmah adalah kunci keberkahan setiap langkah perjuangan di jalan Allah."</p>
              </div>

              <div className="education-section blue-accent">
                <h3>Latar Belakang Pendidikan</h3>
                <ul className="education-list">
                  <li>
                    <div className="edu-icon">🎓</div>
                    <div className="edu-details">
                      <strong>Program Magister (S2)</strong>
                      <span>UIN Kiai Haji Achmad Siddiq Jember</span>
                    </div>
                  </li>
                  <li>
                    <div className="edu-icon">🎓</div>
                    <div className="edu-details">
                      <strong>Program Sarjana (S1)</strong>
                      <span>Universitas Al-Azhar Mesir</span>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .pendiri-page {
          background: #ffffff;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .header-section {
          padding: 14rem 0 8rem;
          text-align: center;
          background: linear-gradient(rgba(0, 33, 71, 0.8), rgba(0, 33, 71, 0.7)), url('https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999165/qyvcomndxiwejcvzmfsl.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: white;
        }

        .pre-title {
          display: block;
          color: #ff8c00;
          font-weight: 800;
          letter-spacing: 4px;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 3.5rem;
          color: white;
          margin-bottom: 1.5rem;
        }

        .accent-divider {
          width: 80px;
          height: 5px;
          background: #ff8c00;
          margin: 0 auto;
          border-radius: 10px;
        }

        .tokoh-section {
          padding: 8rem 0;
        }

        .tokoh-spacer {
          height: 5rem;
        }

        .tokoh-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: flex-start;
        }

        .reverse {
          direction: ltr;
        }

        .tokoh-role {
          display: block;
          color: #002147;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .color-alt {
          color: #ff8c00;
        }

        h2 {
          font-size: 2.8rem;
          color: #002147;
          line-height: 1.2;
          margin-bottom: 2rem;
        }

        .tokoh-desc {
          font-size: 1.15rem;
          color: #475569;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }

        .quote-box {
          padding: 2rem;
          background: white;
          border-left: 6px solid #002147;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-radius: 0 20px 20px 0;
        }

        .alt-border {
          border-left-color: #ff8c00;
        }

        .quote-box p {
          font-size: 1.1rem;
          font-style: italic;
          color: #1e293b;
          margin: 0;
        }

        .image-wrapper {
          position: relative;
        }

        .img-fluid {
          border-radius: 30px;
          box-shadow: 0 30px 60px rgba(0, 33, 71, 0.15);
          position: relative;
          z-index: 2;
          width: 100%;
          height: auto;
        }

        .image-accent {
          position: absolute;
          bottom: -30px;
          right: -30px;
          width: 200px;
          height: 200px;
          background: #002147;
          border-radius: 50%;
          z-index: 1;
          opacity: 0.05;
        }

        .secondary {
          left: -30px;
          right: auto;
        }

        .education-section {
          margin-top: 2.5rem;
          text-align: left;
        }

        .education-section h3 {
          font-size: 1.2rem;
          color: #002147;
          margin-bottom: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .education-section h3::before {
          content: '';
          display: block;
          width: 20px;
          height: 3px;
          background: #ff8c00;
        }

        .education-section.blue-accent h3::before {
          background: #002147;
        }

        .education-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .education-list li {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .edu-icon {
          background: #f0f4ff;
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #002147;
          flex-shrink: 0;
          border: 1px solid rgba(0, 33, 71, 0.1);
        }

        .edu-details strong {
          display: block;
          color: #1e293b;
          font-size: 1.05rem;
          margin-bottom: 0.2rem;
        }

        .edu-details span {
          color: #64748b;
          font-size: 0.9rem;
        }

        @media (max-width: 992px) {
          .tokoh-grid {
            display: flex;
            flex-direction: column-reverse; /* Pimpinan: image is 2nd in DOM, so this puts it on top */
            gap: 4rem;
            text-align: center;
            align-items: center;
          }
          .tokoh-grid.reverse {
            flex-direction: column; /* Ketua Yayasan: image is 1st in DOM, so column keeps it on top */
          }
          h1 { font-size: 2.5rem; }
          h2 { font-size: 2rem; }
          .quote-box { border-left: none; border-top: 6px solid #002147; border-radius: 0 0 20px 20px; text-align: left; }
          .alt-border { border-top-color: #ff8c00; }
        }
      `}</style>
    </main>
  );
}
