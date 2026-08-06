"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import localFont from "next/font/local";

const frizQuadrata = localFont({
  src: "../../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

export default function PendaftaranPage() {
  return (
    <main className="pendaftaran-layout">
      <Navbar />

      <div className="ppdb-hero">
        <div className="hero-content">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-badge"
          >
            PPDB ONLINE 2026/2027
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${frizQuadrata.className} hero-title`}
          >
            Penerimaan Santri Baru
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-desc"
          >
            Mari bergabung bersama keluarga besar Pondok Pesantren Al-Azhar Purwakarta. Wujudkan generasi Rabbani yang berakhlak mulia dan berwawasan global.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginTop: '2rem' }}
          >
            <a href="https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta" target="_blank" rel="noopener noreferrer" className="btn-daftar-utama">
              📝 Masuk ke Portal Pendaftaran (PPDB)
            </a>
          </motion.div>
        </div>
      </div>

      <div className="pendaftaran-container">
        
        {/* PUSDA CTA Section */}
        <div className="pusda-cta-section">
          <div className="pusda-content">
            <div className="pusda-badge">PORTAL PUSDA AZHAR</div>
            <h2>Sudah Mendaftar PPDB?</h2>
            <p>Bagi wali santri yang sudah melakukan pendaftaran dan memiliki akun, silakan lengkapi biodata serta dokumen persyaratan administrasi melalui Portal Pusat Data Santri (PUSDA).</p>
            <Link href="/pusda" className="btn-pusda">
              <span>Lengkapi Berkas di PUSDA AZHAR</span>
              <span className="arrow">→</span>
            </Link>
          </div>
          <div className="pusda-image">
            <span style={{ fontSize: '6rem' }}>📂</span>
          </div>
        </div>

        {/* Alur Pendaftaran Section */}
        <div className="alur-section">
          <div className="section-header">
            <h2 className={`${frizQuadrata.className}`}>Alur Pendaftaran</h2>
            <p>Langkah demi langkah proses penerimaan santri baru Pondok Pesantren Al-Azhar Purwakarta.</p>
          </div>
          
          <div className="alur-grid">
            {[
              { num: 1, icon: "📝", title: "Pendaftaran", desc: "Isi formulir pendaftaran di laman portal web pendaftaran PPDB dengan data lengkap dan akurat." },
              { num: 2, icon: "💳", title: "Pembayaran", desc: "Jika ada biaya pendaftaran, lakukan pembayaran melalui layanan transfer Bank atau Minimarket." },
              { num: 3, icon: "🔍", title: "Proses Seleksi", desc: "Lembaga pendidikan akan melakukan proses seleksi dan prosesnya dapat dipantau secara real time." },
              { num: 4, icon: "📢", title: "Pengumuman", desc: "Hasil penerimaan peserta didik baru dapat dicek secara online dengan memasukkan nomor pendaftaran." },
              { num: 5, icon: "🤝", title: "Daftar Ulang", desc: "Peserta yang dinyatakan Diterima wajib melakukan daftar ulang sebagai tanda konfirmasi." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="alur-card"
              >
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .pendaftaran-layout {
          background: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .ppdb-hero {
          background: url('https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999215/vdc4p1otuifswwdjx7zt.jpg') center/cover no-repeat;
          padding: 8rem 2rem 6rem;
          text-align: center;
          position: relative;
        }

        .ppdb-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, rgba(0,33,71,0.9) 0%, rgba(0,33,71,0.7) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-block;
          background: #ff8c00;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: 3rem;
          color: white;
          margin-bottom: 1rem;
        }

        .hero-desc {
          color: #e2e8f0;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .btn-daftar-utama {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 1.25rem 2.5rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 15px 30px rgba(16,185,129,0.3);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .btn-daftar-utama:hover {
          background: #059669;
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(16,185,129,0.4);
          border-color: rgba(255,255,255,0.2);
        }

        .pendaftaran-container {
          max-width: 1200px;
          margin: -3rem auto 5rem;
          padding: 0 1.5rem;
          position: relative;
          z-index: 20;
        }

        .pusda-cta-section {
          background: linear-gradient(135deg, #002147 0%, #00122e 100%);
          border-radius: 24px;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 20px 40px rgba(0,33,71,0.15);
          margin-bottom: 5rem;
        }

        .pusda-content {
          max-width: 600px;
          color: white;
        }

        .pusda-badge {
          background: rgba(255,140,0,0.2);
          color: #ff8c00;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 12px;
          display: inline-block;
          margin-bottom: 1rem;
          border: 1px solid rgba(255,140,0,0.3);
          letter-spacing: 1px;
        }

        .pusda-content h2 {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 1rem;
        }

        .pusda-content p {
          color: #cbd5e1;
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .btn-pusda {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          background: #ff8c00;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 800;
          transition: all 0.3s ease;
        }

        .btn-pusda:hover {
          background: #e67e22;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255,140,0,0.2);
        }

        .pusda-image {
          background: rgba(255,255,255,0.05);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed rgba(255,255,255,0.1);
        }

        .alur-section {
          padding-top: 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          color: #002147;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: #64748b;
          font-size: 1.1rem;
        }

        .alur-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          position: relative;
        }

        .alur-card {
          background: white;
          padding: 2.5rem 1.5rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
          position: relative;
          transition: transform 0.3s;
        }

        .alur-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
        }

        .step-num {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: #002147;
          color: white;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 900;
          font-size: 1.2rem;
          box-shadow: 0 10px 20px rgba(0,33,71,0.2);
          border: 4px solid #f8fafc;
        }

        .step-icon {
          font-size: 3rem;
          margin: 1rem 0;
        }

        .alur-card h3 {
          font-size: 1.1rem;
          color: #0f172a;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .alur-card p {
          color: #64748b;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .pusda-cta-section {
            flex-direction: column;
            text-align: center;
            gap: 2rem;
          }
          .pusda-image {
            display: none;
          }
          .alur-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
