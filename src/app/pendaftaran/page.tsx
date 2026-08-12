"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const frizQuadrata = localFont({
  src: "../../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

export default function PendaftaranPage() {
  const [waves, setWaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('registration_settings').select('*').order('id', { ascending: true });
        if (!error && data) {
          setWaves(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const anyOpen = waves.some(w => w.is_open);

  return (
    <main className="pendaftaran-layout">
      <Navbar />

      {/* Hero Header matching Sistem Pendidikan style */}
      <section className="hero-header">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="pre-title">PPDB ONLINE 2026/2027</span>
            <h1 className={frizQuadrata.className}>Penerimaan Santri Baru</h1>
            <p className="school-name">Pondok Pesantren Al-Azhar Purwakarta</p>
            <p className="hero-desc">Mari bergabung bersama keluarga besar Pondok Pesantren Al-Azhar Purwakarta. Wujudkan generasi Rabbani yang berakhlak mulia dan berwawasan global.</p>
          </motion.div>
        </div>
      </section>

      <div className="pendaftaran-container">
        
        {/* Alur Pendaftaran Section (Moved to Top) */}
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

        {/* Call to action for PPDB Link */}
        <div className="ppdb-cta-section">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="ppdb-box"
          >
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🎓</span>
            <h2 style={{ fontSize: '2rem', color: '#002147', fontWeight: 900, marginBottom: '1rem' }}>Siap Mendaftar?</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Pendaftaran santri baru terbagi ke dalam beberapa gelombang. Perhatikan jadwal di bawah ini:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              {loading ? (
                <p>Memuat jadwal pendaftaran...</p>
              ) : (
                waves.map((wave) => (
                  <div key={wave.id} style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '12px', border: `2px solid ${wave.is_open ? '#10b981' : '#cbd5e1'}`, minWidth: '250px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 800 }}>{wave.wave_name}</h4>
                      <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 800, background: wave.is_open ? '#dcfce7' : '#f1f5f9', color: wave.is_open ? '#166534' : '#64748b' }}>
                        {wave.is_open ? '✅ Tersedia' : 'Tutup'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', textAlign: 'left' }}>
                      Mulai: <strong>{new Date(wave.open_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong><br />
                      Sampai: <strong>{new Date(wave.close_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>

            {anyOpen ? (
              <a href="https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta" target="_blank" rel="noopener noreferrer" className="btn-daftar-utama" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <span>📝</span> Masuk ke Portal Pendaftaran (PPDB)
              </a>
            ) : (
              <button disabled className="btn-daftar-utama" style={{ background: '#94a3b8', cursor: 'not-allowed', color: '#f1f5f9' }}>
                Pendaftaran Sedang Ditutup
              </button>
            )}
          </motion.div>
        </div>

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
      </div>

      <Footer />

      <style jsx>{`
        .pendaftaran-layout {
          background: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .hero-header {
          padding: 12rem 0 6rem;
          background: linear-gradient(rgba(0, 33, 71, 0.9), rgba(0, 33, 71, 0.8)), url('https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999165/qyvcomndxiwejcvzmfsl.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: white;
          text-align: center;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .pre-title {
          color: var(--secondary, #ff8c00);
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 3px;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 1rem;
        }

        .hero-header h1 {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 0;
          line-height: 1.1;
        }

        .school-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary, #ff8c00);
          margin-top: 1rem;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 5px;
          opacity: 0.9;
        }

        .hero-desc {
          font-size: 1.25rem;
          max-width: 700px;
          margin: 0 auto;
          opacity: 0.8;
          line-height: 1.6;
        }

        .pendaftaran-container {
          max-width: 1200px;
          margin: -3rem auto 5rem;
          padding: 0 1.5rem;
          position: relative;
          z-index: 20;
        }

        /* Alur Pendaftaran Style */
        .alur-section {
          background: white;
          padding: 4rem;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          margin-bottom: 4rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
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
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          position: relative;
        }

        .alur-card {
          flex: 0 0 calc(33.333% - 1rem);
          max-width: calc(33.333% - 1rem);
          min-width: 250px;
          background: #f8fafc;
          padding: 2.5rem 1.5rem;
          border-radius: 20px;
          text-align: center;
          border: 1px solid #e2e8f0;
          position: relative;
          transition: transform 0.3s;
        }

        .alur-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border-color: #cbd5e1;
        }

        .step-num {
          margin: 0 auto 1rem auto;
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

        /* PPDB CTA Section */
        .ppdb-cta-section {
          margin-bottom: 4rem;
          text-align: center;
        }

        .ppdb-box {
          background: white;
          padding: 4rem 2rem;
          border-radius: 24px;
          border: 2px dashed #cbd5e1;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          text-align: center;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
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

        /* PUSDA CTA Section */
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

        @media (max-width: 992px) {
          .hero-header { padding: 10rem 0 5rem; }
          .hero-header h1 { font-size: 2.8rem; }
        }

        @media (max-width: 768px) {
          .hero-header h1 {
            font-size: clamp(1.8rem, 8vw, 2.5rem);
            white-space: normal;
          }
          .school-name {
            font-size: clamp(0.65rem, 3.5vw, 1rem);
            letter-spacing: 2px;
            white-space: normal;
          }
          .hero-desc {
            display: none;
          }
          .alur-section {
            padding: 3rem 1.5rem;
          }
          .alur-grid {
            grid-template-columns: 1fr;
          }
          .pusda-cta-section {
            flex-direction: column;
            text-align: center;
            gap: 2rem;
          }
          .pusda-image {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
