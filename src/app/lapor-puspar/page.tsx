"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import localFont from "next/font/local";
import Link from "next/link";

const frizQuadrata = localFont({
  src: "../../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

export default function LaporPusparPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi pengiriman data
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <main className="puspar-page">
      {/* Background Decorators */}
      <div className="bg-decorator orb-1"></div>
      <div className="bg-decorator orb-2"></div>
      <div className="bg-pattern"></div>

      <div className="container">
        <motion.div 
          className="header-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="icon-wrapper">
            <span className="blink-indicator-large"></span>
            <span className="toa-icon">📢</span>
          </div>
          <h1 className={frizQuadrata.className}>Lapor PUSPAR</h1>
          <p className="subtitle">Pusat Pengaduan & Aspirasi Santri</p>
          <p className="desc">
            Sampaikan pengaduan, kritik, saran, atau aspirasi Anda demi mewujudkan 
            lingkungan pendidikan yang lebih baik, aman, dan nyaman di Al-Azhar Purwakarta.
          </p>
        </motion.div>

        <motion.div 
          className="form-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="puspar-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="puspar-form"
              >
                <div className="form-group">
                  <label htmlFor="nama">Nama Lengkap (Opsional)</label>
                  <input type="text" id="nama" placeholder="Boleh dikosongkan jika ingin anonim" className="glass-input" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="kategori">Kategori Laporan *</label>
                    <div className="select-wrapper">
                      <select id="kategori" required className="glass-input">
                        <option value="" disabled selected>Pilih Kategori...</option>
                        <option value="Fasilitas">Fasilitas & Sarana Prasarana</option>
                        <option value="Pelayanan">Pelayanan Akademik</option>
                        <option value="Keamanan">Keamanan & Ketertiban</option>
                        <option value="Bullying">Indikasi Perundungan (Bullying)</option>
                        <option value="Aspirasi">Aspirasi / Saran Membangun</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="unit">Unit Terkait *</label>
                    <div className="select-wrapper">
                      <select id="unit" required className="glass-input">
                        <option value="" disabled selected>Pilih Unit...</option>
                        <option value="SDIT">SD Islam Terpadu Al-Azhar</option>
                        <option value="SMP">SMP Islam Al-Azhar</option>
                        <option value="MA">Madrasah Aliyah Al-Azhar</option>
                        <option value="Umum">Umum / Yayasan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="laporan">Isi Laporan / Aspirasi *</label>
                  <textarea 
                    id="laporan" 
                    required 
                    placeholder="Ceritakan secara detail mengenai pengaduan atau aspirasi Anda..." 
                    className="glass-input textarea-glass"
                    rows={6}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="kontak">Kontak WhatsApp / Email (Opsional)</label>
                  <input type="text" id="kontak" placeholder="Agar kami dapat memberikan umpan balik atas laporan Anda" className="glass-input" />
                  <span className="help-text">Privasi Anda akan kami jaga sepenuhnya.</span>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Sedang Mengirim...
                    </>
                  ) : (
                    <>
                      Kirim Laporan Sekarang
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="puspar-success"
                className="success-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="success-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="success-icon">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h2>Laporan Berhasil Terkirim!</h2>
                <p>Terima kasih telah berpartisipasi mewujudkan lingkungan Al-Azhar Purwakarta yang lebih baik. Laporan Anda telah kami catat dan akan segera diproses oleh tim PUSPAR.</p>
                <button onClick={() => setIsSuccess(false)} className="outline-btn">
                  Kirim Laporan Lain
                </button>
                <Link href="/" className="back-home-link">
                  Kembali ke Beranda
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style jsx>{`
        .puspar-page {
          min-height: 100vh;
          padding: 10rem 0 6rem;
          background-color: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        .bg-decorator {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.4;
        }

        .orb-1 {
          top: -10%;
          right: -5%;
          width: 50vw;
          height: 50vw;
          background: rgba(255, 140, 0, 0.15);
        }

        .orb-2 {
          bottom: -10%;
          left: -5%;
          width: 60vw;
          height: 60vw;
          background: rgba(0, 33, 71, 0.1);
        }

        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 30px 30px;
          z-index: 1;
          opacity: 0.5;
        }

        .container {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff8c00, #ffcc00);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3);
          position: relative;
          margin-bottom: 1.5rem;
        }

        .toa-icon {
          font-size: 2.8rem;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }

        .blink-indicator-large {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 18px;
          height: 18px;
          background-color: #ef4444;
          border-radius: 50%;
          border: 3px solid #f8fafc;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .header-section h1 {
          color: #002147;
          font-size: 3rem;
          margin: 0 0 0.5rem 0;
          letter-spacing: -1px;
        }

        .subtitle {
          color: #ff8c00;
          font-weight: 700;
          font-size: 1.2rem;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .desc {
          color: #475569;
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .form-container {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 33, 71, 0.05);
        }

        .puspar-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #002147;
          font-size: 0.95rem;
        }

        .glass-input {
          width: 100%;
          padding: 1rem 1.2rem;
          border-radius: 12px;
          border: 1px solid rgba(0, 33, 71, 0.1);
          background: rgba(255, 255, 255, 0.5);
          font-size: 1rem;
          color: #1e293b;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .glass-input:focus {
          outline: none;
          border-color: #0033cc;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 51, 204, 0.1);
        }

        .glass-input::placeholder {
          color: #94a3b8;
        }

        .textarea-glass {
          resize: vertical;
          min-height: 120px;
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper::after {
          content: '▾';
          position: absolute;
          top: 50%;
          right: 1.2rem;
          transform: translateY(-50%);
          pointer-events: none;
          color: #475569;
          font-size: 1.2rem;
        }

        select.glass-input {
          appearance: none;
          padding-right: 2.5rem;
          cursor: pointer;
        }

        .help-text {
          font-size: 0.8rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .help-text::before {
          content: '🔒';
          font-size: 0.9rem;
        }

        .submit-btn {
          margin-top: 1rem;
          background: linear-gradient(135deg, #002147, #0033cc);
          color: white;
          border: none;
          padding: 1.2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(0, 51, 204, 0.2);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(0, 51, 204, 0.3);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Success State */
        .success-state {
          text-align: center;
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon-wrapper {
          width: 80px;
          height: 80px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .success-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        .success-state h2 {
          color: #002147;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .success-state p {
          color: #475569;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        .outline-btn {
          background: transparent;
          border: 2px solid #002147;
          color: #002147;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .outline-btn:hover {
          background: #002147;
          color: white;
        }

        .back-home-link {
          color: #ff8c00;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .back-home-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .form-container {
            padding: 2rem 1.5rem;
          }
          
          .header-section h1 {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </main>
  );
}
