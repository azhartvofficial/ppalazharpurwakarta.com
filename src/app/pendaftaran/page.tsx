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
  const isPusdaOpen = waves.some(w => w.access_code);

  return (
    <main className="pendaftaran-layout">
      <Navbar />

      {/* Hero Header matching PUSDA style */}
      <section className="hero-header">
        <div className="hero-content">
          <span className="hero-badge">PPDB ONLINE 2026/2027</span>
          <h1 className="hero-title">Penerimaan <span>Santri Baru</span></h1>
          <p className="school-name">Pondok Pesantren Al-Azhar Purwakarta</p>
          <p className="hero-desc">Mari bergabung bersama keluarga besar Pondok Pesantren Al-Azhar Purwakarta. Wujudkan generasi Rabbani yang berakhlak mulia dan berwawasan global.</p>
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
              { num: 1, icon: "📝", title: "Pendaftaran", desc: "Isi formulir pendaftaran di laman portal web pendaftaran PPDB dengan data lengkap dan akurat.", descMobile: "Isi formulir online" },
              { num: 2, icon: "💳", title: "Pembayaran", desc: "Jika ada biaya pendaftaran, lakukan pembayaran melalui layanan transfer Bank atau Minimarket.", descMobile: "Bayar administrasi" },
              { num: 3, icon: "🔍", title: "Proses Seleksi", desc: "Lembaga pendidikan akan melakukan proses seleksi dan prosesnya dapat dipantau secara real time.", descMobile: "Ikuti seleksi" },
              { num: 4, icon: "📢", title: "Pengumuman", desc: "Hasil penerimaan peserta didik baru dapat dicek secara online dengan memasukkan nomor pendaftaran.", descMobile: "Cek kelulusan" },
              { num: 5, icon: "🤝", title: "Daftar Ulang", desc: "Peserta yang dinyatakan Diterima wajib melakukan daftar ulang sebagai tanda konfirmasi.", descMobile: "Daftar ulang" }
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
                <p className="desc-desktop">{step.desc}</p>
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
            <h2 style={{ fontSize: '2.5rem', color: '#002147', fontWeight: 900, marginBottom: '1rem' }}>Siap Mendaftar?</h2>
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

        {/* PUSDA CTA Section - Compact Version */}
        <div className="pusda-cta-section">
          <div className="pusda-content">
            {isPusdaOpen ? (
              <>
                <motion.div 
                  className="pusda-title-animated"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  PORTAL PUSDA AZHAR
                </motion.div>
                <p>Bagi wali santri yang sudah memiliki akun PPDB, silakan lengkapi biodata & berkas di:</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <Link href="/pusda" className="btn-pusda-floating">
                    <span className="btn-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </span>
                    Klik untuk Lengkapi Data Santri
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div 
                  className="pusda-badge"
                  style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  PORTAL PUSDA DITUTUP
                </div>
                <p>Untuk saat ini akses pengisian biodata dan kelengkapan berkas sedang ditutup.</p>
                <p style={{ marginTop: '0.5rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                  Untuk kendala dan informasi lebih lanjut hubungi:<br/>
                  <a href="https://wa.me/6283846489366" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 800, textDecoration: 'none' }}>085846489366 (Danish)</a>
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <button disabled className="btn-pusda-floating" style={{ background: '#475569', cursor: 'not-allowed', border: 'none', transform: 'none', boxShadow: 'none' }}>
                    AKSES PORTAL TUTUP
                  </button>
                </div>
              </>
            )}
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
          background: linear-gradient(135deg, #002147 0%, #00122e 100%);
          padding: 8rem 1.5rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: url('https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999165/qyvcomndxiwejcvzmfsl.png') center/cover;
          opacity: 0.15;
          mix-blend-mode: overlay;
        }
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-badge {
          background: rgba(255,140,0,0.15);
          color: #ff8c00;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          display: inline-block;
          border: 1px solid rgba(255,140,0,0.3);
        }
        .hero-title {
          font-size: 4rem;
          color: white;
          font-weight: 900;
          margin-bottom: 0;
          letter-spacing: -1px;
        }
        .hero-title span {
          color: #ff8c00;
        }

        .school-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          opacity: 0.9;
        }

        .hero-desc {
          color: #cbd5e1;
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
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
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
          position: relative;
        }

        .alur-card {
          background: #002147;
          padding: 2.5rem 1.5rem;
          border-radius: 24px;
          text-align: center;
          border: 2px solid #ff8c00;
          position: relative;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 15px 35px rgba(0, 33, 71, 0.4);
        }

        .alur-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 33, 71, 0.6);
          border-color: #ffa500;
        }

        .step-num {
          margin: 0 auto 1rem auto;
          background: #ff8c00;
          color: #002147;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 900;
          border: 3px solid white;
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
          color: #ff8c00;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .alur-card p.desc-desktop {
          color: #e2e8f0;
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
          border-radius: 20px;
          padding: 2.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 15px 35px rgba(0,33,71,0.2);
          margin-bottom: 4rem;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pusda-cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255, 140, 0, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .pusda-content {
          max-width: 600px;
          color: white;
          position: relative;
          z-index: 2;
        }

        .pusda-title-animated {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #002147 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
          display: inline-block;
          letter-spacing: -1px;
          filter: drop-shadow(0 4px 6px rgba(0,33,71,0.15));
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
          margin-bottom: 1rem;
        }

        .btn-pusda-floating {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          background: linear-gradient(135deg, #ff8c00 0%, #e67e22 100%);
          color: white;
          padding: 1rem 1.8rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 900;
          font-size: 1.05rem;
          letter-spacing: 0.5px;
          box-shadow: 0 10px 25px rgba(255,140,0,0.3);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          width: fit-content;
          animation: pulse-pusda 2s infinite;
        }

        @keyframes pulse-pusda {
          0% { box-shadow: 0 0 0 0 rgba(255,140,0,0.7); transform: scale(1); }
          70% { box-shadow: 0 0 0 15px rgba(255,140,0,0); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(255,140,0,0); transform: scale(1); }
        }

        .btn-pusda-floating:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 15px 35px rgba(255,140,0,0.4);
          background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
          animation: none;
        }

        .btn-pusda-floating .btn-icon svg {
          width: 20px;
          height: 20px;
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
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
          }
          .alur-card {
            width: 31%;
            box-sizing: border-box;
            padding: 0.8rem 0.5rem;
            border-radius: 12px;
            background: #002147;
            border: 1px solid rgba(255, 140, 0, 0.5);
            box-shadow: 0 8px 20px rgba(0, 33, 71, 0.3);
          }
          .alur-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 33, 71, 0.4);
          }
          .step-num {
            display: none;
          }
          .step-icon {
            font-size: 1.5rem;
            margin: 0 auto 0.5rem auto;
            background: rgba(255, 255, 255, 0.1);
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            box-shadow: none;
            border: 1px solid rgba(255, 140, 0, 0.3);
          }
          .alur-card h3 {
            font-size: 0.65rem;
            margin-bottom: 0;
            white-space: normal;
          }
          .alur-card p.desc-desktop {
            display: none;
        }
      `}</style>
    </main>
  );
}
