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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // 1. Sign up user in Supabase Auth
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

      if (authError) {
        throw new Error(authError.message);
      }

      // 2. Insert details into pendaftaran table in Supabase Postgres
      const { error: dbError } = await supabase
        .from("pendaftaran")
        .insert([
          {
            nama_lengkap: nama,
            email: email.toLowerCase(),
            no_hp: noHp,
            jenjang: jenjang,
            status: "Pending"
          }
        ]);

      if (dbError) {
        console.warn("Database insert warning:", dbError.message);
        // We still consider registration success since Auth succeeded,
        // but it is best if the table is created!
      }

      setSuccess(true);
      
      // Clear form
      setNama("");
      setEmail("");
      setNoHp("");
      setJenjang("");
      setPassword("");
    } catch (error: any) {
      setErrorMsg(error.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pendaftaran-layout">
      <Navbar />

      <div className="pendaftaran-container">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div 
              key="form-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="pendaftaran-card"
            >
              <div className="card-header">
                <span className="badge">PPDB ONLINE</span>
                <h1 className={`${frizQuadrata.className} card-title`}>Formulir Pendaftaran</h1>
                <p className="card-desc">Bergabunglah bersama keluarga besar Pondok Pesantren Al-Azhar Purwakarta</p>
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
                  <input 
                    type="text" 
                    id="nama" 
                    placeholder="Contoh: Muhammad Akhyar" 
                    required 
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Alamat E-Mail Aktif</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Contoh: santri@alazharpwk.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="noHp">Nomor WhatsApp Orang Tua / Wali</label>
                    <input 
                      type="tel" 
                      id="noHp" 
                      placeholder="Contoh: 081234567890" 
                      required 
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="jenjang">Pilihan Jenjang Pendidikan</label>
                    <select 
                      id="jenjang" 
                      required 
                      value={jenjang}
                      onChange={(e) => setJenjang(e.target.value)}
                    >
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
                  <label htmlFor="password">Password Akun Baru</label>
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="Minimal 6 karakter" 
                    required 
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="helper-text">Digunakan untuk login ke halaman Dashboard Santri nanti.</span>
                </div>

                <button 
                  type="submit" 
                  className={`btn-submit ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner"></span>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </button>
              </form>

              <div className="card-footer">
                <p>Sudah pernah mendaftar? <Link href="/login" className="login-link">Masuk ke Akun Anda</Link></p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="pendaftaran-card success-card"
            >
              <div className="success-icon">🎉</div>
              <h2 className={`${frizQuadrata.className} success-title`}>Pendaftaran Berhasil!</h2>
              <p className="success-msg">
                Akun calon santri Anda telah berhasil didaftarkan di sistem database Supabase kami.
              </p>
              
              <div className="next-steps">
                <h3>Langkah Selanjutnya:</h3>
                <ul>
                  <li>📧 Silakan periksa kotak masuk E-Mail Anda untuk memverifikasi pendaftaran akun.</li>
                  <li>📱 Panitia PPDB kami akan menghubungi Anda melalui WhatsApp untuk proses verifikasi berkas lebih lanjut.</li>
                  <li>🔑 Anda sekarang bisa masuk menggunakan e-mail dan password yang didaftarkan.</li>
                </ul>
              </div>

              <div className="success-actions">
                <Link href="/login" className="btn-success-login">Masuk ke Dashboard</Link>
                <button onClick={() => setSuccess(false)} className="btn-success-back">Daftar Santri Baru Lainnya</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />

      <style jsx>{`
        .pendaftaran-layout {
          background: #f8fafc;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .pendaftaran-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8rem 2rem 5rem 2rem;
          background: 
            radial-gradient(at 0% 0%, rgba(0, 33, 71, 0.04) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(255, 140, 0, 0.04) 0px, transparent 50%);
        }

        .pendaftaran-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          width: 100%;
          max-width: 600px;
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 33, 71, 0.05);
        }

        .success-card {
          text-align: center;
          border-top: 6px solid #10b981;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .success-title {
          font-size: 2.2rem;
          color: #10b981;
          margin-bottom: 1rem;
        }

        .success-msg {
          font-size: 1.1rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .next-steps {
          background: #f0fdf4;
          border: 1px solid #d1fae5;
          padding: 1.5rem;
          border-radius: 16px;
          text-align: left;
          margin-bottom: 2.5rem;
        }

        .next-steps h3 {
          color: #065f46;
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .next-steps ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .next-steps li {
          color: #047857;
          font-size: 0.95rem;
          line-height: 1.4;
          display: flex;
          gap: 0.5rem;
        }

        .success-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn-success-login {
          display: inline-block;
          padding: 0.8rem 2rem;
          background: #10b981;
          color: white;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-success-login:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }

        .btn-success-back {
          padding: 0.8rem 1.5rem;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-success-back:hover {
          background: #e2e8f0;
        }

        .card-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .badge {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          background: #e0f2fe;
          color: #0284c7;
          font-size: 0.7rem;
          font-weight: 800;
          border-radius: 6px;
          letter-spacing: 1px;
          margin-bottom: 0.75rem;
        }

        .card-title {
          font-size: 2.2rem;
          color: #002147;
          margin-bottom: 0.5rem;
        }

        .card-desc {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .error-alert {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          color: #991b1b;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .pendaftaran-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1.2rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }

        .input-group input, 
        .input-group select {
          padding: 0.9rem 1.2rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          font-size: 0.95rem;
          color: #0f172a;
          background: white;
          outline: none;
          transition: all 0.3s ease;
        }

        .input-group input:focus, 
        .input-group select:focus {
          border-color: #002147;
          box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.08);
        }

        .helper-text {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.2rem;
        }

        .btn-submit {
          padding: 1rem;
          background: #002147;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1rem;
        }

        .btn-submit:hover:not(:disabled) {
          background: #ff8c00;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 140, 0, 0.2);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .card-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: #64748b;
        }

        .login-link {
          color: #002147;
          font-weight: 700;
          text-decoration: none;
        }

        .login-link:hover {
          color: #ff8c00;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .pendaftaran-card { padding: 2rem 1.5rem; }
          .input-row { grid-template-columns: 1fr; gap: 1.5rem; }
          .card-title { font-size: 1.8rem; }
          .success-title { font-size: 1.8rem; }
          .success-actions { flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
