"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import localFont from "next/font/local";

const frizQuadrata = localFont({
  src: "../../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

export default function PendaftaranPage() {
  // Form states
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [password, setPassword] = useState("");
  
  // UX states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama_lengkap: nama,
            no_hp: noHp,
            jenjang: jenjang,
          }
        }
      });

      if (authError) throw new Error(authError.message);

      const { error: dbError } = await supabase
        .from("pendaftaran")
        .insert([{
          nama_lengkap: nama,
          email: email.toLowerCase(),
          no_hp: noHp,
          jenjang: jenjang,
          status: "Pending"
        }]);

      if (dbError) console.warn("Database insert warning:", dbError.message);

      setSuccess(true);
      window.scrollTo(0, 0);
      setNama(""); setEmail(""); setNoHp(""); setJenjang(""); setPassword("");
    } catch (error: any) {
      setErrorMsg(error.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setIsLoading(false);
    }
  };

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
        </div>
      </div>

      <div className="pendaftaran-container">
        <div className="pendaftaran-grid">
          
          {/* Left Column: Information & PUSDA Block */}
          <div className="info-column">
            <div className="info-card welcome-card">
              <h3>Kenapa Memilih Al-Azhar?</h3>
              <ul>
                <li><span className="icon">🕌</span> Pendidikan Karakter Islami yang Kuat</li>
                <li><span className="icon">📚</span> Kurikulum Terpadu Nasional & Pesantren</li>
                <li><span className="icon">🎯</span> Fasilitas Belajar Mengajar yang Modern</li>
                <li><span className="icon">🏆</span> Tenaga Pengajar Profesional & Berpengalaman</li>
              </ul>
            </div>

            <div className="info-card pusda-card">
              <div className="pusda-badge">PORTAL PUSDA AZHAR</div>
              <h3>Sudah Mendaftar?</h3>
              <p>Bagi wali santri yang sudah memiliki akun dan mendaftarkan putra/putrinya, silakan lengkapi biodata dan dokumen persyaratan melalui Portal Pusat Data Santri (PUSDA).</p>
              <Link href="/pusda" className="btn-pusda">
                <span>Lengkapi Berkas di PUSDA AZHAR</span>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="form-column">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div 
                  key="form-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="pendaftaran-card"
                >
                  <div className="card-header">
                    <h2>Buat Akun Pendaftaran</h2>
                    <p>Isi formulir di bawah ini untuk memulai langkah pendaftaran.</p>
                  </div>

                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="error-alert"
                    >
                      ⚠️ {errorMsg}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="pendaftaran-form">
                    <div className="input-group">
                      <label htmlFor="nama">Nama Lengkap Calon Santri</label>
                      <input type="text" id="nama" placeholder="Contoh: Muhammad Akhyar" required value={nama} onChange={(e) => setNama(e.target.value)} />
                    </div>

                    <div className="input-group">
                      <label htmlFor="email">Alamat E-Mail Aktif</label>
                      <input type="email" id="email" placeholder="Contoh: santri@alazharpwk.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="input-row">
                      <div className="input-group">
                        <label htmlFor="noHp">No WhatsApp Wali</label>
                        <input type="tel" id="noHp" placeholder="081234567890" required value={noHp} onChange={(e) => setNoHp(e.target.value)} />
                      </div>

                      <div className="input-group">
                        <label htmlFor="jenjang">Pilihan Jenjang</label>
                        <select id="jenjang" required value={jenjang} onChange={(e) => setJenjang(e.target.value)}>
                          <option value="">-- Pilih Jenjang --</option>
                          <option value="TKIT">TKIT Al-Azhar</option>
                          <option value="SDIT">SDIT Al-Azhar</option>
                          <option value="SMP">SMP Al-Azhar</option>
                          <option value="MA">Madrasah Aliyah Al-Azhar</option>
                          <option value="Ponpes">Pondok Pesantren (Tahfidz)</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="password">Password Akun</label>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <input 
                          type={showPassword ? "text" : "password"}
                          id="password" placeholder="Minimal 6 karakter" required minLength={6}
                          value={password} onChange={(e) => setPassword(e.target.value)}
                          style={{ paddingRight: '40px' }}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn-show-pwd">
                          {showPassword ? '👁️‍🗨️' : '👁️'}
                        </button>
                      </div>
                      <span className="helper-text">Digunakan untuk login ke Dashboard Pendaftaran.</span>
                    </div>

                    <button type="submit" className={`btn-submit ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                      {isLoading ? <span className="spinner"></span> : "Daftar Sekarang"}
                    </button>
                  </form>

                  <div className="card-footer">
                    <p>Sudah punya akun? <Link href="/login" className="login-link">Masuk di sini</Link></p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pendaftaran-card success-card"
                >
                  <div className="success-icon">🎉</div>
                  <h2 className={`${frizQuadrata.className} success-title`}>Pendaftaran Berhasil!</h2>
                  <p className="success-msg">Akun calon santri Anda telah didaftarkan.</p>
                  
                  <div className="next-steps">
                    <h3>Langkah Selanjutnya:</h3>
                    <ul>
                      <li>📧 Periksa E-Mail Anda untuk memverifikasi akun.</li>
                      <li>📁 Buka Portal PUSDA untuk melengkapi biodata dan berkas.</li>
                      <li>📱 Panitia PPDB akan menghubungi Anda via WhatsApp.</li>
                    </ul>
                  </div>

                  <div className="success-actions">
                    <Link href="/pusda" className="btn-success-main">Lengkapi Berkas (PUSDA)</Link>
                    <Link href="/login" className="btn-success-login">Masuk Dashboard</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
          padding: 8rem 2rem 5rem;
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

        .pendaftaran-container {
          max-width: 1200px;
          margin: -3rem auto 5rem;
          padding: 0 1.5rem;
          position: relative;
          z-index: 20;
        }

        .pendaftaran-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 2rem;
          align-items: flex-start;
        }

        .info-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          margin-bottom: 1.5rem;
          border: 1px solid #f1f5f9;
        }

        .welcome-card h3 {
          font-size: 1.25rem;
          color: #002147;
          font-weight: 800;
          margin-bottom: 1.25rem;
        }

        .welcome-card ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .welcome-card li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          color: #475569;
          font-weight: 500;
        }

        .pusda-card {
          background: linear-gradient(135deg, #002147 0%, #00122e 100%);
          color: white;
          border: none;
        }

        .pusda-badge {
          background: rgba(255,140,0,0.2);
          color: #ff8c00;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 12px;
          display: inline-block;
          margin-bottom: 1rem;
          border: 1px solid rgba(255,140,0,0.3);
        }

        .pusda-card h3 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .pusda-card p {
          color: #cbd5e1;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .btn-pusda {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ff8c00;
          color: white;
          padding: 1rem 1.25rem;
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

        .btn-pusda .arrow {
          font-size: 1.2rem;
        }

        .pendaftaran-card {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }

        .card-header h2 {
          font-size: 1.6rem;
          color: #002147;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }

        .card-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        .error-alert {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          color: #991b1b;
          padding: 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .pendaftaran-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }

        .input-group input, 
        .input-group select {
          padding: 0.85rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.95rem;
          background: #f8fafc;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .input-group input:focus, 
        .input-group select:focus {
          outline: none;
          border-color: #002147;
          background: white;
          box-shadow: 0 0 0 3px rgba(0,33,71,0.1);
        }

        .btn-show-pwd {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .helper-text {
          font-size: 0.75rem;
          color: #64748b;
        }

        .btn-submit {
          padding: 1rem;
          background: #002147;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
          display: flex;
          justify-content: center;
        }

        .btn-submit:hover:not(:disabled) {
          background: #003a7a;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,33,71,0.15);
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

        .card-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.9rem;
          color: #64748b;
        }

        .login-link {
          color: #002147;
          font-weight: 800;
          text-decoration: none;
        }

        .login-link:hover {
          color: #ff8c00;
          text-decoration: underline;
        }

        .success-card {
          text-align: center;
          padding: 3rem;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .success-title {
          font-size: 2rem;
          color: #10b981;
          margin-bottom: 0.5rem;
        }

        .success-msg {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .next-steps {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: left;
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }

        .next-steps h3 {
          font-size: 1rem;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .next-steps ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          font-size: 0.9rem;
          color: #475569;
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn-success-main {
          background: #ff8c00;
          color: white;
          padding: 1rem;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 800;
          transition: all 0.2s;
        }

        .btn-success-main:hover {
          background: #e67e22;
          transform: translateY(-2px);
        }

        .btn-success-login {
          background: #f1f5f9;
          color: #334155;
          padding: 1rem;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 800;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .btn-success-login:hover {
          background: #e2e8f0;
        }

        @media (max-width: 900px) {
          .pendaftaran-grid {
            grid-template-columns: 1fr;
          }
          .info-column {
            order: 2;
          }
          .form-column {
            order: 1;
          }
          .input-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
